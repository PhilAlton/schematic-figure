// query-parts.mjs — Zero-LLM progressive-disclosure API & part signature slicer [Addresses FM-3].
// Eliminates the need to load 195 KB of reference/lib-*.md or 338 KB of blender/*.py into context.
// Usage:
//   node tools/query-parts.mjs --list-domains
//   node tools/query-parts.mjs --domains optics,qc --route lightScene3 [--search "waveguide,slm"]
//   node tools/query-parts.mjs --blender apparatus3d,scene
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { args } from './lib/cdp.mjs';

const A = args();
const FOUNDATION = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_DIR = join(FOUNDATION, 'engine');
const BLENDER_DIR = join(FOUNDATION, 'blender');
const REF_DIR = resolve(FOUNDATION, '..', 'reference');
const MAX_BYTES = 3900; // Strictly under 4 KB budget [Addresses FM-3]

const CORE_MODULES = {
  core: 'Page, panel, anchor, relation (F.relate), and text layout primitives (engine/core.js)',
  draw: 'Low-level SVG shapes, arrows, connectors (L.connect, L.callout), gradients, and clip paths (engine/draw.js)',
  illustrate: 'Procedural vector shading, L.tones, L.wobble, L.vary, and illustrated finish (engine/illustrate.js)',
  light3: 'L.lightScene3 depth-plane sorted 3D beams, glass lenses, and oblique boxes (engine/light3.js)',
  geo: 'Oblique/isometric 3D projection geometry helpers and coordinate transforms (engine/geo.js)',
  optics: 'Optical bench components: lenses, mirrors, beamsplitters, fibers, cavities, detectors (engine/optics.js)',
  signals: 'Signal waveforms, step histograms, spectra, and overview devices (engine/signals.js)',
  forms: '3D oblique boxes, cylinders, prisms, trays, and stimulus/motion glyphs (engine/forms.js)',
  blocks: 'Block diagrams, neural networks, axes/plots, and photonic chip layouts (engine/blocks.js)',
  notation: 'Mathematical brackets, dimensions, callouts, and reference numerals (engine/notation.js)',
  patent: '37 CFR 1.84 USPTO patent drawing parts: figLabel, numeral, section hatching, flowcharts (engine/patent.js)',
};

const DOMAIN_LIBS = {
  bio: 'Cells, receptors, membranes, organelles, nucleic acids, pathways, lab animals, tissues (engine/bio.js, reference/lib-bio.md)',
  chem: 'Skeletal formulas, metal centres, catalytic cycles, reaction arrows, lab glassware (engine/chem.js, reference/lib-chem.md)',
  cs: 'System architecture stacks, tensor blocks, attention graphs, tables, badges (engine/cs.js, reference/lib-cs.md)',
  ind: 'P&ID valves, columns, vessels, heat exchangers, electrical/electrochemical symbols (engine/ind.js, reference/lib-ind.md)',
  qc: 'Quantum circuits, Tanner/surface codes, trapped-ion rails, modular quantum networks (engine/qc.js, reference/lib-qc.md)',
};

const BLENDER_KITS = {
  scene: 'Core Cycles/Freestyle setup, camera_look, camera_oblique, use_style("illustration"), finish (blender/scene.py)',
  apparatus3d: '3D optical/cryogenic/vacuum apparatus, breadboards, coils, chambers (blender/apparatus3d.py)',
  bio3d: '3D lipid bilayers, vesicles, protein complexes, viral capsids, DNA helices (blender/bio3d.py)',
  device3d: '3D nanofabricated chips, waveguides, resonators, heterostructures, MEMS (blender/device3d.py)',
  mol3d: '3D ball-and-stick and space-filling molecular structures (blender/mol3d.py)',
};

function extractJsExports(jsFile, keywords = []) {
  const path = join(ENGINE_DIR, `${jsFile}.js`);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/.exec(lines[i]);
    if (m) {
      const fnName = m[1];
      const params = m[2].replace(/\s+/g, ' ').trim();
      let comment = '';
      if (i > 0 && lines[i - 1].trim().startsWith('//')) {
        comment = lines[i - 1].trim().replace(/^\/\/\s*/, '');
      }
      const entry = `${fnName}(${params})${comment ? ' — ' + comment : ''}`;
      if (!keywords.length || keywords.some((kw) => entry.toLowerCase().includes(kw))) {
        items.push(entry);
      }
    }
  }
  return items;
}

function extractBlenderDefs(kitName, keywords = []) {
  const path = join(BLENDER_DIR, `${kitName}.py`);
  if (!existsSync(path)) return [];
  const src = readFileSync(path, 'utf8');
  const lines = src.split(/\r?\n/);
  const out = [];
  const docMatch = /^"""([\s\S]*?)"""/.exec(src);
  if (docMatch) {
    const firstLine = docMatch[1].trim().split(/\r?\n/)[0];
    out.push(`# ${kitName}.py: ${firstLine}`);
  }
  for (let i = 0; i < lines.length; i++) {
    const m = /^def\s+([A-Za-z0-9_]+)\s*\(([^)]*)\):/.exec(lines[i]);
    if (m && !m[1].startsWith('_')) {
      const sig = `def ${m[1]}(${m[2].replace(/\s+/g, ' ').trim()}):`;
      let doc = '';
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('"""')) {
        doc = lines[i + 1].trim().replace(/^"""|"""$/g, '').trim();
      }
      const entry = doc ? `${sig}  # ${doc.slice(0, 90)}` : sig;
      if (!keywords.length || keywords.some((kw) => entry.toLowerCase().includes(kw))) {
        out.push(entry);
      }
    }
  }
  return out;
}

function extractMarkdownBullets(mdPath, sectionFilter = null, keywords = []) {
  if (!existsSync(mdPath)) return [];
  const src = readFileSync(mdPath, 'utf8');
  const sections = src.split(/^##\s+/m).slice(1);
  const out = [];
  for (const sec of sections) {
    const lines = sec.split(/\r?\n/);
    const heading = lines[0].trim();
    if (sectionFilter && !sectionFilter.test(heading)) continue;
    const bullets = lines.slice(1).filter((l) => l.trim().startsWith('- `') || l.trim().startsWith('* `'));
    const matched = keywords.length
      ? bullets.filter((b) => keywords.some((kw) => b.toLowerCase().includes(kw)))
      : bullets;
    if (matched.length) {
      out.push(`### ${heading}`);
      for (const b of matched) {
        out.push(b.length > 140 ? b.slice(0, 137) + '...' : b);
      }
    }
  }
  return out;
}

function clampOutput(lines) {
  let acc = '';
  for (const line of lines) {
    if (Buffer.byteLength(acc + line + '\n', 'utf8') > MAX_BYTES) {
      acc += `... (truncated to <4 KB; pass --search "<term>" to narrow further)\n`;
      break;
    }
    acc += line + '\n';
  }
  return acc.trimEnd();
}

if (A['list-domains'] || (Object.keys(A).length === 1 && A._.length === 0)) {
  const out = ['=== Core Engine Modules (skills/schematic-figure/foundation/engine/) ==='];
  for (const [k, v] of Object.entries(CORE_MODULES)) out.push(`  ${k.padEnd(12)} ${v}`);
  out.push('\n=== Domain Part Libraries (engine/<domain>.js & reference/lib-<domain>.md) ===');
  for (const [k, v] of Object.entries(DOMAIN_LIBS)) out.push(`  ${k.padEnd(12)} ${v}`);
  out.push('\n=== Headless Blender 3D Kits (skills/schematic-figure/foundation/blender/) ===');
  for (const [k, v] of Object.entries(BLENDER_KITS)) out.push(`  ${k.padEnd(12)} ${v}`);
  console.log(clampOutput(out));
  process.exit(0);
}

const keywords = A.search && A.search !== true
  ? String(A.search).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  : [];

const outLines = [];

if (A.blender && A.blender !== true) {
  const kits = String(A.blender).split(',').map((s) => s.trim()).filter(Boolean);
  for (const kit of kits) {
    outLines.push(...extractBlenderDefs(kit, keywords));
  }
}

if (A.route && A.route !== true) {
  const route = String(A.route).trim().toLowerCase();
  outLines.push(`=== Route Slice: ${A.route} ===`);
  if (route.includes('lightscene3') || route.includes('light3')) {
    outLines.push(...extractJsExports('light3', keywords));
    outLines.push(...extractJsExports('illustrate', keywords).slice(0, 8));
  } else if (route.includes('illustrat')) {
    outLines.push(...extractJsExports('illustrate', keywords));
  } else if (route.includes('patent')) {
    outLines.push(...extractJsExports('patent', keywords));
  } else if (route.includes('blender')) {
    outLines.push(...extractBlenderDefs('scene', keywords).slice(0, 12));
  } else {
    outLines.push(...extractJsExports(route, keywords));
  }
}

if (A.domains && A.domains !== true) {
  const doms = String(A.domains).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  for (const d of doms) {
    outLines.push(`=== Domain Slice: ${d} ===`);
    const exports = extractJsExports(d, keywords);
    for (const e of exports.slice(0, 18)) outLines.push(`  L/D.${e}`);
    if (DOMAIN_LIBS[d]) {
      const mdBullets = extractMarkdownBullets(join(REF_DIR, `lib-${d}.md`), null, keywords);
      outLines.push(...mdBullets.slice(0, 16));
    } else {
      const secRegex = new RegExp(d, 'i');
      const mdBullets = extractMarkdownBullets(join(REF_DIR, 'lib-api.md'), secRegex, keywords);
      outLines.push(...mdBullets.slice(0, 16));
    }
  }
}

if (!outLines.length && keywords.length) {
  outLines.push(`=== Search Results: ${keywords.join(', ')} ===`);
  for (const mod of [...Object.keys(CORE_MODULES), ...Object.keys(DOMAIN_LIBS)]) {
    for (const e of extractJsExports(mod, keywords)) outLines.push(`[${mod}] ${e}`);
  }
}

console.log(clampOutput(outLines));
