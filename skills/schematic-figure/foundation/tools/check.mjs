// check.mjs — the gate. Measures what can be measured; it cannot tell you the figure is good.
//   node tools/check.mjs [--fig figure/figure.js] [--final] [--root <project dir>] [--out <dir>]
// FAIL lines must be fixed. WARN lines are a fix-list unless you can say why the figure is right.
// Writes <figure dir>/out/check.json and out/onscreen-text.txt (every string on the page, for the facts ledger).
import { mkdirSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { serve, launch, loadFigure, args } from './lib/cdp.mjs';
import { runGate, finishGate } from './lib/gate.mjs';

const A = args();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = A.root && A.root !== true ? resolve(A.root) : null;   // --root <dir>: the figure lives outside the foundation (as in render.mjs)
const figAbs = resolve(A.fig ?? 'figure/figure.js'), fig = relative(PROJ ?? ROOT, figAbs);
// --out <dir>: where check.json and onscreen-text.txt go. Default: out/ next to the figure. With --root: the OS temp folder, so the project's source tree stays clean.
const out = A.out && A.out !== true ? resolve(A.out) : PROJ ? join(tmpdir(), 'schem-check', figAbs.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_-]+/g, '_').slice(-80)) : join(dirname(figAbs), 'out');
mkdirSync(out, { recursive: true });

const { srv, port } = await serve(ROOT, PROJ);
const cdp = await launch();
try {
  const t0 = Date.now();
  const { manifest: M, error } = await loadFigure(cdp, port, fig, { dpi: 192 });
  if (error) {
    finishGate({ fail: ['figure threw: ' + error.split('\n')[0]], warn: [], info: [] }, out);
  } else {
    await runGate({ cdp, M, figAbs, out, final: !!A.final, A, buildMs: Date.now() - t0 });
  }
} catch (e) {
  finishGate({ fail: ['check crashed: ' + (e.stack || e)], warn: [], info: [] }, out);
} finally {
  cdp.close();
  srv.close();
}
