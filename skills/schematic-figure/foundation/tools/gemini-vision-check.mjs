// gemini-vision-check.mjs — Zero-npm Gemini 2D Spatial Grounding Auditor [Addresses FM-3].
// Uses Node >= 22 built-in fetch against the Gemini REST API to detect visual defects that SVG DOM bounding boxes
// cannot catch (rotated/curved text collisions, 3D Blender callout misalignments, register clashes, visual crowding),
// converting normalized [ymin, xmin, ymax, xmax] (0..1000) coordinates into exact figure pt and mm coordinates.
// Usage:
//   node tools/gemini-vision-check.mjs --img figure/out/<name>.png [--fig figure/figure.js] [--manifest figure/out/manifest.json] [--spec docs/spec.md] [--out figure/out/vision-check.json]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { args } from './lib/cdp.mjs';

const A = args();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('info gemini-vision-check skipped: GEMINI_API_KEY not set (deterministic DOM/pixel checks in check.mjs unaffected)');
  process.exit(0);
}

const figPath = A.fig && A.fig !== true ? resolve(A.fig) : null;
const imgPath = A.img && A.img !== true
  ? resolve(A.img)
  : figPath
    ? join(dirname(figPath), 'out', 'figure.png')
    : resolve('figure/out/figure.png');

if (!existsSync(imgPath)) {
  console.log(`info gemini-vision-check skipped: image not found at ${imgPath}`);
  process.exit(0);
}

const outDir = dirname(imgPath);
const manifestPath = A.manifest && A.manifest !== true
  ? resolve(A.manifest)
  : join(outDir, 'manifest.json');

let M = { W: 518.7, H: 255.1, widthMM: 183, heightMM: 90, panels: [], anchors: {} };
if (existsSync(manifestPath)) {
  try { M = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch {}
}

const specPath = A.spec && A.spec !== true ? resolve(A.spec) : resolve('docs/spec.md');
const specText = existsSync(specPath) ? readFileSync(specPath, 'utf8').slice(0, 3000) : '';
const outJsonPath = A.out && A.out !== true ? resolve(A.out) : join(outDir, 'vision-check.json');

const model = process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash';
const imgB64 = readFileSync(imgPath).toString('base64');

const prompt = `You are a publication-quality scientific figure art editor and spatial auditor.
Inspect this rendered schematic figure (${M.widthMM} mm x ${M.heightMM} mm, ${M.W} pt x ${M.H} pt).
${specText ? `Context from docs/spec.md:\n${specText}\n` : ''}
Detect visual defects in these 4 categories that DOM axis-aligned bounding boxes miss:
1. ROTATED_OR_CURVED_TEXT_COLLISION: Rotated text or math symbols touching a line, arrow, or shape.
2. ANCHOR_MISALIGNMENT_3D: Callout leader tip on a 3D/raster hero object that does not land on the visual feature its label names.
3. REGISTER_CLASH: Unshaded flat primitives adjacent to a 3D or illustrated hero object (P27, P30).
4. VISUAL_CROWDING_OR_CLIPPING: Cluttered sub-regions or clipped arrowheads/glyphs.

Return ONLY valid JSON with shape:
{
  "defects": [
    {
      "category": "ROTATED_OR_CURVED_TEXT_COLLISION" | "ANCHOR_MISALIGNMENT_3D" | "REGISTER_CLASH" | "VISUAL_CROWDING_OR_CLIPPING",
      "box_2d": [ymin, xmin, ymax, xmax],
      "description": "concise description and subtraction-first fix"
    }
  ]
}
where box_2d uses normalized 0..1000 integer coordinates [ymin, xmin, ymax, xmax]. If the figure has no such defects, return {"defects": []}.`;

try {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType: 'image/png', data: imgB64 } },
          { text: prompt }
        ]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    })
  });

  if (!res.ok) {
    console.log(`info gemini-vision-check HTTP ${res.status}: ${await res.text()}`);
    process.exit(0);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"defects":[]}';
  const parsed = JSON.parse(rawText);
  const rawDefects = Array.isArray(parsed.defects) ? parsed.defects : [];

  const defects = rawDefects.map((d) => {
    const [ymin = 0, xmin = 0, ymax = 0, xmax = 0] = Array.isArray(d.box_2d) ? d.box_2d : [0, 0, 0, 0];
    const xPt = +((xmin / 1000) * M.W).toFixed(1), yPt = +((ymin / 1000) * M.H).toFixed(1);
    const wPt = +(((xmax - xmin) / 1000) * M.W).toFixed(1), hPt = +(((ymax - ymin) / 1000) * M.H).toFixed(1);
    const xMM = +((xmin / 1000) * M.widthMM).toFixed(1), yMM = +((ymin / 1000) * M.heightMM).toFixed(1);
    return {
      category: d.category || 'VISUAL_CROWDING_OR_CLIPPING',
      box_2d: [ymin, xmin, ymax, xmax],
      pt: { x: xPt, y: yPt, w: wPt, h: hPt },
      mm: { x: xMM, y: yMM },
      description: d.description || ''
    };
  });

  writeFileSync(outJsonPath, JSON.stringify({ model, image: imgPath, defects }, null, 2));
  if (!defects.length) {
    console.log(`info gemini-vision-check (${model}): 0 visual defects detected`);
  } else {
    for (const d of defects) {
      console.log(`WARN [${d.category}] at (${d.pt.x}, ${d.pt.y} pt; ${d.mm.x}, ${d.mm.y} mm; box ${d.pt.w}x${d.pt.h} pt): ${d.description}`);
    }
  }
} catch (err) {
  console.log(`info gemini-vision-check skipped on network/parse error: ${err.message || err}`);
  process.exit(0);
}
