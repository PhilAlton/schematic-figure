# Schematic Studio Operational Rules

When designing, rendering, replicating, or auditing scientific schematics (`schematic-figure`) or 37 CFR 1.84 patent drawings (`patent-drawing`), enforce these operational invariants at all times:

## 1. Command Execution Shape
- Always run `node skills/schematic-figure/foundation/tools/render.mjs`, `node skills/schematic-figure/foundation/tools/check.mjs`, `node skills/schematic-figure/foundation/tools/query-parts.mjs`, `node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs`, and `blender -b` as standalone, prefix-matchable commands (no `&&` chains or `$()` command substitutions).
- In sandboxed environments (such as Antigravity on Windows/macOS), invoke browser/Blender rendering tools with `BypassSandbox: true`.
- During the inner drafting loop (Steps 6–8), use single-pass rendering and verification:
  `node skills/schematic-figure/foundation/tools/render.mjs --fig <figure_path> --quick --check`
  so headless Chromium renders `<name>.png`, `<name>-thumb.png`, and runs the full DOM/canvas pixel gate in a single browser session.

## 2. Progressive Disclosure First (`[Addresses FM-3]`)
- **Never** read all `reference/lib-*.md` files (195 KB) or `foundation/blender/*.py` files (338 KB) wholesale into context.
- Before reading any `reference/lib-*.md` file or writing `figure/*.js`, run:
  - `node skills/schematic-figure/foundation/tools/query-parts.mjs --list-domains`
  - `node skills/schematic-figure/foundation/tools/query-parts.mjs --domains <d1,d2> --route <route>`
  - `node skills/schematic-figure/foundation/tools/query-parts.mjs --blender <kit1,kit2>`
  to retrieve only the relevant API signatures and keep context under 4 KB.

## 3. Subagent Separation of Duties (`[Addresses FM-1]`)
- **Clean-Room Blind Reader (`schematic-blind-reader`)**: At `depth=standard` and `depth=full`, never perform an inline self-cold-read (`review=own`) when subagent invocation (`invoke_subagent`) is available. Always dispatch `schematic-blind-reader` (`Model: 'flash'`) on `figure/out/<name>-thumb.png` and `figure/out/<name>.png` to write `docs/reader-test.md`. `schematic-blind-reader` is strictly forbidden from reading `docs/brief.md`, `docs/spec.md`, `docs/facts.md`, or `figure/*.js`.
- **Parallel Concept Drafting (`schematic-drafter` + `schematic-art-director`)**: At `depth=full` in `design` mode, dispatch two parallel `schematic-drafter` subagents (`figure/figure_a.js` and `figure/figure_b.js`) and have `schematic-art-director` adjudicate them into `docs/choice.md`.
- **Subtraction-First Remediation**: When addressing any readability, crowding, or critique finding from `docs/reader-test.md` or `docs/critique-independent.md`, never add text or a new visual element without removing at least as much elsewhere.

## 4. 2D <-> 3D Calibration & Spatial Grounding (`[Addresses FM-4]`)
- Whenever a figure uses a headless Blender 3D hero (`style='illustration'`), record the exact placed panel width `fig_width_mm` in `figure/scene-contract.json` and pass `fig_width_mm` to `use_style('illustration', fig_width_mm=...)` in `figure/render3d.py` so Freestyle outlines print at `0.5 pt` without scaling mismatch.
- Run `node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs --img figure/out/<name>.png` alongside `check.mjs` to catch rotated-text collisions, 3D callout anchor misalignments, and register clashes with exact `(x_pt, y_pt)` and `(x_mm, y_mm)` coordinates.
