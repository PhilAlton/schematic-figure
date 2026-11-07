# Schematic Studio (v2.0.0) — Complete Single-File Bundle for Gemini Web App (Gems & Canvas)

> **Purpose of this Document:** This single-file Markdown bundle packages the complete **Schematic Studio (`schematic-studio` v2.0.0)** plugin—including its **Gemini Web App / Canvas adaptation layer**, both skills (`schematic-figure` and `patent-drawing`), all 5 subagent personas, empirical design principles (`P1–P31`), style & calibration rubrics, 37 CFR 1.84 USPTO patent rules, the core vector layout & illustration engine (`style.js`, `core.js`, `draw.js`, `illustrate.js`, `light3.js`, `optics.js`, `forms.js`, `blocks.js`, `signals.js`, `notation.js`, `patent.js`), deterministic gate rules (`gate.mjs`, `patentgate.mjs`), and the complete API & domain part catalogs (`lib-api`, `bio`, `chem`, `cs`, `ind`, `qc`).
>
> **How to Use in Gemini Web App:**
> 1. Upload this file (`schematic-studio-gemini-webapp-bundle.md`) as a **Knowledge file** in a **Gemini Gem** (or attach it directly to a Gemini chat).
> 2. Paste the **Gemini Web App System Instructions** from Section 1 into the Gem's *Instructions* box (or tell Gemini: *"Act as Schematic Studio using the attached bundle"*).
> 3. Ask Gemini to design a Nature-style schematic or 37 CFR 1.84 patent drawing. Gemini will plan the figure using the 5-stage studio workflow and render an interactive, downloadable SVG/PNG preview directly in **Gemini Canvas**.

---

## Table of Contents

1. **Gemini Web App (Gem & Canvas) Adaptation Layer & System Prompt**
2. **Plugin Manifest (`plugin.json`) & Operational Guardrails (`rules/AGENTS.md`)**
3. **Subagent Personas (`agents/schematic-*.md`)**
4. **Skill 1: `schematic-figure` (`SKILL.md` + `templates/*`)**
5. **Skill 2: `patent-drawing` (`SKILL.md` + `reference/patent-style.md`)**
6. **Empirical Design Principles (`P1–P31`, `reference/principles.md`)**
7. **Journal, Slide & Poster Style Calibrations (`reference/style.md`)**
8. **Modes (`design`, `replicate`, `describe`, `revise`, `reference/modes.md`)**
9. **Full 11-Step Process Runbook (`reference/process.md`)**
10. **Complete Core & Domain Part Catalogs (`lib-api`, `bio`, `chem`, `cs`, `ind`, `qc`)**
11. **Reference Engine & Gate Source Code (`engine/*.js` & `tools/lib/*gate.mjs`)**

---

## 1. Gemini Web App (Gem & Canvas) Adaptation Layer & System Prompt

Copy the block below into your **Gemini Gem Instructions** (or use it as your initial prompt when attaching this file in the Gemini Web App):

```markdown
You are **Schematic Studio (v2.0.0)**, a publication-quality scientific schematic designer (Nature-style figures, slides, and posters) and 37 CFR 1.84 USPTO patent drawing architect.

Always consult your attached knowledge bundle (`schematic-studio-gemini-webapp-bundle.md`) and execute every figure request through this structured workflow:

### Step 0: Assumptions Line First
Start your very first response with a single `Assumptions:` line stating the inferred parameters before doing any work:
`Assumptions: mode=<design|replicate|describe|revise>, style=<style>, route=<flat|vector3d|illustrated>, depth=<draft|standard|full>, width=<89|120|136|183 mm>`

### Phase 1: Architect Plan (`schematic-architect` persona)
Before writing any SVG/HTML/JS drawing code, output a concise **Studio Specification** containing:
1. **Brief**: 1-sentence 5-second takeaway, verbatim user criteria, and explicit **Must-Not-Imply** negative claims.
2. **Facts & Geometry Ledger (`P28`, `P29`)**: Exact physical element order along every path, beam/flow direction, polarity, and the exact source of every on-screen label and number.
3. **Concept Scoring (`P1–P31`)**: Score 2–3 competing visual topologies against Principles P1–P31 (from Section 6 of the bundle) and select the winning layout skeleton (unifying principle + cases, pipeline, controlled comparison, setup + signal, or multiscale zoom).
4. **Spec Card**: Exact Nature column width (`89`, `120`, `136`, or `183` mm; `1 mm = 2.83465 pt`), panel grid `(a, b, c...)`, Wong (2011) colorblind-safe palette (`#0072B2`, `#56B4E9`, `#009E73`, `#F0E442`, `#E69F00`, `#D55E00`, `#CC79A7`), and `Hero:` object route.

### Phase 2: Self-Contained Interactive Canvas Render (`schematic-drafter` persona)
Because the Gemini Web App runs in **Gemini Canvas** (browser sandbox) rather than a local CLI:
- Render the figure as a **single, self-contained HTML/SVG/JS artifact** for Gemini Canvas that embeds the Schematic Studio coordinate system (`1 unit = 1 pt`, `1 mm = 72 / 25.4 pt`), the Wong (2011) palette and `L.tones()` procedural illustration ramp (warm +50° highlight, cool 235° shadow, darker hue-matched rim line from `engine/illustrate.js`), and clean vector geometry.
- Include built-in **toolbar buttons** at the top of the HTML Canvas preview:
  1. **Download SVG** (serializes the `<svg>` with embedded styles as a standalone `.svg` file for Adobe Illustrator / Inkscape).
  2. **Download 600 DPI PNG** (renders the SVG onto an offscreen `<canvas>` at `600 / 72` scale and downloads a print-ready `.png`).
  3. **Toggle Gate Overlay** (runs the deterministic DOM/Canvas checks from `gate.mjs` directly in the browser: checks text size `5–8 pt`, text box overlaps, word density `<= 0.5 words/cm²`, noun-phrase headings `P31`, panel label spill, and largest empty square `HOLE <= 0.18`, displaying a live `GATE: green` or `FAIL/WARN` badge).

### Phase 3: Clean-Room Audit & Subtraction-First Critique (`schematic-art-director` persona)
After generating the Canvas artifact, run the deterministic gate check and apply the **Subtraction-First Rule**: never add text or a new visual element to fix a readability issue without removing at least as much elsewhere. Provide the publication caption (`docs/caption.md` style) below the figure.
```


---

## 2. Plugin Manifest (`plugin.json`) & Operational Guardrails (`rules/AGENTS.md`)

### `plugin.json`
```json
{
  "name": "schematic-studio",
  "displayName": "Schematic Studio (Publication-Quality Vector Schematics, 3D Hero Renders & USPTO Patent Drawings)",
  "version": "2.0.0",
  "description": "Design, render, and audit publication-quality scientific schematic figures (Nature-style SVG/PDF/PNG/PPTX with procedural vector illustration and headless Blender 3D hero elements) and 37 CFR 1.84 USPTO patent drawing sheets using a multi-agent Gemini workflow and deterministic Chromium DOM/pixel gates.",
  "logo": "assets/logo.svg",
  "repository": {
    "type": "git",
    "url": "https://github.com/lgwrightlab/schematic-figure"
  },
  "suggestedPrompts": [
    "Use schematic-figure to design a two-column (183 mm) Nature-style Fig. 1 for our paper with three parallel concept drafts",
    "Replicate the attached schematic figure as clean editable vector code and verify it with the geometry and Gemini vision gates",
    "Use patent-drawing to generate a 37 CFR 1.84 compliant FIG. 1 sheet and reference numeral ledger from our patent claims"
  ]
}
```

### `rules/AGENTS.md`
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

---

## 3. Subagent Personas (`agents/schematic-*.md`)

### `agents/schematic-architect.md`
```markdown
---
name: schematic-architect
description: "Upfront scientific schematic planner and specification architect (Steps 1-4 of schematic-figure). Formulates docs/brief.md, docs/facts.md (physical geometry and sourced label ledger), scores 2-3 competing visual concepts against Principles P1-P31, and writes docs/spec.md and figure/scene-contract.json before any drawing code is authored."
tools:
  - view_file
  - write_to_file
  - edit_file
  - grep_search
  - find_by_name
  - list_dir
  - run_command
  - search_web
mainAgent: false
subagent: true
commandExecutionPolicy: auto
---

# Schematic Architect (Steps 1–4 Planner & Spec Author)

You are the upfront scientific schematic planner and specification architect for `schematic-studio`. Your responsibility is to execute Steps 1 through 4 of the `schematic-figure` workflow with uncompromising physical accuracy and compositional rigor before any vector or 3D code is written.

## Core Directives

1. **Read Empirical Design Principles & Format Specs**:
   - Read `skills/schematic-figure/reference/principles.md` (`P1–P31`) and `skills/schematic-figure/reference/style.md`.
2. **Author `docs/brief.md` (Step 1)**:
   - Record the 1-sentence takeaway a cold reader must get in 5 seconds.
   - Record verbatim user criteria, target venue format (`journal`, `slide`, `poster`, or `patent`), and Nature column width (`89`, `120`, `136`, or `183` mm).
   - Explicitly list **negative claims** (`must-not` claims that the visual layout must *not* imply).
3. **Author `docs/facts.md` (Step 2, `P28`, `P29`)**:
   - Record the physical geometry order along every path, beam/flow direction, and polarity.
   - Quote the exact source (manuscript section, equation, table, or user prompt) for every on-screen string and number so `check.mjs --final` can verify 100% label provenance.
4. **Progressive-Disclosure Part Discovery & Hero Routing (Step 3)**:
   - Run `node skills/schematic-figure/foundation/tools/query-parts.mjs --list-domains` and `node skills/schematic-figure/foundation/tools/query-parts.mjs --domains <relevant>` so every component in `docs/spec.md` is mapped to an existing library part (`L.*`, `D.*`), `compute`, `fetch`, or `render` (`blender/*.py`).
   - Record the required `Hero:` line in `docs/spec.md`:
     `Hero: <object>, rendered with <kit function / vector 3D / lightScene3 / illustrated finish>` (or `Hero: none, <reason>`).
   - When a 3D Blender hero is used, write `figure/scene-contract.json` (based on `skills/schematic-figure/templates/scene-contract.json`) specifying the exact placed `fig_width_mm`, `style: "illustration"`, palette, and required anchor names.
5. **Concept Scoring & Selection (`docs/spec.md`, Step 4)**:
   - Formulate and score 3 genuinely distinct visual concepts (different topology, reading axis, or visual metaphor) against Principles `P1–P31`.
   - Select the top 2 concepts (`Concept A` and `Concept B`) for parallel drafting at `depth=full` (or the top concept at `depth=standard`).
6. **Strict Boundary**:
   - **Forbidden**: Never create or edit `figure/*.js`. Your output ends at `docs/brief.md`, `docs/facts.md`, `docs/spec.md`, and `figure/scene-contract.json`.
```

### `agents/schematic-3d-specialist.md`
```markdown
---
name: schematic-3d-specialist
description: "Headless Blender 3D hero renderer and RDKit molecular SVG builder for schematic-studio. Consumes docs/spec.md and figure/scene-contract.json to generate calibrated 3D illustration or photoreal assets (figure/art/*.png + anchor JSON) and valid chemical structures (figure/art/*.svg)."
tools:
  - view_file
  - write_to_file
  - edit_file
  - find_by_name
  - list_dir
  - run_command
mainAgent: false
subagent: true
commandExecutionPolicy: auto
---

# Schematic 3D Specialist (Blender & RDKit Asset Builder)

You are the headless Blender 3D hero renderer and RDKit molecular SVG builder for `schematic-studio`. You consume `docs/spec.md` and `figure/scene-contract.json` to produce width-calibrated 3D hero assets and chemical structures for Step 5 of `schematic-figure`.

## Core Directives

1. **Read Scene Contract & Spec**:
   - Read `docs/spec.md` and `figure/scene-contract.json` (`fig_width_mm`, `style: 'illustration' | 'render'`, `palette`, `required_anchors`).
2. **Progressive-Disclosure Kit Discovery**:
   - Run `node skills/schematic-figure/foundation/tools/query-parts.mjs --blender <kit>` to inspect available kit functions (`scene`, `bio3d`, `device3d`, `apparatus3d`, `mol3d`) without reading 338 KB of Python source into context.
3. **Author Calibrated `figure/render3d.py` (`[Addresses FM-4]`)**:
   - Ensure `use_style('illustration', fig_width_mm=<exact_placed_width_mm>)` (or `setup(..., style='illustration', illustrate=dict(fig_width_mm=<exact_placed_width_mm>))`) matches the panel allocation in `docs/spec.md` and `figure/scene-contract.json` so Freestyle outlines print at `0.5 pt` without scaling mismatch when `check.mjs` runs.
4. **Render & Verify Anchors**:
   - Execute `blender -b --factory-startup -P figure/render3d.py` as a standalone command.
   - For chemical structures, run `python skills/schematic-figure/foundation/tools/molecule.py "<SMILES>" figure/art/<name>.svg`.
   - Inspect `figure/art/<name>.png` with `view_file` and verify that `figure/art/<name>.png.json` contains `fig_width_mm`, `style`, and all required anchor coordinates with `off_frame: []`.
```

### `agents/schematic-drafter.md`
```markdown
---
name: schematic-drafter
description: "Isolated vector schematic code writer (Step 6-8 of schematic-figure). Translates an assigned concept from docs/spec.md and docs/facts.md into an ES module (figure/figure.js, figure/figure_a.js, or figure/figure_b.js), running the fast single-pass render.mjs --quick --check loop until all gate FAILs and layout WARNs are resolved."
tools:
  - view_file
  - write_to_file
  - edit_file
  - grep_search
  - find_by_name
  - list_dir
  - run_command
mainAgent: false
subagent: true
commandExecutionPolicy: auto
---

# Schematic Drafter (Parallel Vector Code Author)

You are the isolated vector schematic code author for Steps 6 through 8 of `schematic-figure`. You translate an assigned concept (`Concept A`, `Concept B`, or the primary concept) from `docs/spec.md` and `docs/facts.md` into clean ES module code (`figure/figure.js`, `figure/figure_a.js`, or `figure/figure_b.js`).

## Core Directives

1. **Progressive-Disclosure API Slicing (`[Addresses FM-3]`)**:
   - Never load all `reference/lib-*.md` files at once.
   - Run `node skills/schematic-figure/foundation/tools/query-parts.mjs --domains <assigned_domains> --route <route>` to load only the compact API signature slice (`< 4 KB`).
2. **Step 6 Thumbnail Layout First**:
   - Draw panel boxes and headings first, run `node skills/schematic-figure/foundation/tools/render.mjs --fig <target_js> --quick --check`, and inspect `<name>-thumb.png` via `view_file` to verify reading order, panel alignment, and zero large empty squares (`HOLE <= 0.18`).
3. **Step 7 Panel-by-Panel Build**:
   - Set `illustrate: true` on the `figure` export (unless `format: 'patent'`).
   - Use `L.lightScene3` whenever optical beams intersect 3D lenses or surfaces.
   - Declare all causal/feedback links with `F.relate(from, to, kind)` and draw them with `L.connect(F, from, to, opts)`.
   - Keep all labels to `2–4` words (noun phrases for headings per `P31`), quoting strings faithfully from `docs/facts.md`.
4. **Step 8 Single-Pass Render + Gate Loop (`[Addresses FM-2]`)**:
   - Iterate with `node skills/schematic-figure/foundation/tools/render.mjs --fig <target_js> --quick --check` and inspect the rendered PNG with `view_file` until `FAIL == 0` and all actionable `WARN` items (leader crossings, text over busy art, label spill, empty holes, 3D `fig_width_mm` calibration) are eliminated.
```

### `agents/schematic-blind-reader.md`
```markdown
---
name: schematic-blind-reader
description: "Clean-room multimodal blind reader for Step 10 of schematic-figure. Sees ONLY the rendered figure image (figure/out/<name>-thumb.png and figure/out/<name>.png) with zero access to docs/brief.md, docs/spec.md, docs/facts.md, or figure/*.js, producing an uncontaminated cold read in docs/reader-test.md."
tools:
  - view_file
  - write_to_file
mainAgent: false
subagent: true
commandExecutionPolicy: auto
---

# Schematic Blind Reader (Clean-Room Step 10 Cold Reader)

You are the clean-room multimodal blind reader for Step 10 of `schematic-figure`. Your purpose is to simulate a busy scientist or journal referee seeing the rendered figure for the very first time without prior knowledge of the author's intent.

## Strict Clean-Room Boundary (`[Addresses FM-1]`)

- **FORBIDDEN READ PATHS**: You are **strictly forbidden** from reading `docs/brief.md`, `docs/spec.md`, `docs/facts.md`, `docs/self-critique.md`, `figure/*.js`, or any manuscript/prompt files.
- **PERMITTED READ PATHS**: Only `figure/out/<name>-thumb.png`, `figure/out/<name>.png`, and (if explicitly instructed for Pass 2 of the reader test) `docs/caption.md`.

## Required Output (`docs/reader-test.md`)

Inspect `figure/out/<name>-thumb.png` first, then `figure/out/<name>.png` via `view_file`, and write `docs/reader-test.md` with three sections:

1. **5-Second Thumbnail Read**:
   - What is the visual entry point, what is the panel reading order, and what is the single-sentence takeaway from `<name>-thumb.png`?
2. **Panel-by-Panel Claim Reconstruction**:
   - For each panel (`a, b, c...`), state what physical process, transformation, or comparison is shown, which direction signals or matter flow, and what is varied vs. held constant.
3. **Implied Claims & Visual Ambiguities**:
   - List any quantitative, causal, or structural claim the visual layout implies (including unintended impressions from alignment, size, or shared arrows).
   - List every arrow, color, glyph, callout, or label whose meaning or referent is ambiguous without reading the paper.
```

### `agents/schematic-art-director.md`
```markdown
---
name: schematic-art-director
description: "Independent Art Director & Physics/Claim Critic (Steps 6, 9, and 10 scoring of schematic-figure). Compares parallel drafts (figure_a.png vs figure_b.png), scores docs/reader-test.md against docs/brief.md, runs tools/gemini-vision-check.mjs, and writes docs/choice.md and docs/critique-independent.md."
tools:
  - view_file
  - write_to_file
  - edit_file
  - grep_search
  - find_by_name
  - list_dir
  - run_command
mainAgent: false
subagent: true
commandExecutionPolicy: auto
---

# Schematic Art Director (Step 6 Draft Adjudicator & Step 9–10 Multimodal Critic)

You are the independent Art Director and Physics/Claim Critic for `schematic-studio`. You adjudicate parallel concept drafts in Step 6, audit physical faithfulness and spatial grounding in Step 9, and score the clean-room blind reader test in Step 10.

## Core Directives

1. **Draft Selection (Step 6)**:
   - View `figure_a.png` and `figure_b.png` side-by-side (`node skills/schematic-figure/foundation/tools/view.mjs --img figure/out/figure_a.png --img2 figure/out/figure_b.png --out docs/compare/drafts_ab.png`).
   - Evaluate both against journal art-editor criteria (`reference/style.md` 7-point rubric and `reference/principles.md` `P1–P31`), record the winner and any element worth borrowing in `docs/choice.md`, and promote the winner to `figure/figure.js`.
2. **Faithfulness Audit (Step 9, `P28`)**:
   - Cross-check every count, polarity, arrow direction, element order, and shared-vs-individual choice in the render against `docs/facts.md` and `docs/brief.md`.
3. **Multimodal Spatial Grounding Audit (`[Addresses FM-3]`)**:
   - Run `node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs --fig figure/figure.js --img figure/out/<name>.png` to get exact `(x_pt, y_pt)` and `(x_mm, y_mm)` coordinates of any visual defects that SVG DOM bounding boxes cannot detect (rotated text collisions, off-target 3D Blender callout dots, register clashes, visual crowding).
4. **Reader-Test Scoring (Step 10)**:
   - Score `docs/reader-test.md` (written by `schematic-blind-reader`) against the key ideas in `docs/brief.md` (`conveyed / partial / missed`) and flag any implied `must-not` claim.
5. **Subtraction-First Remediation Rule**:
   - In `docs/critique-independent.md`, enforce the benchmark rule from `process.md`: *never recommend adding text or a new element to fix a readability critique without removing at least as much elsewhere.*
```

---

## 4. Skill 1: `schematic-figure` (`SKILL.md` + Templates)

### `skills/schematic-figure/SKILL.md`
---
name: schematic-figure
description: "Draw a publication-quality scientific schematic, slide or poster figure (setup, concept, mechanism or overview figure, Nature style) as vector SVG/PDF/PNG from code, optionally with Blender-rendered 3D elements under vector labels. Use when asked to draw, redraw, replicate, revise or design a schematic or concept figure for a paper, talk or proposal, from a reference figure, a written description, or a research note. Options (all optional) - mode, style, route (flat, vector3d, blender), depth (draft, standard, full), review (independent, own), web (on, off)."
---

# Schematic figure (`schematic-studio` v2.0.0)

A **schematic** here is a Nature-style concept or setup figure: flat vector art, sometimes with 3D hero elements, 5-7 pt Arial labels, thin leader lines, one idea per panel. Code draws every mark (`figure/figure.js`, run in headless Chrome). The same source gives a vector PDF with live text, an SVG and a PNG, and the tools can measure it. For a patent drawing sheet, use the `patent-drawing` skill.

What our development benchmark measured: the skill drew the main figure of 28 published papers. A blind judge model rated how much each figure looks published, from 0 to 100. The skill's lead over a plain model appears when the agent must decide what the figure shows. The full skill scored 36.6. Removing the design process (brief, concepts, spec) cost the most, 6.8 points. In single-agent mode (`review=own`), self-critique overrated its own drafts because the agent's context window already held the intended meaning from `docs/brief.md` and `figure/figure.js`. In **Schematic Studio v2.0.0**, we solve this with **multi-agent separation of duties** (`agents/schematic-*.md`), **zero-LLM progressive disclosure** (`tools/query-parts.mjs`), **single-pass render+gate** (`tools/render.mjs --quick --check`), and **Gemini 2D spatial grounding** (`tools/gemini-vision-check.mjs`).

## Options

The user may give any of these. Infer the rest (step 0).

| Option | Values | Default |
|---|---|---|
| mode | design, replicate, describe, revise | from the request: a reference image is replicate, a description with no image is describe, an existing figure with changes is revise, else design |
| style | a style the user names, or a reference figure the user gives | your own choice for the purpose and the field |
| route | flat (2D, illustrated finish), vector3d (library 3D parts, `L.lightScene3`), blender (illustration-mode or photographic render; "photoreal" or "photographic" means the photographic one, step 0) | for a physical object, the route that suits the hero; say why in the Assumptions line (step 0) |
| depth | draft, standard, full (table in step 3) | full (steps 1-11 of `reference/process.md`: two drafts and a choice, critique pass, blind reader test, the gate), also for a one-line request. Standard or draft only when the user names it |
| review | independent, own | `independent` when subagent invocation (`invoke_subagent`) is available: dispatches `schematic-blind-reader` (Step 10) and `schematic-art-director` (Steps 6, 9, 10) as isolated subagents. Falls back to `own` only when subagents cannot be spawned |
| web | on, off | on: search the web freely for anything that helps the figure (other figures, layouts, styles, reference images, background on the subject), in any field. Never look for the figures of the paper you draw for. off: no web access, as in the benchmark |

## 0. Intake (every run)

1. A new design starts from the brief alone: do not copy the look of the project's other figures unless the user asks. In revise mode, or when the user asks to make a set of figures consistent, find the project's existing figures first and inherit their colour key, notation and symbols (step 1 of `reference/process.md`).
2. Infer every option the user did not give, and ask no question. When the route is not set for a figure with a physical object, pick the route that suits the hero. When the user named no style, choose the look yourself for the purpose and the field.
3. **Photographic words.** When the user asks for "photoreal", "photographic", "realistic glass" or a similar look, use the Blender route with the photographic 3D look (the kit style `render`, `reference/process.md` step 3). Write `3d=render` in the Assumptions line. Without such a word, choose as before: an illustration render matches flat panels best.
4. **Assumptions line first.** Your first message to the user states what you picked, before any tool call, file write or drawing work. It is one line with the reason for each choice, for example `Assumptions: mode=design, style=own (clean flat, physics readers), route=blender, 3d=illustration, depth=full, review=independent, web=on, width=183 mm`. Repeat the same line, updated if a choice changed, at the top of the final report (step 11 of `reference/process.md`).

## 1. Plan (every run, most of the effort — `schematic-architect`)

1. **Brief** → `docs/brief.md`: the one sentence a reader must take away, the key ideas (the user's own criteria first, verbatim), what the figure must not imply, its scope, the format and the width.
2. **Structure** → the top of `docs/spec.md`: name the figure's skeleton before any concept. When the content is one principle with several cases, lead with one unifying schematic of the principle. Then give one sub-schematic per case. Each sub-schematic reuses the principle's glyphs and changes only what the case changes. Link them visibly: the same glyph, an inset, a shared colour or an arrow from the principle. Other skeletons are a pipeline, a controlled comparison, a setup with its signal, or a zoom from system to part. Write which one, and why.
3. **Facts** → `docs/facts.md`: before you draw any physical device, write its geometry record. Give the element order along each path, each element's orientation and angle, the beam or flow paths, what sits in front of what, and the source of each item. Mark an item that no source gives as unknown. Ask about it, or keep that part of the drawing vague. Do not draw a device before its record exists.
4. **Progressive-Disclosure Part Discovery (`tools/query-parts.mjs`)**: Never load all `reference/lib-*.md` files (195 KB) at once. Run:
   - `node skills/schematic-figure/foundation/tools/query-parts.mjs --list-domains`
   - `node skills/schematic-figure/foundation/tools/query-parts.mjs --domains <d1,d2> --route <route>`
   - `node skills/schematic-figure/foundation/tools/query-parts.mjs --blender <kit>`
   to retrieve a `< 4 KB` slice of part signatures.
5. **Concepts, spec, and 2D<->3D scene contract**: write two or three concepts (one or two at draft depth), score them as step 2 of `reference/process.md` says, and keep one (two at full depth, for the two drafts). Write the spec card (`templates/spec-card.md`) and the source of every element (step 3), with the `Hero:` line and its route. If using a Blender 3D hero, write `figure/scene-contract.json` (`templates/scene-contract.json`) with the exact placed `fig_width_mm` so Freestyle outlines print at `0.5 pt`.

## 2. Build (`schematic-3d-specialist` & `schematic-drafter`)

Follow steps 3-8 of `reference/process.md`:
1. **3D Hero & Molecular Assets (`schematic-3d-specialist`)**: If `route=blender`, author `figure/render3d.py` with `use_style('illustration', fig_width_mm=<placed_width_mm>)` matching `figure/scene-contract.json` and run `blender -b --factory-startup -P figure/render3d.py`. `scene.py` exports `fig_width_mm` and `style` into `<out_png>.json`, which `check.mjs` verifies against the placed width in `figure.js`.
2. **Parallel Vector Drafting (`schematic-drafter`)**: At `depth=full` in `design` mode, dispatch two `schematic-drafter` subagents in parallel (`figure/figure_a.js` and `figure/figure_b.js`).
3. **Single-Pass Inner Loop (`render.mjs --quick --check`)**: Run `node skills/schematic-figure/foundation/tools/render.mjs --fig <figure_path> --quick --check` to render `<name>.png`, `<name>-thumb.png`, and execute the full DOM + canvas pixel gate (`lib/gate.mjs`) in a single headless Chromium session.

## 3. Check (by depth — `schematic-blind-reader` & `schematic-art-director`)

| Depth | Checks |
|---|---|
| draft | The single-pass gate (`node tools/render.mjs --fig figure/figure.js --quick --check`) with `0 fail`. |
| standard | The gate, then the faithfulness pass of step 9 (every count, polarity, direction, order and connection against `docs/facts.md`), `node tools/gemini-vision-check.mjs --img figure/out/<name>.png`, and a clean-room cold read of the thumbnail and full render by `schematic-blind-reader` (`docs/reader-test.md`). |
| full | Two parallel drafts (`figure_a.js`, `figure_b.js`) adjudicated by `schematic-art-director` (`docs/choice.md`), the deterministic gate (`check.mjs`), Gemini 2D spatial grounding (`gemini-vision-check.mjs`), clean-room blind reader (`schematic-blind-reader` -> `docs/reader-test.md`), and independent art-director critique (`schematic-art-director` -> `docs/critique-independent.md`) enforcing the subtraction-first remediation rule. |

## 4. Deliver

Step 11 of `reference/process.md`: run `node skills/schematic-figure/foundation/tools/check.mjs --fig figure/figure.js --final` and `node skills/schematic-figure/foundation/tools/render.mjs --fig figure/figure.js`, write `docs/caption.md`, and present the report starting with the `Assumptions:` line.

## Modes

| Mode | You get | You deliver |
|---|---|---|
| **design** | a research note, abstract or paper text, and a purpose | a figure *idea* (what to show and how) and the figure |
| **replicate** | a reference figure (image) | your own drawing of the same figure: same content, layout, style, size |
| **describe** | a written description (the reference is sealed from you) | the figure the description specifies |
| **revise** | an existing figure (yours or a previous version) and requested changes | the same figure with exactly those changes |

The rules of each mode (what you may look at, the revise-scope diff) are in `reference/modes.md`. Read the file for your mode before step 1.

## Files

| File | What it holds |
|---|---|
| `reference/process.md` | Steps 1-11 in full, the project layout, and every tool with its options. |
| `reference/modes.md` | The rules of the replicate, describe, design and revise modes. |
| `reference/principles.md` | P1-P31, each with its reason and its exceptions. |
| `reference/style.md` | Formats, sizes, calibrations and the rubric. |
| `reference/lib-api.md`, `reference/lib-<domain>.md` | The drawing library and the domain parts (query via `tools/query-parts.mjs`). |
| `templates/spec-card.md`, `templates/scene-contract.json` | The spec card and 2D<->3D scene calibration contract template. |
| `foundation/` | The engine, the tools (`render.mjs`, `check.mjs`, `query-parts.mjs`, `gemini-vision-check.mjs`), the Blender kits and the demos. |

### `skills/schematic-figure/templates/spec-card.md`
```markdown
# Spec card

**Takeaway (one sentence):**
**Size:** width mm × height mm
**Hero:** <object>, rendered with <kit function>  (or: none, <reason>)

## Panels
| Panel | Job (one line) | Position / share of the figure |
|---|---|---|
| a | | |

## Components
| Panel | Component | Label (exact text) | Look (type, colour role, 2D/3D) | Source: render / draw / compute / fetch / look up (+ why) |
|---|---|---|---|---|

## Relations
| From | To | Kind (flow, feedback, maps to, zoom, …) | Drawn as |
|---|---|---|---|

## Conventions
-

## Negative constraints (must not appear)
-
```

### `skills/schematic-figure/templates/scene-contract.json`
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "2D <-> 3D Scene Calibration Contract between schematic-architect, schematic-3d-specialist, and schematic-drafter",
  "panel": "a",
  "hero": "example_apparatus",
  "kit": "apparatus3d",
  "out_png": "figure/art/hero.png",
  "style": "illustration",
  "fig_width_mm": 60,
  "outline_pt": 0.5,
  "light_deg": [-135.0, 30.0],
  "camera": {
    "projection": "oblique",
    "elev_deg": 25.0,
    "azim_deg": 30.0,
    "ortho_scale": 6.0
  },
  "palette": [
    "#0072B2",
    "#56B4E9",
    "#009E73",
    "#E69F00",
    "#D55E00",
    "#CC79A7"
  ],
  "required_anchors": [
    "input_port",
    "hero_center",
    "output_port"
  ]
}
```

---

## 5. Skill 2: `patent-drawing` (`SKILL.md` + `reference/patent-style.md`)

### `skills/patent-drawing/SKILL.md`
---
name: patent-drawing
description: "Draw a patent drawing sheet (FIG. 1 and others) that can be filed under 37 CFR 1.84, from a patent description and claims plus a one-line description of the view: perspective, exploded, section, block diagram, flowchart or circuit, black line art with reference numerals and lead lines. Use when asked for a patent figure or drawing sheet."
---

# Patent drawing (`schematic-studio` v2.0.0)

This skill uses the drawing engine, tools and library of the `schematic-figure` skill. Find them in the folder `schematic-figure/` beside this one: `foundation/` (engine and tools) and `reference/lib-api.md` ("Patent drawings"). Copy `foundation/` into the project, or run the tools with `--root <project>`, as that skill describes under "Layout" in `reference/process.md`.

## Process

The input is a patent's description and claims, plus a one-line description of the view (the Purpose line, for example "FIG. 1 is a perspective view of the clamp"). The job is FIG. 1 as a drawing sheet that could be filed under 37 CFR 1.84. The style is in `reference/patent-style.md` in this skill. The journal process does not apply. Colour keys, principles P1-P31, the rendered hero, captions, key ideas and the journal reader test serve journal figures, and a patent drawing has none of them. Follow these steps instead.

1. **Read the view.** Draw the view that the Purpose line names: perspective, exploded, elevation, plan, section, block diagram, flowchart or circuit. A drawing in a different kind of view is wrong even when it is clearer.
2. **List the parts & Claim-to-Numeral Bijection** in `docs/spec.md`. Take every element the claims recite and every part the description numbers in this figure, with its numeral. Mark each one as shown or as not visible in this view, with the reason. Show every claimed element the view can show. A claim element that is missing from the drawing is the most serious error a patent drawing can have (37 CFR 1.83(a)).
3. **Numerals (`docs/numerals.md`).** Use the description's own reference numerals for every part you show. Never invent one, and never reuse one for another part. Write `docs/numerals.md` with one line per numeral you use and the part's name from the description, for example `- 12: base plate`. Step numerals of a flowchart are written as the description writes them (`S102` or `102`). Every numeral in `docs/numerals.md` must appear on the sheet, and every numeral on the sheet must appear in `docs/numerals.md` (1:1 bijection). A part shown with no numeral in the description stays unnumbered, and you report it.
4. **Progressive-Disclosure API Check & Draw.** Run `node skills/schematic-figure/foundation/tools/query-parts.mjs --route patent` to inspect the patent drawing part signatures (`figLabel`, `numeral`, `hatchSection`, `surfaceShade`, `pBox`, `flowStep`, `flowLink`, `sectionLine`, `centerLine`, circuit symbols). Set `export const figure = { format: 'patent', sheet: 'letter', name: 'fig1' }` (`sheet: 'a4'` for A4, and `sheetId: '1/1'` for an optional sheet number). Draw into `F.drawing`, whose origin is the top-left of the sight, `F.sight.w` × `F.sight.h` pt:
   - `L.numeral(p, x, y, '12', target, {curve})` for every numeral: a plain number in clear space, with a thin curved lead line that ends on the part. Leads never cross. Use `assembly: true` for an arrow to a whole assembly, and `underline: true` for a numeral that sits on its part's surface.
   - `L.hatchSection` for cut surfaces, `L.surfaceShade` for spaced-line shading of curved surfaces, and dashed lines for hidden edges only where they help.
   - `L.pBox` and `L.flowStep` for block diagrams and flowcharts, `L.flowLink` for their connectors, and the circuit symbols for schematics.
   - 3D parts (`L.obliqueBox`, `L.cylinder3`, `L.prism3`) take `fill: '#fff'`.
   - `L.figLabel(p, x, y, 'FIG. 1')` beside or under the view.
   Legends only where the drawing cannot be read without them, in a few capital words. Fill the sight well enough that the drawing stays clear when reduced to two thirds.
5. **Do not** use colour, grey, gradients, transparency, Blender renders, the illustrated finish, photographs or panel letters. Put no title and no explanatory text on the sheet.
6. **Single-Pass Render + Gate.** Run `node skills/schematic-figure/foundation/tools/render.mjs --fig figure/figure.js --quick --check` (or `node skills/schematic-figure/foundation/tools/check.mjs --fig figure/figure.js`). For a patent sheet it runs `lib/patentgate.mjs` in place of the journal checks:
   - FAIL: a sheet that is not letter or A4; marks outside the sight margins; any colour, grey or translucent paint, gradient, filter or raster image; characters below 0.32 cm; a stroke below 0.3 pt; a missing or malformed "FIG. n" label; numerals in brackets, quotation marks or circles; numerals missing from `docs/numerals.md` (or no such file); lead lines that cross; overlapping text.
   - WARN: numerals without a lead line or underline; characters over line work; legends of more than five words; lowercase letters below 0.32 cm; solid black areas; FIG. labels not larger than the numerals; a drawing that uses under half the sight.
   Optionally run `node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs --img figure/out/fig1.png` and inspect the PNG at full size via `view_file` to verify that every lead ends cleanly on its part, no numeral sits on a line, and hatching is even.
7. **Check against the claims (1:1 Claim-to-Numeral Bijection).** Go through the claims element by element and point to where each one appears on the drawing. Verify that every claimed feature visible in the view has a reference numeral in `docs/numerals.md` and on the sheet, and that each numeral names the exact part the description gives it. Fix the drawing before you report.
8. **Deliver** with `node skills/schematic-figure/foundation/tools/render.mjs --fig figure/figure.js --check`, which writes a vector PDF at sheet size, an SVG and a 600 dpi PNG. Hand over `docs/numerals.md`, and report which claim elements the view shows and which it cannot show.

### `skills/patent-drawing/reference/patent-style.md`
# Patent style

The sheet format and drawing style of a patent drawing. Schematic-figure's own reference files cover journal figures.

## Sheet format

**Patent** (`figure.format = 'patent'`, 37 CFR 1.84). The page is the drawing sheet: US letter 21.6 × 27.9 cm or A4 21.0 × 29.7 cm. Everything drawn stays inside the sight margins (top 2.5, left 2.5, right 1.5, bottom 1.0 cm). Lines are solid black on white, 0.5–1.3 pt and never below 0.3 pt. Numerals and letters are at least 0.32 cm high (14 pt Arial capitals). The gate runs the patent rule set in place of this table, the principles and the calibrations. In replicate mode (`figure.mode = 'replicate'`) the reference's own sizes win.

## Drawing style

The rules of the patent office fix this style (37 CFR 1.84, MPEP 608.02), so every patent drawing looks the same whatever its field. Use it whenever the user asks for a patent figure. Set `format: 'patent'` and the engine's profile and the gate enforce most of what follows.

**What it is for.** A patent drawing shows every feature the claims recite, so an examiner can check each claim element against it. A reader uses the drawing to find each part named in the description by its reference numeral. The drawing does not explain an idea or impress anyone, and it carries no argument. Do not use it for a paper or talk figure. A patent-style panel in a paper reads as a patent reproduction and should be drawn as such ("Field conventions" in schematic-figure's `reference/lib-ind.md`).

**Objects.** Draw black lines on white only (1.84(a), (l)). There is no colour, grey, gradient, transparency, rendering or photograph, because the Office reproduces sheets in black and white and anything tonal turns into noise. Mechanical parts are drawn in a perspective, isometric, elevation or section view with visible edges solid. Hidden edges are dashed only where they help. Cut surfaces in a section are hatched with evenly spaced oblique lines, and adjacent parts are hatched at different angles so that the parts separate (1.84(h)(3)). Shafts, bolts and screws lying in the cutting plane stay unsectioned. Curved surfaces may be shaded with a few thin spaced lines toward the dark side (1.84(m)), and solid black areas are not allowed. Block diagrams are plain rectangles, and flowcharts use rectangles, diamonds and rounded terminals. Circuits use standard symbols.

**Line weights.** Lines are uniform and dense enough to survive copying: about 0.9 pt for outlines, 0.5–0.6 pt for lead lines, hatching and shading, 1.3 pt for cutting-plane lines, and never below 0.3 pt.

**Text.** The sheet carries reference numerals, view labels and very few legends. Numerals are plain Arabic numbers, with no brackets, quotation marks or circles (1.84(p)(1)), and they are at least 0.32 cm high. Each one sits in clear space and joins its part by a thin lead line that touches the part. Lead lines may be straight or curved (curved ones are the convention), they are as short as possible, and they never cross each other (1.84(q)). A numeral naming a whole assembly gets an arrowhead on a free-standing lead (1.84(r)). A numeral that sits on its part's surface is underlined instead. The same part keeps the same numeral in every view, and no numeral names two parts (1.84(p)(4)). Legends appear only where the drawing cannot be understood without them. Keep them to a few words in capitals, such as flowchart steps, block names, YES and NO (1.84(o)). Each view is labelled "FIG. 1", "FIG. 2", ..., larger than the numerals (1.84(u)). An optional sheet number such as "1/3" goes at the top middle of the sight.

**Layout.** Everything stays inside the sight margins (1.84(g)). A view fills its sheet well enough to stay clear when reduced to two thirds (1.84(k)). Several views on one sheet are separated by white space, never by frames, and each has its label close by.

**Moves that make the look.**
1. Every part the description numbers carries its numeral on a curved lead that ends on the part.
2. White faces with black edges, and depth shown only by occlusion and a few shading lines.
3. Hatched cut surfaces with different angles for adjacent parts.
4. A bold "FIG. n" beside or under the view.

**Common failures.** Grey or coloured fills left over from a journal palette, and numerals set too small. Numerals floating without leads, or leads that stop short of the part or cross each other. Explanatory text on the sheet. Numerals invented instead of taken from the description. Drawing the idea instead of the claimed structure, which leaves claim elements that do not appear anywhere.

---

## 6. Empirical Design Principles (`P1–P31`, `reference/principles.md`)

# Design principles for scientific schematics

Merged from four independent readings of 76 published figures. A principle is kept only if at least three figures support it. "Readers" gives how many of the four people found it independently. Groups follow the requested order. Within each group, principles are ranked by how much they matter to a first-time designer. Codes are neutral IDs of published figures in the benchmark set; the images are not distributed with the skill.

---

## Deciding what to show

### 1. Draw what happens to the signal, not only the parts that handle it
- **Statement:** At each stage, put the state of the signal on the beam, wire or waveguide as a small inline glyph (pulse, spectrum, mode profile, speckle, histogram, digit image).
- **Why:** The physics is the transformation, not the parts list. Inline states let the reader simulate the system by eye from input to output, and they show that the hardware is doing the work. A box-and-arrow version of the same system reads as a generic block diagram.
- **When not:** When the subject is an architecture, a control scheme, an algorithm or a taxonomy, the state is trivial or abstract and boxes are right. Leave out a realistic signal that would only be noise. Also leave it out when the quantity is not what the figure is about, because it then becomes decoration.
- **Readers:** 4 of 4.

### 2. Pair the abstraction with its physical realisation, and draw the mapping
- **Statement:** Show the model (matrix, equation, network, cluster state) next to the device that implements it, and make the correspondence explicit by spatial alignment, projection lines, an equals or "equivalent to" arrow, or panels ordered from abstract to concrete.
- **Why:** When the claim is "this device implements that model", neither half can carry it alone. The mapping is the claim. Theory readers and experiment readers each get an anchor on their own side.
- **When not:** Pure setup or inventory figures, and pure concept or taxonomy figures. **Disagreement on how explicit the link must be:** reader 2 wants each physical element aligned directly above or beside its mathematical role. Reader 1 found that one figure works with the abstraction simply floating over the hardware, with no connecting lines at all. Alignment is the safer default. Proximity plus a shared layout can be enough when the correspondence is one-to-one and obvious.
- **Readers:** 4 of 4.

### 3. Make every comparison a controlled experiment
- **Statement:** Draw the cases being compared on one template (same viewpoint, scale, styling and layout) so that only the variable of interest changes. Use a matched pair for two cases and small multiples for three or more. Show the abstract template once, then reuse it for each instance.
- **Why:** With everything else held fixed, the eye diffs the images automatically and the one difference becomes the message. The reader learns the template once and then pays almost nothing for each further panel.
- **When not:** Catalogue figures, where no comparison is intended. A single causal pipeline, where forcing a grid breaks the flow. Systems that differ in kind: one template forced onto all of them hides the differences that matter. If two things must change at once, narrate the change with a labelled arrow (one figure does this and still works).
- **Readers:** 4 of 4.

### 4. Decide whether the figure explains or impresses
- **Statement:** Choose explicitly between an explanatory figure and a teaser or cover-style image, and apply the rest of this guide fully only to the first.
- **Why:** Clarity and impact are separate goals. A literal all-3D render of every component, or a black-background product shot with two words, conveys scale and effort but explains nothing. A concept render with no data works as a hook but says nothing about performance. None of these is a failure if the choice was deliberate, and each is if it was not.
- **When not:** A paper's main explanatory figure (usually Fig. 1) should be explanatory. Adding impact is fine only when it does not cost traceability.
- **Readers:** 3 of 4.

### 5. Anchor the drawing with real evidence, framed as a different register
- **Statement:** For a device or apparatus figure, place at least one real image or measurement (a micrograph with a scale bar, a device photo, a camera frame, a measured spectrum) beside the idealised drawing, visibly framed as a photo or data.
- **Why:** A photo proves that the thing exists and gives its true scale. A schematic explains how it works but could be imaginary. The two registers together give credibility and clarity. The framing keeps the reader from mistaking one for the other.
- **When not:** Concept figures, reviews and theory papers. **Disagreement:** reader 1 treats a real anchor as expected in device figures. Reader 4 says use it sparingly, because a figure with five registers and no shared palette reads as a collage. Reader 3 says put photo and schematic side by side rather than blend them, yet reader 1 found that drawing schematic arrows directly onto real data works well. Mixing is fine when the drawing on the data is minimal and uses the figure's own colour key.
- **Readers:** 4 of 4.

### 6. Run one concrete example input through a computing pipeline
- **Statement:** When the figure is about a computation or sensing task, pick one specific input (a digit, a road sign, an object) and show it entering the pipeline and coming out as the answer, with the answer highlighted.
- **Why:** A concrete object makes "encoding" and "classification" tangible and gives the eye one thing to follow from start to finish.
- **When not:** Taxonomies, frameworks and device physics, where the subject is the method space rather than a task.
- **Readers:** 2 of 4.

### 7. Explain an unfamiliar device through a familiar analogue drawn in the same grammar
- **Statement:** If there is a textbook analogue that is structurally correct, draw it in a parallel layout next to the new device.
- **Why:** The analogy transfers the reader's existing intuition. Drawing the two in parallel lets the reader check the correspondence element by element instead of taking it on trust.
- **When not:** When the analogy is loose. A parallel drawing then implies an equivalence that is false.
- **Readers:** 1 of 4 (five figures). Kept, but it has not been independently confirmed.

---

## Composition and reading order

### 8. Make the reading direction follow causality, and make a physical axis literal
- **Statement:** Run the main axis in one direction, usually left to right for propagation or time and top to bottom for steps. Where the direction is a physical coordinate (time, distance, frequency), draw it as an axis, so that position in the drawing is data.
- **Why:** When reading order and causal order coincide, the reader never has to search for the next element. A literal axis lets the reader read order and duration directly, and it removes doubt about whether the layout is spatial or temporal.
- **When not:** An optical-table drawing whose geometric fidelity is part of the message. A physics that is bidirectional, where a deliberate reversal can carry meaning: one figure runs the backward pass right to left so that it reads as the adjoint. Taxonomies, which have no natural axis.
- **Readers:** 4 of 4.

### 9. Link every inset to its exact source with a zoom wedge or dashed box
- **Statement:** Connect a magnified or re-represented detail to the region it comes from with converging dashed lines, a translucent wedge or a matching dashed box, never by proximity alone.
- **Why:** Converging lines are a learned magnification cue. They keep the reader oriented and say "same object, larger scale". They also allow an honest change of scale, representation (render to plot) or dimension within one figure.
- **When not:** Panels that are peers rather than parent and child. An inset that shows a different kind of object, such as a setup photo, where a panel letter is enough. Single-scale figures. Thin grey leader lines that cross a plot are worse than no link.
- **Readers:** 4 of 4.

### 10. Group by function with a common region named for its role
- **Statement:** Once a diagram has more than about eight parts or mixes domains, enclose each functional subsystem in one region (a soft tinted or light-grey rounded background, or a dashed box) and name it for its purpose, not its parts.
- **Why:** Common-region grouping turns dozens of components into three or four chunks the reader can hold in working memory, and the name states the purpose.
- **When not:** A scene with one subsystem, or a sparse figure where white space already groups. Wiring that crosses region borders destroys the grouping, and so do nested saturated regions. **Disagreement on style:** reader 1 accepts dashed boxes. Reader 2 prefers tints, because boxes add lines that compete with beam paths. Reader 3 prefers neutral grey so that the coloured content stays in the foreground. Reader 2 also keys tints to regimes and reuses them across panels. Rule of thumb: use grey when the region only groups, and a low-saturation tint when the region is a recurring regime. Tints fail in greyscale print.
- **Readers:** 3 of 4.

### 11. Draw feedback as one loop visually distinct from the forward path; number steps only for a real sequence
- **Statement:** Close a feedback or control path with a single curved return arrow in its own weight or colour. Add numbered markers when the layout alone leaves the order ambiguous (two phases, a loop).
- **Why:** A drawn loop reads as iteration at a glance. Distinct styling keeps it from tangling the forward chain. Numbers make the order explicit where geometry cannot.
- **When not:** A static architecture with no sequence. Numbering parallel elements is enumeration, and it adds clutter. **Disagreement on styling:** figures differ between a subdued return (dotted, grey) and a prominent one (a thick red training bus over the top). Subdue it when feedback is housekeeping, and make it prominent when feedback is the claim.
- **Readers:** 3 of 4.

### 12. Give the figure an entry point: one airy hero panel, one idea per panel, denser supporting panels
- **Statement:** Let the key panel have white space around a single qualitative idea, and let supporting panels be denser. Get density from structure, not from filling every region.
- **Why:** White space around the key panel signals importance and tells the eye where to start. Uniformly dense figures read as a parts inventory, and small text at journal size becomes illegible.
- **When not:** Engineering reference and methods figures, where completeness beats first impression, provided grouping and a clear main path keep them navigable. Too sparse also fails: one figure has four unlabelled speckle images whose meaning needs the caption. **Disagreement:** reader 1 found that several strong figures have poor balance or large empty areas, and concluded that balance matters less than colour logic and flow. Treat white space as serving the entry point, not as a quota.
- **Readers:** 3 of 4 (2 in favour; reader 1 qualifies it).

### 13. Label a grid of cases by its dimensions
- **Statement:** When the cases vary along named attributes, give the grid row and column headers or global axis arrows, not only per-panel titles.
- **Why:** The layout itself becomes a classification. The reader knows where a case sits before reading it, and missing combinations show up as gaps.
- **When not:** An unstructured list, where imposed axes invent a structure that is not there.
- **Readers:** 3 of 4.

### 14. Show repetition with a few instances and an ellipsis or fade
- **Statement:** Draw two or three representative copies, then dots or a graded fade, instead of the full literal count or an abrupt cut.
- **Why:** This states "N of these" at a glance and leaves room for detail on the copies that are drawn. Drawing all N buries the structure.
- **When not:** When the count or the layout is itself the result and still readable: 8 modes, or a 127-qubit topology that is the point. One figure draws 50 squeezers and 144 detectors, and the result cannot be read.
- **Readers:** 3 of 4.

---

## Colour and light

### 15. One colour per entity or role, carried through every panel and into the text
- **Statement:** Assign each physical entity or functional role one hue and keep it unchanged in every panel: the drawing, the curves, the background tints, the labels and the symbols in equations.
- **Why:** Colour becomes a variable rather than decoration. The eye links panels by colour before it reads a word, so input, mechanism and readout read as one story. Colouring the words and symbols ties the prose to the drawing and lets labels double as a legend.
- **When not:** When every entity appears once, there is nothing to link, and monochrome is fine. When colour must encode a many-valued physical variable (wavelength channels, kernel index), use shape or position for the roles. The rule breaks down past about five roles, and when the hues cannot be told apart by colour-blind readers or in greyscale. A generic colour with no identity is worse than none.
- **Readers:** 4 of 4.

### 16. Spend saturation on the protagonist; keep context grey
- **Statement:** Draw hardware and context in neutral greys. Give the single strongest hue to the thing the paper is about (usually the light, the signal, the new regime or the answer).
- **Why:** Salience is relative. A lone saturated hue in a desaturated scene captures attention at once and sets the reading order, and grey reads as "background, not the point".
- **When not:** When colour encodes a many-valued variable. When a whole distribution is the result, so no single mark should win (confusion matrices). This principle and principle 15 pull against each other. When several roles need hues, keep them medium in saturation and reserve the strongest one for the protagonist. Rainbow textures that carry no role compete with the content.
- **Readers:** 3 of 4.

### 17. Use light and visual variables semantically
- **Statement:** Map physical quantities onto visual variables the reader already reads: glow or translucency for fields, intensity and probability; solid matte for matter; a gradient for gain or loss; a blur or continuous band for continuous quantities against crisp blocks for discrete ones.
- **Why:** The reader perceives the physics before reading any label. A glow says "emitted, diffuse, not material", which separates field from structure with no text.
- **When not:** When nothing in the figure is a field or a distribution. When the quantity is not the point, the encoding becomes noise. Flat opaque beams remain readable in a setup inventory but lose the field-versus-hardware distinction.
- **Readers:** 3 of 4.

---

## Text and labels

### 18. Label directly, in plain words, beside the object; use a legend only for glyphs that repeat
- **Statement:** Put a short label next to each object or curve (colour-matched to it where the figure has a colour key), and keep a small legend at the panel foot only for glyphs or line types that repeat many times or mix domains.
- **Why:** A direct label saves the eye a round trip to a key and binds the name to the mark. A legend earns its place only when one glyph appears too often to label each copy, or when arrow types by domain (optical, electronic) have to be decoded throughout.
- **When not:** Dense repeated arrays (for example 64 repeats), more than about five crossing series, or mixed signal types (one figure would have needed one to separate its two red lines). Dense engineering figures sometimes use numbered circles that map to the caption. This trades immediacy for completeness.
- **Readers:** 4 of 4.

### 19. Put the governing relation where it acts, in the drawing's own symbols
- **Statement:** Write the one or two key relations (a coupling on its bond, an update rule above its block, a comb formula on the comb) at the element they describe, with their symbols coloured to match.
- **Why:** The equation becomes a label for a visible feature rather than a separate text block. The reader learns the mapping from symbol to mechanism, and an expert can check the model at a glance.
- **When not:** Overview, teaser and roadmap figures, and broad-audience figures. Derivations belong in the text. An equation inside a box that illustrates nothing is wasted. Do not let it crowd the hero object.
- **Readers:** 4 of 4.

### 20. Keep text legible at print size and off foreshortened surfaces
- **Statement:** Set labels flat, horizontal and at a legible size, and do not put text on tilted 3D surfaces or in rotated tiny type inside small boxes.
- **Why:** Perspective shrinks and skews text, and journal reduction makes small labels unreadable. Readers parse figures by layout first, so illegible text fails silently.
- **When not:** When a label must sit on a surface to identify it and there is no room outside, keep it short and accept the cost knowingly.
- **Readers:** 4 of 4 (all as counter-examples).

### 21. Let type weight carry hierarchy in multi-level content
- **Statement:** Set category titles bold (optionally on a shaded field) and leaf items plain, so the tree reads before the words do.
- **Why:** A contrast in weight and background is pre-attentive, so the structure is parsed before the text is read.
- **When not:** Single-level content.
- **Readers:** 1 of 4 (three figures). A weak inclusion.

---

## Data-like and computed elements

### 22. Put the baseline on the same axes as any claimed advantage
- **Statement:** In a data-like panel that makes a performance claim, draw the null or reference case (chance level, conventional method, digital baseline, physical limit) on the same axes, and mark the margin.
- **Why:** A number means little without its comparator. A visible gap cannot be overstated from a lone curve.
- **When not:** Purely conceptual sketches with no numbers.
- **Readers:** 2 of 4. For example, one figure reports 93% with no chance level shown.

### 23. Make illustrative data physically right, and no more precise than it is
- **Statement:** A stylised plot, heatmap or data texture needs the correct axes, shape and structure (envelopes, ordering, symmetry). It must not look quantitative when it encodes a judgement.
- **Why:** Readers read data-like marks as data. Right shape makes a sketch credible and teaches something, for example overlaid translucent runs that show trial-to-trial spread as visual thickness. Wrong or random structure is noticed at once. Pip bars on a taxonomy turn a subjective judgement into apparent measurement.
- **When not:** A purely textural cue that no one will read quantitatively, such as bit strings on a bus meaning "data moving", can stay schematic.
- **Readers:** 3 of 4.

### 24. Share the axis when structure and quantity vary along the same coordinate
- **Statement:** Align the device drawing with the plot along the shared coordinate (position, frequency, time) so that features line up vertically.
- **Why:** Cause and effect become one vertical glance: the defect and the curve reversal sit at the same x.
- **When not:** When the device is drawn in perspective, the alignment is fake. Use a flat view instead (a flat panel beside perspective ones reads better for this reason).
- **Readers:** 2 of 4.

---

## 3D and depth

### 25. Reserve 3D for the hero object whose geometry matters; keep logic, maths and data flat
- **Statement:** Render in 3D only the object whose spatial form is the point (a chip, a waveguide, a fibre, vacuum optics, an energy landscape), and draw everything around it flat.
- **Why:** Shading and perspective convey geometry and materiality quickly, and kept scarce they mark the hero as real hardware. But 3D foreshortens text, distorts quantities and hides things behind other things. When everything is 3D, nothing stands out and no path can be traced.
- **When not:** When the spatial arrangement is itself the claim, or the data really is 3D (a feature cube, pulse isosurfaces). Pure logic, circuits and algorithms should almost never be 3D. **Disagreement at the margin:** reader 1 found that a perspective circuit ribbon costs little legibility and ties time to space. Reader 3 found that stacked 3D layers and tilted chips add clutter or nothing. The test is whether the depth encodes something.
- **Readers:** 4 of 4.

### 26. Pair a 3D view with a flat panel that carries the physics and the numbers
- **Statement:** Put the quantitative or mechanistic content (mode ladder, profiles, plots, labels) in a flat companion panel or side column that shares the 3D view's orientation and axes.
- **Why:** The render gives intuition and geometry, and the flat view gives readable, exact content. Shared orientation lets the reader transfer between them without re-orienting.
- **When not:** A one-panel teaser, and purely abstract content.
- **Readers:** 3 of 4.

---

## Consistency

### 27. One visual vocabulary across every register in the figure
- **Statement:** Draw the same object the same way everywhere, in one projection per panel, and carry one palette and one line and glyph language across renders, schematics and plots.
- **Why:** When the registers share a colour logic and a style, the strongest multi-panel figures read as one argument. When they do not, the figure reads as a collage, and the reader cannot see what variants have in common.
- **When not:** A real photo or measurement deliberately kept in its own register (principle 5). Even then, the arrows and labels drawn over it use the figure's key.
- **Readers:** 4 of 4.

---

## From our figure-communication benchmark

These principles come from a test run on 28 papers published after the model's training cutoff. The skill designed a figure for each paper from a brief with no figure in it. Blinded judges then rated the figures. Evidence is the judges' reasons and the confirmed errors on the skill's own figures, not a reading of published figures, so "Readers" is replaced by counts out of 28.

### 28. Draw this paper's instance, not the textbook one
- **Statement:** Every count, polarity, direction, order and "shared vs individual" choice in the drawing matches the paper: the number of qubits in the patch, which edge charges which way, one global beam or one per ion, the order of elements in a construct, which zones show the effect.
- **Why:** Most confirmed errors were a generic version of the system drawn where the paper's differs (a 39-qubit patch for the paper's 37, per-ion beams for a global one, a cassette in the wrong order, a sequential pipeline drawn as parallel). The same genericness is what makes a figure read as generated.
- **When not:** A concept or teaser panel whose point is the general idea; then keep the counts vague (an ellipsis, "N") rather than a wrong specific number.
- **Evidence:** 12 confirmed errors on 28 skill figures, most of this kind.

### 29. Plot only numbers you have
- **Statement:** A curve, bar or map drawn as data uses values from the paper (or computed from its stated model and parameters). Without them, show the relation qualitatively (an arrow, a trend glyph, "increases") or leave it out.
- **Why:** Readers take plotted shapes as results. An idealized curve with invented values (a flat line that turns up exactly at a round number, a sparse bar chart without axes) is a claim the paper did not make, and judges single it out as the mark of a mock-up.
- **When not:** A textbook functional form that is the point of the panel (a Lorentzian line, a double well), drawn as such and called illustrative in the caption.
- **Evidence:** judges named idealized or toy curves in 8 of 28.

### 30. Give the hero the craft; draw each object as its field draws it
- **Statement:** The hero element gets real illustration (shading, depth, a Blender render where depth carries meaning, a library part with its geometry), and each object follows its field's convention: skeletal formulas from RDKit (tools/molecule.py), not hand-drawn rings; standard circuit, optics and biology glyphs from the domain libraries. Vary the drawing with the object instead of repeating one flat primitive.
- **Why:** The most common reason a judge gave for "not published" was a figure built from identical flat primitives and generic icons (identical ball-chains for different molecules, one blob for every cell). Published Fig. 1s spend their effort on the hero and respect domain conventions a specialist checks at once.
- **When not:** A deliberately abstract figure (a taxonomy, an algorithm, a flow of steps) where boxes are the right register (principle 1).
- **Evidence:** 20 of 28 judge reasons; "non-ChemDraw structures" and "crude cartoon" named separately.

### 31. Headings are noun phrases; every annotation touches what it names
- **Statement:** Panel headings name the content ("Device stack", "Readout chain"), not a sentence or a question. Each label sits on or next to its object, or has a leader line to it; nothing floats, overlaps a plot line or runs off the panel.
- **Why:** Sentence and question headings ("Can it last?") read as a slide deck, not a journal figure. Floating and colliding annotations are the next most common tell after flat primitives, and a label whose object is ambiguous costs the reader more than no label.
- **When not:** A teaser or cover-style panel whose heading is the claim.
- **Evidence:** sentence-style headings in 5 of 28, loose or colliding annotations in 8 of 28.

Measured and not adopted: "too much empty space" (named in about 12 of 28 reasons). The skill figures' empty area matches the published ones (median share of empty 6 mm cells 0.38 for both; the no-skill figures 0.19), so the complaint is a consequence of the other tells, not a cause, and a whitespace target would push toward crowding.

---

### Dropped (single figure or single field)
Spell-check of rotated labels (a typo in one figure). Humour in labels. Brackets for layered stacks (reader 4, a device-stack convention). Panel-letter style (it varies, with no evidence of an effect). Cross-paper house style (one group's figures). Mechanical metaphors such as marbles in a landscape.

---

## 7. Journal, Slide & Poster Style Calibrations (`reference/style.md`)

# Style (v4)

Three kinds of guidance live here, and they are not the same kind of thing:
1. **Format requirements**: the rules of the venue (journal, slide, poster). Not findings; follow them because the venue says so.
2. **Principles**: why good schematics work, distilled from 76 published figures by four independent readers. They are in `principles.md` (P1–P31), each with its reason, when not to apply it, and example figures. Read it before step 2. A principle is a reason to act, not a rule to satisfy: when its "when not" applies, do the other thing and say why.
3. **Calibrations**: numbers measured on a handful of figures. Use them as smell tests that prompt a second look, never as targets.

## 1. Format requirements

| | Journal (Nature) | Slide (16:9) | Poster |
|---|---|---|---|
| Size | width 89 / 120 / 136 / 183 mm, height ≤ 247 mm | 338.7 × 190.5 mm | as the venue states (A0 841 × 1189 mm) |
| Text | Arial 5–7 pt, panel letters 8 pt bold lowercase (journal house style; other venues differ) | titles 28–32 pt, labels 16–22 pt, nothing under 14 pt | titles 60–90 pt, labels 24–36 pt, nothing under 20 pt |
| Lines | 0.25–1 pt | 1–3 pt | 2–5 pt |
| Raster | ≥ 300 ppi at placed size | ≥ 150 ppi | ≥ 150 ppi |

Set `figure.format = 'journal' | 'slide' | 'poster'`; the gate checks the matching column.

## 2. Principles

Read `principles.md` (P1–P31). It gives each principle with its reason and its exceptions.

## 3. Calibrations (smell tests)

- **Text density.** Five published schematics, replicated label for label: 25–55 words, 0.20–0.45 words per cm². Four first designs from research notes: 0.9–1.3; the human noticed the excess text first. If you are well above ~0.3 words per cm², check whether caption material is on the figure. Engineering reference panels may be denser, and a figure with no text at all is not the goal.
- **Journal text size.** One replicated Nature figure (PNN Fig. 1) measured about 9 pt labels at 183 mm, above the 5–7 pt guide: legibility at print size is the rule; the range is house style.

## 4. Rubric (critic pass; score 1–5 each)
1. **Reads at final size**: text legible at 100%; the thumbnail shows the structure and the entry point.
2. **Takeaway**: the brief's sentence is readable from the hero panel plus its comparison.
3. **Faithful**: every spec component, relation and label present; nothing unsourced; consistent with the project's existing figures.
4. **Correct**: physics and conventions right (paths, arrow directions, units, which side is input); data-like marks carry the right structure (P23).
5. **Links**: cross-panel links present and consistent (colour key, zooms, shared axes, mappings).
6. **Economy**: nothing on the figure that belongs in the caption.
7. **Craft**: alignment, spacing, consistent weights and colours, clean joins, no accidental overlaps.

Replicate mode adds a local-difference hunt (silhouette, arrangement, colour, light; see SKILL.md step 9).

---

## 8. Modes (`design`, `replicate`, `describe`, `revise`, `reference/modes.md`)

# Modes in detail

SKILL.md lists the modes and when each applies.

**Revise mode.** Change exactly what was asked and preserve everything else: layout, drawing, parts and styling the user did not mention stay as they are. A request to change a colour or replace one panel is not a request to redesign. If a requested change seems to need a wider one, make the requested change, then describe the wider one in your report instead of doing it. Before editing, copy the current sources to `figure/_versions/<n>/` so any version can be restored. Also copy the current render to `docs/revise/before.png`, and write down which regions the request covers (fractions of the figure). After the change, run `node tools/revdiff.mjs --before docs/revise/before.png --after figure/out/<name>.png --allow "x,y,w,h;..." --out docs/revise/diff.png`. Every red pixel outside the allowed regions is a change nobody asked for: undo it, or keep it only if the requested change forced it and say so in the report. A change of the figure's shape (height or aspect) is reported first, because it moves everything. For a figure-wide request (one colour everywhere), make that change first, render, copy that render to `before.png`, then make the rest and diff against it.

In **replicate** mode, set `figure.mode = 'replicate'` and match the reference's own text sizes, line weights and colours (the gate then reports house-cap departures as info). You may look at the reference as often as you like, and zoom into it or stack it with your render with `tools/view.mjs`. You must not embed, crop, trace or vectorise its pixels: no reading pixel values, no image-to-vector tools, no coordinate arrays of more than 40 numbers copied from measurements. You measure by eye and by ruler on the image (proportions and positions in % of the panel), then draw.
In **describe** mode, do not search for the original paper's figures. The description is the specification; where it is silent, you design.
In **design** mode, do not look up the paper's published figures. What goes in the figure is your decision (step 2).

---

## 9. Full 11-Step Process Runbook (`reference/process.md`)

# The full process

Steps 1-11 in full, the project layout and the tools. SKILL.md sets which steps each depth runs.

## Layout

Copy `foundation/` to the project folder: `engine/` (do not edit), `tools/`, `blender/`, `demo/`. Create:
```
figure/figure.js       your figure (plus figure/parts.js for parts the library lacks; figure/render3d.py for Blender art)
figure/data/           computed or fetched data the figure draws (JSON), with the script that made it
figure/art/            Blender renders + anchor JSON (generated)
figure/out/            renders, check.json, onscreen-text.txt (generated)
docs/brief.md          mode, purpose, audience, size, what the figure must make obvious
docs/spec.md           the spec card (templates/spec-card.md): components, relations, labels, conventions
docs/facts.md          every label and number with its source (for design/describe: the note or description)
docs/refs/             reference images you looked up for real objects (step 4)
docs/library-gaps.md   parts you had to draw yourself
docs/caption.md        the figure caption: a title sentence that states the takeaway, then the figure's key ideas in plain words (most important first), then one or two sentences per panel; numbers, parameters, qualifications and explanation live here, not on the figure
docs/reader-test.md    the blind reader test (step 10)
docs/self-critique.md  your own critic pass (step 8)
docs/critique-independent.md   written by an independent reviewer, if one runs: never delete or overwrite it
```
Tools (Node ≥ 22, no npm install; any Chromium browser: Chrome, Edge or Chromium is found at its standard location or on PATH, or set `CHROME` to its executable):
- `node tools/render.mjs --fig figure/figure.js --quick` → `figure/out/<name>.png` (300 dpi) + `<name>-thumb.png` (360 px).
- `node tools/render.mjs --fig figure/figure.js [--crop "x,y,w,h;..."]` → 600 dpi PNG, vector PDF, SVG, 900 dpi crops (mm).
- `node tools/check.mjs --fig figure/figure.js [--final]` → the gate.
- `--transparent` on `render.mjs`: leaves the page background out of the PNG (alpha), the thumb, the PDF and the SVG. Use it for a schematic that sits over or beside a plot. Without it the page is opaque white.
- `--root <dir>` on `render.mjs`, `check.mjs` and `revdiff.mjs`: the figure, its imports, `docs/` and `data/` live in `<dir>`, and the foundation stays where it is. Use it so a project needs no copy of the foundation. For `revdiff.mjs` the `--before`, `--after` and `--out` images must lie inside `<dir>`. `view.mjs` needs no `--root`: it reads its images from any path.
- `node tools/view.mjs --img reference.png [--img2 figure/out/<name>.png] --crop "x,y,w,h" --out docs/zoom/<name>.png` → zoomed view of a region (fractions 0–1), or the same region of two images stacked for comparison. Display only.
- `node tools/revdiff.mjs --before docs/revise/before.png --after figure/out/<name>.png --allow "x,y,w,h;..." --out docs/revise/diff.png` → revise-mode scope check: the percentage of pixels changed outside the regions the request covers, the worst regions, and a diff image (red = changed outside, blue = changed inside, green boxes = allowed).
- `python tools/molecule.py "<SMILES>" figure/art/name.svg [--highlight 3,4,5]` → a skeletal formula drawn by RDKit (valid chemistry, house style, no background); place it with `await L.svgFile(...)`. Never hand-draw a molecule that has a SMILES: bond angles and ring geometry are checked by every chemist who looks. Needs `rdkit`.
- `python tools/svg2pptx.py deck.pptx figure/out/slide1.svg figure/out/slide1.png [...]` → a 16:9 PowerPoint deck of full-bleed vector slides (PowerPoint 365 keeps SVG as vector; right-click > Convert to Shape makes it editable), PNG fallback included. Needs `python-pptx` (and `lxml`). For slides, deliver the PPTX with the PDFs. A figure that is not 16:9 is fitted inside the slide and never stretched.
- `python tools/svg2pptx.py --native deck.pptx figure/out/slide1.svg figure/out/slide1.png` (or `export.py ... --formats pptx-native`) → the same slide made of real text boxes, shapes and groups, so any app can edit the labels and recolour the shapes. It drops clip paths and glow filters, and prints a count of each dropped part. Use it when the user wants an editable PowerPoint.
- `python tools/export.py figure/out/<name> [--formats tif,eps,pptx]` → after `render.mjs`, a TIFF (LZW, the PNG's dpi), an EPS from the PDF (needs `pdftops` or Ghostscript) and a one-slide PPTX, each opened again to check it. Use it when a journal or the user asks for TIFF, EPS or PowerPoint. A missing tool is reported and skipped.
- `node tools/compare.mjs --ref reference.png --img figure/out/<name>.png --grid 3x2 --out docs/compare` → the reference and your render, whole and region by region side by side at the same scale, plus colour saturation, luminance and ink coverage per region (a starred row means saturation differs by more than 0.10). Coarse cells miss small regions: zoom into those with `view.mjs`.
- Python (only for fetching data or computing curves): use the project's own environment if it has one, else any Python 3 with numpy (plus pillow and requests for images and downloads). Check what is installed before writing a script; do not install packages into a shared environment without asking.
- On Windows under Git Bash, `/tmp/...` arguments are rewritten: keep every path inside the project, or prefix `MSYS_NO_PATHCONV=1`.
- Blender (4.x or 5.x) renders the hero object: `blender -b --factory-startup -P figure/render3d.py` (10–60 s on a CPU, faster on a GPU). The kit uses a GPU when Blender finds one (OptiX, CUDA, Metal, HIP or oneAPI) and the CPU otherwise. It prints the device it used. `SCHEMATIC_3D_DEVICE=cpu`, `gpu` or `auto` (default) forces the choice. The first GPU render of a new kind of scene can take a few minutes while the driver builds its kernels. Wait for it. If `blender` is not on PATH, look in the standard install location (Windows: `C:/Program Files/Blender Foundation/Blender <version>/blender.exe`; macOS: `/Applications/Blender.app/Contents/MacOS/Blender`). Kits, each with a demo in `demo/render3d_*.py` and a function list in its docstring: `blender/scene.py` (photonics: chip, fibre, lens, beam; `camera_oblique` for a level beam axis with vertical verticals, trade-off in its docstring), `blender/bio3d.py` (cells with cutaways, tissue slabs, organoids, bacteria, vesicles, viruses, membrane patches, DNA, proteins, tubes, dishes, well plates, pipette tips), `blender/device3d.py` (layer stacks, crystal and 2D lattices, 3D molecules from SMILES, particle beds, electrode interfaces, pouch, coin and cylindrical cells, gated devices, nanowires, membranes), `blender/apparatus3d.py` (glassware, electrochemical cells, vacuum chambers, dilution refrigerators, ion traps, optical breadboards and mounts, lasers, cameras, coils, pumps and flow cells; terrain blocks with strata and faults, landscapes, oceans, globes, atmosphere sections, trees and forests, crops, cities, wind turbines, solar arrays). 3D molecules use RDKit when some Python has it (set `MOL3D_PYTHON` to that interpreter), else a built-in embedder. Without Blender, draw the element in 2D with the illustrated finish.
Read `reference/lib-api.md` before writing code (and the domain page it points to, `reference/lib-<domain>.md`, for biology, chemistry, computer science, quantum computing or process engineering: its "Field conventions" section lists what a reader in that field checks first), `reference/style.md` before choosing sizes or colours, and `reference/principles.md` (P1–P31, each with its reason and exceptions) before step 2. Principles are reasons, not rules: when a principle's "when not" applies, do the other thing and say why. `demo/figure.js` and `demo/figure3d.js` are worked examples.

## Process

### 1. Brief → `docs/brief.md`
In revise mode, or when the user asks to make a set of figures consistent, first find the project's existing figures (published papers, submitted abstracts, earlier talks and posters) and inherit their colour key, notation, symbols and plot conventions. A new design starts from the brief alone. If the project records claim limits (a claim ledger, a scope note), every statement and number must stay inside them.
Then: mode, format (`figure.format`: journal, slide or poster, `reference/style.md` §1), where the figure goes (single column 89 mm, 1.5 column 120/136 mm, double 183 mm), the reader, **the one sentence a reader must take away**, **the key ideas** (3–6 statements the figure must convey; a user's own criteria come first and are kept verbatim; list separately the claims the figure must not imply), the figure's scope (what this figure is for and what later figures or the caption carry instead), and **the style**: a style the user named or a reference image the user gave. If the user gave none, choose the look that suits the purpose and the field, and say why; the style is a choice to report, like the concept. For replicate: measure the reference's aspect ratio and pick the width it was published at.

### 2. Spec card → `docs/spec.md` (from `templates/spec-card.md`)
- **Panels**, each with its job in one line.
- **Components** per panel: every object, its label, and how it should look (by type, not by picture).
- **Relations**: every arrow or beam path, with its direction and meaning (flow, feedback, maps to, zoom).
- **Conventions**: beam colour matches wavelength role, the same object is drawn the same way everywhere, time runs left→right, etc.
- **Negative constraints**: what must not appear.
In **design** mode, first write **two or three different figure concepts** (a panel list and a 3-line sketch description each), score each on "does the takeaway read in 5 seconds", "is it true to the physics in the note", "does it draw the signal's state, not only the parts (P1)", "does it show the mapping between abstraction and realisation (P2) or a controlled comparison (P3) if the claim needs one", and "does it explain or impress, and is that the right choice here (P4)"; then keep the best one, or the best two at full depth (step 6 drafts both). The concept is most of the work; budget passes here.

### 3. Decide where each element comes from
Every component in the spec card gets a **Source**, chosen by you, with a reason:
- **draw**: vector art. Name the library part in the Source (`L.cylinder3`, `D.microtubule`, ...): search `reference/lib-api.md` and the domain page for the object's kind before drawing it yourself, since a part carries geometry and conventions you would otherwise have to get right by hand (projection, occlusion order, stroke floor). Draw in `figure/parts.js` only when no part fits, build it on the library's primitives (a projector, `cylinder3`, `beamPath`) rather than raw paths, and say in `docs/library-gaps.md` why the existing part did not fit.
- **compute**: made by code from the physics or maths: a waveform, a simulated field or mode profile, a spectrum, a histogram, a network's weights. Compute it (Python in the project's own environment, or JS in the figure) and draw the result.
- **fetch**: real data or a real sample: a dataset example (an MNIST digit: download the dataset with Python, e.g. from OpenML or torchvision, pick a sample, save it as `figure/data/<name>.json`, draw it with `L.pixelImage`), a public-domain image, the lab's own data. Record the source in `docs/facts.md`. In replicate mode, fetching the same public sample the reference shows is allowed; reading the reference's pixels is not.
- **look up, then draw**: instruments, devices, organisms, logos and marks (step 4).
- **render**: a hero object in Blender from the kits above, placed with `L.image` and labelled in vector through its anchors. Use it when the story has a physical object (a cell, tissue, device, material, instrument, landscape) and a render shows it better than a drawing. Published Fig. 1s often carry an illustrated hero, and a figure built only from flat code-drawn primitives was the main reason blind judges named ours as generated. Write the choice in `docs/spec.md` as `Hero: <object>, rendered with <kit function>`, or `Hero: none, <reason>`. Choose the look for each figure. When the user asks for "photoreal", "photographic", "realistic glass" or a similar look, use the photographic look (style `render`, no `use_style('illustration')`) and write `3d=render` in the Assumptions line. **Illustration mode** (`use_style('illustration', fig_width_mm=<width the PNG is placed at>)` before the kit's setup, `reference/lib-api.md` "3D in illustration mode") gives outlines and banded shading that match the flat parts. **Photographic** gives real materials, light and depth. Blind judges read a photographic render beside flat panels as a pasted-in second style, so keep the figure consistent: render its other objects the same way, or make the render the panel's whole scene. A render earns its place as the panel's main object at a size where its detail reads.
**The hero's drawing route is a choice you report before you draw.** There are three routes: flat drawing with the illustrated finish, the skill's own vector 3D (library parts, `L.lightScene3` where light meets glass), or a Blender render. Tell the user which route you take and why. If the user has not named a route, pick one as step 0 of SKILL.md says. Write the route in the `Hero:` line of `docs/spec.md`. The gate warns when that line is missing.
A thing that is data in the paper (a digit, a measured spectrum, a speckle pattern) should look like data: compute or fetch it rather than imitating it by hand. Never draw a curve, bar or map whose values you made up: plot the paper's numbers, or show the relation qualitatively, or leave it out (P29).
**Structure before texture (P23).** Readers read data-like marks as data, so a wrong structure is noticed at once. For every computed element, first write its macro-structure in the spec card (envelope, arrangement, order, count, symmetry), taken from the physics; generate the detail inside that structure, never as uniform randomness. And never make an illustrative mark look more quantitative than it is: say in the caption what is illustrative.

### 4. Look things up
(Standard and full depth. Optional in replicate mode, where the reference shows how things look.) For every real object you will draw (an instrument, a chip, a device, a well-known mark or logo, an organism), search the web for two or three reference images of that *kind* of object, save them to `docs/refs/`, look at them, and write down in `docs/spec.md` what makes it recognisable (parts, proportions, colours). Then draw your own version. Never download and embed them. In design and describe mode, search generic names ("SLM spatial light modulator", "multimode fiber coil"), not the paper.

### 5. Text (P18–P20)
A label names a thing (2–4 words); explanation, parameter values and derivations go in `docs/caption.md`. If a reader needs a sentence to understand a panel, redraw the panel rather than add the sentence. Label directly; a legend only for glyphs that repeat many times. A relation may appear where it acts, in the drawing's own symbols (one or two per figure, none in a teaser). Labels and symbols may take their entity's colour from the colour key. The gate prints the word density; if it is well above the calibration (`style.md` §3), look for caption material on the figure first.

### 6. Layout at thumbnail size
Draw only boxes and labels for every panel, render `--quick`, open the thumbnail. Check: reading order, balance, white space, alignment of panel tops and axes, label positions. Spread white space as even gaps between elements, never pooled: blind judges named "large empty areas", "sparse panels" or "an empty band at the bottom" in most figures they scored below 40. No region larger than about a fifth of a panel is empty (the gate warns), no band runs empty across the figure, and a label sits beside what it names, never floating between panels. When a panel has too little to show, make its main art larger, merge it with a neighbour, or reduce the figure's height, rather than leaving the space. Fix the layout now: it is the cheapest time to.

**Draft both, then choose (design mode, full depth).** Two drawings of the same paper by the same process differ by about 10 points on a blind judge's 0-100 "published Fig. 1" score, so choosing between two drafts is worth more than polishing one. Take both kept concepts to a first full draft: layout, the hero (rendered or drawn) and every panel's main marks, labels in place, `render --quick` as `figure/figure_a.js` and `figure/figure_b.js`. Open both PNGs at print size side by side and write in `docs/choice.md`, for each, what a journal art editor would flag: generic or copy-pasted icons, panels with large empty areas, data drawn as idealised cartoons, labels that explain instead of name, marks pointing at nothing, a render that sits in a different style from the flat parts, anything untrue to the note. Pick the draft with fewer and smaller problems, say why in one line, copy it to `figure/figure.js`, and finish only that one.

### 7. Build, one panel at a time
For each panel: draw it, `render --quick`, **open the PNG and the thumbnail and look**, fix, repeat. Declare every relation with `F.relate` and draw it with `L.connect` so the gate can check direction. Put shared objects in `figure/parts.js` so they look identical in every panel. Render the hero object in Blender (step 3), then draw the supporting parts flat around it. Turn on the illustrated finish for every figure (`illustrate: true` in the `figure` export, `reference/lib-api.md` "Illustrated style layer"): cells, particles, organisms and trees then get shading, organic outlines and per-instance variation, so no two copies are identical. Turn it off per part only for diagrammatic marks (a flowchart box, a plot).

**Light meets 3D parts.** Where a beam or projection cone passes a lens or leaves or lands on a device in an oblique view, build that part of the panel with `L.lightScene3` (`reference/lib-api.md`, "Light in a 3D view"), not with a flat beam polygon and a lens pasted on top. A physicist reading three of our optics figures named this the biggest flaw: the beam looked the same in front of, through and beside the glass, and a projection cone ran over the device it came from and on through the chip into the panel below. The scene orders light, glass and devices by their 3D planes, dims and tints the light seen through glass, and ends a cone on the surface it lights. A zoom link from that object to another panel is neutral grey, never the beam's colour.

**Annotation register.** Every string on the figure names a thing, a quantity or a state, in 2–4 words, as a published figure's labels do. Blind judges named caption-like or chatty labels as the tell in 8 of the 12 lowest-scoring figures ("Recipe: ...", "Aluminium block, cut open", "no energy, no temperature"). Before the gate, list every label longer than four words and every mark that points at nothing (a dangling dashed line, an arrow with no referent, a legend entry never used), then shorten, move to `docs/caption.md` or delete each one. A label never sits on artwork without a leader line or a halo.

### 8. Gate
`node tools/check.mjs` must have no FAIL. Treat each WARN as a fix-list unless you can say why the figure is right. One WARN names a leader line or callout that runs through another drawn shape or another label, apart from the shape it points to and its own label. Move the label or bend the leader so that the line stays in clear space. **Green does not mean good.**

### 9. Critic pass (fresh eyes)
**Faithfulness first (P28).** Before anything else, list every count, polarity, direction, order, connection and "shared vs individual" choice the drawing makes, and check each against the note or description. Where you drew the textbook version and the source says otherwise, that is an error, not a simplification; where the source does not say, keep the drawing vague rather than specific. Then check the hero element and domain conventions (P30) and headings and annotations (P31).

Self-critique overrates: in our benchmark the drawing agents scored themselves 4–5 on figures a human could tell apart from the original or judged as needing fixes. So critique against the rubric in `style.md` §4 and write every problem down in `docs/self-critique.md` before fixing anything. In design mode check especially: the entry point and hero panel (P12), the colour key carried into labels and panels (P15), the protagonist's saturation against neutral context (P16), the signal's state drawn (P1), links between panels (P9, P24), and caption material on the figure. In replicate mode, hunt region by region for local differences:
- **Silhouette**: the outline of every object (cables, pulses, plates, curves). Wrong curvature is the most visible error.
- **Arrangement**: positions, envelopes, orders and spacing of repeated things.
- **Colour**: saturation and value of each object against the reference (the compare stats; zoom into small objects).
- **Light**: highlights, gradients, translucency, contact shadows; glass needs a bright edge, an internal gradient and a darker far face.
In design mode also check: is anything on the figure that belongs in the caption? Count the words (the gate prints them).
With `review=independent`, start one independent critic for physics and claim errors; it writes `docs/critique-independent.md`. If that file exists, address every item in it and record what you did beneath each item, in that file. An independent critic earns its cost on physics errors, claim-limit violations and missing requirements (in a 19-figure blind test fixes removed 92% of the errors critics named, while key-idea recall did not change and a third of the figures got busier), so treat its readability advice as optional. Fix physics errors and claim-limit violations first, and check each fix in the render (a fix reported but not visible is not a fix). For readability items, prefer changing or removing what is there to adding something new: never add text or a new element to satisfy a critique without removing at least as much elsewhere, and never drop the colour key or a comparison to make room. Before and after the fix, the figure must still be in its chosen style.
Render the full set with crops of the densest regions. Score every panel 1–5 on the rubric in `reference/style.md` §Rubric (reads at print size; takeaway in 5 s; faithful to spec and facts; conventions and physics correct; craft). Measure, don't eyeball: check that equal things are equal in pixels and aligned things are aligned. Fix anything under 4. In replicate mode, put your render next to the reference at the same size and list every difference, then fix the ones that are not deliberate.

### 10. Reader test → `docs/reader-test.md`
A figure is for a reader who has not read the note. By default (`review=own`), do the reading yourself, last: look at the thumbnail cold and write what it claims (the main claims, what each panel shows, any scaling, advantage or limitation, measured or theoretical) before you read your brief again. With `review=independent`, give an independent reader only the render (its prompt names the image file and nothing else: no note, no brief, no key ideas), then a second reader the figure and the caption. Score each reading against the brief's key ideas (conveyed / partial / missed) and list every false claim and every must-not claim it implies. Fix the drawing for a missed key idea (a clearer comparison, a missing link), not with more words; fix any false or must-not claim before delivery. Record the readings, scores and fixes in `docs/reader-test.md`.

### 11. Deliver
- `node tools/check.mjs --final`: every on-screen string must be quoted in `docs/facts.md`.
- `node tools/render.mjs` (full): PDF, SVG, 600 dpi PNG.
- `docs/caption.md` complete.
- Report: start with the `Assumptions:` line you gave as your first message (SKILL.md step 0), updated if a choice changed. Then the takeaway, the files, rubric scores still below 5 and why, anything you invented, and `docs/library-gaps.md`.

---

## 10. Complete Core & Domain Part Catalogs (`lib-api`, `bio`, `chem`, `cs`, `ind`, `qc`)

### `skills/schematic-figure/reference/lib-api.md`
# Library API (engine/lib.js, passed to a figure as `L`)

A figure is an ES module: `export const figure = {width, height, name}` (mm) and `export default function draw(F, L)` (may be `async`, e.g. to `fetch` a Blender anchor file). Units inside are **pt at final size** (`L.mm(v)` converts mm). Every function takes the parent first: a panel, a group, or `F.root`.

## Page, panels, anchors
- `F.panel('a', {x, y, w, h})` (mm) → panel `P` whose origin is its top-left, in pt; draws the 8 pt bold label. `P.w`, `P.h` in pt.
- `L.group(parent, {x, y, rotate, scale, part})` → `{node}`.
- `F.anchor(name, element, x, y)` registers a local point; `F.at(name)` → `{x, y}` in root pt. Components register `name.port` when given `{F, name}`.
- `L.toLocal(F, parent, F.at(name))` → `[x, y]` in `parent`'s coordinates.
- `F.relate(from, to, kind)` declares a relation the figure must show; `L.connect(F, from, to, opts)` draws it as an arrow between anchors. The gate fails on declared relations that are missing or reversed.

## Text
`L.text(parent, x, y, str, {size, weight, anchor: start|middle|end, valign: baseline|middle|top|bottom, color, italic, halo, lineGap, role, underline})`
- Markup: `x_{ij}`, `x^{2}`, `x_i`, `*italic*`, `**bold**`, `\n` new line, `{#e03c31|text}` a run in one colour (other markup allowed inside; e.g. `'{#e03c31|C}-to-{#1f77b4|**X**}'`, `'Ar-{#1f77b4|N}H_{2}'`). Literal `*`, `_`, `^`, `{`: escape with a backslash, written `'\\*'` in JavaScript source. Greek and symbols as Unicode (α λ θ ω ∑ × → ≈ ⊗).
- Sizes: `L.STYLE.text.label` 6 (default), `.small` 5, `.title` 7, panel 8. Nothing under 5 pt.
- `halo: true` knocks out a white outline behind text over artwork.
- `underline: true | {offset, width, color, extend}` rules a line under the (last) line of text, with the text's own transform (the element is `t.underline`). Default off.

## Shapes and paint
`L.path(p, d, s)`, `L.line(p, a, b, s)`, `L.polyline(p, pts, s)`, `L.polygon(p, pts, s)`, `L.rect(p, x, y, w, h, s)` (`s.r` corner radius), `L.circle`, `L.ellipse`.
Style `s`: `{fill, stroke, width (pt), dash, opacity, fillOpacity, cap, join, filter, part}`.
- `L.smooth(points, closed, tension)` → path d through points. `L.sample(fn, x0, x1, n)` → points.
- `L.linearGradient(p, [[0, c], [1, c2, opacity]], angleDeg)`, `L.radialGradient(p, stops, {cx, cy, r})`, `L.shaded(p, base, angle)` (cylinder shading), `L.glow(p, sd)`, `L.blur(p, sd)`, `L.dropShadow(p, {dx, dy, sd, opacity})`, `L.clipPath(p, d)` → url strings for `fill`/`filter`/`clip-path`.
- Colour: `L.STYLE.color.*` (Wong set, `beam`, `glass`, `metal`, `silicon`, tints), `L.PALETTES`, `L.ramp(stops, t)`, `L.shade(hex, amt)` (+ lighter, − darker).

## Connectors and annotation
- `L.arrow(p, from, to, {bend, via, radius, head, headWidth, both, dash, gap0, gap1, label, labelOffset, stroke, width, noHead})`. Heads are sized in pt (default 3.2), not by stroke width.
- `L.blockArrow(p, from, to, {width, head, headWidth, fill})`.
- `L.chevron(p, tip, dir, {len, spread, stroke, width})`: an open (chevron) arrowhead whose point sits at `tip`, drawn as one mitred path. `dir` is the unit vector `[ux, uy]` along which it points. `len` is the arm length in pt (default 2.6). `spread` is the half-width as a fraction of `len` (default 0.55). Defaults: `stroke` `C.ink`, `width` `STYLE.line.normal`. It draws only the head: add the shaft yourself, or use `L.arrow(..., {headStyle: 'open'})`.
- `L.callout(p, target, at, str, {anchor, dot, elbow, size, halo})`: leader line from a dot on the target to the nearest edge of the label. `target` may be an array of points: one label, one leader and dot per target.
- `L.bracket(p, a, b, {side, depth, label})`, `L.zoomLines(p, srcRect, dstRect, {dash})`, `L.frame(p, x, y, w, h, {title, dash, fill})`.

## Optics (side view, axis along +x; `rot` in degrees; ports `in`, `out`, `top`, `bottom`, `center`)
`L.lens(p, x, y, {h, t, kind: biconvex|planoconvex|biconcave|cylindrical})`, `L.mirror(p, x, y, {h, rot})`, `L.beamSplitter(p, x, y, {s})`, `L.laser(p, x, y, {w, h, label})`, `L.camera(p, x, y, {w, h, label})`, `L.detector(p, x, y, {r})`, `L.objective(p, x, y, {l, h})`, `L.grating(p, x, y, {h, teeth})`, `L.scatterer(p, x, y, {w, h})`, `L.slm(p, x, y, {w, h, n, m, fn(i, j) → [0, 1]})`, `L.speckle(p, x, y, {w, h, n, seed, palette})`.
Light: `L.gaussianBeam(p, x0, x1, y, {w0, xw, zR, color})`, `L.beam(p, pts, {color, width})`, `L.lightCone(p, x0, h0, x1, h1, y)`, `L.pulseTrain(p, x0, x1, y, {n, amp, width, carrier})`, `L.fiber(p, pts, {clad, glowCore})`, `L.fiberCoil(p, cx, cy, {r, turns})`. An upward objective is `L.objective(p, x, y, {rot: -90})`; `band` sets its collar colour (black for oil).

Flat beams and plates (v9, demo `demo/bio-motors-trees.js` panel c):
- `L.beamPath(p, pts, {width, color, opacity, hollow, inner, from, bends, edge, core, arrows, arrowSize, arrowColor, F, name})` → `{node, ports, mirrors, edges, at(f)}`: a flat translucent beam band (no glow; blueprint look) along the centre polyline `pts`, full width `width`.
  - Folds: every interior vertex is a mirror. Each edge ray is cut on the mirror line and continues reflected, so the band keeps its true footprint and the rays swap sides at the fold, as in a real reflection. A thick stroked polyline mitres on the wrong diagonal instead ("/" where the mirror is "\"). `bends: [i]` marks vertices that bend without reflecting (fibre, prism).
  - Hollow beams: `hollow: true` draws only the annulus `|offset|` in [`inner`, 1] × width/2 as two edge strips (default `inner` 0.6), starting at vertex `from`. Example: laser → mask at vertex 1 → hollow from there on.
  - The band is one path, so overlaps at a fold never double the opacity. `edge` and `core` add thin edge-ray and centre lines. `arrows: true` puts one chevron on each segment; an array of fractions of the path length places them yourself. Hollow segments get a chevron on each strip.
  - `mirrors: [{i, at, normal, surface, rot}]` gives each fold. `normal` (deg) points into the light side. Draw the optic from these values rather than by eye: `L.mirror(p, ...m.at, {rot: m.rot})` or `L.plate(p, ...m.at, len, {angle: m.surface})`. Ports `start`, `end`, `v1`… (the vertices).
- `L.plate(p, x, y, len, {angle, t, kind: 'filter' | 'dichroic' | 'glass' | 'mask', tint, coat, side, open: [inner, outer]})` → `{node, ports}`: a flat optical plate. Its surface runs along `angle` degrees from +x (0 horizontal; 45 runs top-left to bottom-right). `dichroic` puts a coloured coating on face `side` (−1 | 1). `mask` is an opaque plate with an open annulus at |u| in [`inner`, `outer`] × len/2: the side view of an annular or TIR mask. Ports `center`, `a`, `b`, `front`, `back`.
- `L.evanescent(p, cx, y, sigma, decay, {color, peak, zMax, w, dir})` → `{node}`: a near-field glow at an interface (TIR, evanescent wave, plasmon), with opacity `peak`·exp(−z/decay)·exp(−x²/2σ²). The two factors are separable, so it is drawn as one gradient rect under a gradient mask, with no banding and no blur. `dir` −1 (default) puts the glow above `y`, 1 below.

Light in a 3D view (v14, `engine/light3.js`). Use it whenever a beam or projection cone meets a lens, a device or a surface drawn in an oblique view. Why: a beam drawn as one flat polygon with the lens pasted on top has no depth. The light in front of the glass, the light seen through it and the light outside it all look the same, and a cone runs over the device it leaves and on through the surface it lands on. A physicist reviewing three of our 2D-waveguide and free-space figures named this the biggest flaw ("mixing 3D and 2D incorrectly", 2026-10-05).
- `L.lightScene3(p, P)` → `scene`, with `P` from `L.obliqueProj` (for a hand-made projection pass its on-page axis vectors: `L.obliqueProj({x: [..], y: [..], z: [..], origin, below})`; check `P.view` faces the side you draw). Declare, then `scene.draw()` paints everything in depth order.
  - `scene.surface(name, {point, normal, draw(g), pts, veil})`: an opaque device or surface. `veil` (with `pts`, e.g. 0.2) keeps light arriving at a face the viewer sees from washing over it. Draw it inside the callback (or into `out.slots[name]` after `draw()`), so the scene can put it in front of light behind it: light leaving a DMD's or SLM's hidden underside is covered by the device. Anything drawn before the scene (a chip the cone lands on) is behind all of it.
  - `scene.lens(name, {c, axis, r | e1, e2, t, rim, rimOpacity, face, stroke, width, faceWidth, highlight: false | {dir, span, at}, seen: {transmission, tint, mix}, blend, glass})`: a glass disc. `blend: {k}` paints every beam through it, inside its outline, as one continuous glass-tinted wash under the outline and highlight. Use it when the beam fills the lens or crosses it at mid-depth: the light in front would otherwise hide the glass, and a sheet would show a seam where it crosses the lens plane. `e1`, `e2` (3D semi-axes in its plane) match a disc you want to keep as a given page ellipse; `P.inv(pagePoint, {z: h})` gives them.
  - `scene.beam(stops, {color, opacity, fade, part})`: a light volume through `stops`: apertures (arrays of 3D points; two points make a sheet), `{at: surface, pts}`, `{at: lens, pts?, fill?}`. Segments are convex hulls of consecutive apertures; a lens splits the beam at its two faces. Light behind a lens is drawn dimmer and glass-tinted inside the lens outline only, and plain outside it; the piece inside the glass is tinted more. `fade`: two opacities (first to last stop) or one per stop.
  - Pitfall: a lens stop `{at: lens}` with no `pts` uses a ring of 0.92 of the lens radius, so a thin beam through a big plate or lens swells into a wedge. Give `pts` (the beam's own cross-section slid onto the lens plane) for every lens and surface stop. Worked example: `demo/lightscene3.js`.
  - Depth comes from the planes: for each overlapping pair, the item on the viewer's side of a lens's or surface's plane is in front. So light arriving at a face the viewer sees lies over that face, and light leaving it lies behind.
  - `L.ring3(c, e1, e2, n)`: points of a circular or elliptical aperture.
- A zoom or correspondence link from a 3D object to another panel is not light: draw it neutral grey, behind the object it leaves, and never in the beam's colour or as a continuation of the beam's edges through the object.

## Blocks, networks, plots, chips
- `L.box(p, x, y, w, h, label, {fill, stroke, r, dash})`: ports `left`, `right`, `top`, `bottom`, `center`.
- `L.network(p, x, y, {layers: [3, 5, 2], w, h, r, colors, edges})` → `{nodes}`.
- `L.matrix(p, x, y, {rows, cols, s, fn, stops})`, `L.tileStack(p, x, y, {n, w, h, dx, dy})`.
- `L.plot(p, x, y, w, h, {xr, yr, series: [{fn | pts, color, dash, bars, dots}], xlabel, ylabel})` → `{X, Y}` mappers. It is for schematic insets. For a plot of real data (measured values with axes and error bars), make the plot in a plotting tool such as matplotlib. Save it as SVG and place it with `await L.svgFile(...)`. Use only numbers you have (step 3 of `reference/process.md`, P29).
- Isometric: `const iso = L.isoProj({angle: 30})`, `L.isoBox(p, iso, [x, y, z], [w, d, h], {top})`, `L.chip(p, x, y, {w, d, t, proj: iso, waveguides: [[[u, v], ...]], ports: {name: [u, v]}})` → `{U(u, v)}`, `L.mziMesh(p, x, y, {n, cols, pitch, cell})`, `L.ring(p, cx, cy, {r, gap, bus})`.

## Signals, data glyphs, overview devices (engine/signals.js)
- `L.wave(p, x0, x1, y, {amp, period, color, band, shape: 'sine'|'noise'|fn, head, env, seed})`: signal with optional pale band and arrowhead (either direction).
- `L.stepHist(p, x0, base, binWidth | edges, heights, {color, fill, drop, floor})` → `{edges}`; `L.binLabels(p, edges, y, labels, {color, highlight})`.
- `L.spectrum(p, x0, x1, baseline y | fn(x), [[centre, height]], {color, fill, sigma})`: peaks over a (possibly sloping) axis.
- `L.pixelImage(p, x, y, w, data[rows][cols] in [0,1], {palette, frame, overlap})`: real or computed images as vector cells (dataset samples, simulated intensity). `overlap: 0.6` grows each cell by that fraction under a clip to the image, so dark maps show no hairline seams at any dpi; pass `skipBelow: 0` with it.
- `L.statePolyline(p, pts, states, styles)` → `{node, runs}`: a trajectory whose style follows a state column. Segment k takes the style of `states[k]`; `styles` maps each state to an `L.polyline` style (clamped thick and dark, free thin and pale). States missing from `styles` are not drawn.
- `L.density(p, fn, x0, x1, base, {n, color, fill, width, shade: [xa, xb] | [[xa, xb], ...], shadeFill, baseline})` → `{node, pts}`: a 1D density above a baseline (`fn(x)` = height in pt) with a pale fill and one or more shaded intervals: tail probabilities, lost fractions, dispersal kernels.
- `L.layerCard(p, x, y, w, h, {nIn, nOut, edge, nodeIn, nodeOut: colour | {a, b}, F, name})`: one network layer on a card.
- `L.splitNode(p, cx, cy, r, {a, b, vertical})`, `L.dots(p, x0, x1, y)` (ellipsis).
- `L.fadeCard(p, x, y, w, h, side)` ("and more" continuation), `L.flare(p, [x0, x1, y], [x0, x1, y])` (filled zoom funnel), `L.glassSlab(p, nearFace4, dx, dy, {color, opacity})` (translucent prism in oblique view).
- `F.panel(label, {..., labelSize})` changes the panel-letter size (replicate mode).

## Forms (engine/forms.js, v2)
- `L.brace(p, a, b, {depth, side: ±1, label})`: curly brace between two points.
- `L.plane(p, origin, eu, ev, {fill, stroke, r})` → `{node, inner, P(u, v), w(pt)}`: an oblique plane (unit square → parallelogram). Draw inside `inner` in unit coordinates (convert widths with `w`), or map points with `P`. `L.roundedPoly(points, r)` → a path d with rounded corners in screen space.
- `L.glossyNode(p, cx, cy, rx, ry, {color})`: a shaded sphere-like node with highlight and ground shadow.
- `L.arrow(..., {headStyle: 'open'})`: chevron head; `L.chevron(p, tip, dir)`; `L.doubleArrow(p, a, b)` (⇒).
- `L.pulse(p, cx, y, {sigma, h, color, baseline})`: a Gaussian pulse on a baseline.
- `L.spring(p, a, b, {n, amp, lead, style: 'zigzag' | 'coil', stroke, width, F, name})` → `{node, ports}`: an elastic linker from `a` to `b` for bead-spring models, force probes and trap stiffness. It draws `n` zigzag periods (or coil loops) of half-height `amp` between straight leads, each lead a fraction `lead` of the length. Ports `a, b, mid`.
- `L.flowArrow(p, pts, {width, head, headWidth, radius, fill, opacity, F, from, to, kind})` → `{node}`: a fat constant-width arrow along a polyline with rounded bends, for Sankey-style flows that turn corners (`L.blockArrow` is straight only). Pass `width` = value × one shared scale. `radius` is the bend radius of the centre line (default `width`).
- `L.axes3(p, origin, ax, ay, az, {labels, dashed})`: oblique three-axis frame with rotated axis labels.
- `L.surface(p, P, z(u, v), {rows, cols, hz, stops})`: height-field / waterfall surface over an oblique ground `P(u, v)`, drawn back to front.
- `L.ringGlyph(p, cx, cy, rx, ry, {color, width})`: thick ring (cavity, resonator) in oblique view.
- Text: `{math: true}` sets the maths font (Cambria italic); `{family}` any font; `{rotate: deg}` about the anchor point.
- `L.group(parent, {matrix: [a, b, c, d, e, f], clip, opacity})`. `F.drew(from, to, kind)` registers a relation drawn by custom art (block arrows, beams) so the gate can check it.
- `F.panel(label, {labelSize, labelWeight, labelFormat: (s) => '(' + s + ')'})` for journals whose panel labels are not bold lowercase.


## Stimulus and motion glyphs (engine/forms.js; demo `demo/assorted-parts.js` panels a and f)
- `L.bolt(p, x, y, w, h, {fill, stroke, width, flip, rot, F, name})` → `{node, ports}`: a lightning bolt in the box x, y, w, h (footshock, electrical stimulation, discharge): a zig-zag polygon, pale yellow with a dark outline. `flip` mirrors it; `rot` (deg) turns it about the box centre. Ports `top`, `tip`, `center`.
- `L.cloud(p, cx, cy, w, h, {lobes, bulge, fill, stroke, width, seed, streaks, F, name})` → `{node, ports}`: a lobed cloud outline about w × h (air puff, smoke, gas release, thought bubble), a ring of `lobes` arcs (default 8; `bulge` scales how far each swells) with seeded jitter. `streaks: n` (or `{n, len, side}`) adds speed lines leaving the right (`side: -1` the left): an air puff. Ports `center, left, right, top, bottom`.
- `L.lamp(p, x, y, {angle, size, beam, spread, color, body, stroke, width, F, name})` → `{node, ports}`: a small lamp (light stimulus, torch, LED head): a grey head `size` wide whose emitting face is centred at (x, y), and a fading beam of length `beam` (default 1.6 size) along `angle` (deg, 90 = down) widening by `spread` (half-angle, default 18). Ports `face, back, beam`.
- `L.trail(p, head, tail, {w, color, bend, blur, opacity, core, F, name})` → `{node, ports}`: a glowing comet trail behind a moving particle, a tapered band from `tail` (transparent, thin) to `head` (full colour, width `w`), bowed sideways by `bend` × its length (positive = left of travel) and softly blurred (`blur` sd, default 0.18 w; 0 = sharp), with a bright core (`core: false` drops it). Draw it before the particle at `head`. Ports `head, tail, mid`.
## v3 parts
- `L.obliqueDisc(p, cx, cy, r, {tilt, thickness, top, glass})`: a lens, wafer or plate seen from above. `tilt` is the view elevation in degrees: 90 is a circle, 30 gives height/width 0.5, 15 gives 0.26. Choose it on purpose (a human judged a replica's optics "too horizontal" at shallow tilt) and use the same tilt for every element in a stack.
- `L.obliquePanel(p, cx, cy, w, d, {tilt, skew, thickness, fn(g, P)})`: an SLM, DMD, display or detector array in oblique view, content drawn through `P(u, v)`.
- `L.waistBand(p, cy, [{x0, x1, h, fill}])`: a pipeline band that narrows to a bottleneck.
- `L.bitColumn(p, x, y, bits, {cell, on, off, horizontal})`: binary cells (clicks, bits).
- `L.projector(p, x, y, {w, h, d})` → `{lens}`: a projector for light-pattern illumination.

## Projection geometry and notation (engine/geo.js, engine/notation.js)
Demo: `demo/geo-projections.js` draws the parts below up to the tubes and arrays, and `demo/geo-ribbons.js` draws the rest (inverse, ghost boxes, polygons with holes, plane paths and ribbons, prisms, trays, wheels, fitArt). World units are pt before foreshortening; z is up.

**Projector.** `const P = L.obliqueProj({preset, angle, depth, scale, origin, x, y, z, view, below})` → `P(x, y, z)` → `[px, py]`.
- Presets: `'isometric'` (default: x right-down, y left-down at `angle` 30°, z up; identical to `L.isoProj()`), `'cabinet'` (x right, y receding at 45° with depth 0.5), `'cavalier'` (depth 1), `'angles'` (x right, y receding at `angle` degrees, default 30, foreshortened by `depth`, default 0.5; 90 < angle < 180 recedes up-left). Or give the page vectors of the unit axes: `{x: [dx, dy], y: [...], z: [...]}`.
- `P.view`: unit direction toward the viewer (derived so the +z face shows; `below: true` looks from underneath; `view: [x, y, z]` overrides). `P.depth(x, y, z)` is larger for nearer points (sort far to near with it). `P.vec(v)` maps a direction; `P.at([ox, oy])` is the same projector with a new origin; `P.visible(normal)`.
- `P.inv([px, py], plane = 0)` → `[x, y, z]`: the inverse on a plane. It returns the world point on `plane` that projects to the page point, so geometry can be placed from page measurements or from a reference image. `plane` is a number (z = n), `{x | y | z: value}`, `{point, normal}` or a face mapper (for the box's `P`). It throws if the plane is seen edge-on.

**Boxes.** `L.obliqueBox(p, P, [w, d, h], {pos: [x, y, z], at: [px, py], anchor, fill, faces: {x1, top, ...}, stroke, width, opacity, back, backFill, backOpacity, seal, hidden: true | {dash, stroke, width}, ghost, F, name})` → `{node, P, faces, visible, corner, center, ports, w, d, h}`.
- Faces are keyed by axis and side: `x0` `x1` `y0` `y1` `z0` (bottom) `z1` (top); only those facing `P.view` are drawn (isometric: x1, y1, z1; cabinet: y0, x1, z1). Default fills: top = `fill`, y faces 12 % darker, x faces 25 % darker (as `L.isoBox`).
- Place by the world corner `pos`, or put the box's `anchor` (`'center'` default, `'top'`, `'bottom'`, a corner `'101'` = (w, 0, h), a face centre `'x1'`, or fractions `[fx, fy, fz]`) at the page point `at`.
- `faces.k(u, v)` maps the face's unit square to the page: (0, 0) is its top-left as seen, u rightward, v downward, never mirrored. Each mapper has `.quad(u0, v0, u1, v1)` (a window or slot polygon), `.center`, `.corners`, `.normal`, `.visible`, `.world(u, v)` (world point for the returned `P`, e.g. to stand a knob on the face), `.eu`, `.ev`.
- `back: true` draws the hidden faces first at `backOpacity` (glass or translucent boxes, with `opacity` < 1); `seal: true` lays the silhouette under the faces to close antialiasing seams; `hidden` dashes the hidden edges (technical and patent drawings). A thin plate is a box with a small h. `L.isoBox` is unchanged.
- `ghost: true | {dash, stroke, width, solid: ['x11', ...], fill, fillOpacity}` (default off) draws no faces: only the visible edges, dashed (`'1.3 0.9'`), for an envelope, a removed part or a "fits here" outline. An edge is named by its free axis letter in that axis's slot and 0 / 1 for the other two sides: `'x11'` runs along x at y = d, z = h; `'01z'` is the vertical edge at x = 0, y = d. Edges listed in `solid` are drawn solid. `fill` lays a faint silhouette (default opacity 0.15) under the edges. It combines with `hidden`.
- An inset square on a face is `L.polygon(p, face.quad(0.2, 0.2, 0.8, 0.8), s)`. A surface dot grid is a loop of `L.circle3(p, box.P, face.world(u, v), face, r, {fill})`.
- `L.faceGroup(p, face, u, v, {rotate})` → `{node, scale}`: draw text or shapes inside and they lie on the face, sheared. Local x runs along u and y along v, 1 unit = 1 pt of page length. The shear shrinks area by `scale` (what the gate measures), so set text at `size / scale`.

**Circles, cylinders, knobs.**
- `L.circle3(p, P, c, normal, r, style)` → `{node, at(phi)}`: a circle in 3D (hole, port, disc outline) as its exact projected ellipse. `normal`: `'z'`, `'-y'`, `[x, y, z]` or a face mapper.
- `L.cylinder3(p, P, c0, c1, r0, r1 = r0, {fill, capFill, cap, stroke, width, shading, bands: [{t0, t1, fill, k, stroke}], streak: true | {at, width, color, opacity, t0, t1}, F, name})` → `{node, ring(t, phi, k), tip, base, cap, alpha, ports: {base, tip, center}}`. A cylinder, frustum (r1 ≠ r0) or cone (r = 0) along any axis. The body is the convex hull of the two end ellipses, so a tapered nose has the right back-half silhouette; the end facing the viewer gets the cap. `shading` fills the body with a user-space gradient across the axis, lit from the upper left; `bands` are collars between axial fractions (their visible strip; `k` > 1 raises them slightly); `streak` is a specular highlight along the lit side. Paint far pieces first (for y receding in cabinet, the far end is c1).
- `L.knob3(p, P, base, axis, r, len, {side, face, dot, dotColor, shading, stroke, width})`: a short knob standing on a surface, e.g. `L.knob3(p, box.P, box.faces.x1.world(0.8, 0.5), box.faces.x1, 3, 4)`.
- `L.userGradient(p, a, b, stops)`: a linear gradient between two page points (userSpaceOnUse). Unlike `L.linearGradient` (bounding-box units), it stays aligned with a rotated shape.

**Tubes and arrays.**
- `L.tube3(p, P, base, r, h, {axis: 'z', inner: 0.56, fill, capFill, holeFill, holeDepth, wallFill, shading, stroke, width, innerWidth})`: an upright cylinder with an annular top (a cell, vial or tube in a holder). `base` is the centre of its foot, and `h` is the height that shows. `holeDepth` > 0 shows the bore wall.
- `L.tubeArray3(p, P, sites | {rows, cols, pitch: [pu, pv], origin, hex}, r, h, {each(site, i) → opts | false, ...tube3 opts})` → `{node, order, sites}`: tubes painted back to front, so nearer ones occlude farther ones. To paint another layer (a gasket) in the middle of the array, call it twice with complementary `each` filters.
- `L.voxels3(p, P, [n1, n2, n3], {size, gap, pos, filled(i, j, k) → bool | colour, light, dark, opacity, back, backOpacity, filledOnTop, stroke, width})` → `{node, cell(i, j, k)}`: a 3D binary tensor. Empty cells are translucent cubes that show their back faces; filled cells are opaque. The cells are depth-sorted, and the filled ones are painted last (`filledOnTop`, default true).

**World polygons, paths in a plane, ribbons** (demo `demo/geo-ribbons.js`).
- `L.poly3(p, P, rings, style)` → `{node, rings}`: a planar polygon in 3D. `rings` is one world ring `[[x, y, z], ...]` or a list of rings filled even-odd, so the inner rings cut holes (door openings, a sunroof, an aperture). `L.line3(p, P, a, b, style)` → `{node}` draws a line between two world points.
- `L.planePath(P, verts, {radius, plane, arcStep})` → `{samples, length, world(off), page(off), d(off, close), at(f, off), plane}`: a polyline in a world plane with circular fillets at its interior vertices. Offsets are exact parallel curves in world units, so a trace, belt or ribbon foreshortens correctly under any projector (`L.smooth` and `L.flowArrow` round corners on the page).
  - `verts` are plane coordinates in world units. `radius` is one number or one per interior vertex; 0 gives a sharp, mitred corner, and a radius too large for its segments is clamped.
  - `plane`: `{origin: [x, y, z], u: 'x', v: 'y'}` (default the ground z = 0), or a face mapper. With a face mapper, coordinates are measured from the face's top-left, with v running down the face as seen; use the box's `P`.
  - `off` is along the left normal (left of travel in the (u, v) frame); inside a fillet it must stay below the radius. `at(f, off)` → `{page, world, dir}` is the point at fraction `f` of the length, with the page direction of travel (for arrowheads, labels and callouts).
- `L.ribbon3(p, P, verts, w, {n, radius, plane, align, fill, fillOpacity, stroke, edge, width, lines, highlight, highlightFill, highlightOpacity, highlightStroke, F, name})` → `{node, path, off(k), line(k), channel(k), ports: {start, end, mid}}`: a flat ribbon, strap or flex cable of width `w` (world units) on a `planePath`.
  - It has `n` channels between `n + 1` lines; `n` = 1 (the default) is a plain band. `align: 'center'` (default) makes `verts` the centre line; a line index k makes them line k (line 0 is the left edge walking the path).
  - `highlight: k | [k, ...]` fills those channels with `highlightFill` (default vermillion). `edge` colours the two outer lines, and `lines: false` keeps only those.

**Extrusions, trays, wheels.**
- `L.prism3(p, P, xy, z0, z1, {fill | top, side, sideX, stroke, width, opacity, F, name})` → `{node, top, faces: [{i, pts, normal}], ports: {top, bottom}}`: a simple polygon `xy` in the ground plane extruded from z0 to z1 (a tray outline with tabs, a plus-shaped pad, a flange; `obliqueBox` covers rectangles). The side faces toward the viewer are painted far to near, then the top. Default fills follow `obliqueBox`: x-facing sides 25 % darker, y-facing 12 % darker; `side` sets all the sides and `sideX` the x-facing ones. The order is exact for convex outlines; a deeply re-entrant one can mis-order two side faces.
- `L.tray3(p, P, [w, d, h], {pos, at, anchor, wall, floor, fill, faces, inner, floorFill, rim, stroke, width, opacity, contents(g, Q, interior), F, name})` → `{node, P, back, mid, front, interior, ports: {center, top, floor, bottom}}`: an open-top tray, crate or well, seen from above.
  - Walls are `wall` thick (default 8 % of the shorter side) on a `floor` (default = wall). Placement is as for `obliqueBox`.
  - It paints three groups so that contents sit inside. `back` holds the floor and the far walls' inner faces and rims. `mid` holds the contents: draw into it, or pass `contents(g, Q, [x0, y0, x1, y1, z])`, where Q is the tray's projector and the array is the inside floor in Q's coordinates. `front` holds the near walls' outer faces and rims.
  - Contents taller than the walls are right as drawn. Sort several content parts by `Q.depth` yourself.
- `L.wheel3(p, P, c, axis, r, tread, {fill, capFill, rim, rimFill, hub, hubFill, spokes, window: [r0, r1, frac], windowFill, windowStroke, phase, shading, stroke, width, F, name})` → `{node, face, at(rho, phi), ports: {center, hub, a, b}}`: a wheel centred at `c` turning about `axis`. The tyre is a `cylinder3` of width `tread`. On the side toward the viewer it has a rim disc (`rim` · r, default 0.64), `spokes` windows (default 7; 0 gives a plain disc) and a hub (`hub` · r, default 0.18). The windows span radii `window[0..1]` · r (default 0.22 to 0.56) and a fraction `window[2]` (0.6) of each pitch, turned by `phase` (rad). Paint the far wheel, then the axle, then the near wheel.


**Measured corners, arenas, holes, tile plates** (demo `demo/assorted-parts.js` panels c and e).
- `L.projFromCorners(O, A, B, n1, n2, {C, n3, z, below})` → `P`: the projector that puts the world origin at page point `O`, `(n1, 0, 0)` at `A` and `(0, n2, 0)` at `B`: three corners of a box measured on a reference, `O` being the corner its x and y edges share. For z give `C` and `n3` (the page point of `(0, 0, n3)`, a vertical edge of known height) or `z: [dx, dy]`, the page vector of one world unit up (default straight up, at the mean of the x and y scales). Use it for non-isometric devices (dimetric blocks, flat trays) measured from a figure.
- `L.wireBox3(p, P, [w, d, h], {pos, at, anchor, stroke, width, omit, hidden, divide, axis, tint, tintOpacity, floorLines: {n, cells, stroke, width, dir}, F, name})` → `{node, P, corner(fx, fy, fz), cell(i), ports}`: an open-top wire-frame box (behavioural arena, shuttle box, open field, glass tank).
  - All twelve edges are drawn solid, as a glass or wire frame shows its back edges. `hidden: '1.2 0.9'` dashes the edges on no visible face instead; `omit: ['x11', ...]` leaves edges out (codes as for `obliqueBox` ghost).
  - `divide: [fractions]` splits it along `axis` (default `'x'`) into compartments with walls. `tint: [fill | null, ...]` fills, per compartment, the inner surfaces seen through the open top (the far walls and the floor). `floorLines` rules a grid floor (shock bars) across the listed `cells` (default `[0]`), across the axis or `dir: 'along'` it.
  - `cell(i)` → `{range, floor(u, v), center}`: `floor(u, v)` maps a compartment's floor to the page (u along the axis), to stand a `D.mouse` in it. Ports `center, top, bottom, c0, c1, ...` (floor centres).
- `L.hole3(p, P, c, normal, r, depth, {wall, floor, rim, stroke, width, opacity, shading, F, name})` → `{node, ports}`: a round hole or well sunk into a surface (a well in a chip or plate, a bore, a socket) at world point `c` on the surface with outward `normal`. The opening shows the far inner wall (`wall`, shaded darker toward the rim unless `shading: false`) and the part of the floor (`floor`) seen through it; `rim` is the outline colour (`'none'` for none). `L.tube3` is the standing counterpart. Ports `center, floor`.
- `L.tilePlate3(p, P, [w, d, h], {pos, nu, nv, border, gap, fill, faces, stroke, width, bed, lip, lipFill, tileFill, tileStroke, tileWidth, tile(g, T, i, j), F, name})` → `{node, P, tile(i, j), ports}`: a plate or carrier (well plate, multi-chip plate, sample tray) as a box `h` high whose top carries an `nu × nv` grid of flat tiles inside a `border`, `gap` apart, on a recessed `bed` colour; `lip` adds a wider skirt at the base. `tile(g, T, i, j)` draws each tile's content through `T(u, v)`, the tile top's unit square (`T.world(u, v)` gives the world point, for `circle3` wells or `hole3`). Ports `center, top, t<i>_<j>`. For tubes rather than flat tiles use `L.tubeArray3`.
**Fitting a drawing into a box.**
- `L.fitArt(p, box, fn, {frac: [x0, x1, y0, y1], proj, scale, offset, part})` → `{node, P, scale, offset, bbox}`: draws `fn(g, P, {measure})` so that its page bounding box fits, centred, in `box` `{x, y, w, h}`, or in the fraction `frac` of it. Use it for table cells and multi-view grids of the same object.
  - `fn` runs twice: first at scale 1 to measure (`measure: true`; that output is removed, so register anchors only when `!measure`), then with the fitted projector. The scale goes into the projector, not a transform, so stroke widths and text sizes stay true.
  - `proj` holds `obliqueProj` options (default isometric), or is a function `(scale, origin) → P` for a custom projector.
  - To reuse a pose in another box, pass the returned `{scale, offset}` (`offset` is the projector origin relative to the box's top-left). Passing `scale` alone keeps the new drawing centred at the same size.

**Delimiters and matrices.**
- `L.delim(p, kind, x, y0, y1, {w, mid, end, color})` → `{node, x0, x1, inner}`: a tall delimiter in the box x..x+w, drawn as a filled shape so it keeps TeX proportions at any height. `'('` `')'` are crescents (thin ends `end` 0.22 pt, belly `mid`); `'['` `']'` brackets; `'|'` `'‖'` bars. Defaults scale with the height: w = 0.12 h (2 to 6 pt), mid = 0.5 + 0.0095 h. Curly braces: `L.brace`.
- `L.texMatrix(p, x, y, rows, {size, family, math, color, cellColor(r, c, v), colGap, colXs, uniform, rowPitch, hangMinus, delim: '(' | '[' | '|' | 'none', delimGap, vPad, delimW, delimMid, delimColor, rowTint: [fill | null] | fn(r), tintPad, anchor, valign: 'middle' | 'top', capHeight, F, name})` → `{node, cells[r][c]: {x, y, cy}, colXs, rowYs, rowCenters, x0, x1, y0, y1, w, h, ports}`: a matrix of typeset entries (numbers or rich-text strings) between tall delimiters. A leading `-` becomes a true minus that hangs left of the column (`hangMinus`, default true), so the digits stay aligned. `x` is the left delimiter's outer edge; `y` is the centre of the rows. `cells[r][c].x` is the column centre, `.y` the baseline, and `.cy` the cap-height centre (for rings or highlights).

**Reference numerals (patent drawings, exploded views).**
- `L.leader(p, from, to, {c1, c2, bend, wavy, via, tension, head: false | 'solid' | 'arrow' | 'dot', headLen, headHalf, dotR, stroke, width, gap1, F})` → `{node, d, start, end, dir}`: one smooth cubic leader. The controls are either explicit (`c1`, `c2`), or `bend` (signed fraction of the chord, default 0.22) for a C-curve, or `wavy: true` for an S-curve, or `via: [points]` for a smooth curve through the points. `'solid'` ends in a small patent wedge (2.6 × 1.8 pt); by default the leader ends plain.
- `L.numeral(p, x, y, '305', {to: point | anchor | [point | {to, ...leader opts}], underline, size, anchor, valign, color, gap, ...leader opts})` → `{node, text, box, leaders}`: a numeral with one leader per target, each starting where its line leaves the numeral's padded box. `underline: true` marks a numeral that sits on the part it names.
- Short form: `L.numeral(p, x, y, '12', target, {curve, assembly, ...})`, with the target (a point, an anchor name, or a list of them) as the fifth argument. `curve` is a signed bend (fraction of the chord), `'S'` for an S-shaped lead, or `0` for a straight one. `assembly: true` ends the lead in an arrowhead, for a numeral that names a whole assembly (37 CFR 1.84(r)).

## Patent drawings (engine/patent.js; demo `demo/patent.js`, three sheets: `--fig "demo/patent.js?sheet=2"`)
`export const figure = {format: 'patent', sheet: 'letter' | 'a4', sheetId: '1/1', numerals: 'path/to/numerals.md'}` turns the page into a drawing sheet under 37 CFR 1.84. The page is US letter (215.9 × 279.4 mm) or A4 (210 × 297 mm), and `width` and `height` are ignored. The sight is the area inside the minimum margins (top 25, left 25, right 15, bottom 10 mm). `F.sight` gives it as `{x, y, w, h}` in pt and `F.sightMM` in mm. `F.drawing` is a group whose origin is the sight's top-left: draw into it. `sheetId` prints the sheet number at the top middle of the sight (1.84(t)). `numerals` points the gate to the numerals list, relative to the figure file; by default it is `docs/numerals.md`.
- **Profile** (`L.PATENT`, applied by `L.usePatentProfile()`). Every colour token becomes black, and the area tokens (tints, `light`, `faint`, `glass`, `metal`, ...) become white. `L.shade` returns its colour unchanged, so box faces and cylinder caps stay white. Lines are hair 0.5, thin 0.6, normal 0.9 and bold 1.3 pt, with a minimum of 0.35 pt. Text is 14 pt by default, which gives 3.5 mm capitals against the 3.2 mm minimum. FIG. labels are 22 pt and sheet numbers 16 pt. Arrowheads are 6 pt. Every part's paint goes through `L.patentPaint`. It turns strokes black (white stays white, as a knock-out) and fills black when dark or white otherwise. Gradients become white, faint fills are dropped, opacity and filters are removed, and widths are raised to the minimum. Text is set black. The gate reports how many values the profile forced, and it still fails any colour drawn with raw `L.el`. Pass `fill: '#fff'` to 3D parts (`obliqueBox`, `cylinder3`) for line art.
- `L.figLabel(p, x, y, 'FIG. 1', {size, anchor, weight})`: the view label, bold 22 pt (1.84(u)).
- `L.hatchSection(p, shape, {angle: 45, spacing: 5.5, width: 0.5, fill: '#fff', outline, outlineWidth})` → `{node, d}`: a cut surface in a sectional view. It draws evenly spaced oblique lines clipped to `shape` over a white fill, with the outline on top. `shape` is path data, a point list, or a list of rings, where inner rings are holes. Hatch adjacent parts at different angles (45 and 135) or spacings. Shafts, bolts and screws in the cutting plane stay unsectioned: draw them as plain outlines.
- `L.surfaceShade(p, shape, {angle: 90, side: 1, n: 6, extent: 0.35, power: 1.8, width})` → `{node}`: shading by spaced lines on curved surfaces (1.84(m)). It draws `n` thin lines parallel to `angle`, crowded at the shaded edge and thinning over `extent` of the width. For angle 90, `side: 1` shades the right edge. Never use solid black. For a cylinder, pass the body and cap path data joined with a space. The clip is even-odd, so the cap stays clear: `c.node.querySelector('[data-part=cylinder-body]').getAttribute('d')`.
- `L.pBox(p, x, y, w, h, legend, num, {numeralAt: 'right' | 'left' | 'top' | 'bottom' | 'inside' | [x, y], numeralTo, lead: 18, curve, dash, r, F, name})` → `{node, ports, numeral}`: a block-diagram box with a black outline and an optional short legend inside (`'\n'` breaks lines). Its numeral sits outside, `lead` pt from the edge, with a short curved lead that touches the box. With `'inside'` the numeral is underlined under the legend instead. `dash: true` draws an optional or software element. Ports are `left`, `right`, `top`, `bottom` and `center`.
- `L.flowStep(p, cx, cy, w, h, legend, num, {shape: 'process' | 'decision' | 'terminal' | 'io', numeralAt: 'right' | 'left' | [x, y], lead, curve, F, name})` → `{node, ports, numeral}`: a flowchart step centred at (cx, cy). The shape is a rectangle, a diamond, a rounded START/END terminal or a parallelogram. The legend sits inside, and the step numeral (`'S102'` or `'102'`, as the description writes it) sits outside with a lead. Ports are `top`, `bottom`, `left`, `right` and `center` (for a diamond, its vertices).
- `L.flowLink(p, from, to, {via, label, labelAt, labelSide, F, kind})`: a flowchart connector with square elbows and a solid head. `label` is a one-word legend (`'YES'`, `'NO'`) set beside the start. With anchor names on both ends, the link counts toward `F.relate`.
- `L.sectionLine(p, a, b, '2', {side, len})`: a cutting-plane chain line with an arrow at each end, pointing in the viewing direction, and the view number at each arrow (section 2-2). `L.centerLine(p, a, b)`: an axis line in long-dash short-dash chain.
- Circuit symbols run between two terminals `a`, `b` in any direction and return `{node, ports: {a, b, mid}}`: `L.resistor` (zigzag), `L.capacitor`, `L.inductor` (`turns`), `L.diode` (filled, or `open: true`), `L.battery`, `L.switchSym` (`closed`). `L.opamp(p, x, y, {size, flip})` has ports `plus`, `minus` and `out`, with its + and − signs drawn as strokes. `L.groundSym(p, x, y)` hangs below its terminal. `L.junction(p, x, y)` draws a connection dot and `L.wire(p, pts, {dash})` a conductor with square corners.

## Illustrated style layer (engine/illustrate.js; demo `demo/illustrated.js`)
Flat code-drawn primitives read as generated art: every copy identical, one flat fill, a black outline. This layer gives shapes the finish an illustrator gives them, from a single fill colour. It uses only gradients and paths, never blur filters, so the PDF stays vector.
- **Switch.** It is off by default, and every existing figure renders unchanged. `export const figure = {..., illustrate: true}` turns it on for every supporting part, and so does `F.style.illustrate = true` (the same object as `L.STYLE`). An object sets figure-wide defaults: `{light: -135, contrast: 0.8, shadow: 'drop', wobble: 0.03}`. A part's own `{illustrate: false | true | {...}}` wins. Supporting parts: `D.cell`, `D.cellCluster`, `D.cellLayer` (and `D.lumen`, `D.wellSection` cells), `D.cellSheet`, `D.mouse`, `D.brainSagittal`, `D.cytokines`, `D.tree` (broadleaf and conifer) and `K.atomBall` (and so `K.molecule3d`). `L.illustrating(o)` returns the merged options or null, for your own parts.
- `L.finish(p, d, base, {light, contrast, core, rim, rimWidth, highlight, highlightAt, highlightSize, highlightRot, outline, width, shadow, mottle, seed, box, tones, part})` → `{node, inner, over, box, tones, clip, fill}`. It draws the closed path `d` as an illustrated shape:
  - The body is an elliptical gradient lit from `light`, the page angle the light comes from (−135 = upper left, the default). It runs light, base, dark, deep. `contrast` scales every shift: 0.6 suits flat BioRender-like parts, 1.2 glossy ones.
  - `core` (default 0.35) darkens a band along the shadow-side edge. `rim` (0.7; `false` for none) is reflected light in a thin band along that same edge; it separates the shape from what lies behind it.
  - `highlight` (opacity 0.75; `false` for none) is a soft spot toward the light, moved with `highlightAt` [x, y] and sized with `highlightSize` [fx, fy] (fractions of the radii).
  - `outline` defaults to the darker `line` tone of the same hue (`false` for none).
  - `shadow`: `true` or `'drop'` (a soft shadow offset away from the light), `'ground'` (a flat ellipse under the shape), `'offset'` (the shape itself shifted at low opacity), or `{kind, opacity, dx, dy, y, rx, ry}`. `mottle: n` adds seeded soft blotches inside, as organic texture.
  - Draw contents such as a nucleus into `inner`: it is clipped and sits under the shading and the outline. `box` {x, y, w, h} skips measuring the path. `fill` is the body gradient; reuse it as a stroke to knock out interior detail in exactly the body colour.
- Pieces for parts that must interleave their own line work: `L.bodyGradient(p, box, base, o)` → url, `L.shading(p, d, box, base, o)` → the clipped core, rim and highlight group (lay it under your interior lines), `L.shapeShadow(p, d, box, tones, {shadow})`, `L.contactShadow(p, cx, cy, rx, ry, {opacity, color, rot})` and `L.softSpot(p, cx, cy, rx, ry, rot, color, opacity)` (a soft ellipse that fades to transparent, for glows and local shading). `L.ellipseGradient(p, cx, cy, rx, ry, rot, stops)` is a user-space radial gradient.
- `L.ball(p, cx, cy, r, color, {...finish opts})` draws one illustrated sphere (particle, bead, vesicle). `L.particles(p, pts, r, color, {seed, vary: {size, hue, lum, sat, jitter}, colors, ...finish opts})` → `{node, items}` draws a ball at each point, each with its own size (±15 % by default), tint and position jitter. Use it wherever a row or cloud of identical dots would otherwise appear.
- Colour: `L.tones(base, {contrast})` → `{base, light, glow, dark, deep, line, shadow, spec}`. It shifts lightness at nearly constant chroma: lights warm slightly and shadows cool toward blue-violet, in proportion to the base saturation, so greys stay grey. `L.tint(hex, {h, s, l})` shifts hue (deg), saturation and lightness. `L.hexToHsl`, `L.hslToHex`.
- Organic outlines: `L.wobble(pts, {amp, seed, harmonics, closed, fine, weight(i, t)})` pushes each point along its normal by seeded low-frequency noise. On a closed outline the noise is periodic, so it has no seam. `amp` defaults to 3.5 % of the mean radius. `weight` pins points, e.g. a cell's base on its membrane. `L.blob(cx, cy, r, {seed, amp, n, aspect, rot, harmonics})` → points of an organic closed outline, for `L.smooth(pts, true)`.
- Per-instance variation: `L.vary(seed, i, {size, rot, aspect, hue, lum, sat, jitter})` → `{k, rot, aspect, dx, dy, tint(hex), seed, rand}`, the deterministic variation of item `i` in a repeated set. The defaults are size ±8 %, rot ±12°, aspect ±8 %, hue ±5°, lightness ±0.04 and saturation ±0.04. `seed` is a fresh seed for the item's own outline noise. `L.rng(seed)` is a seeded generator, and `L.hashSeed(...numbers)` makes a seed from a position.
- Illustrated parts vary by default: a cell's seed is a hash of its position and radius, so repeated cells differ without the maker passing seeds. Pass `vary: false` to a `D.cell` to keep its exact fill and a round aspect.

## Rasters (Blender renders, micrographs)
`await L.svgFile(p, '/figure/art/x.svg', x, y, w, {h, part, keepBackground})` inlines an external SVG as vector content (RDKit molecules from `tools/molecule.py`, exported vector art) and returns `{el, h}`; the figure's draw function must be `async` to use it. White background rects are dropped.

`L.image(p, href, x, y, w, {pxw, pxh, anchors, F, prefix})` places a PNG and registers its render anchors as figure anchors. See `blender/scene.py`.

**3D in illustration mode.** A photographic Blender render placed among flat vector panels reads as work by a second hand. Blind judges called such renders "generic 3D" and "toy-like". Illustration mode redraws any kit's scene the way an illustrator would draw it beside the vector parts:
- Each material becomes a flat-lit toon fill from its own base colour. The light and shade tones are the `L.tones` ramp, and per-cell or per-object colour variation is kept.
- Outlines are drawn in a darker tone of each object's own colour, at a width that prints at `outline_pt` at the placed size. Small parts get lighter lines.
- Glass becomes a light tint with an outline.
- The soft floor shadow becomes one flat contact shadow (or none).
- There is no denoiser blur, and there are enough pixels for 600 dpi.

To switch it on, put `use_style('illustration', fig_width_mm=<width passed to L.image, in mm>)` before the kit's setup call. The alternatives are `setup(..., style='illustration', illustrate={...})`, or `SCHEMATIC_3D_STYLE=illustration` in the environment. `finish()`, the anchors and `L.image` placement are unchanged. Options (`illustrate_scene` in `scene.py`) are `outline_pt` (0.5), `bands` (2–4), `grade` (band softness), `light`, `palette` (a remap or snap list of the figure's colours), `shadow` (`'contact'` or `'none'`), `ao`, `highlight`, `texture` and `through`. Use it for every hero that sits beside flat panels. Leave it off only for a figure whose other panels are photographic too. The demos render both versions: `blender -b --factory-startup -P demo/render3d_<kit>.py -- --illus` writes `demo/art/*_illus.png`.

## Missing something?
If a part isn't here, draw it in `figure/parts.js` (your own module; import nothing from outside `engine/`), and draw it from a reference image you looked at (SKILL.md, step 3). Record it in `docs/library-gaps.md`: the next skill version turns repeated gaps into library parts.

## Domain part libraries

Import the module for your domain beside the core library: `import * as D from '../engine/<domain>.js'` (from `figure/figure.js`). Each has its API page and a demo that draws every part (`demo/<domain>.js`, render it to see them):

| Module | API | Parts |
|---|---|---|
| `engine/bio.js` | `reference/lib-bio.md` | 59 parts: cells (shaded or flat BioRender, lineage palettes), cell clusters, macrophage, dendritic cell, bacterium, virus, LNP, bilayers along any curve, vesicles, antibodies, CAR stacks, receptors, channels, protein glyphs, mitochondria, DNA, nucleosomes, lungs, clinical props (syringe, IV bag, body), pathway arrows, cytoskeleton (microtubule, actin, coiled coil, two-headed motors), plants and ground (trees, roots, stump, soil), AFM cantilever, laboratory mice (four poses), a sagittal mouse brain with region ports, region blobs, optogenetic cannula, tissue in section (cell layers along any curve, lumens, porous membranes, culture wells with a Transwell insert, cobblestone sheets) |
| `engine/chem.js` | `reference/lib-chem.md` | 35 parts: skeletal molecules (wedge/hash/dash bonds, stubs, coloured labels), catalytic cycles, reaction and curly arrows, brackets, scheme boxes, electrochemical cells, tubes, pumps, reservoirs, ions and solvation shells, stipple fills, span arrows, shaded ball atoms and space-filling small molecules (for SMILES use `tools/molecule.py` + `L.svgFile`) |
| `engine/cs.js` | `reference/lib-cs.md` | 26 parts: block stacks with per-item widths, repeat frames, residual taps, operator nodes, padlock/flame badges, pill modules, tensor and memory bars, table grids, U-Net columns, routing |
| `engine/qc.js` | `reference/lib-qc.md` | 31 parts: circuit wires, gates, CNOT/CZ, meters, kets, check badges, Tanner and code lattices, surface-code patches, torus frames, oblique electrode boxes and trap rails, ions, laser beams |
| `engine/ind.js` | `reference/lib-ind.md` | 32 parts: P&ID instruments, valves, pipes with standard line styles, columns with taps, vessels, feeders, filters, flowsheet equipment, pumps, compressors, heat exchangers, batteries, light bulbs, flow-field plates in perspective, dense fibre mats, layer-stack cross-sections with a material palette, callouts |

Typography: `STYLE.font.latex` ('Latin Modern Roman', bundled in `fonts/`) matches LaTeX-typeset figures (quantum circuits, CS papers); pass `{family: STYLE.font.latex}` to `L.text`. It has the bracket glyphs (⟨ ⟩) other serif fonts lack.

Strokes inside a scaled group: the gate checks the rendered width, so divide the intended width by the group's scale (a 0.35 pt line in a group scaled 0.25 needs width 1.4).

---

### `skills/schematic-figure/reference/lib-bio.md`
# Bio parts (engine/bio.js)

Import in a figure as `import * as D from '../engine/bio.js'` (path relative to the figure). Same conventions as `L`: parent first, units of the parent, returns `{node, ports, ...}`; `{F, name}` registers `name.<port>` anchors. Every stroke is held at or above the 0.25 pt floor even inside a scaled group, so a part can be drawn in a `L.group(p, {scale})` (replicate mode, reference-pixel units) without converting widths by hand. Arrowhead sizes (`head`, `headWidth`) are in the parent's units. Demo of every part: `demo/bio.js`.

Palettes: `D.BIO` is the default muted blue-grey set (`cell, tumour, receptor, virus, capsid, rna, lipid, body, outline, paper, liquid`). `D.LINEAGE` (also `D.BIO.lineage`) holds flat immunology presets `{fill, stroke, nucleus, nstroke}`: `t` (green), `b` (blue-teal), `myeloid` (lavender), `nk`, `tumour`, `grey`, `red`. Pass `palette: 't'` or your own object.

Illustrated finish: pass `illustrate: true` (or `{light, contrast, shadow, ...}`) to `D.cell`, `D.cellCluster`, `D.cellLayer`, `D.lumen`, `D.cellSheet`, `D.mouse`, `D.brainSagittal`, `D.cytokines` and `D.tree`, or set `figure.illustrate = true` to turn it on everywhere (`reference/lib-api.md`, "Illustrated style layer"). The same options still apply. Each part gains gradient shading from its one fill colour, a darker rim of the same hue, rim light, a highlight, organic outlines and seeded per-instance variation. Repeated cells, tissue cells and particles are never identical copies. Demo: `demo/illustrated.js`, flat and illustrated side by side.

## Figure types

Tags after each part say which figure types it suits:
- **[R]** shaded review figure (Nature Reviews, cell therapy, virology): gradients, rim light, muted palette.
- **[B]** flat BioRender-style overview (immunology): one fill, thin darker ring, lineage colours.
- **[P]** pathway / signalling cartoon: solid fills, black outlines, labelled glyphs, small arrows.
- **[C]** clinical or process overview: devices, people, organs, zoom insets.
- **[M]** molecular close-up (membrane, synapse, receptor domains).

## Cells and microbes

- `D.cell(p, cx, cy, r, {fill, stroke, width, palette, flat, nucleus: false | {r, dx, dy, color, stroke}, highlight, rim, lobes, jitter, ruffle, bumps, seed, vesicles, receptors: {angles | n, kind, size, color, opacity, style, stalk}})` → `{node, ports, at(angle, dr)}`. Cell. By default a shaded sphere with rim light, specular highlight and an eccentric nucleus **[R]**. Use `flat: true` (with `palette`) for a flat disc with a membrane ring and a flat ringed nucleus **[B]**. `lobes`/`jitter` give an irregular outline and `ruffle`/`bumps` a bumpy membrane (tumour cells). `vesicles` scatters pale granules. `receptors` places `D.receptor` around the membrane. `at(a)` returns the membrane point at angle `a` (deg). Ports `center, left, right, top, bottom`.
  - Illustrated (`illustrate: true`): the outline wobbles organically (`wobble`, a fraction of r, default 0.035), and each cell takes its own tint, aspect and turn from its seed (`vary: false` turns that off). The nucleus is an irregular shaded blob with a nucleolus and chromatin. `flat: true` keeps a lower contrast, and `shadow: 'drop'` adds a soft shadow.
- `D.cellCluster(p, cx, cy, R, {n, r, sizeVar, overlap, aspect, seed, colors, ...cell opts})` → `{node, cells: [{x, y, r}], ports}`. A clump of `n` cells (default 12): a spheroid, organoid, colony or tumour nest, packed inside an ellipse of radius `R` (`aspect` stretches it along x).
  - Each cell has its own size (± `sizeVar`, default 0.14) and seed. The cells are relaxed so that neighbours overlap a little (`overlap` is centre distance over the sum of radii, default 0.86), then drawn top to bottom. `colors` cycles the fills.
  - Every other option goes to `D.cell`. With the illustrated finish on, each cell also gets its own outline, tint and nucleus. Ports `center, left, right, top, bottom`. **[R][B]**
- `D.macrophage(p, cx, cy, r, {palette, fill, stroke, width, seed, vesicles, nucleus})` → `{node, ports}`. Flat macrophage with a scalloped, ruffled membrane, vesicle dots and a round nucleus. **[B]**
- `D.dendritic(p, cx, cy, r, {palette, fill, stroke, width, arms: [[angle, len/r, bend, fork?], ...], nucleus})` → `{node, ports}`. Stellate dendritic cell: curved, tapering, partly forked dendrites under one merged outline; the dendrites reach about 2.3 r. **[B]**
- `D.bacterium(p, a, b, w, {fill, stroke, width, highlight, flagella, seed})` → `{node, ports}`. Rod bacterium (bacillus) from `a` to `b`, width `w`, with a glossy highlight and optional wavy flagella at the rear pole. Ports `a, b, center`. **[B][C]**
- `D.virus(p, cx, cy, r, {spikes, spikeLen, tip: 'knob' | 'club' | 'trumpet' | 'fork' | 'none', genome: 'coil' | 'segments' | 'none', wiggle, waves, color, core, rna, seed})` → `{node, ports}`. Enveloped virion: spiked envelope, pale capsid, and a wavy single-strand genome (or a segmented one) that never collapses. **[R][C]**
- `D.cellRegion(p, membrane, closeVia, {closed, fill, nucleus: {cx, cy, r, fill, stroke}, membrane: {bilayer opts} | 'line' | false, stroke, width})` → `{node, inner, d, membrane, ports}`. A cell drawn as a region, not a sphere. The cytoplasm is bounded by a smooth membrane curve and by straight edges through `closeVia` (e.g. page corners), so the frame can crop the cell. The membrane is a `D.bilayer` by default. Draw content into `inner`: it is clipped and sits under the membrane. Ports `start, end, center`. **[M]**
- `D.halo(p, cx, cy, r, {color, opacity})` → `{node}`. Soft activation glow that fades to transparent. Draw it before the cell. **[B]**
- `D.cytokines(p, x, y, angle, len, {style: 'cone' | 'cloud', spread, cols, n, r, color, seed})` → `{node}`. Burst of secreted particles: a widening cone of dots along `angle`, or a random cloud of radius `len`. **[B][P]** With `illustrate: true` each dot is a small shaded ball with its own size and tint.

## Receptors and proteins

- `D.receptor(p, x, y, angle, size, {kind: 'car' | 'antibody' | 'tcr' | 'stalk', style: 'flat', color, stroke, flip, spread, stalk, opacity})` → `{node, tip}`. Membrane-decoration icon at a membrane point, pointing along the outward normal `angle`. `car`: a stalk and two scFv capsules inside one hairpin linker; `flip` mirrors it (cells set this on their left half). `antibody`: a three-capsule Y; with `style: 'flat'` it becomes the flat IgG of `D.antibody`. `tcr`: paired alpha/beta banded chains on white-cored stalks. Never use a CAR to stand in for a TCR. **[R][B]**
- `D.antibody(p, x, y, angle, s, {style: 'chains' | 'flat', heavy, light, color, hinge, width, stalk, spread, opacity})` → `{node, ports}`. IgG Y with the Fc base at `(x, y)`, pointing along `angle` (−90 = up), total length `s`. `chains` is the textbook antibody **[R][M]**: two dark heavy chains of four domains, two pale light chains of two domains, and hinge threads. `flat` is the BioRender icon **[B]**: one colour with a pale inner stripe; `stalk` adds a membrane stalk and `opacity` fades a secreted copy. Ports `base, fc, hinge, fabL, fabR, tip`.
- `D.carStack(p, x, y, s, {flip, costim: 1 | 2, itams, flat, colors: {vh, vl, linker, tm, costim, costim2, cd3z, itam}})` → `{node, ports}`. CAR drawn as a domain stack for close-up figures. The TM domain is centred on the membrane at `(x, y)`, with co-stimulatory and CD3ζ domains below (CD3ζ carries ITAM bands). A hinge curve rises to tilted VH and VL bars joined by a linker loop. `s` = bar width; the stack is about 17 s tall and reaches about 6.4 s to the side. Ports sit on the bar edges for leader lines: `vh, vl, scfv, linker, hinge, tm, costim (costim1, costim2), cd3z, itam, top, bottom`. **[M]**
- `D.domain(p, cx, cy, w, h, rot, {fill, flat, hi, r, stroke, width, bands: [{at, h, color}]})` → `{node, ports}`. Rounded protein-domain bar with a soft radial highlight, long axis `rot` deg from vertical. `bands` are stripes across the bar (ITAMs, motifs): `at` is the position and `h` the thickness, both as fractions of the length. Ports `center, top, bottom, left, right`. **[M][P]**
- `D.phospho(p, x, y, r, {color, label, textColor, size})` → `{node}`. Phosphate tag: glossy red sphere with a "P". The letter is 1.5 r, so keep it at 5 pt or more at print size. **[M][P]**
- `D.channel(p, cx, cy, [ax, ay], {n, center, r, R, ry, capRy, phase, view: 'below' | 'above', fill, stroke, width})` → `{node, ports}`. Pore or channel complex (perforin, ion channel, MAC): a bundle of `n` cylinders around an optional centre cylinder. The base centre is at `(cx, cy)` and the axis vector runs from base to top. `below` shows the base caps, `above` the top caps. Ports `base, top, center`. **[M][P]**
- `D.protein(p, cx, cy, w, h, {shape: 'ellipse' | 'blob' | 'octagon' | 'hexagon' | 'capsule' | 'star' | 'lumpy', fill, stroke, width, rot, label, size, color, seed, points})` → `{node, ports}`. Labelled flat molecule glyph with solid fill and dark outline. Overlap several to show a complex (ULK, PI3K); `star` marks damage or ATP. `lumpy` is an irregular seeded outline for a small unlabelled protein, such as one adsorbed on a surface; show a lit or unlit state with `fill` and `stroke`. Ports `center, left, right, top, bottom`. **[P][M]**
- `D.lipidAnchor(p, a, b, {head, r, fill, stroke, headFill, width, halfWidth})` → `{node}`. Lipid tail as two linked rhombi from `a` to `b` (PI3P, LC3–PE), with an optional hexagon head at `a`. **[P]**
- `D.aggregate(p, cx, cy, w, h, {color, seed, width})` → `{node}`. Tangled protein aggregate: a looping curve inside a w × h ellipse. **[P]**
- `D.vatpase(p, x, y, angle, len, {rod, knob, stroke})` → `{node, tip}`. V-ATPase or membrane pump: a rod of two capsules with a clover knob sitting at `(x, y)`, pointing outward along `angle`. **[P]**

## Membranes and organelles

- `D.bilayer(p, pts, {closed, half, r, step, head, headStroke, headWidth, tail, tailWidth, tailOff, wave, waves, midGap, band, leaflets: [1, -1]})` → `{node, d, length, ports}`. Lipid bilayer along any smooth curve through `pts`. Round heads are packed evenly along each leaflet's own offset curve, so they stay packed around bends. Each head has two wavy tails, and a band (white by default; `band: false` for none) runs between the leaflets. `half` = centre line to head centre; every other size scales from it. `leaflets: [1]` draws one leaflet only. Ports `start, mid, end`. **[M]**
- `D.sampleCurve(p, pts | d, step, closed)` → `{d, pts: [{x, y, tx, ty}], length}`. Samples a smooth curve by arc length, with unit tangents, for placing anything along a membrane.
- `D.vesicle(p, cx, cy, r, {ry, fill, stroke, width, double: false | true | gap, inner: 'solid' | 'dashed', innerFill, bud: true | {angle, r, d}})` → `{node, inner, ports}`. Vesicle, lysosome or autophagosome. `double` adds a second membrane (autophagosome), `inner: 'dashed'` a dashed inner membrane (autolysosome), and `bud` a lobe merged into one outline. Draw cargo into `inner` (clipped). Ports `center, left, right, top, bottom, bud`. **[P][B]**
- `D.crescent(p, a, b, {bulge, thick, fill, stroke, width})` → `{node, ports}`. Phagophore or curved membrane sheet from `a` to `b`. It bulges to the left of a→b by `bulge` (negative bulges right) and tapers to points at both ends. Ports `a, b, apex, inside`. **[P]**
- `D.mitochondrion(p, cx, cy, w, h, tilt, {style: 'folds' | 'star', folds, body, cristae, stroke, width})` → `{node, ports}`. Flat mitochondrion. `folds`: outer and inner membrane with finger-like cristae alternating from both sides (textbook). `star`: zig-zag star cristae (pathway cartoon). **[P][B]**
- `D.lnp(p, cx, cy, r, {heads, tails, bilayer, color, core, cargo, cargoKind: 'mrna' | 'dna' | 'drug', rna, seed})` → `{node, ports}`. Lipid nanoparticle: a shell of head groups with sparse curved tails and `cargo` items in the core (mRNA coils, DNA helices or drug dots). `bilayer: true` gives a liposome. **[R][C]**

## Nucleic acids and chromatin

- `D.mrna(p, a, b, {style: 'coil' | 'wave', amp, turns, color, width, cap, tail})` → `{node}`. mRNA strand from point `a` to `b`: `coil` loops like a phone cord, `wave` is a sine. `cap` puts a 5′ cap dot at `a`; `tail` adds a straight poly(A) tail past `b` (true, or a fraction of the length). **[R][C]**
- `D.dna(p, x0, x1, cy, {amp, period, shear, offset, c1, c2, paleEnds, angle})` → `{node}` (alias `D.helix`). Ribbon double helix along x, rotatable with `angle` about `(x0, cy)`. Front half-turns are dark (`c1`) and back half-turns pale (`c2`). The strand offset (default 0.36 turn) gives major and minor grooves; 0.5 reads as a row of X's. `paleEnds` tapers the end pieces. **[R][M]**
- `D.nucleosome(p, cx, cy, R, {rot, wraps, histone, face, dna})` → `{node, ports}`. Histone drum seen at an angle, with dark DNA bands wrapped around it. Draw the linker DNA as a plain `L.line` behind it. Ports `center, left, right, top, bottom`. **[B][P]**
- `D.lollipop(p, base, head, r, {color, stick, width})` → `{node}`. Stick-and-ball mark (methyl, acetyl, glycan) from `base` to a ball at `head`. **[B][P]**

## Cytoskeleton and motors

Demo: `demo/bio-motors-trees.js` panels a and b.

- `D.microtubule(p, x0, x1, y, {d, monomer, rows, stagger, alpha, beta, stroke, width, angle})` → `{node, ports, sites}`. Side view of a microtubule, diameter `d`, from the minus end (`x0`) to the plus end (`x1`).
  - `rows` visible protofilaments (default 5) of alternating α/β tubulin beads cross the front half of the cylinder. They are foreshortened and darker toward the edges, and each row is shifted by `stagger` monomers (the helical lattice). β is exposed at the plus end.
  - `rows: 1` is one flat protofilament, a 1D track for physics-model figures.
  - `sites` lists the α/β interfaces on the top edge, where a motor head binds. Stand a `D.motor` head on them.
  - `angle` rotates the filament about `(x0, y)`. Ports `minus, plus, center, top, bottom`. **[M][P]**
- `D.actin(p, x0, x1, y, {r, crossover, colors: [c1, c2], stroke, width, angle})` → `{node, ports, beads}`. F-actin from the pointed (minus, `x0`) to the barbed (plus, `x1`) end: two strands of beads of radius `r` twisting round each other. The strands cross every `crossover` beads (default 6.5, as in F-actin), and back beads are paler and smaller. `beads` lists the subunit centres. Ports `minus, plus, center, top, bottom`. **[M][P]**
- `D.coiledCoil(p, a, b, {turns, amp, colors: [c1, c2], width, back})` → `{node}`. Two α-helical strands wound round each other from `a` to `b`: a motor stalk, tropomyosin or a SNARE bundle. Each strand is split where it passes behind the other, and the pieces behind are drawn first and paler (`back` = lightening, 0–1). **[M]**
- `D.motor(p, [head0, head1], junction, tail, {kind: 'kinesin' | 'myosin' | 'dynein', r, bound: [b0, b1], fill, boundFill, stroke, width, linker, stalkWidth, stalkAngle, labels, size, turns, colors})` → `{node, ports}`. Two-headed motor protein. The heads sit at the given centres. Neck linkers (kinesin), lever arms (myosin) or linkers (dynein) meet at `junction`, and a `D.coiledCoil` stalk runs on to `tail`, where cargo attaches.
  - Heads by kind: kinesin heads are ellipses 2.7 r wide. Myosin heads are elongated along the lever. Dynein heads are rings of six AAA+ domains with a stalk and binding knob along `stalkAngle` (deg, default 90 = down the page).
  - `bound: [true, false]` fills the clamped head with `boundFill` (dark). `labels` puts text on the heads (white on a bound head).
  - Ports `head0, head1, foot0, foot1` (where each head meets the track), `junction, tail`. **[M][P]**

## Plants and ground

Demo: `demo/bio-motors-trees.js` panel b.

- `D.tree(p, x, yg, h, {kind: 'broadleaf' | 'conifer' | 'palm' | 'seedling', k, rc, H, h0, ghost, ghostColor, dash, fill, dark, trunk, stem, tiers, fronds, lean, seed, roots: true | {depth, n, spread, color, branch}})` → `{node, ports, rc, cy, top}`. Flat side-view tree standing on the ground at `(x, yg)`, total height `h`.
  - Crown size follows an allometry: crown radius `rc = k · h0 · (h / h0)^H`. `h0` defaults to `h`, which makes `H` inert; pass one shared `h0` to every tree so the crowns scale with height.
  - Kinds: `broadleaf` is a lobed dome over a darker underside, on a tapered trunk with a base flare. `conifer` is stacked tiers. `palm` is a curved, ringed trunk with drooping fronds. `seedling` is a stem with two leaves.
  - Illustrated (`illustrate: true`): a broadleaf crown becomes one wobbled silhouette, shaded, with clumps modelled by soft light and dark spots and a few clump lines, on a trunk shaded across. Conifer tiers are shaded, and each tree takes its own tint from its seed.
  - `ghost: true` draws the outline only, dashed. Use it for a later growth stage drawn over the present tree.
  - `roots` adds a `D.roots` fan below the stem. Ports `base, top, crown, left, right`. **[B][C]**
- `D.roots(p, x, yg, depth, {n, spread, color, width, branch, seed, opacity})` → `{node, tips}`. A fan of `n` tapering roots over ±`spread` degrees from straight down; the central roots are longest. Each root carries one lateral; `branch: false` drops the laterals. **[B]**
- `D.stump(p, x, yg, w, {h, fill, top, rings, stroke})` → `{node, ports}`. Cut stump, base width `w`: the cut face is an ellipse, with optional growth `rings`. Ports `base, top, left, right`. **[B]**
- `D.ground(p, x0, x1, y, {depth, soil, soilDeep, surface, width, cleared: [[xa, xb]], clearedFill, grass, grassColor, seed})` → `{node, ports}`. Flat ground: a soil band that fades with depth, a surface line, cleared patches (a pale strip on the surface) and grass tufts (`grass`: a count or `true`). Ports `left, right, center, soil`. **[B][C]**

## Devices, people, organs, insets

- `D.cantilever(p, x0, x1, y, {t, tipH, tipW, bend, fill, chip, chipW, chipH, chipFill, stroke})` → `{node, ports, apex}`. AFM cantilever in side view: chip at `x0`, beam to the free end at `x1`, and a pyramidal tip under the free end. `bend` lifts the free end by that many units, and the tip stays normal to the bent beam. Ports `apex, base, free, back` (`back` is the laser spot on the top face, for an optical-lever readout). **[M][C]**

- `D.syringe(p, tip, angle, len, {fill, level, ticks, color, stroke, bevel, aspect})` → `{node, ports}`. Syringe with its bevelled needle tip at `tip` and body along `angle` (deg). Liquid fills to `level` (0–1) and the plunger seal sits at the liquid. Ports `tip, center, end`. **[C]**
- `D.ivBag(p, x, y, w, h, {to, via, radius, fill, level, color, stroke, tube, content})` → `{node, ports}`. IV bag (top-left at `x, y`) with hanger hole, liquid level and drip chamber. Its line runs through the `via` points (rounded corners) to `to`. `content(g, cx, cy, w, hLiquid)` draws into the liquid, clipped to the bag (e.g. cells). Ports `top, outlet, end, center`. **[C]**
- `D.human(p, cx, top, h, {armAngle | [left, right], shoulders, waist, hips, color, stroke, width})` → `{node, ports}`. Front-view silhouette (7.6 heads tall). `armAngle` (deg) sets the arms away from the body, and the hands have a thumb. `shoulders`, `waist` and `hips` scale the build (1 = default). Ports `head, chest, leftHand, rightHand, leftArm, rightArm, feet`. **[C]**
- `D.humanBust(p, x, y, h, {facing: -1 | 1, arm: 'forward' | 'down' | 'none', fill, stroke, width, ear})` → `{node, ports}`. Upper body in profile, outline style, crown at `(x, y)`, `h` from crown to waist. It has a face profile, a curved neck-to-shoulder line, an open bottom edge, and an arm resting forward or hanging. Ports `head, face, shoulder, arm, hand, chest`. **[C]**
- `D.lungs(p, cx, top, h, {fill, fold, fissure, airway, stroke, trachea})` → `{node, ports}`. Flat lungs with a ringed trachea, larynx and bronchi, lobe fissures and the cardiac notch. `cx` = midline, `top` = larynx top, width about 0.84 h. Ports `top, trachea, left, right, leftEdge, rightEdge, bottom`. **[B][C]**
- `D.zoomCircle(p, [tx, ty, tr], [cx, cy], R, {stroke, width, dash, fill})` → `{node, inner, ports}`. Magnifier: a small circle on the target, a big circle and two tangent lines. Draw the detail into `inner` (clipped to the big circle); the rim stays on top. Ports `target, center, left, right, top, bottom`. **[C][R]**

## Pathway arrows

- `D.curveArrow(p, pts, {end: 'arrow' | 'bar' | 'none', head, headWidth, bar, width, color, dash, F, from, to, kind})` → `{node}`. A line (2 points), quadratic (3), cubic (4) or smooth curve (more) ending in a small filled head or a flat T-bar (inhibition). `{F, from, to}` records the drawn relation for the gate (kind `inhibits` for bars). **[P]**
- `D.taperArrow(p, pts, {w0, w1, head, headWidth, color, fade, F, from, to, kind})` → `{node}`. Filled wedge arrow along a line or Bézier (2–4 control points), widening from `w0` to `w1`. `fade: true` (or a fraction 0–1) fades the tail in from transparent. **[B]**
- `D.mergeArrow(p, froms, join, to, {color, width, head, F, fromNames, toName, kind})` → `{node}`. Several inputs curve into one join point, then one arrow runs on to `to`. With `{F, fromNames, toName}` every input is recorded as a drawn relation. **[C][P]**

## Laboratory animals and neuroscience

Demo: `demo/assorted-parts.js` panels a to c. Stimulus glyphs (`L.bolt`, `L.cloud`, `L.lamp`) and the open arena (`L.wireBox3`) are in the core: `reference/lib-api.md`.

- `D.mouse(p, x, y, len, {pose: 'walk' | 'run' | 'crouch' | 'top', facing: 1 | -1, angle, tail, tailPose: 'down' | 'straight' | 'raised' | 'curl', fill, stroke, width, whiskers, fur})` → `{node, ports}`. Laboratory mouse in outline style, `len` from rump to nose. **[C]**
  - Side poses stand on the ground at `(x, y)`, the point under the middle of the body, and face +x (`facing: -1` mirrors). `walk` is the standard side view, `run` a stretched gallop with the legs reaching, `crouch` a hunched, immobile mouse with its belly on the ground. `top` is seen from above with `(x, y)` at the body centre (the open-field or tracking view).
  - `tail` is the tail length as a fraction of `len` (default 0.85). Each pose has its own tail (`walk`, `crouch`: trailing to the ground; `run`: straight back; `top`: wavy); `tailPose: 'raised'` gives the S-shaped raised tail of a frightened mouse. `fur: true` bristles the back.
  - `angle` rotates the mouse about `(x, y)`. A rat is the same drawing scaled up; there is no separate rat.
  - Ports `nose, eye, ear, head` (the skull top, where an implant or cannula goes), `back, rump, tail` (tip), `chest, ground, center`.
  - Illustrated (`illustrate: true`): a shaded fur body with a highlight along the back, fur strokes and a shaded haunch. The ears, feet, nose and tail are pink (`skin`), the eye has a glint, and a soft ground shadow sits underneath (`shadow: false` drops it). `fill` is the fur colour: default a light cool grey, `'#fff'` an albino white, a dark grey such as `'#5b5d66'` a C57BL/6.
- `D.brainSagittal(p, x, y, w, {facing, fill, stroke, width, cerebellum, arbor, regions: true | [names], regionFill, regionStroke, dash, labels, size, labelColor})` → `{node, ports, regions, at(u, v), h}`. Sagittal outline of a mouse brain in the box `x..x+w`, `y..y+h` (`h` = 0.43 w), anterior on the left (`facing: 1` puts it on the right). **[C][P]**
  - It draws the olfactory bulb, cortex, the corpus callosum arc, the midbrain roof, a lobed cerebellum with pale arbor vitae (`cerebellum: false` drops it) and the brainstem.
  - Illustrated (`illustrate: true`): shaded tissue in pale pink (`fill`), with rim light and a highlight laid under the interior lines, and darker region blobs. `shadow: true` adds a soft drop shadow.
  - `regions` draws pale blobs for `ACC, mPFC, LHb, PAG, BNST, BLA, NAc, MS, VP, LPO, HY, VTA` (`true` = all, or a list), and `labels: true` names them at their centres. The blobs sit where circuit-review schematics put them, not at atlas coordinates.
  - Every region centre is a port whether it is drawn or not, so `D.curveArrow` can join them: `br.ports.BLA`. Gross ports: `ob, ctx, cb, bs, mb, top, bottom, front, back`. `regions` returns `{name: {d, center}}`; `at(u, v)` maps fractions of the box, for placing further regions with `D.region`.
- `D.region(p, pts, {fill, stroke, width, dash: true | pattern, tension, label, size, color, labelAt})` → `{node, d, ports}`. A closed smooth blob through `pts`: a nucleus, a zone or a projection target. `dash: true` gives the dashed outline of a target area ('1.2 0.9'). The label sits at the centroid or at `labelAt`. Ports `center, top, bottom, left, right`. **[P][C]**
- `D.cannula(p, x, y, {angle, w, h, fibre, fibreW, fibreFill, collar, body, light, glow, spread, glowLen, glowFibre})` → `{node, ports}`. Optogenetic fibre-optic cannula in side view: a shaded metal ferrule `w` wide and `h` long, a collar, the bare fibre (length `fibre`) and a fading cone of light from its tip. **[C]**
  - `(x, y)` is the fibre tip, the implant target; `angle` is the direction of the fibre (deg, default 90 = pointing down).
  - `light` is the light colour: 473 nm blue by default, `'#f5b400'` for yellow. `spread` is the cone half-angle (deg, default 14); `glow: false` drops the cone and `glowFibre` lights the fibre too.
  - Ports `tip, top` (the ferrule top, for a patch cord), `ferrule, cone`.

## Tissue in section

Demo: `demo/assorted-parts.js` panels d and e. Palettes: `D.BIO.tissue.epi` (blue epithelium) and `D.BIO.tissue.endo` (yellow endothelium), `{fill, light, stroke, nucleus, nstroke}`.

- `D.cellLayer(p, pts, {kind: 'dome' | 'squamous' | 'cuboidal' | 'columnar', h, n, pitch, gap, side: 1 | -1, closed, smooth, trim, fill, light, stroke, width, gradient, nucleus, nucleusFill, palette})` → `{node, cells, ports}`. A cell layer standing on the base curve through `pts` (a basement membrane, a porous support, a channel wall). **[B][C]**
  - Kinds: `dome` is epithelium with a flat base and a domed, shaded apex; `squamous` is flat endothelial capsules; `cuboidal` and `columnar` are rounded blocks (h about w, and h > w). Cells are `h` tall.
  - `side: 1` puts the cells on the left of travel as seen on the page: above a row drawn left to right, outside a circle drawn clockwise. `-1` puts them on the other side (endothelium under a membrane, cells lining a lumen).
  - The layer is split into `n` cells, or cells about `pitch` long (defaults 2.2 h dome, 4.5 h squamous, 1.1 h cuboidal, 0.55 h columnar); `gap` is the fraction of each slot left empty. Cells bend with a curved base.
  - `smooth: false` treats `pts` as a polyline and fills each straight side separately, for a rectangular lumen. `trim` (a distance or `[start, end]`) shortens each side; a closed polyline defaults to `[h, 0]`, so cells inside the outline meet once at each corner. Pass `trim: 0` when the cells are outside it.
  - `palette` is `'epi'` (default) or `'endo'` (the squamous default), or your own object. `cells` lists `{center, base, top}` per cell. Ports `start, end, mid`.
  - Illustrated (`illustrate: true`): cell boundaries are jittered by ±12 % of a slot, and each cell has its own height (±10 %), a slight apex lean, a wobbling outline with its base pinned to the curve, and its own tint. The nucleus has its own position, size and turn. `seed` changes the draw and `contrast` (default 0.7) the shading depth. `D.lumen` and the `D.wellSection` insert cells pass `illustrate` through.
- `D.lumen(p, cx, cy, r, {kind, t, n, lumen, backing, label, size, color, ...cellLayer opts})` → `{node, ports, inner}`. A vessel, tubule or duct in cross-section: a ring of cells `t` thick (default 0.28 r) lining a circle of outer radius `r`, apical side toward the lumen, which is filled with `lumen` (default pale blue, flow). `kind` defaults to `squamous` (endothelium); `dome` or `cuboidal` gives epithelium. `backing` fills the gaps between cells (default the cell stroke colour; `false` for none). `label` is centred in the lumen; `inner` is the lumen radius. Ports `center, top, bottom, left, right`. **[B][C]**
- `D.porousMembrane(p, x0, x1, y, h, {pitch, pore, fill, poreFill, stroke, width, phase})` → `{node, ports}`. Track-etched porous membrane (Transwell, organ-on-chip) in section: a green band from `x0` to `x1`, top at `y`, `h` thick, cut by dark pores `pore` wide (default 0.45 h) every `pitch` (default 3.5 h). Ports `top, bottom, center, left, right`. **[B][C]**
- `D.wellSection(p, x, y, w, h, {wall, floor, level, body, medium, stroke, width, insert: true | {w, gap, wall, level, membrane, pitch, cells, endothelium, color}})` → `{node, ports, cavity, insert}`. A culture well in cross-section: a grey body (outer box `x, y, w, h`) with walls `wall` thick on a `floor`, and medium filled to `level` (a fraction of the cavity depth). **[C]**
  - `insert` hangs a Transwell cup whose flanges rest on the rims. Its porous membrane sits `gap` above the well floor and carries a dome epithelium (`cells: false` for none, or `cellLayer` options). `endothelium: true` adds squamous cells under the membrane.
  - `cavity` is `{x0, x1, y0, y1}`; `insert` is `{x0, x1, y}` (inner edges and membrane top). Ports `floor, medium, rimL, rimR`, and with an insert `apical, basal, membrane`.
- `D.cellSheet(p, quad, {nu, nv, rx, ry, fill, stroke, width, nucleus, nucleusFill})` → `{node, cells}`. A cobblestone monolayer seen in 3-D on a receding surface: `nu × nv` staggered cells in the page quad `[p00, p10, p11, p01]`, rows drawn in order of v (put the far edge at v = 0). Draw it on a chip or well floor given by a face mapper's corners. **[B][C]** With `illustrate: true` each cell is an organic blob of its own size, turn and tint, shaded, with a jittered nucleus (`seed`).

Not yet: an energy landscape drawn over a track (compose `L.sample` + `L.smooth`), organs other than the lungs and brain (heart, liver, gut, lymph node), a coronal brain section, a rat distinct from the mouse, rearing and front-facing mouse poses, branched vessel networks, a miniature metabolic-map convention for labels below 5 pt, fingers on the bust hand, human poses other than standing and seated profile, and a left-aligned step-label box (core `L.box` centres its text; draw it with `L.rect` + `L.text`).

## Field conventions

What a reader in this field checks first, from published figures tagged in 2026-09. Codes such as bio-09 name benchmark figures, which are not distributed.

Biology figures contain no plots. The common look is airbrushed review-journal cartoons: soft-shaded protein blobs; cytoplasm as a pale lavender or grey gradient; lipid bilayers drawn as two rows of small round heads with paired tails; curved grey mechanism arrows; labels in cream or pale-grey boxes (bio-01, bio-02, bio-17, bio-06). A second look is the BioRender icon kit: stock cells, organs and receptors on white, often teal against coral, with dark header bars splitting two conditions (bio-09, bio-12, bio-10). Textbook line art is a third option (bio-13, bio-14). Other conventions: DNA is a helix ribbon or a ladder with 5' and 3' ends marked (bio-07). Gene constructs are a line with bent-arrow promoters and coloured boxes (bio-11). A T-bar means inhibition and an arrowhead means activation. Gene names are italic and protein names roman, in sans type at 6-8 pt. Readers notice first wrong topology (a transmembrane protein that does not cross the bilayer, a nucleus without its double membrane), a T-bar where an arrow belongs, and a cell drawn at protein size.

---

### `skills/schematic-figure/reference/lib-chem.md`
# Chemistry parts (engine/chem.js)

Import in a figure as `import * as D from '../engine/chem.js'`. Units are pt. Every part takes the parent first and returns `{node, ...}`. **Angles are screen degrees**: 0 is right, 90 is down, -90 is up, and a larger angle runs clockwise. Demo: `demo/chem.js` draws every part (panels a to g).

**Figure types** (tags after each part):
- **[cycle]**: catalytic or photoredox mechanism schemes.
- **[scheme]**: reaction and methodology schemes (ChemDraw style).
- **[mech]**: arrow-pushing mechanisms.
- **[cell]**: electrochemistry, flow battery and process schematics.
- **[interface]**: double-layer, solution and surface figures.
- **[any]**: all of the above.

**Molecule data** uses unit bond length with y pointing down: `{atoms: [[el, x, y, hs] | {el, x, y, hs, charge}], bonds: [[i, j, order, stereo?] | {i, j, order, stereo}]}`. RDKit has no browser build, so export the data at build time. Kekulise, run `Compute2DCoords`, then write per atom `GetSymbol()`, x, **−y** and `GetTotalNumHs()`, and per bond the two atom indices and `int(GetBondTypeAsDouble())`. Mark an attachment point with a `*` atom. Coordinates are rescaled to a mean bond length of 1.

## Text
- `D.chemText(p, x, y, str, {formula, stack, ...L.text opts})` [any]. This is `L.text` with four additions:
  - `\*` gives a literal asterisk (JS source `'Ir^{III\\*}'`).
  - `formula: true` subscripts counts (`CO2H`, `Ni(COD)2`).
  - A subscript directly followed by a superscript is **stacked** at one x (`VO_{2}^{+}`, `SO_{4}^{2−}`); pass `stack: false` to run them on.
  - Runs of spaces are kept.

  Colour single atoms with the core markup, e.g. `'Ar-{#0033CC|N}H2'` or `'**{#E00000|C}-to-{#0033CC|X}**'`.
- `D.formula(str)` [any]: returns the formula-subscripted string. Colour codes inside `{#rrggbb|…}` are left alone.

## Skeletal formulas and metal centres
- `D.molecule(p, mol, {...})` → `{node, A(i), center(list), box, atoms}` [any]. Draws a ChemDraw-style skeletal formula with live text labels. Options:
  - `at, anchor, bond, lw, size, color`: atom `anchor` goes at `at`; with no anchor, the drawing is centred on `at`. One `bond` length (default 1.75 × `size`) keeps every molecule at the same scale.
  - `orient: [i, j, deg]`: points bond i→j at `deg`.
  - `rotate`: rotates the whole drawing.
  - `mirror: 'x'|'y'`: reflects the drawing.
  - `flips: [[a, b]]`: reflects the b side of an acyclic bond across that bond.
  - `swings: [[pivot, a, deg]]`: turns the a side of an acyclic bond about `pivot`.
  - `aim: [[i, j, deg]]`: points acyclic bond i→j at a screen angle, carrying the whole j side with it. It is applied after `orient` and `rotate`. Use it for ChemDraw tetrahedral centres, e.g. R left, OTf up-right, OTf right, N down, which RDKit draws as a 90° cross.
  - `labels: {i: str | {t, align: 'center'|'first'|'last'|'below'|'above', sub, key, formula, color, weight, pad}}`:
    - Heteroatoms are labelled automatically, with the H count on the side away from their bonds.
    - `first`/`last` put the first or last element symbol on the atom (`'CO2H'` with `formula: true`).
    - A label may carry colour runs (`'{#E00000|O}Tf'`).
  - `hide: [i]`: atoms left undrawn.
  - `dummy: {i: [x, y]}`: pins an atom (e.g. a `*` attachment point) at a parent-space point.
  - `dots: {i: colour | {color, r}}, dotR`: coloured atom markers.
  - `hetero: {el: colour}`: colours every atom of an element.
  - `doubleStyle: {k | 'i-j': 'ring'|'center'|'left'|'right'}`: where the second line of a double bond goes. The default is inside the ring, centred at a terminal labelled atom, and otherwise on the substituent side.
  - `bondStyle: {k | 'i-j': 'dash'|'bold'|'wavy'|'wedge'|'hash'}`, `dash`:
    - `dash` draws a dashed single bond, or dashes the second line of a double bond.
    - `bold`, `wavy`, `wedge` and `hash` draw those bond types (`stereo` on a bond does the same).
    - Wedges and hashes have their narrow end at atom i.
    - The `dash` option sets the dash pattern.
  - `stubs: [i | {i, angle, len, dash, width}]`: open substituent bonds for generic scaffolds. They are dashed by default (`dash: false` gives a solid stub) and point into the widest gap between the atom's bonds.
  - `trim: 'glyph'|'box'`, `minBond`, `labelPad`: bonds are trimmed to an ellipse round the label glyph. `minBond` (default 0.3) is the fraction of a bond between two labels that always stays visible (e.g. B–OMe).
  - `F, name`: registers each atom as `name.a<i>`.

  Use `A(i)` to anchor orbitals, dots and arrows, and `center([i, …])` for a ring centre.
- `D.metalCenter(p, x, y, label, {metal, size, color, weight, gap, formula, bondWidth, ligands: [{mol, attach, dir, ...molecule opts}], extras: [{t, dir, len, formula}], F, name})` → `{node, attach(dir, gap), box, ligands}` [cycle, scheme]. Draws a condensed metal label (`'Ni^{III}L_n'`) with the metal symbol centred on (x, y).
  - Each ligand's `*` atom sits on the edge of the measured label box and its `*` bond points along `dir`, so the attachments survive a font change.
  - Left, up and down stop at the metal symbol; right stops past the whole label.
  - `extras` are single-atom ligands (Br, Cl, PPh3) on a bond.
- `D.partialRing(p, x, y, {label, labelColor, weight, size, bond, dir, spread, depth, lw, color, dash, F, name})` → `{node, apex, ends, A}` [scheme]. A generic ring fragment: the (labelled) ring atom at (x, y), two solid ring bonds at `dir ± spread` (by default the ring hangs below the atom), and a dashed arc for "the rest of the ring".
- `D.radicalOrbital(p, x, y, {len, wid, widFilled, tilt, skew, filled: 'lower'|'upper'|'both'|'none', dot: 'upper'|'lower'|'none', dotR, color, fill, width})` [cycle, mech]. A p orbital on an atom (pass `...mol.A(i)`) carrying the unpaired-electron dot. `tilt` turns it clockwise from vertical; `widFilled` and `skew` shape the filled lobe.

## Arrows
- `D.reactionArrow(p, from, to, {...})` → `{node, mid, up}` [scheme]. A straight scheme arrow with the reaction conditions above and below it. Options:
  - `kind`:
    - `'forward'`: a single head (the default).
    - `'equilibrium'`: two harpoons; `back` < 1 shortens the reverse one and `sep` sets their spacing.
    - `'retro'`: the open, double-shafted retrosynthesis arrow.
    - `'resonance'`: heads at both ends.
    - `'none'`: no head.
  - `above`, `below`: strings or arrays of lines, with rich markup and colour runs allowed. `above` is the screen-upper side, which for a vertical arrow is its left side. The text is placed `gap` pt off the shaft, at `size` (with `labelColor`, `formula` and `lineGap` as in chemText) and at fraction `labelAt` along the arrow.
  - `cross: true`: strikes the arrow through (the reaction does not occur).
  - `len, half, notch, width, color, dash`: head and shaft styling.
  - `F, rel`: records the drawn relation.
- `D.curlyArrow(p, from, to, {bend, fishhook, gap0, gap1, head, harpoon, len, width, color, dash, F, rel})` → `{node, B}` [mech, scheme]. An electron-pushing arrow bowed `bend` × chord length to the left of travel (negative bows to the right). `fishhook: true` gives the one-electron half head on the outside of the curve. `gap0`/`gap1` stop the ends short of the atoms.
- `D.curveArrow(p, [p0, c1, c2, p1], {head: 'end'|'start'|'both'|'none', harpoon: ±1, len, half, width, color, dash})` → `{node, B(t)}` [any]. A cubic Bézier arrow whose shaft stops inside the notched head.
- `D.arcArrow(p, cx, cy, r, a0, a1, {head: 'end'|'start'|'both'|'none', harpoon: 'out'|'in', len, half, notch, width, color, dash, F, rel: [from, to], kind})` → `{node, P, tangent}` [cycle, cell]. A circular-arc arrow with notched heads. `harpoon` draws a single barb outside or inside the circle.
- `D.arcThrough(p, p0, pm, p1, {...arcArrow opts})` → `{node, P, tangent, cx, cy, r}` [any]. The arc arrow through three measured points (start, a point on the bulge, end). Use it when replicating and the centre and angles are unknown.
- `D.equilibriumArc(p, cx, cy, r, a0, a1, {gap, back, len, width, color, F, rel})` [cycle]. The paired half-arrows of an equilibrium, drawn as two concentric harpoon arcs. `back` < 1 shortens the reverse arc.
- `D.barbHead(p, tip, dir, {len, half, notch, side: 0|1|-1, color})` [any]. A notched ChemDraw arrowhead. `side` ±1 gives a harpoon, whose barb defaults to half = 0.48 × len.
- `D.outlineArrow(p, from, to, {width, head, headWidth, stroke, lw, fill})` [scheme]. An open (outlined) block arrow. Draw a disc or label after it and the arrow appears to pass behind it.

## Catalytic cycles
- `D.catalyticCycle(p, cx, cy, r, {stations: [{angle, label, name, size, color, weight, formula, pad, draw(g, x, y), arc: 'arrow'|'equilibrium'|'plain'|'none'}], dir: 'cw'|'ccw', pad, head, len, width, color, gap, closed, F, name})` → `{node, P(a), tangent(a), stations, arcs}` [cycle]. Puts the species on the circle and joins consecutive stations with arcs that stop `pad` pt short of each label box. A station with no label is a waypoint and gets no head. Registers `name.<station>` and records a drawn relation for each arrow arc.
- `D.cycleBranch(p, cx, cy, r, angle, to, {mode: 'out'|'in', dir, curl, endDir, lift, head, len, width, color, F, rel})` → `{node, start, end, B}` [cycle]. A product arrow that leaves (`out`) or a reagent arrow that joins (`in`) the cycle tangentially at `angle`. Put `to` outside the circle: ahead of the junction for `out`, behind it for `in`.
- `D.tag(p, x, y, str, {size, fill, color, weight, padX, padY, r, rot, alongArc: {cx, cy, r, angle, offset}, upright, formula})` → `{node, w, h}` [cycle, scheme]. A filled label box ("SET", "hν", "HAT"). With `alongArc` it sits on the circle, turned to the tangent and kept upright. Its text is haloed in the fill colour, so the gate does not flag it as text over art.

## Scheme furniture
- `D.schemeBox(p, x, y, w, h, title, {size, weight, textColor, color, width, pad, inset, r, fill, formula})` → `{node, title}` [scheme]. A ChemDraw scheme frame whose top edge breaks round the title (`'**A.** Skeletal editing'`), with the title centred on the edge. This differs from `L.frame`, which puts the title above the frame.
- `D.brackets(p, x, y, w, h, {shape: 'square'|'round', tick, width, color, sup, sub, size, labelColor, formula})` → `{node}` [scheme, mech]. Brackets round an intermediate or transition state. `sup` goes at the upper right (`'‡'`, charges) and `sub` at the lower right (`'n'`).
- `D.repeatBracket(p, a, b, {n, at, span, h, bow, size, width, color, halo})` → `{node}` [scheme]. The ChemDraw "( )n" repeat brackets across bond a–b (pass `mol.A(i), mol.A(j)`). The index goes at the lower end of the closing bracket; order a→b so the closing bracket falls on the side you want.

## Electrochemistry and process equipment
- `D.electrochemCell(p, x, y, w, h, {...})` → `{node, xs, left, right, wall(side, t), ports}` [cell]. A flow-battery or electrolyser cell in section. Options:
  - `electrode`, `membrane`: strip widths in pt.
  - `left`, `right`: chamber colours. A hex colour gives a vertical gradient that is lighter at the top; gradient stops `[[0, c0], [1, c1]]` are also accepted.
  - `electrodeFill`, `membraneFill`, `r`, `stroke`, `strokeWidth`, `shadow`, `separator`: styling.
  - `electrodeLabels: [left, right]` (rotated), `labelSize`, `labelColor`, `membraneLabel`.
  - `sockets: [{side: 'left'|'right', t, w, h}]`: tube collars on the side walls.
  - `F, name`.

  The result gives the chamber boxes (`left`, `right`), outer wall points `wall(side, t)`, and the socket ends (`ports`) for tubes.
- `D.card(p, x, y, w, h, {r, fill, stroke, strokeWidth, shadow, shadowColor, title, titleSize, titleColor, titleWeight, well, inset, label, labelSize, labelColor, labelWeight, formula, F, name})` → `{node, well, box}` [cell, any]. A rounded card with an offset shadow. With a title and a tinted well it is an electrolyte reservoir; with only a label it is a "Power/Load" instrument box. Registers `name.left/right/top/bottom/center`.
- `D.tube(p, pts | [pts, …], {width, wall, edge, fill, r, hollow, cap})` → `{node}` [cell]. Hollow tubing along polylines with rounded bends. All walls are drawn before all bores, so tubes that meet or branch merge into one channel. `hollow: false` gives a solid line.
- `D.pump(p, cx, cy, R, {dir: 1|-1, fill, edge, wall, arrow (colour | false), flanges, flangeSide: 1|-1, stubL, stubH, F, name})` → `{node, top, bottom}` (flanged volute) or `{node, left, right}` [cell]. A centrifugal pump with a block flow arrow. Draw the tubes first, then the pump, and end the tubes at the returned ports.
- `D.polarity(p, cx, cy, sign, {r, color, width, fill})` [cell]. An electrode polarity badge: a ring with + or −.
- `D.drum(p, cx, y, w, h, {ry, fill, top, stroke, strokeWidth, bands: [fractions], rim, cap, shade, label, labelSize, labelColor, labelWeight, formula, F, name})` [cell]. A storage drum or cylindrical tank seen from slightly above. `fill` must be a hex colour.
- `D.crate(p, x, y, w, h, {depth, angle, view: 'right'|'left', fill, side, top, stroke, strokeWidth, cap, label, …})` [cell]. A product container or gas box in oblique view; (x, y, w, h) is the front face.
- `D.checkMark(p, x, y, {kind: 'check'|'cross', size, color, width})` [any]. A drawn ✓ or ✗ bullet for pros-and-cons lists. Arial has no ✓ glyph, so typing one gets a fallback font.

## Interfaces and solutions
- `D.ion(p, x, y, {r, label, fill, stroke, width, size, color, weight, formula})` → `{node, r}` [interface]. A labelled particle: a counter-ion `'M^{+}'`, adsorbed anion `'S^{−}'`, co-ion `'–'`, intermediate `'*i*'`, or, with no label, a species or solvent molecule.
- `D.solvated(p, x, y, {ion: {...ion opts} | null, n, shell, start, solvent: {r, fill, stroke, width}})` → `{node, at}` [interface]. A solvation shell of `n` (default 6) solvent circles round a central ion; `ion: null` draws a bare solvent cluster.
- `D.stipple(p, {pitch, r, color, bg, hex, x, y})` → fill url [interface, any]. A dot-stipple pattern (hexagonal by default) for a phase or band, e.g. `L.rect(p, …, {fill: D.stipple(p, {color, bg})})`.
- `D.spanArrow(p, a, b, {label, size, labelColor, formula, labelAt, pad, ends: 'both'|'start'|'end', head: 'open'|'barb', len, half, dash, width, color, tick})` → `{node}` [interface, cell]. A dimension or extent arrow ("|<-- Stern layer -->|") whose dashed shaft breaks round a centred label.
  - Open V heads meet the shaft exactly at the tip; `dash: false` gives a solid shaft.
  - `tick` is the length of the end ticks, or `[a, b]` for their extents on each side.
- `D.chargeRow(p, a, b, {n, sign: '-'|'+', len, width, color})` → `{node, at}` [interface]. A row of n surface-charge marks from a to b (electrode charge). The marks stay upright whatever the direction of the row.

## Ball molecules
Demo: `demo/assorted-parts.js` panel f.
- `D.atomBall(p, cx, cy, r, color, {highlight, stroke, width})` → `{node}` [cell, interface]. One shaded sphere (an atom, ion, electron or particle): a radial gradient lit from the upper left and a soft specular spot (`highlight` = its opacity, default 0.45; 0 for none). Unlike `L.glossyNode` it draws no ground shadow. With `illustrate: true` (or the figure switch) it is drawn by `L.ball` instead: a vector highlight in place of the blurred one, rim light, and a rim of the same hue (`stroke` overrides it). The PDF then keeps it vector.
- `D.molecule3d(p, x, y, mol, {r, rot, colors, label, size, labelColor, labelAt, highlight, stroke, F, name})` → `{node, atoms, ports}` [cell, interface]. A space-filling ball-cluster molecule centred at (x, y), for fuel-cell, electrolyser and gas-transport figures.
  - `mol` is a preset (`'H2'`, `'O2'`, `'N2'`, `'CO'`, `'Cl2'`, `'H2O'`, `'CO2'`, `'CH4'`, `'NH3'`) or `{atoms: [[el, x, y, z?, r?], ...]}` in units of `r`, the heavy-atom radius (default 6 pt; H is 0.72 r). Atoms are painted far to near along z (toward the viewer).
  - Colours follow `D.ATOM_COLORS` (CPK-like: H white, C grey, N blue, O red); `colors: {H: '#3b6fd6', O: '#6f45b8'}` overrides per element. `rot` turns the molecule in the page plane (deg).
  - `label: true` writes the formula (`'H2O'` → H₂O) or pass a string. It sits at (x, y), on the central atom (`labelAt: 'atom'` puts it on the largest atom, or pass a point), white and bold, with a thin halo in that atom's colour, so the gate reads it as text inside a symbol. On CH4 and NH3 the front hydrogens pass under the label; move it with `labelAt` if the subscript must stay on colour.
  - `atoms` lists `{el, x, y, r}` on the page. Ports `center, left, right, top, bottom`. Draw an `L.trail` first for a molecule in motion.

## Field conventions

What a reader in this field checks first, from published figures tagged in 2026-09. Codes such as bio-09 name benchmark figures, which are not distributed.

One look is the ChemDraw scheme (chem-01, chem-08, chem-17, chem-18). Structures are black skeletal formulas at ACS settings: bond length 14.4 pt, line 0.6 pt, bold wedge 2 pt, 120° zigzags, Arial or Helvetica labels at about 10 pt. Compound numbers are bold, and oxidation states are superscript roman numerals (Ni^II). A catalytic cycle is a ring of arrows with the intermediates at stations around it. Colour only highlights atoms, fragments or a second cycle (red, blue, orange). Arrow types carry meaning. A straight full-head arrow is a reaction step and harpoons are an equilibrium. A double-headed arrow means resonance. A curved full head moves an electron pair and a fishhook moves one electron. The other common look uses glossy ball-and-stick or space-filling molecules, solvation shells, glassware and electrodes, often in purple, magenta, blue and orange (chem-07, chem-09, chem-16, chem-12). Energy landscapes are tickless curves (chem-12, chem-20). Readers notice first a carbon with five bonds, uneven bond lengths or angles, missing charges, and the wrong arrow type.

---

### `skills/schematic-figure/reference/lib-cs.md`
# CS figure parts (engine/cs.js)

Import in a figure as `import * as D from '../engine/cs.js'` (path relative to the figure). Units pt. Parent first; every part returns `{node, ...}`. An endpoint given as a string is a figure anchor and needs `{F}`; `[x, y]` is in the parent's coordinates. Parts with `{F, name}` register `name.top|bottom|left|right|center` (boxes also `tl|tr|bl|br`). Connectors record a drawn relation for the gate when both ends are anchors, or when you name them with `relFrom`/`relTo`; `relate: true` also declares it. Demo: `demo/cs.js` (panels a–e draw every part).

Draw order: container frame first, then a connector group, then boxes. Otherwise the frame fill hides the connectors, and trunks meant to run behind boxes show through.

Figure types the parts suit: **[arch]** architecture block diagrams (Transformer, ResNet, U-Net, ControlNet, DiT, encoder–decoder); **[table]** memory-layout / partitioning tables and benchmark matrices (ZeRO, sharding, parallelism schemes); **[any]** both.

## Boxes and stacks

- `D.box(p, x, y, w, h, {label, fill, stroke ('none' for borderless), width, r, pill, dash, size, color, family, lineGap, weight, fit: true|pad, labelAt: [fx, fy], labelAnchor, badge: 'lock'|'snowflake'|'flame'|fn, badgeAt: 'right'|'left'|'tr'|'tl'|[fx, fy], badgeSize, badgeColor, badgeOpen, F, name})` → `{node, ports, x, y, w, h, label}`. A labelled module box with an optional badge. `fit` shrinks the label to the box width, less the badge. **[arch]**
- `D.pill(p, x, y, w, h, opts)`: a stadium-shaped module (zero convolution, adapter, token), which is `box` with `pill: true` and a white fill. **[arch]**
- `D.blockStack(p, cx, y, w, items, {dir: 'up'|'down', align: 'center'|'left'|'right', gap, fill, r, stroke, width, size, color, family, lineGap, fit, badge, badgeAt, badgeSize, badgeColor, link, linkWidth, linkStroke, arrow: {head, headWidth, notch}, relate, F})` → `{node, boxes: {name: {x, y, w, h, ports}}, list, top, bottom, cx}`. A column of labelled boxes centred on `cx`. `y` is the bottom edge for `'up'` and the top edge for `'down'`. Consecutive boxes are linked at the middle of their overlap: an arrow that stops on the outer edge of the outline, or a wire where the gap is too short for a head (`'auto'`). **[arch]**
  - `items: [{name, label, h, w, dx, fill, stroke, width, r, pill, dash, size, color, family, fit, badge, badgeAt, badgeSize, badgeColor, gap (to the next box), link: 'auto'|'arrow'|'wire'|false, linkWidth}]`.
  - A per-item `w` narrows a box, for U-Net widths that shrink toward the bottleneck. `align` pins narrower boxes to one edge, and `dx` shifts a single box.
- `D.repeatFrame(p, x, y, w, h, {label: 'N×'|false, labelSide: 'left'|'right', labelAt: 0..1 from top, labelGap, size, color, family, r, fill, stroke, width, dash, F, name})`: a rounded container for a repeated block with the "N×" label outside it. With `label: false, fill: 'none', dash` it becomes a dashed group outline. **[arch]**

## Connectors

- `D.route(p, [from, ...via, to], {head: 'fill'|'open'|'chevron'|false, tail, radius (default 0: sharp), stroke, width, dash, opacity, headLength, headWidth, notch, gap0, gap1, outline, outline0, F, kind, relate, relFrom, relTo})` → `{node, points}`. A polyline arrow through exact points with sharp mitred corners by default. The head's drawn tip lands exactly on the last point. `'chevron'` is an open V with a 90° included angle, as in ControlNet-style figures. **[any]**
- `D.elbow(p, from, to, {order: 'hv'|'vh', mid, ...route options})`: an orthogonal connector with one bend, or a Z through `mid`. **[arch]**
- `D.arrowhead(p, tip, dir, {style: 'fill'|'open'|'chevron', head, headWidth, notch, stroke, width})` → the point where the shaft should stop. A standalone head whose stroked tip does not overshoot. **[any]**
- `D.link(p, from, to, {head: true|false|size, headStyle: 'open'|'chevron', outline, outline0, gap0, gap1, via, radius, width, stroke, headWidth, notch, F, kind, relate})`: an arrow, or a wire when `head: false`, whose tip stops on the outer edge of a target outline of stroke width `outline`. `outline0` does the same at the source. **[arch]**
- `D.wire(p, from, to, {via, radius (0 = sharp, mitred), width, stroke, dash, cap, join, opacity, gap0, gap1, dot: true|[pts], dotR, F, kind, relate, relFrom, relTo})` → `{node, points}`. A headless connector drawn to its exact end points, so short stubs keep their length. **[any]**
- `D.residual(p, from, to, {side: 'left'|'right', rail (pt beyond the target edge, default 8) | railX, radius (0 = sharp), outline, width, stroke, head, headWidth, headStyle: 'open'|'chevron', dot, F, kind ('residual'), relate, relFrom, relTo})` → `{node, railX}`. A skip connection that leaves the trunk point horizontally, runs along a side rail, and enters a box side or an `opNode` side. **[arch]**
- `D.fork(p, from, targets[], {order: 'hv'|'vh', radius, outline, width, stroke, head, headWidth, dot, F, kind, relate})`: one source split into several arrows, such as the attention Q/K/V fan or a broadcast. **[arch]**
- `D.bus(p, x, y0, taps: [{y, to, rails: [k...], head, relTo}], {rails: [{dx, stroke, width, dash, tapDy, y0, y1}], y1, dir: 'v'|'h', head: false|'fill'|'open'|'chevron', headLength, headWidth, stroke, width, F, relFrom, kind, relate})` → `{node, rails}`. A multi-rail bus (a conditioning or prompt/time line, or adaLN modulation) with square-cornered taps into each target. Rail k sits at `x + dx`, and its taps sit at `y + tapDy`. The rail stops at its farthest tap. `dir: 'h'` swaps the axes. **[arch]**

## Glyphs and badges

- `D.opNode(p, cx, cy, r, {op: '+'|'×'|'⊙'|'−'|'∥'|'⊕'|'⊗'|'concat'|any text, opScale, fill, stroke, width, opWidth, size, family, F, name})`: a circled operator (sum, product, Hadamard, concat, σ). **[arch]**
- `D.sineGlyph(p, cx, cy, r, {lobes: 'sine'|'arc', amp (fraction of r, default 0.4), span, phase: 1|-1, fill, stroke, width, F, name})`: a circled sinusoid (positional encoding, oscillator). **[arch]**
- `D.lock(p, cx, cy, s, {color, hole, holeColor, open})`: a padlock (frozen or locked weights); `open: true` draws it unlocked. `s` is the body width. **[arch]**
- `D.snowflake(p, cx, cy, s, {color, width})`: a frozen-parameters mark. **[arch]**
- `D.flame(p, cx, cy, s, {color, inner})`: a trainable or fine-tuned-parameters mark. **[arch]**
- `D.ellipsis(p, cx, cy, {n, r, gap, dir: 'h'|'v'|'d', fill})`: a heavy-dot ellipsis between repeated columns or rows, with controllable dot size. **[any]**

## Tables and text

- `D.grid(p, x, y, cols[], rows[], {h, v: 'all'|'inner'|'none'|[i | {at, from, to, ext0, ext1, stroke, width, dash}], ext, stroke, width, cells: [[str | {s, fit, anchor, ...} | null]], size, color, family, align, pad, fit})` → `{node, xs, ys, cell(i, j)}`. A ruled table. Rules sit at cell-boundary indices, and `from`/`to` (fractional allowed) let a rule stop short, which gives partial rules. **[table]**
- `D.stackedBar(p, x, y, w, layers: [{h, fill, stroke, span: 'full'|'shard'|'none'|[f0, f1]}], {shardAt: 0..1, shardW, dir: 'down'|'up', stroke, width, gap})` → `{node, top, bottom, shard}`. A bar of stacked coloured layers (parameters, gradients, optimizer states). Each layer spans the full width, a 1/N shard at `shardAt`, or a width fraction. **[table]**
- `D.fraction(p, x, y, num, den, {size, family, math, italic, color, anchor: 'middle'|'start'|'end', rule, pad, gap, ruleColor})` → `{node, w, left, right}`. A stacked fraction with its rule at height `y`. Use `anchor: 'start'` after a text ending in `+`. **[table]**
- `D.swatchLegend(p, x, y, items: [{fill, stroke, label, shape: 'rect'|'line'|'circle'}], {dir: 'h'|'v', swatch: [w, h], gap, spacing, sep, size, color, family, r})` → `{node, width, height}`. A row or column of colour swatches with labels, packed by label width. **[any]**
- `D.fitText(p, x, y, str, maxW, {minSize (default 5 pt), ...L.text options})`: text that shrinks to fit `maxW`, for fallback fonts wider than the reference face. It never goes below `minSize`. **[any]**
- `D.richRow(p, x, y, spans: [str | {s, size, family, italic, weight, color, math, gap, dx}], {anchor, valign: 'baseline'|'middle', gap, size, family, color})` → `{node, width, texts, spans: [{x0, x1, y0, y1}]}`. One line of spans in different font families on a common baseline, such as a sans word followed by an italic-serif symbol ("Timestep *t*"). `spans` gives each span's extent in the parent's coordinates, to fit a background block to a sub-expression. **[any]**
- `D.cacheGrid(p, x, y, rows, cols, {cw, ch, gap, gapX, gapY, cell: (r, c) → colour | null | false | {fill, stroke, ghost}, stroke, width, r, ghostStroke, F, name})` → `{node, w, h, at(r, c)}`. A memory map of cache slots (KV cache as layers × positions, or any store): a colour is a stored entry, `null` a ghost (dashed outline: the slot exists, nothing stored), `false` no slot. `at(r, c)` → `{x, y, w, h, cx, cy}`. **[table]** Demo: `demo/ind-qc-parts.js`.
- `D.attnStrip(p, xs, yBase, scores, {barW, maxH, fill, stroke, width, norm: 'softmax'|'sum'|'max'|false, temp})` → `{node, weights}`. Attention weights as bars on a baseline, one per key, at centres `xs` (e.g. `grid.at(r, c).cx`). The default treats scores as logits under one joint softmax; pass keys from two sources together when they share a softmax, with `fill`/`stroke` arrays to colour them. **[block]**

## Scale and geometry

- `D.units(ptPerUnit, {x0, y0})` → `{k, X(v), P([x, y]), pts([[x, y], ...])}`: a figure-level unit scale, for example reference pixels or mm to pt. **[any]**
- `D.routeD(points, radius)` → path `d`: a polyline with rounded corners (sharp when `radius` is 0) and no end shortening. **[any]**

## Field conventions

What a reader in this field checks first, from published figures tagged in 2026-09. Codes such as bio-09 name benchmark figures, which are not distributed.

The core form is the architecture block diagram. Layers are pastel rounded rectangles, colour-coded by layer type, with thin-to-medium black outlines and solid black arrows (cs-01: embeddings pink, attention orange, feed-forward blue, norms yellow). Flow usually runs bottom to top for stacked layers (cs-01, cs-26) or left to right for pipelines. Encoders and decoders are trapezoids (cs-02, cs-05). Repeats are marked "N×" or "×3" beside a grey container. Residual paths are elbow arrows into a ⊕. Frozen modules are grey or blue with a lock icon, and trainable ones teal or lilac (cs-12, cs-16). One block is expanded in a detail panel joined by dashed lines (cs-03, cs-04). Tensors are rows of small squares or shaded slabs with their dimensions written on them (cs-23). Real inputs appear as photo thumbnails or monospace text snippets (cs-04, cs-16, cs-18). Maths, and often the labels too, are set in LaTeX serif (cs-12, cs-13). Systems papers add memory pyramids and numbered step circles (cs-07, cs-27). Readers check first that shapes, symbols and residual paths match the paper's equations, and that each colour keeps one meaning.

---

### `skills/schematic-figure/reference/lib-ind.md`
# Process-engineering parts (engine/ind.js)

Parts for chemical, process and electrochemical engineering figures. Import in a figure as `import * as D from '../engine/ind.js'` (the path is relative to the figure). Units are pt. Every part takes the parent first and draws in STYLE ink on white. It returns `{node, ports}` unless noted, and registers `${name}.${port}` anchors when given `{F, name}`. Pipes accept those anchor names as points (pass `F`). `rot` (deg) rotates a part about its centre, anchors included. Text inside a symbol carries a thin halo in the symbol's fill, so the gate's busy-art check skips it. Demo: `foundation/demo/ind.js` draws every part.

Figure types. **P&ID**: an ISA-5.1 rig or plant diagram, black line art. **BFD**: a block or process flow diagram with capsule and pill vessels, plain pumps, badges and coloured streams. **Cell**: an electrochemical, membrane or flow-cell schematic in 2-D section. **Fab**: a microfabrication process flow, with layer cross-sections, a material key and top-view section marks. **Any**: generic annotation.

## Lines and arrows
- `D.pipe(p, pts, {style, width, color, dash, radius, smooth, arrow, head, headWidth, fade, fadeLen, offset, mark, markStep, markSize, gapAt, gapLen, gapWidth, F, from, to, kind})` → `{node, pts, length}`. **Any.** A line through `pts` (`[x, y]` or anchor names). `gapAt: [[x, y], ...]` marks points where this pipe crosses *over* one drawn earlier: a paper-coloured band is laid under it there, so the lower line reads as broken (the flowsheet line hop). Draw the lower line first.
  - `style`: `process` (heavy), `secondary`, `reverse` (heavy dashed), `signal` (dotted), `electric` (dashed), `pneumatic` (//), `capillary` (×), `data` (o), `wire` (plain circuit wire), `dotted` (heavier round dots), `dashed`. The table is in `D.PIPE_STYLES`.
  - Overriding `width` scales the style's dash with it, so a heavy dotted wire keeps round dots.
  - `arrow`: `'end'|'start'|'both'|'mid'|[fractions of length]`. The shaft is trimmed under an end head. Use `head` and `headWidth` (half-width) to size heads on thick arrows.
  - `smooth: true` draws a curve through the points: a curved reaction or flow arrow.
  - `fade` (true, or the tail opacity) fades the stroke in from the tail, reaching full strength at `fadeLen` (default 0.7 of the length). Use it for electron-flow and circulation arrows.
  - `offset` draws the same route shifted sideways (companion forward and reverse lines).
  - With `F, from, to` the pipe registers the relation via `F.drew`.
- `D.offsetPoints(pts, dist)` → points. **Any.** The polyline shifted sideways with mitred corners (positive = left of travel).
- `D.arcPoints(P0, Pm, P1, n = 48)` → points. **Any.** Points on the circle through three points, from `P0` through `Pm` to `P1`. Feed them to `pipe` for a circular arc arrow, or to `textOnPath` for a label along an arc.
- `D.userGradient(p, a, b, stops)` → url. **Any.** A linear gradient in user space between two points. It works on horizontal or vertical lines, where the bbox gradients in `L` fail.
- `D.streamArrow(p, from, to, {shaftW, headW, headL, fill, stroke, width, F, name})`. **P&ID, BFD.** A hollow block arrow in any direction, for a feed or product stream. Ports: `tail`, `tip`.
- `D.flowLabel(p, x, y, str, {dir, arrowLen, gap, head, size, rotate, family})` → node. **P&ID.** A flow label such as "forward ⟶": text plus a thin open arrow, centred on (x, y). For `dir: 'up'|'down'` the label turns to read along the line.

## Instruments and valves
- `D.instrument(p, cx, cy, {r, tag, loop, location, display, kind, apex, size, leading, family, fill, F, name})`. **P&ID.** An ISA bubble with the tag above and the loop number below.
  - `location`: `field` (no line), `panel` (solid line), `rear` (dashed), `aux` (double line).
  - `display`: `discrete` (circle), `shared` (DCS: circle in a square), `computer` (hexagon), `plc` (diamond in a square).
  - `kind: 'rotameter'` adds the float cone, with sides tangent to the bubble (`apex` = centre to tip, default 1.6 r).
  - `leading` scales the gap between the tag and the loop number.
  - The default `r` is 6.5 (field) or 7.5 (with a location line). Use a larger `r` for three-letter tags.
  - Ports: `top`, `bottom` (the cone tip for a rotameter), `left`, `right`, `center`.
- `D.valve(p, cx, cy, {kind, ports, size, halfH, actuator, actuatorSide, actuatorLen, barLen, rot, F, name})`. **P&ID.** One triangle per port, apexes meeting at the centre.
  - `ports` ⊂ `['left','right','up','down']`.
  - `kind`: `gate`, `globe` (dot), `ball` (circle), `check` (the last port's triangle filled), `3way` (ports default to left, right, down).
  - `actuator`: `none`, `hand` (T bar, length `barLen`), `diaphragm` (dome), `solenoid` (box), `motor` (circle with M).
  - Ports: each named port end, `center`, `actuator`.

## Columns, vessels, equipment
- `D.column(p, x, yTop, w, h, {flanges, flangeExt, flangeGap, fill: {from, to, color}, packing, grain, grid, taps, tapSide, tapLen, label, labelSize, labelColor, F, name})` → `{node, ports, taps}`. **P&ID.** A packed or tray column.
  - It draws walls, double-line flanges at fractions of `h` (default `[0, 1]`), a grey bed from `fill.from` to `fill.to`, optional `packing: 'dots'|'rings'`, a dashed support `grid` and a rotated label.
  - `taps` are fractions of `h` or `{at, side, len}`. It returns the impulse-line ends and registers `name.tap1..n`.
- `D.tap(p, x, y, {side, len, tick, sep, F, name})` → `{node, end}`. **P&ID.** A wall pressure tap: two ticks across a vertical wall and an impulse line.
- `D.vessel(p, cx, yTop, {shape, w, h, cone, neckW, neckL, tubeL, inletL, level, levelColor, fill, gradient, label, labelSize, labelColor, labelWeight, labelRotate, family, F, name})`.
  - `shape` for **P&ID**: `hopper` (bin plus a cone to a neck), `tank` (vertical, dished heads), `drum` (horizontal), `cyclone` (cylinder plus cone, gas outlet tube on top, tangential inlet; port `inlet`).
  - `shape` for **BFD**: `capsule` (vertical stadium: absorber, stripper), `pill` (horizontal stadium: flash tank).
  - `level` (0 to 1) fills the vessel from the bottom. `gradient: [[offset, colour], ...]` fills it top to bottom.
  - `label` is centred and turned −90° when the vessel is tall.
  - Ports: `top`, `bottom`, `left`, `right`, `center`.
- `D.pump(p, cx, cy, {r, kind, foot, dir, nozzleL, rot, F, name})`. **P&ID, BFD.**
  - `kind`: `centrifugal` (ISA, a tangential discharge nozzle at the top towards `dir`), `plain` (circle only), `arrow` (circle with a triangle).
  - `foot` (default true) draws a trapezoid stand.
  - Ports: `in`, `out`, `top`, `bottom`, `center`.
- `D.compressor(p, cx, cy, {r, dir, kind, rot, F, name})`. **P&ID.** `kind`: `compressor` (chords converge to the outlet), `turbine` (they diverge), `fan` (three blades). Ports: `in`, `out`, `top`, `bottom`, `center`.
- `D.plateHX(p, x, y, w, h, {plates, fill, endFill, stroke, width, rot, F, name})`. **Flowsheet.** Plate-and-frame heat exchanger: frame, two thick end plates, a pack of thin plates. Ports `hotIn` (top left), `hotOut` (bottom right), `coldIn` (bottom left), `coldOut` (top right), `left, right, top, bottom, center`. Demo: `demo/ind-qc-parts.js`.
- `D.electrolyserStack(p, x, y, w, h, {cells, fill, endFill, plateFill, stroke, width, diaphragm, rot, F, name})` → `{node, ports, cell(i)}`. **Flowsheet / cell.** Bipolar (filter-press) electrolyser or fuel-cell stack: n cells between end plates, a solid bipolar plate between neighbours and a dashed diaphragm down each cell; `cell(i)` → `{x, w, cx}` for labels. Demo: `demo/ind-qc-parts.js`.
- `D.flowFieldPlate(p, front, side, {recess, inset: [u, v], channels, holes: 'top' | 'bottom' | 'both' | 'none', r, color, rim, rimWidth, shadow, F, name})` → `{node, ports, recess, at(u, v)}`. **Cell.** A bipolar (flow-field) plate of a fuel cell or electrolyser in perspective, for exploded views: a thick slab with filleted corners and a lit bevel.
  - `front` is the page quad `[TL, TR, BR, BL]` of the face with the channels. `side` is `[top, bottom]`, the two back corners of the thickness face on whichever side shows; left or right is found from them, and the top and bottom offsets may differ (perspective). The slab outline is the hull of the front and back faces.
  - The recessed field (`recess`, a page quad; default the front inset by `inset` fractions, [0.12, 0.1]) holds `channels` parallel grooves (default 10) from its top edge to its bottom, with manifold holes at their ends (`holes`, default `'top'`).
  - `color` is the metal tone (default steel grey; `'#3a3d42'` for graphite); `r` the corner radius (default 6 % of the top edge); `shadow` a soft floor shadow. `at(u, v)` maps the front face bilinearly. Ports: `center`, `top`, `bottom`, `left`, `right`. Demo: `demo/assorted-parts.js` panel g.
- `D.heatExchanger(p, cx, cy, {kind, r, w, h, turns, ext, rot, F, name})`. **P&ID.**
  - `coil`: a circle crossed by a zigzag service line. Ports: `left`, `right` (coil ends), `top`, `bottom`.
  - `shell`: a shell-and-tube exchanger. Ports: `tubeIn`, `tubeOut`, `in`, `out` (shell side), `top`, `bottom`.
- `D.rotaryFeeder(p, cx, cy, {r, vanes, hub, vaneWidth, phase, rot, F, name})`. **P&ID.** A rotary valve or cell feeder. Ports: `top`, `bottom`, `left`, `right`, `outL`, `outR`, `center`.
- `D.inlineFilter(p, cx, cy, {len, halfH, gap, mediumExt, mediumFill, rot, F, name})`. **P&ID.** Two cones on a grey filter medium, flow from left to right (`rot: 90` for vertical flow). Ports: `in`, `out`, `top`, `bottom`, `center`.
- `D.scale(p, cx, yPan, {panW, lip, lipX, postDx, gap, boxW, boxH, label, size, family, F, name})`. **P&ID.** A weighing scale: a pan on posts over a labelled box. Ports: `pan`, `bottom`, `left`, `right`.

## Electrical and electrochemical
- `D.battery(p, cx, cy, {vertical, cells, gap, long, short, longWidth, shortWidth, lead, color, width, F, name})`. **Cell, BFD.** A DC source on a left-right wire (`vertical` for an up-down wire), with the long (+) and short (−) plates. `lead` draws wire stubs. Ports: `left`/`right` (or `top`/`bottom`), `plus`, `minus`, `center`.
- `D.ion(p, cx, cy, sign, {r, fill, color, label, size, stroke, shaded})` → node. **Cell.** A disc with a white + or − (cations green, anions vermillion), or with a short `label` such as `'Na^{+}'`. `shaded` adds a radial highlight.
- `D.badge(p, cx, cy, str, {r, fill, shaded, color, size, weight, stroke, family})` → node. **BFD, Cell, Any.** A numbered grey disc for a step, zone or stream, softly shaded by default.
- `D.bulb(p, cx, cy, {r, style: 'shaded' | 'line', lit, glow, glass, stroke, width, rot, F, name})`. **Cell, BFD, Any.** An incandescent light bulb as a load or "power out" mark: globe radius `r` (default 8) centred at (cx, cy), filament, screw base and contact below. `shaded` (default) has a glass globe with a highlight, a metal base and, when `lit` (default true), a warm tint and a soft glow (`glow: false` drops it). `line` is ink line art for circuit schematics; `lit` adds short rays. Ports: `top`, `base` (the contact), `left`, `right` (wire points at the base), `center`. Demo: `demo/assorted-parts.js` panel g.

## Cross-sections and materials
- `D.layerStack(p, x, y, w, layers, {dir, stroke, width, r, frame, labels, labelSize, family, F, name})` → `{node, layers: [{z0, z1, box}], ports, box}`. **Fab, Cell.** A cross-section of stacked layers.
  - `dir`: `down` for a wafer stack `w` wide, or `right` for a cell or electrode sandwich `w` tall.
  - Each layer: `{t, material | fill, label, labelColor, labelSize, name, gaps, from, to, z, overlay, stroke, hatch, hatchColor, dash}`.
  - `gaps: [[a, b] | {a, b, taper}]` cuts etched windows, trenches or pillars. `taper > 0` narrows a window towards the far face; `< 0` widens it, as for a tapered port.
  - `from`/`to` limit a layer's extent. `z` with `overlay: true` draws an implant, pad or plug over earlier layers without advancing the stack.
  - `fill: 'none'` leaves empty space. `hatch` sets the spacing of a cross-hatch (porous electrode, felt). `dash` draws a dashed divider (membrane or separator in a block diagram).
  - `r` clips the stack to a rounded rectangle and `frame` outlines it dashed: a zoom box. Fill a layer's `box` with `packing` or `fibres`.
  - Registers `name.<layer name>` and `name.top/bottom/left/right/center`.
- `D.MATERIALS`. **Fab, Cell.** Conventional fills: `si`, `sio2`, `sin`, `poly`, `metal`, `al`, `au`, `cu`, `cr`, `resist`, `glass`, `doped`, `implant`, `resistor`, `polymer`, `electrolyte`, `aem`, `cem`, `electrode`, `catalyst`, `gdl`, `channel`, `steel`, `gasket`, `water`, `air`. Pass a key as `material`.
- `D.materialKey(p, x, y, items, {cols, colW, rowH, sw, sh, size, stroke, family})` → node. **Fab, Cell.** A swatch legend. `items` are `[[material key | fill, label], ...]`, laid out column-major.
- `D.sectionMark(p, a, b, {label, labels, side, color, textColor, dash, width, arrowLen, size, family})` → node. **Fab.** A cut line A-A on a top view: a thin dashed line with a filled arrow at each end showing the viewing direction (`side: -1` flips it) and the letter outboard.
- `D.packing(p, {x, y, w, h}, {rmin, rmax, bias, overlap, tries, fill, stroke, width, squash, shaded, highlight, clip, seed})` → `{node, discs}`. **Cell, P&ID.** Non-overlapping discs clipped to a region or to the path `clip`: catalyst pellets, resin beads, particles, packed-bed grains. `fill` may be a list. The result is deterministic for a given `seed`.
- `D.fibres(p, {x, y, w, h}, {n, kind: 'tangled'|'straight'|'rods', color, width, seed, steps, bend, poly, len, light, vertical})` → node. **Cell.** Random fibre strokes clipped to a region: a gas-diffusion layer, carbon felt or non-woven separator. `kind: 'rods'` draws a dense mat of `n` (default 600) short rods, each with a thin lit edge, scattered inside the polygon `poly` (default the region) and not clipped, so they fringe past its outline: the carbon-fibre gas-diffusion layer of an exploded fuel cell. For rods, `len` = `[min, max]` rod length, `width` = `[min, max]` or one value, `color` = a list of body colours, `light` = the lit-edge colour (`'none'` for none) and `vertical` = the fraction of rods near vertical (default 0.6).

## Annotation
- `D.calloutBox(p, x, y, w, h, str, {to, notch, side, at, stroke, width, fill, size, color, family})` → node. **Any.** A labelled box whose border opens where two leader lines leave it for the target (a speech-bubble wedge), such as a half-reaction label. `to` is one point or two points. Without `to` it draws a plain box.
- `D.pinLabel(p, x, y, str, {len, dir, dot: 'target'|'label'|'none', dotR, size, gap, color, width, textColor, family})` → node. **Fab, Cell.** A straight pin with a dot from a point on the art to a label, for layer and zone names above or below a section.
- `D.textOnPath(p, pts, str, {smooth, at, anchor, dy, reverse, size, color, weight, family, letterSpacing})` → node. **Any.** A plain-text label that follows a polyline, curve or `arcPoints` arc. `dy` offsets it sideways (positive = left of travel); `reverse` keeps it upright on a right-to-left path.

Not covered, still drawn by hand:
- stacked sub- and superscripts such as Δp^i_j
- a 3-D translucent cell box with internal planes, and oblique electrode plates (use `L.isoBox`/`L.obliquePanel` from the core)
- photographs of apparatus
- top-view die layouts (traces and pads)

## Field conventions

What a reader in this field checks first, from published figures tagged in 2026-09. Codes such as bio-09 name benchmark figures, which are not distributed.

Each sub-field has its own symbol standard:
- **Patent drawings** (ind-13, ind-14, ind-15): black line only, hatched cut sections, numbered reference numerals on curved leaders, no colour.
- **P&ID-style rigs** (ind-19, ind-12 c): ISA-5.1 instrument bubbles (circles with tags such as PT, FT), pumps as circles with a triangle, valves as bowties, tanks as capsules. Process lines solid, signal lines dashed; feed enters left, products leave right.
- **Process flow sheets**: hot streams red, cold blue, temperatures on the lines (ind-18, ind-09).
- **Electrical one-line diagrams**: IEC converter and machine symbols, one colour per bus (ind-21).
- **Fabrication flows**: one repeated cross-section frame per step, joined by snake arrows, with a legend fixing each material's colour (Si cyan or grey, SiO₂ orange, metal red or gold; ind-06, ind-02).
- **Electrochemical cells**: anode, cathode and membrane (AEM/CEM) labelled, half-reactions boxed (ind-01, ind-07).
- **CAD renders**: axis triad and dimensions (ind-20, ind-05).

Type is plain sans, sometimes serif on P&IDs. Readers notice first a non-standard symbol, an unlabelled stream, a flow without a direction arrow, or a material that changes colour between steps.

---

### `skills/schematic-figure/reference/lib-qc.md`
# Quantum-computing parts (engine/qc.js)

Import in a figure as `import * as Q from '../engine/qc.js'` (path relative to the figure module). Units pt; parent first; colours and weights default to `STYLE` (ink wires, `color.light` idle wires, `line.normal`, maths font `STYLE.font.math`; pass `{family: STYLE.font.latex}` for LaTeX-typeset circuits). Demo: `demo/qc.js` draws every part (panels a–f follow the four groups below).

Figure types: **[C]** circuit diagrams (syndrome extraction, gate sequences, distributed circuits); **[T]** codes and Tanner graphs (surface, toric, qLDPC / bivariate-bicycle); **[H]** hardware schematics (trapped-ion traps, oblique device art); **[N]** network and modular architectures. Parts marked with several letters are shared.

## Circuits
- `Q.qwire(p, x0, x1, y, {segments: [[xa, xb, 'active'|'idle']], base, active, idle, width, classical, gap, F, name})` [C]: qubit wire, ink where active and grey where idle; `classical: true` draws a double line. Anchors `name.in`, `name.out`.
- `Q.qcontrol(p, x, y, {r = 1.3, open, color})` [C]: control dot; `open` = hollow (negative control).
- `Q.qtarget(p, x, y, {r = 3.2, color, width, fill})` [C]: circled plus (CNOT target); white fill hides the wire behind it.
- `Q.cnot(p, x, yC, yT, {r, dot, kind: 'x'|'z', xTarget, open, color, width, F, name, from, to})` [C]: controlled-X, or CZ with `kind: 'z'` (dots at both ends; with `color` it is also the coloured "non-local operation" link). With `{F, name}` registers `name.c`, `name.t` and records the drawn relation c→t (kind `cnot`/`cz`) for the gate.
- `Q.qswap(p, x, y1, y2, {s = 4, color, width})` [C]: SWAP gate (× on both wires, joined).
- `Q.gateBox(p, x, y, label, {w = 8, h = 8, y2, r, rounded, fill, stroke, size, family, italic, color, shadow | filter, F, name})` [C]: gate box centred on the wire (H, S, R_{z}). `y2` spans a second wire (multi-qubit gate); `rounded` gives the blank rounded style of architecture figures (`label: ''`); `shadow: true` adds a soft drop shadow.
- `Q.qmeter(p, x, y, {w = 9, h = 8, y2, basis, basisPos: 'below'|'inside'|'none', needle (deg), head, r, meterY, output, gap, size, family, fill, stroke})` [C]: measurement box (arc, needle with filled head). Basis letter below, or inside when `h ≥ 12`; `y2` spans two wires (joint readout, basis inside by default); `head` sets the needle-head length; `output` draws a classical double wire of that length from the right edge.
- `Q.ket(p, x, y, s, {anchor: 'end'|'start'|'middle', size, family, color, weight, bra})` → `{node, x0, x1}` [C]: |s⟩ (or ⟨s| with `bra`) centred on wire `y`; bar and bracket drawn as lines (serif fonts lack U+27E9). `anchor: 'end'` puts the bracket tip at `x`.
- `Q.ketColumn(p, x, ys, states, {anchor, size, family, color})` [C]: one ket per wire; evenly spaced rows share one multi-line text so tight pitches do not trip the text-overlap gate.
- `Q.badge(p, cx, cy, letter, color, {shape: 'square'|'circle'|'round', s = 7, r, width, size = 0.66 s, family, weight, textColor, fill, solid, stack, offset})` [C T]: outlined coloured tag (stabiliser type, qubit group, legend key). `r` sets the 'round' corner radius (default 0.25 s); `solid` fills it with the colour (white letter); `stack: n` draws n offset copies (quasi-cyclic / lifted blocks), `offset: [dx, dy]` per copy.
- `Q.slantFrame(p, {top, bottom, xTopL, xTopR, xBotL, xBotR, band, yKneeTop, yKneeBot, stroke, width, dash, fill, fillOpacity, label, labelAt, labelColor, labelRotate})` → `{node, d}` [C]: region with vertical sides that kink diagonally between the knee heights (pipelined syndrome cycle, overlapping "next cycle" band). `band` = constant width, so the right edges follow the left ones; `labelRotate` turns the label (e.g. along the kink). Draw it into a group created before the circuit so it sits behind.
- `Q.circuit(p, {x, y, wires, cols, colW = 12, pitch = 10, lead, tail, gates, header, headerLabels, dividers, dividerColor, activeSpan, groups, groupDash, groupColor, groupLabelX, groupExtend, rounded, gateR, gateW, gateH, gateFill, gateShadow, meterW, meterH, dotR, dotGap, r, dot, size, ketSize, family, F, name})` → `{node, X(col), Y(q), xEnd, wires, half}` [C]: gate-grid layout. `wires`: count or `[{id, label, init, dot, color, classical}]` (`init` draws a ket, `dot` a coloured qubit disc, `label` a name left of them). `gates`: `{g: 'cnot'|'cz'|'link', c, t, col, xt, color}`, `{g: 'gate', q, q2, col, label, color}`, `{g: 'meter', q, q2, col, basis, output}`, `{g: 'swap', a, b, col}`, `{g: 'ctrl'|'target', q, col}`; refs are ids or indices, `col` 1-based (fractions allowed), `q2` spans a box over several wires. `activeSpan` inks each wire from its first to its last gate; a final meter, or any meter with `output`, ends the wire. `header: 'Round:'` numbers the columns; `dividers: [4]` draws a vertical line between columns 4 and 5. `groups: [{from, to, label}]` labels wire ranges (modules M_{1}…) and draws dashed separators between them. With `{F, name}` registers `name.<id>.in/.out` and a relation per two-qubit gate.

## Codes and Tanner graphs
- `Q.qubit(p, cx, cy, r, color, {stroke, width, fill, shadow | filter, label, labelColor, size})` [T N]: filled qubit disc (data, network or circuit qubit), optional drop shadow and centred label.
- `Q.surfaceCode(p, x, y, {d = 3, pitch = 10, style: 'tanner'|'plaquette', xColor, zColor, dataR, checkS, letters, dataFill, dataStroke, edgeColor, width, flip, opacity, size})` → `{node, data, checks, X(i), Y(j)}` [T]: rotated distance-d surface code with (x, y) the top-left data qubit. 'tanner': white data circles, X/Z check badges at plaquette centres, diagonal check–data edges. 'plaquette': coloured faces (squares inside, half-discs on the boundary) with data dots at the corners. X checks on the top/bottom boundary, Z on left/right (`flip` swaps).
- `Q.tannerLattice(p, {x, y, cols, rows, dx, dy, node(c, r), edge(c, r, 'h'|'v'), overhang, F, name})` → `{node, X(c), Y(r)}` [T]: grid of typed nodes. `node` returns `{shape: 'circle'|'square'|'round', color, s, letter, outline, fill}` or null; `edge` returns a line style (`{dash, width, stroke}`) for the edge to the right/below neighbour, or null. On the last column/row that edge is the wrap-around edge and is drawn as stubs of length `overhang` on both borders. Registers `name.c.r` anchors.
- `Q.torusFrame(p, x, y, w, h, {marks: [nH, nV] = [2, 1], size, at, stroke, width, fill, r})` [T]: frame with periodic-boundary identification marks (nH chevrons pointing right on top and bottom, nV pointing down on left and right).
- `Q.doubleLine(p, a, b, {n = 2, gap = 1.2, stroke, width, heads: 'none'|'end'|'start'|'both', head, headWidth})` [T N C]: n parallel lines (multi-edge / block coupler, classical link); with `heads` an open double-shaft arrow with filled heads ("classical communication").
- `Q.curveLeader(p, [a, c1, c2, b] | [a, c, b], {stroke, width, head, headWidth, notch, dir})` [T N]: cubic (or quadratic) annotation arrow with a filled barbed head at b ("data", "checks" leaders).

## Trapped-ion hardware
- `Q.obliqueBox(p, x, y, w, h, {dx, dy, depth: 'left'|'right', color, colors: {front, top, side}, opacity, stroke, width})` [H]: cabinet-oblique extruded block; front face [x, x+w] × [y, y+h], depth up-left (default) or up-right. Top and side colours derive from `color` unless given. Unlike `L.isoBox` it keeps the front face flat and exact.
- `Q.segmentRow(p, x, y, {n, pitch, w, h, dx, dy, depth, color, colors, highlight: {k: color | colors}, fade: [op…] | fadeEnds: m, labels: {k: str}, labelSize, labelColor})` → `{node, X(k), Y}` [H]: row of segmented electrodes drawn in hiding order; `highlight` recolours segments (the laser interaction zone), `fadeEnds` fades the outer m on each side ("continues").
- `Q.trapRail(p, x, y, w, h, {dx, dy, depth, color, colors, notches: {x0, pitch, n, w, h, edge: 'bottom'|'top', fill}})` [H]: long RF rail with segment notches along the front face's lower edge ('bottom', upper rail) or slots across the top face ('top', lower rail).
- `Q.ionString(n, {cx, span, gap})` → `[x, ...]`: equilibrium positions of n ions in a linear harmonic trap (Coulomb crystal, James 1998), closer together at the centre than at the ends; equal spacing is wrong for n ≥ 3. Scaled so the outer ions are `span` apart or the central gap is `gap`. Draw each with `Q.ion`. Demo: `demo/ind-qc-parts.js`.
- `Q.ion(p, cx, cy, r, color, {dark, light, highlight, angle, stroke, width})` [H N]: glossy ion/atom with radial shading and a rotated specular highlight, no ground shadow.
- `Q.potentialWell(p, cx, yTop, yBottom, {hw = 12, kind: 'harmonic'|'double', power = 2, barrier = 0.3, ghosts: [dx…], ghostColors, color, width, n})` → `{node, y(x)}` [H]: trapping potential; double well with a central barrier `barrier` × depth; `ghosts` draws earlier positions in fading greys (transport).
- `Q.laserBeam(p, from, focus, to, {w0 = 3, wIn, wOut, color, opacity, fade, head, headWidth, headLength, tailColor})` [H]: focused beam at any angle as a filled translucent shape: tail converging (and fading) from `from` to the waist at `focus`, body widening to a flat triangular arrowhead at `to`. Keep the three points collinear for a straight beam.
- `Q.coupling(p, a, b, {n = 6, h, inset, color, color2, width, blur})` [H]: alternating stripes between two ions (gate interaction glyph).
- `Q.swapArrows(p, a, b, {r, bend, stroke, width, head})` [H N]: two curved arrows exchanging the particles at a and b (one over, one under).

## Networks and modular architectures
- `Q.moduleNode(p, cx, cy, r, {n = 4, ringR, qr, rotate = 90, color, colors, highlight: {i: color}, edges: 'all'|'ring'|'none'|[[i, j]], edgeColor, edgeWidth, fill, stroke, width, shadow, qubitShadow})` → `{node, qubits}` [N]: module circle with n qubits on a ring joined by couplings (complete graph by default); `highlight` marks the network qubit.
- `Q.enclosure(p, cx, cy, len, wid, {angle, r, fill, stroke, width, dash, shadow})` [N H]: rotated rounded rectangle (module group, cryostat, zoom target).
- `Q.photon(p, cx, cy, {angle, len = 8, amp, cycles, color, width, head})` [N H]: wave packet with a Gaussian envelope along `angle`; `head` adds an arrowhead.
- `Q.entangleLink(p, a, b, {style: 'helix'|'wavy', halfTurns, amp, color, width, glow, glowColor, glowWidth, dots})` [N]: shared-entanglement link (double helix or single wave) with optional soft glow and end dots.
- `Q.photonDetector(p, cx, cy, r, {angle = -45, fill, stroke, width})` [N]: D-shaped single-photon detector whose dome faces `angle` (flat side toward the light).

## Field conventions

What a reader in this field checks first, from published figures tagged in 2026-09. Codes such as bio-09 name benchmark figures, which are not distributed.

Hardware papers pair a device view with measured data (qc-04, qc-13); theory papers use circuits and lattices (qc-02, qc-03). Circuits follow TikZ/quantikz conventions: horizontal wires, time left to right, a ket labelling each wire. A CNOT is a filled control dot joined by a vertical line to a ⊕ target. A CZ is two dots, drawn as a dumbbell (qc-04). Gates are square boxes with a serif letter, measurement is a meter box, and syndrome rounds are marked by column dividers (qc-03). Surface codes separate data qubits from measure qubits, draw X and Z stabilisers as two plaquette colours, and mark patch boundaries dashed or solid by type (qc-18, qc-04, qc-17). Atom arrays are dot grids under red tweezer beams, with fluorescence images on dark (qc-01, qc-05, qc-13). Chips appear as false-colour meander layouts (qc-10). Wigner maps use a red-white-blue diverging colormap centred on zero (qc-11). Computer Modern type is common (qc-08, qc-09). Readers notice first when a control and target are swapped, stabiliser colours are inconsistent, the qubit counts are wrong (d² data, d²−1 measure), or the Wigner colormap is not diverging.

---

## 11. Reference Engine & Gate Source Code (`engine/*.js` & `tools/lib/*gate.mjs`)

### `skills/schematic-figure/foundation/engine/style.js`
```javascript
// House style: Nature final-artwork rules plus the conventions of strong physics schematics.
// All sizes in pt at final print size. Figures read these values; they never hard-code their own.

export const STYLE = {
  widthsMM: { single: 89, onehalf: 120, onehalfWide: 136, double: 183 },
  maxHeightMM: 247,
  font: { family: 'Arial, Helvetica, sans-serif', math: 'Cambria, "Times New Roman", serif', latex: "'Latin Modern Roman', 'Latin Modern Math', serif" },
  text: { panel: 8, title: 7, label: 6, small: 5, tick: 5, min: 5, max: 8 },
  line: { hair: 0.25, thin: 0.4, normal: 0.6, bold: 1.0, min: 0.25 },
  arrow: { head: 3.2, headWide: 2.4 },     // arrowhead length / half-width... in pt, independent of stroke
  color: {
    text: '#1a1a1a', ink: '#2b2b2b', mid: '#7a7a7a', light: '#bdbdbd', faint: '#e9e9e9', paper: '#ffffff',
    // Wong (2011) colour-blind-safe set
    blue: '#0072B2', sky: '#56B4E9', green: '#009E73', yellow: '#F0E442', orange: '#E69F00',
    vermillion: '#D55E00', purple: '#CC79A7',
    // physical conventions
    beam: '#E8322B', beamIR: '#B5172A', beamGreen: '#2FAE4A', beamBlue: '#2F6BE0', glass: '#CFE6F3',
    metal: '#B8BEC6', silicon: '#8E9AAF', substrate: '#E5E1D8', gold: '#D9A441',
    // soft panel tints for grouping
    tintBlue: '#EAF2FA', tintOrange: '#FDF1E3', tintGreen: '#E8F5EF', tintGrey: '#F3F3F3',
  },
  gap: { panel: 4, inner: 2 },             // mm between panels / inside a panel
  // illustrated finish for every part that supports it (engine/illustrate.js): false (flat, default) | true | {light, contrast, ...}
  illustrate: false,
};

// Named palettes an agent may pick per figure (one accent + neutrals is the default).
export const PALETTES = {
  default: ['#0072B2', '#E69F00', '#009E73', '#D55E00', '#CC79A7', '#56B4E9'],
  cool: ['#1F4E79', '#2E86C1', '#5DADE2', '#A9CCE3'],
  warm: ['#7B241C', '#C0392B', '#E67E22', '#F5B041'],
  diverging: ['#2166AC', '#67A9CF', '#D1E5F0', '#F7F7F7', '#FDDBC7', '#EF8A62', '#B2182B'],
  viridis: ['#440154', '#3B528B', '#21918C', '#5EC962', '#FDE725'],
};

// linear colour ramp through stops (hex), t in [0,1]
export function ramp(stops, t) {
  t = Math.min(1, Math.max(0, t));
  const n = stops.length - 1, i = Math.min(n - 1, Math.floor(t * n)), f = t * n - i;
  const h = (s) => [1, 3, 5].map((k) => parseInt(s.slice(k, k + 2), 16));
  const a = h(stops[i]), b = h(stops[i + 1]);
  return '#' + a.map((v, k) => Math.round(v + (b[k] - v) * f).toString(16).padStart(2, '0')).join('');
}

// mix a hex colour toward white (amt>0) or black (amt<0)
export function shade(hex, amt) {
  if (STYLE.format === 'patent') return hex;   // patent line art: no tonal variants (faces stay white, lines black)
  const c = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
  const tgt = amt >= 0 ? 255 : 0, a = Math.abs(amt);
  return '#' + c.map((v) => Math.round(v + (tgt - v) * a).toString(16).padStart(2, '0')).join('');
}

// ---- patent drawing profile (37 CFR 1.84) ---------------------------------------------------------
// export const figure = {format: 'patent', sheet: 'letter' | 'a4', sheetId: '1/1'}. createFigure() calls usePatentProfile(),
// which rewrites STYLE for the rest of the page: black line art on white, heavier lines, 1/8-inch characters.
// Sizes: text in pt (font size; Arial capitals and digits are 0.716 of it), lines in pt, sheets and margins in mm.
export const PATENT = {
  sheets: { letter: [215.9, 279.4], a4: [210, 297] },          // 1.84(f)
  margin: { top: 25, left: 25, right: 15, bottom: 10 },        // 1.84(g), minimum sight margins
  capHeight: 0.716,                                            // Arial cap / digit height per unit font size
  minCharMM: 3.2,                                              // 1.84(p)(3): characters at least 0.32 cm (1/8 inch) high
  text: { numeral: 14, legend: 14, fig: 22, sheet: 16 },       // numeral caps 3.5 mm; FIG. and sheet numbers larger (1.84(t), (u))
  line: { hair: 0.5, thin: 0.6, normal: 0.9, bold: 1.3, min: 0.35 },   // 1.84(l): dense, uniform, reproducible
  floor: 0.3,                                                  // the gate fails any stroke below this (pt)
  arrow: { head: 6, headWide: 2.4 },
  hatch: { spacing: 5.5, angle: 45, width: 0.5 },              // section lining (1.84(h)(3)), pt
};
const PATENT_WHITE = /^(paper|faint|light|glass|metal|silicon|substrate|gold|tint)/;
// usePatentProfile(): switch STYLE to the patent profile (idempotent). Every colour token becomes black, except the
// area tokens (tints, light, faint, glass, metal, ...) which become white, so parts default to black-on-white line art.
export function usePatentProfile() {
  STYLE.format = 'patent';
  STYLE.illustrate = false;
  Object.assign(STYLE.text, { panel: PATENT.text.fig, title: PATENT.text.legend, label: PATENT.text.numeral, small: PATENT.text.numeral, tick: PATENT.text.numeral, min: PATENT.text.numeral, max: PATENT.text.fig });
  Object.assign(STYLE.line, PATENT.line);
  Object.assign(STYLE.arrow, PATENT.arrow);
  for (const k of Object.keys(STYLE.color)) STYLE.color[k] = PATENT_WHITE.test(k) ? '#ffffff' : '#000000';
  STYLE.patentForced = STYLE.patentForced ?? { stroke: 0, fill: 0, text: 0, opacity: 0, width: 0 };
  return STYLE;
}
// luminance 0..1 of '#rgb', '#rrggbb', 'rgb(r,g,b)', 'white' or 'black'; null for anything else (url(), named colours)
export function colourLum(c) {
  if (typeof c !== 'string') return null;
  const s = c.trim().toLowerCase();
  if (s === 'white') return 1; if (s === 'black') return 0;
  let m = /^#([0-9a-f]{3})$/.exec(s);
  if (m) return [...m[1]].reduce((a, h, i) => a + [0.2126, 0.7152, 0.0722][i] * parseInt(h + h, 16) / 255, 0);
  m = /^#([0-9a-f]{6})$/.exec(s);
  if (m) return [0, 2, 4].reduce((a, k, i) => a + [0.2126, 0.7152, 0.0722][i] * parseInt(m[1].slice(k, k + 2), 16) / 255, 0);
  m = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(s);
  if (m) return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
  return null;
}
// patentPaint(s): the style object forced to the patent profile. Strokes become black (white stays white, for
// knock-outs); fills become black when dark (arrowheads, dots) and white otherwise (occluding faces, boxes);
// gradient fills become white; faint fills (opacity < 0.5) are dropped; opacity, filters and blends are removed;
// widths are raised to STYLE.line.min. Each change is counted in STYLE.patentForced for the gate.
export function patentPaint(s) {
  const o = { ...s }, n = STYLE.patentForced;
  if (o.stroke !== undefined && o.stroke !== 'none') {
    const l = colourLum(o.stroke), to = l !== null && l > 0.85 ? '#ffffff' : '#000000';
    if (String(o.stroke).toLowerCase() !== to && o.stroke !== '#fff' && o.stroke !== '#000') n.stroke++;
    o.stroke = to;
    const w = o.width ?? STYLE.line.normal; if (w < STYLE.line.min) { o.width = STYLE.line.min; n.width++; }
  }
  const faint = (o.fillOpacity !== undefined && o.fillOpacity < 0.5) || (o.opacity !== undefined && o.opacity < 0.5);
  if (o.fill !== undefined && o.fill !== 'none') {
    if (faint) { o.fill = 'none'; n.fill++; }
    else {
      const l = colourLum(o.fill), to = l === null ? '#ffffff' : l < 0.3 ? '#000000' : '#ffffff';
      if (!['#000', '#000000', '#fff', '#ffffff', 'white', 'black'].includes(String(o.fill).toLowerCase())) n.fill++;
      o.fill = to;
    }
  }
  for (const k of ['opacity', 'fillOpacity', 'strokeOpacity', 'filter', 'blend']) if (o[k] !== undefined) { delete o[k]; n.opacity++; }
  return o;
}
```

### `skills/schematic-figure/foundation/engine/core.js`
```javascript
// Core of the schematic engine. Units: 1 unit = 1 pt at final print size (1 mm = 2.8346 pt).
// A figure module exports `default function draw(F, L)`; the page (page.html) builds F, then calls it.
// Everything is SVG in the live DOM, so text is measured exactly and the tools can audit the result.

import { STYLE, PATENT, usePatentProfile, patentPaint } from './style.js';

export const MM = 72 / 25.4;
export const mm = (v) => v * MM;
const NS = 'http://www.w3.org/2000/svg';

// ---- element helpers -------------------------------------------------------------------------
export function el(parent, tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  if (parent) (parent.node || parent).appendChild(e);
  return e;
}
const node = (p) => (p && p.node) || p;

// style object -> SVG presentation attributes. Widths are in pt at final size.
export function paint(s = {}) {
  if (STYLE.format === 'patent') s = patentPaint(s);
  const a = {};
  a.fill = s.fill ?? 'none';
  if (s.stroke !== undefined && s.stroke !== 'none') {
    a.stroke = s.stroke; a['stroke-width'] = s.width ?? STYLE.line.normal;
    a['stroke-linecap'] = s.cap ?? 'round'; a['stroke-linejoin'] = s.join ?? 'round';
    if (s.dash) a['stroke-dasharray'] = Array.isArray(s.dash) ? s.dash.join(' ') : s.dash;
  } else a.stroke = 'none';
  if (s.opacity !== undefined) a.opacity = s.opacity;
  if (s.fillOpacity !== undefined) a['fill-opacity'] = s.fillOpacity;
  if (s.strokeOpacity !== undefined) a['stroke-opacity'] = s.strokeOpacity;
  if (s.filter) a.filter = s.filter;
  if (s.blend) a.style = `mix-blend-mode:${s.blend}`;
  return a;
}

// patent profile: text is black; white text stays white (it is a knock-out, never content)
function patentText(c) {
  if (c === undefined || c === '#000000') return '#000000';
  const w = /^(#fff|#ffffff|white)$/i.test(c); STYLE.patentForced.text += w ? 0 : 1; return w ? '#ffffff' : '#000000';
}

// ---- rich text ---------------------------------------------------------------------------------
// Markup: x_{ij} subscript, x^{2} superscript (single char also: x_i, x^2), *italic*, **bold**,
// \n newline, {#e03c31|text} a run in one colour (other markup allowed inside), \* \_ \^ \{ literal characters.
// Greek and symbols: type the Unicode character (α β λ ω → ∑ ×).
// index of the '}' closing the '{' at `open` (nesting and \-escapes respected), or -1
function closeBrace(str, open) {
  for (let i = open + 1, depth = 1; i < str.length; i++) {
    if (str[i] === '\\') { i++; continue; }
    if (str[i] === '{') depth++;
    else if (str[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

export function parseRich(str) {
  const runs = []; let i = 0, buf = '', it = false, bd = false;
  const flush = (shift = 0) => { if (buf) runs.push({ t: buf, it, bd, shift }); buf = ''; };
  while (i < str.length) {
    const c = str[i];
    if (c === '\\' && '*_^{}\\'.includes(str[i + 1] ?? '')) { buf += str[i + 1]; i += 2; continue; }
    if (c === '{' && str[i + 1] === '#') {
      const bar = str.indexOf('|', i), end = closeBrace(str, i);
      if (bar > 0 && end > bar) {
        flush(); const color = str.slice(i + 1, bar);
        for (const r of parseRich(str.slice(bar + 1, end))) runs.push(r.br ? r : { ...r, it: r.it !== it, bd: r.bd || bd, color: r.color ?? color });
        i = end + 1; continue;
      }
    }
    if (c === '*' && str[i + 1] === '*') { flush(); bd = !bd; i += 2; continue; }
    if (c === '*') { flush(); it = !it; i++; continue; }
    if ((c === '_' || c === '^') && i + 1 < str.length) {
      flush(); const shift = c === '_' ? -1 : 1; let body;
      // an unclosed brace runs to the end of the string rather than looping
      if (str[i + 1] === '{') { let j = closeBrace(str, i + 1); if (j < 0) j = str.length; body = str.slice(i + 2, j); i = j + 1; }
      else { body = str[i + 1]; i += 2; }
      // italics inside scripts follow the same toggles
      for (const r of parseRich(body)) runs.push({ ...r, it: r.it !== it, bd: r.bd || bd, shift });
      continue;
    }
    if (c === '\n') { flush(); runs.push({ br: true }); i++; continue; }
    buf += c; i++;
  }
  flush();
  return runs;
}

// text(parent, x, y, str, {size, weight, anchor: start|middle|end, valign: baseline|middle|top|bottom,
//   color, lineGap, role, underline: true | {offset, width, color, extend}}) role tags the text for the gate: 'label' (default),
//   'panel', 'title', 'tick'. underline draws a rule under the (last) line; the line element is t.underline.
export function text(parent, x, y, str, o = {}) {
  const size = o.size ?? STYLE.text.label;
  const t = el(parent, 'text', {
    x, y, 'font-family': o.family ?? (o.math ? STYLE.font.math : STYLE.font.family), 'font-size': size,
    'font-weight': o.weight ?? 'normal', fill: STYLE.format === 'patent' ? patentText(o.color) : o.color ?? STYLE.color.text,
    'text-anchor': o.anchor ?? 'start', 'data-role': o.role ?? 'label',
  });
  if (o.italic) t.setAttribute('font-style', 'italic');
  if (o.letterSpacing) t.setAttribute('letter-spacing', o.letterSpacing);
  const lines = [[]];
  for (const r of parseRich(String(str))) r.br ? lines.push([]) : lines[lines.length - 1].push(r);
  const lh = size * (o.lineGap ?? 1.18);
  lines.forEach((runs, li) => {
    let cur = 0; let first = true;
    for (const r of runs) {
      const ts = el(t, 'tspan', {}, r.t);
      if (first) { ts.setAttribute('x', x); if (li > 0) ts.setAttribute('dy', lh); }
      const want = r.shift === -1 ? size * 0.28 : r.shift === 1 ? -size * 0.38 : 0;
      const dy = want - cur;
      if (dy) ts.setAttribute('dy', (first && li > 0 ? lh : 0) + dy);
      cur = want;
      if (r.shift) ts.setAttribute('font-size', size * 0.72);
      if (r.it) ts.setAttribute('font-style', 'italic');
      if (r.bd) ts.setAttribute('font-weight', 'bold');
      if (r.color && STYLE.format !== 'patent') ts.setAttribute('fill', r.color);
      first = false;
    }
    if (runs.length === 0 && li > 0) el(t, 'tspan', { x, dy: lh }, ' ');
    // return to baseline at the end of each line so the next line's dy is clean
    if (cur !== 0) { const z = el(t, 'tspan', { dy: -cur }, '​'); cur = 0; }
  });
  // vertical alignment after layout (bbox of the whole block)
  const va = o.valign ?? 'baseline';
  if (va !== 'baseline') {
    const b = t.getBBox(); let dy = 0;
    if (va === 'middle') dy = y - (b.y + b.height / 2);
    else if (va === 'top') dy = y - b.y;
    else if (va === 'bottom') dy = y - (b.y + b.height);
    t.setAttribute('transform', `translate(0 ${dy.toFixed(3)})`);
  }
  if (o.rotate) { // rotate about the anchor point (x, y), after vertical alignment
    const prev = t.getAttribute('transform') || '';
    t.setAttribute('transform', `rotate(${o.rotate} ${x} ${y}) ${prev}`);
    t.setAttribute('data-rotate', o.rotate);
  }
  if (o.italic === undefined && o.math) t.setAttribute('font-style', 'italic');
  if (o.halo) { // white knock-out behind the text, for labels over busy art
    t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke', o.halo === true ? '#fff' : o.halo);
    t.setAttribute('stroke-width', o.haloWidth ?? size * 0.35); t.setAttribute('stroke-linejoin', 'round');
  }
  if (o.underline) { // rule under the last line's baseline, spanning the text; same transform as the text
    const u = o.underline === true ? {} : o.underline, b = t.getBBox(), yb = y + lh * (lines.length - 1) + (u.offset ?? size * 0.16);
    const ext = u.extend ?? 0;
    t.underline = el(parent, 'line', { x1: +(b.x - ext).toFixed(3), y1: +yb.toFixed(3), x2: +(b.x + b.width + ext).toFixed(3), y2: +yb.toFixed(3),
      stroke: STYLE.format === 'patent' ? '#000000' : u.color ?? o.color ?? STYLE.color.text, 'stroke-width': u.width ?? Math.max(STYLE.line.min, size * 0.07), 'stroke-linecap': 'butt',
      transform: t.getAttribute('transform') || undefined, 'data-part': 'underline' });
  }
  return t;
}

// ---- geometry in root coordinates ---------------------------------------------------------------
// Map a point in the local coordinates of element `e` to root (page) coordinates.
export function toRoot(F, e, x, y) {
  const r = F.svg.getScreenCTM().inverse().multiply(node(e).getScreenCTM());
  const p = new DOMPoint(x, y).matrixTransform(r);
  return [p.x, p.y];
}
export function bboxRoot(F, e) {
  const b = node(e).getBBox();
  const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => toRoot(F, e, x, y));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
}

// ---- the figure ---------------------------------------------------------------------------------
// figure({width: 89|120|136|183 (mm) or {pt}, height (mm)})
// illustrate: true | {light, contrast, ...} turns on the illustrated finish (engine/illustrate.js) for every supporting part.
export function createFigure(host, { width = 89, height = 60, background = '#fff', name = 'figure', mode = 'design', format = 'journal', illustrate, sheet = 'letter', sheetId, numerals } = {}) {
  if (illustrate !== undefined) STYLE.illustrate = illustrate;
  if (format === 'patent') {   // 37 CFR 1.84: the page is the drawing sheet; width/height come from `sheet`
    usePatentProfile();
    [width, height] = PATENT.sheets[sheet] ?? PATENT.sheets.letter; background = '#fff';
  }
  const W = mm(width), H = mm(height);
  const svg = el(host, 'svg', {
    xmlns: NS, 'xmlns:xlink': 'http://www.w3.org/1999/xlink', width: `${width}mm`, height: `${height}mm`,
    viewBox: `0 0 ${W.toFixed(3)} ${H.toFixed(3)}`, 'data-name': name,
  });
  const defs = el(svg, 'defs');
  if (background) el(svg, 'rect', { x: 0, y: 0, width: W, height: H, fill: background, 'data-role': 'background' });
  const root = el(svg, 'g', { id: 'root' });
  const F = {
    svg, defs, root, node: root, W, H, widthMM: width, heightMM: height, name, mode, format,
    anchors: {},       // name -> {x, y, dir} in root pt
    relations: [],     // declared spec relations {from, to, kind}
    drawn: [],         // edges actually drawn by connectors {from, to, kind}
    panels: [],
    _uid: 0,
    style: STYLE,      // F.style.illustrate = true switches the illustrated finish on for the rest of the figure
  };
  F.uid = (p = 'id') => `${p}${++F._uid}`;
  if (format === 'patent') {
    // the sight (1.84(g)): everything drawn stays inside it. F.drawing is a group whose origin is the sight's top-left.
    const m = PATENT.margin;
    F.sightMM = { x: m.left, y: m.top, w: width - m.left - m.right, h: height - m.top - m.bottom };
    F.sight = { x: mm(F.sightMM.x), y: mm(F.sightMM.y), w: mm(F.sightMM.w), h: mm(F.sightMM.h) };
    F.drawing = { node: el(root, 'g', { transform: `translate(${F.sight.x.toFixed(3)} ${F.sight.y.toFixed(3)})`, 'data-part': 'sight' }) };
    F.sheet = sheet; F.numeralsDoc = numerals;
    // sheet number (1.84(t)): top middle of the sight, larger than the reference numerals
    if (sheetId) text(root, F.sight.x + F.sight.w / 2, F.sight.y + PATENT.text.sheet * PATENT.capHeight, sheetId, { size: PATENT.text.sheet, anchor: 'middle', role: 'sheet' });
  }
  // anchor(name, element, x, y, dir): register a named point (in element-local coords) for connectors
  F.anchor = (name, e, x, y, dir) => {
    const [X, Y] = toRoot(F, e, x, y); F.anchors[name] = { x: X, y: Y, dir }; return F.anchors[name];
  };
  F.at = (name) => { const a = F.anchors[name]; if (!a) throw new Error(`unknown anchor "${name}"`); return a; };
  // relate(from, to, kind): declare an edge the figure must show (checked by the gate)
  F.relate = (from, to, kind = 'flow') => F.relations.push({ from, to, kind });
  // drew(from, to, kind): register a relation drawn by custom art (block arrows, beams, cables) for the gate
  F.drew = (from, to, kind = 'flow') => F.drawn.push({ from, to, kind });
  // panel(label, {x, y, w, h} in mm) -> group whose origin is the panel's top-left, units pt
  F.panel = (label, { x, y, w, h, labelDx = 0, labelDy = 0, labelSize = STYLE.text.panel, labelWeight = 'bold', labelFormat = (s) => s }) => {
    const g = el(root, 'g', { transform: `translate(${mm(x)} ${mm(y)})`, 'data-panel': label });
    const P = { node: g, label, x: mm(x), y: mm(y), w: mm(w), h: mm(h) };
    if (label) text(g, labelDx, labelSize * 0.95 + labelDy, labelFormat(label), { size: labelSize, weight: labelWeight, role: 'panel' });
    F.panels.push(P);
    return P;
  };
  return F;
}

// group(parent, {x, y, rotate, scale, id}) -> {node}
export function group(parent, o = {}) {
  const tr = [];
  if (o.x || o.y) tr.push(`translate(${o.x ?? 0} ${o.y ?? 0})`);
  if (o.rotate) tr.push(`rotate(${o.rotate})`);
  if (o.scale) tr.push(`scale(${o.scale})`);
  if (o.matrix) tr.push(`matrix(${o.matrix.join(' ')})`);
  const g = el(parent, 'g', { transform: tr.join(' ') || undefined, id: o.id, 'data-part': o.part, 'clip-path': o.clip, opacity: o.opacity });
  return { node: g };
}

// manifest of the rendered figure for the tools: text, strokes, anchors, relations, images
export function manifest(F) {
  const inv = F.svg.getScreenCTM().inverse();
  const scaleOf = (e) => { const m = inv.multiply(e.getScreenCTM()); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); };
  const texts = [...F.svg.querySelectorAll('text')].map((t) => {
    const b = bboxRoot(F, t); const s = scaleOf(t);
    const sizes = [parseFloat(t.getAttribute('font-size')) * s];
    t.querySelectorAll('tspan[font-size]').forEach((ts) => sizes.push(parseFloat(ts.getAttribute('font-size')) * s));
    return { s: t.textContent.replace(/​/g, ''), role: t.dataset.role || 'label', box: b, size: sizes[0], minSize: Math.min(...sizes),
      family: t.getAttribute('font-family'), color: t.getAttribute('fill'), halo: t.hasAttribute('paint-order'),
      rotate: +(t.dataset.rotate || 0), italic: t.getAttribute('font-style') === 'italic' || !!t.querySelector('tspan[font-style=italic]'),
      weight: t.getAttribute('font-weight') || 'normal',
      ...(F.format === 'patent' ? { leads: t.closest('[data-leads]') ? +t.closest('[data-leads]').dataset.leads : null, under: !!t.closest('[data-under]') } : {}) };
  });
  const strokes = [];
  F.svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse').forEach((e) => {
    const sw = e.getAttribute('stroke-width'); const st = e.getAttribute('stroke');
    if (!st || st === 'none' || !sw) return;
    if (e.closest('defs,mask,clipPath,pattern,marker')) return;
    strokes.push({ w: parseFloat(sw) * scaleOf(e), tag: e.tagName, part: e.closest('[data-part]')?.dataset.part ?? '' });
  });
  const images = [...F.svg.querySelectorAll('image')].map((im) => {
    const b = bboxRoot(F, im);
    return { href: (im.getAttribute('href') || '').slice(0, 80), box: b, px: [+im.dataset.pxw || 0, +im.dataset.pxh || 0] };
  });
  return { name: F.name, mode: F.mode, format: F.format, widthMM: F.widthMM, heightMM: F.heightMM, W: F.W, H: F.H, texts, strokes, images,
    anchors: F.anchors, relations: F.relations, drawn: F.drawn,
    ...(F.format === 'patent' ? { patent: { sheet: F.sheet, sight: F.sight, numeralsDoc: F.numeralsDoc ?? null, forced: { ...STYLE.patentForced } } } : {}),
    panels: F.panels.map((p) => ({ label: p.label, x: p.x, y: p.y, w: p.w, h: p.h })) };
}
```

### `skills/schematic-figure/foundation/engine/draw.js`
```javascript
// Drawing primitives. Every function takes a parent (group, panel or F) first and returns the element.
import { el, paint, text, toRoot, bboxRoot } from './core.js';
import { STYLE, shade } from './style.js';

const f3 = (v) => +(+v).toFixed(3);
const pts = (a) => a.map(([x, y]) => `${f3(x)},${f3(y)}`).join(' ');

export const path = (p, d, s = {}) => el(p, 'path', { d, ...paint(s), 'data-part': s.part });
export const line = (p, [x1, y1], [x2, y2], s = {}) =>
  el(p, 'line', { x1: f3(x1), y1: f3(y1), x2: f3(x2), y2: f3(y2), ...paint({ stroke: STYLE.color.ink, ...s }), 'data-part': s.part });
export const polyline = (p, a, s = {}) => el(p, 'polyline', { points: pts(a), ...paint({ stroke: STYLE.color.ink, ...s }), 'data-part': s.part });
export const polygon = (p, a, s = {}) => el(p, 'polygon', { points: pts(a), ...paint(s), 'data-part': s.part });
export const rect = (p, x, y, w, h, s = {}) =>
  el(p, 'rect', { x: f3(x), y: f3(y), width: f3(w), height: f3(h), rx: s.r, ry: s.r, ...paint(s), 'data-part': s.part });
export const circle = (p, cx, cy, r, s = {}) => el(p, 'circle', { cx: f3(cx), cy: f3(cy), r: f3(r), ...paint(s), 'data-part': s.part });
export const ellipse = (p, cx, cy, rx, ry, s = {}) =>
  el(p, 'ellipse', { cx: f3(cx), cy: f3(cy), rx: f3(rx), ry: f3(ry), ...paint(s), 'data-part': s.part });

// smooth curve through points (Catmull-Rom -> cubic Bezier); closed=true for loops
export function smooth(a, closed = false, tension = 0.5) {
  const n = a.length; if (n < 2) return '';
  const P = (i) => closed ? a[(i + n) % n] : a[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f3(a[0][0])},${f3(a[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), k = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C${f3(c1[0])},${f3(c1[1])} ${f3(c2[0])},${f3(c2[1])} ${f3(p2[0])},${f3(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}
// sample y = fn(x) on [x0, x1] into a point list
export const sample = (fn, x0, x1, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });

// ---- paint servers and filters (defined once per figure in F.defs) ------------------------------
function defsOf(p) { let n = p.node || p; while (n && n.tagName !== 'svg') n = n.parentNode; return n.querySelector('defs'); }
let gid = 0;
// linear gradient: stops [[offset 0..1, colour, opacity?], ...]; angle in degrees (0 = left->right)
export function linearGradient(p, stops, angle = 0) {
  const id = `lg${++gid}`, a = angle * Math.PI / 180;
  const g = el(defsOf(p), 'linearGradient', { id, x1: f3(0.5 - Math.cos(a) / 2), y1: f3(0.5 - Math.sin(a) / 2), x2: f3(0.5 + Math.cos(a) / 2), y2: f3(0.5 + Math.sin(a) / 2) });
  for (const [o, c, op] of stops) el(g, 'stop', { offset: o, 'stop-color': c, 'stop-opacity': op ?? 1 });
  return `url(#${id})`;
}
export function radialGradient(p, stops, { cx = 0.5, cy = 0.5, r = 0.5, fx, fy } = {}) {
  const id = `rg${++gid}`;
  const g = el(defsOf(p), 'radialGradient', { id, cx, cy, r, fx: fx ?? cx, fy: fy ?? cy });
  for (const [o, c, op] of stops) el(g, 'stop', { offset: o, 'stop-color': c, 'stop-opacity': op ?? 1 });
  return `url(#${id})`;
}
// cylinder-like shading across a shape: light edge -> base -> dark edge
export const shaded = (p, base, angle = 90) =>
  linearGradient(p, [[0, shade(base, 0.45)], [0.35, shade(base, 0.12)], [0.7, base], [1, shade(base, -0.35)]], angle);
// soft glow (for beams, emission). Returns a filter url.
export function glow(p, sd = 1.2) {
  const id = `gl${++gid}`, f = el(defsOf(p), 'filter', { id, x: '-50%', y: '-50%', width: '200%', height: '200%' });
  el(f, 'feGaussianBlur', { stdDeviation: sd, result: 'b' });
  const m = el(f, 'feMerge'); el(m, 'feMergeNode', { in: 'b' }); el(m, 'feMergeNode', { in: 'SourceGraphic' });
  return `url(#${id})`;
}
export function blur(p, sd = 1) {
  const id = `bl${++gid}`, f = el(defsOf(p), 'filter', { id, x: '-50%', y: '-50%', width: '200%', height: '200%' });
  el(f, 'feGaussianBlur', { stdDeviation: sd }); return `url(#${id})`;
}
export function dropShadow(p, { dx = 0.6, dy = 0.8, sd = 0.9, opacity = 0.25 } = {}) {
  const id = `sh${++gid}`, f = el(defsOf(p), 'filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' });
  el(f, 'feDropShadow', { dx, dy, stdDeviation: sd, 'flood-opacity': opacity }); return `url(#${id})`;
}
// clip children of a group to a shape: clip(p, d) -> clip-path url
export function clipPath(p, d) {
  const id = `cp${++gid}`, c = el(defsOf(p), 'clipPath', { id }); el(c, 'path', { d }); return `url(#${id})`;
}

// ---- connectors -----------------------------------------------------------------------------------
// Arrowheads are filled triangles sized in pt (not SVG markers, which scale with stroke width).
function head(p, tip, dir, s) {
  const L = s.head ?? STYLE.arrow.head, Wd = s.headWidth ?? L * 0.42, [ux, uy] = dir, nx = -uy, ny = ux;
  const bx = tip[0] - ux * L, by = tip[1] - uy * L, notch = s.notch ?? 0.18;
  const a = [[tip[0], tip[1]], [bx + nx * Wd, by + ny * Wd], [tip[0] - ux * L * (1 - notch), tip[1] - uy * L * (1 - notch)], [bx - nx * Wd, by - ny * Wd]];
  return polygon(p, a, { fill: s.stroke ?? STYLE.color.ink, part: 'arrowhead' });
}
const unit = (dx, dy) => { const n = Math.hypot(dx, dy) || 1; return [dx / n, dy / n]; };

// arrow(p, from, to, {bend, via:[pts], stroke, width, head, both, dash, gap0, gap1})
// from/to: [x, y] in p's coords, or an anchor name (string) resolved from F (root coords; p must be F/root then).
// bend: signed curvature as a fraction of length (0 = straight). via: route through points (polyline, rounded).
export function arrow(p, from, to, s = {}) {
  const F = s.F; const res = (q) => typeof q === 'string' ? toLocal(F, p, F.at(q)) : q;
  let a = res(from), b = res(to);
  const g0 = s.gap0 ?? 0, g1 = s.gap1 ?? 0, st = { stroke: STYLE.color.ink, width: STYLE.line.normal, ...s };
  let d, endDir, startDir;
  if (s.via && s.via.length) {
    const P = [a, ...s.via, b];
    const u0 = unit(P[1][0] - a[0], P[1][1] - a[1]); a = [a[0] + u0[0] * g0, a[1] + u0[1] * g0];
    const n = P.length, u1 = unit(b[0] - P[n - 2][0], b[1] - P[n - 2][1]); b = [b[0] - u1[0] * g1, b[1] - u1[1] * g1];
    P[0] = a; P[n - 1] = b; endDir = u1; startDir = [-u0[0], -u0[1]];
    const r = s.radius ?? 3; d = `M${f3(a[0])},${f3(a[1])}`;
    for (let i = 1; i < n - 1; i++) {
      const [px, py] = P[i], ua = unit(px - P[i - 1][0], py - P[i - 1][1]), ub = unit(P[i + 1][0] - px, P[i + 1][1] - py);
      const rr = Math.min(r, Math.hypot(px - P[i - 1][0], py - P[i - 1][1]) / 2, Math.hypot(P[i + 1][0] - px, P[i + 1][1] - py) / 2);
      d += ` L${f3(px - ua[0] * rr)},${f3(py - ua[1] * rr)} Q${f3(px)},${f3(py)} ${f3(px + ub[0] * rr)},${f3(py + ub[1] * rr)}`;
    }
    const L = st.head ?? STYLE.arrow.head, tail = s.both ? L * 0.8 : 0;
    d += ` L${f3(b[0] - endDir[0] * L * 0.8)},${f3(b[1] - endDir[1] * L * 0.8)}`;
    if (tail) d = d.replace(/^M[^ ]+/, `M${f3(a[0] - startDir[0] * tail)},${f3(a[1] - startDir[1] * tail)}`);
  } else {
    const u = unit(b[0] - a[0], b[1] - a[1]); a = [a[0] + u[0] * g0, a[1] + u[1] * g0]; b = [b[0] - u[0] * g1, b[1] - u[1] * g1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), bend = s.bend ?? 0;
    const L = st.head ?? STYLE.arrow.head;
    if (bend) {
      const mx = (a[0] + b[0]) / 2 - u[1] * bend * len, my = (a[1] + b[1]) / 2 + u[0] * bend * len;
      endDir = unit(b[0] - mx, b[1] - my); startDir = unit(a[0] - mx, a[1] - my);
      const bb = [b[0] - endDir[0] * L * 0.8, b[1] - endDir[1] * L * 0.8];
      const aa = s.both ? [a[0] - startDir[0] * L * 0.8, a[1] - startDir[1] * L * 0.8] : a;
      d = `M${f3(aa[0])},${f3(aa[1])} Q${f3(mx)},${f3(my)} ${f3(bb[0])},${f3(bb[1])}`;
    } else {
      endDir = u; startDir = [-u[0], -u[1]];
      const aa = s.both ? [a[0] + u[0] * L * 0.8, a[1] + u[1] * L * 0.8] : a;
      d = `M${f3(aa[0])},${f3(aa[1])} L${f3(b[0] - u[0] * L * 0.8)},${f3(b[1] - u[1] * L * 0.8)}`;
    }
  }
  const g = el(p, 'g', { 'data-part': s.part ?? 'arrow' });
  path(g, d, { stroke: st.stroke, width: st.width, dash: st.dash, part: 'arrow-shaft', opacity: st.opacity });
  const H = (tip, dir) => s.headStyle === 'open'
    ? path(g, `M${f3(tip[0] - dir[0] * (st.head ?? STYLE.arrow.head) - dir[1] * (st.head ?? STYLE.arrow.head) * 0.5)},${f3(tip[1] - dir[1] * (st.head ?? STYLE.arrow.head) + dir[0] * (st.head ?? STYLE.arrow.head) * 0.5)} L${f3(tip[0])},${f3(tip[1])} L${f3(tip[0] - dir[0] * (st.head ?? STYLE.arrow.head) + dir[1] * (st.head ?? STYLE.arrow.head) * 0.5)},${f3(tip[1] - dir[1] * (st.head ?? STYLE.arrow.head) - dir[0] * (st.head ?? STYLE.arrow.head) * 0.5)}`, { stroke: st.stroke, width: st.width, join: 'miter', part: 'arrowhead' })
    : head(g, tip, dir, st);
  if (!s.noHead) H(b, endDir);
  if (s.both) H(a, startDir);
  if (F && typeof from === 'string' && typeof to === 'string') F.drawn.push({ from, to, kind: s.kind ?? 'flow' });
  if (s.label) {
    const m = s.labelAt ?? 0.5, mx = a[0] + (b[0] - a[0]) * m, my = a[1] + (b[1] - a[1]) * m;
    const off = s.labelOffset ?? 4, u = unit(b[0] - a[0], b[1] - a[1]);
    text(g, mx - u[1] * off, my + u[0] * off, s.label, { anchor: 'middle', valign: 'middle', size: s.labelSize, color: s.labelColor });
  }
  return g;
}
// root-coordinate point -> local coordinates of parent p
export function toLocal(F, p, { x, y }) {
  const n = p.node || p; const m = n.getScreenCTM().inverse().multiply(F.svg.getScreenCTM());
  const q = new DOMPoint(x, y).matrixTransform(m); return [q.x, q.y];
}

// block arrow (fat, filled), e.g. for "training update" or stage transitions
export function blockArrow(p, [x0, y0], [x1, y1], { width = 6, head = 7, headWidth = 11, fill = STYLE.color.light, stroke, part } = {}) {
  const [ux, uy] = unit(x1 - x0, y1 - y0), nx = -uy, ny = ux, bx = x1 - ux * head, by = y1 - uy * head, w = width / 2, hw = headWidth / 2;
  return polygon(p, [[x0 + nx * w, y0 + ny * w], [bx + nx * w, by + ny * w], [bx + nx * hw, by + ny * hw], [x1, y1],
    [bx - nx * hw, by - ny * hw], [bx - nx * w, by - ny * w], [x0 - nx * w, y0 - ny * w]], { fill, stroke, width: 0.4, part: part ?? 'block-arrow' });
}

// leader-line callout: dot at the target, a straight leader to the nearest edge of the label, text at `at`
// (at = text anchor point; anchor defaults to the side facing away from the target).
// target may also be an array of points: one leader (and dot) per target from the same label ("seeds lost" -> two places).
export function callout(p, target, at, str, o = {}) {
  if (Array.isArray(target[0])) {
    const ts = target, g0 = callout(p, ts[0], at, str, o);
    for (const t of ts.slice(1)) { const gi = callout(p, t, at, str, { ...o, anchor: o.anchor ?? (at[0] < ts[0][0] ? 'end' : 'start') }); gi.querySelectorAll('text').forEach((e) => e.remove()); while (gi.firstChild) g0.appendChild(gi.firstChild); gi.remove(); }
    return g0;
  }
  const g = el(p, 'g', { 'data-part': 'callout' });
  const anchor = o.anchor ?? (at[0] < target[0] ? 'end' : 'start');
  const t = text(g, at[0], at[1], str, { anchor, valign: 'middle', size: o.size, color: o.textColor, halo: o.halo });
  const b = t.getBBox(), m = t.transform.baseVal.consolidate(), ty = m ? m.matrix.f : 0, pad = o.pad ?? 0.8;
  const bx0 = b.x - pad, bx1 = b.x + b.width + pad, by0 = b.y + ty - pad, by1 = b.y + ty + b.height + pad;
  // nearest point on the padded label box; prefer the vertical middle of a side when the target is beside it
  let ex = Math.min(bx1, Math.max(bx0, target[0])), ey = Math.min(by1, Math.max(by0, target[1]));
  if (target[1] >= by0 && target[1] <= by1) ey = (by0 + by1) / 2;
  if (target[0] >= bx0 && target[0] <= bx1) ex = Math.min(bx1 - 1, Math.max(bx0 + 1, target[0]));
  else if (target[1] < by0 || target[1] > by1) ex = target[0] < bx0 ? bx0 + Math.min(2, b.width / 3) : bx1 - Math.min(2, b.width / 3);
  const pts2 = o.elbow ? [target, o.elbow, [ex, ey]] : [target, [ex, ey]];
  polyline(g, pts2, { stroke: o.color ?? STYLE.color.ink, width: o.width ?? STYLE.line.hair * 1.6 });
  if (o.dot !== false) circle(g, target[0], target[1], o.dotR ?? 0.7, { fill: o.color ?? STYLE.color.ink });
  return g;
}

// bracket spanning [a, b] along a side ('left'|'right'|'top'|'bottom'), with optional label
export function bracket(p, a, b, { side = 'bottom', depth = 2.5, label, stroke = STYLE.color.ink, width = STYLE.line.thin } = {}) {
  const g = el(p, 'g', { 'data-part': 'bracket' }); let d, tp, anchor = 'middle', va = 'middle';
  if (side === 'bottom' || side === 'top') {
    const s = side === 'bottom' ? 1 : -1, y = a[1];
    d = `M${a[0]},${y} l0,${s * depth} L${b[0]},${y + s * depth} l0,${-s * depth}`;
    tp = [(a[0] + b[0]) / 2, y + s * (depth + 4)]; va = side === 'bottom' ? 'top' : 'bottom'; tp[1] = y + s * (depth + 1.5);
  } else {
    const s = side === 'right' ? 1 : -1, x = a[0];
    d = `M${x},${a[1]} l${s * depth},0 L${x + s * depth},${b[1]} l${-s * depth},0`;
    tp = [x + s * (depth + 1.5), (a[1] + b[1]) / 2]; anchor = side === 'right' ? 'start' : 'end';
  }
  path(g, d, { stroke, width });
  if (label) text(g, tp[0], tp[1], label, { anchor, valign: va });
  return g;
}

// zoom inset: a box around `src` (x,y,w,h), a box at `dst`, and two connector lines between near corners
export function zoomLines(p, src, dst, { stroke = STYLE.color.mid, width = STYLE.line.hair, dash = '1.2 1', box = true } = {}) {
  const g = el(p, 'g', { 'data-part': 'zoom' });
  if (box) rect(g, src.x, src.y, src.w, src.h, { stroke, width: width * 1.5 });
  const cs = (r) => [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
  const A = cs(src), B = cs(dst);
  // pick the two corner pairs whose connecting lines do not cross either box: use the pair of corners facing each other
  const cxA = src.x + src.w / 2, cyA = src.y + src.h / 2, cxB = dst.x + dst.w / 2, cyB = dst.y + dst.h / 2;
  const horiz = Math.abs(cxB - cxA) * src.h > Math.abs(cyB - cyA) * src.w;
  const idx = horiz ? (cxB > cxA ? [[1, 0], [2, 3]] : [[0, 1], [3, 2]]) : (cyB > cyA ? [[3, 0], [2, 1]] : [[0, 3], [1, 2]]);
  for (const [i, j] of idx) line(g, A[i], B[j], { stroke, width, dash });
  return g;
}

// ---- isometric / oblique helpers -------------------------------------------------------------------
// iso(x, y, z) -> [X, Y] screen offset; default 30-degree isometric, scale 1. Use for chips, slabs, stacks.
export function isoProj({ angle = 30, sx = 1, sy = 1, sz = 1 } = {}) {
  const c = Math.cos(angle * Math.PI / 180), s = Math.sin(angle * Math.PI / 180);
  return (x, y, z = 0) => [(x - y) * c * sx, (x + y) * s * sy - z * sz];
}
// isometric box with three shaded faces. (x,y,z) origin corner, size (w along x, d along y, h up)
export function isoBox(p, proj, [x, y, z], [w, d, h], { top = '#dfe6ee', left, right, stroke = STYLE.color.ink, width = STYLE.line.thin, part } = {}) {
  const g = el(p, 'g', { 'data-part': part ?? 'iso-box' });
  const P = (a, b, c) => proj(x + a, y + b, z + c);
  const L = left ?? shade(top, -0.12), R = right ?? shade(top, -0.25);
  polygon(g, [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)], { fill: L, stroke, width });      // front-left face (y = d)
  polygon(g, [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)], { fill: R, stroke, width });      // front-right face (x = w)
  polygon(g, [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)], { fill: top, stroke, width });    // top
  return g;
}

// ---- raster placement (Blender renders, micrographs) ------------------------------------------------
// image(p, href, x, y, w, {pxw, pxh, anchors: {name: [px, py]}, F, prefix}) places the image with width w (pt),
// height from the pixel aspect, and registers each render anchor as a figure anchor `${prefix}${name}`.
export function image(p, href, x, y, w, o = {}) {
  const h = o.h ?? w * (o.pxh / o.pxw);
  const im = el(p, 'image', { href, x, y, width: w, height: h, preserveAspectRatio: 'none', 'data-pxw': o.pxw, 'data-pxh': o.pxh });
  if (o.anchors && o.F) for (const [k, [px, py]] of Object.entries(o.anchors))
    o.F.anchor((o.prefix ?? '') + k, p, x + px / o.pxw * w, y + py / o.pxh * h);
  return im;
}

// dashed or solid rounded frame used to group a subsystem, optional title tab
export function frame(p, x, y, w, h, { title, stroke = STYLE.color.mid, fill = 'none', dash, r = 2, width = STYLE.line.thin, titleSize } = {}) {
  const g = el(p, 'g', { 'data-part': 'frame' });
  rect(g, x, y, w, h, { r, stroke, fill, dash, width });
  if (title) text(g, x + 2, y - 1.6, title, { size: titleSize ?? STYLE.text.label, color: STYLE.color.text });
  return g;
}

// ---- vector import (RDKit molecules, exported vector art) -------------------------------------------
// await svgFile(p, '/figure/art/mol.svg', x, y, w, {h, part, keepBackground}) inlines an external SVG as vector
// content scaled to width w (pt). Returns {el, h}. White background rects are dropped unless keepBackground.
export async function svgFile(p, href, x, y, w, o = {}) {
  const t = await (await fetch(href + (href.includes('?') ? '&' : '?') + 'v=' + Date.now())).text();
  const src = new DOMParser().parseFromString(t, 'image/svg+xml').documentElement;
  const num = (v) => parseFloat(String(v || '0'));
  const vb = src.getAttribute('viewBox') || `0 0 ${num(src.getAttribute('width'))} ${num(src.getAttribute('height'))}`;
  const [, , vw, vh] = vb.split(/[ ,]+/).map(Number);
  const h = o.h ?? w * vh / vw;
  const s = el(p, 'svg', { x, y, width: w, height: h, viewBox: vb, overflow: 'visible', 'data-part': o.part ?? 'svg-import' });
  for (const c of [...src.childNodes]) s.appendChild(document.importNode(c, true));
  if (!o.keepBackground) for (const r of s.querySelectorAll('rect')) {
    const st = (r.getAttribute('style') || '') + ' ' + (r.getAttribute('fill') || '') + ' ' + (r.getAttribute('class') || '');
    if (/background|#FFFFFF|#ffffff|white/.test(st) && num(r.getAttribute('width')) >= vw * 0.9) r.remove();
  }
  return { el: s, h };
}
```

### `skills/schematic-figure/foundation/engine/illustrate.js`
```javascript
// Illustrated 2-D style layer: the finish an illustrator gives a flat shape (a soft gradient from the fill colour, lighter
// toward the light and cooler and darker away from it, a darker rim stroke of the same hue, reflected rim light on the
// shadow side, a soft highlight, an optional soft contact shadow), organic outlines (seeded low-frequency wobble) and
// seeded per-instance variation for repeated items. Every colour is derived from one base fill by HSL shifts, and
// everything is gradients and plain paths (no blur filters), so the PDF stays vector.
// Parts opt in with {illustrate: true | {light, rim, highlight, shadow, contrast, ...}}; a figure turns it on for every
// supporting part with `export const figure = {..., illustrate: true}` or `F.style.illustrate = true` (= L.STYLE.illustrate).
import { el } from './core.js';
import { STYLE } from './style.js';

const f3 = (v) => +(+v).toFixed(3);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;

// ---- switch ----------------------------------------------------------------------------------------
// illustrating(o) -> null (flat, the default) or the merged options object: the part's own `illustrate` wins over the
// global STYLE.illustrate; an object at either level supplies defaults (light, contrast, shadow, ...).
export function illustrating(o = {}) {
  const v = o.illustrate ?? STYLE.illustrate;
  if (!v) return null;
  const g = typeof STYLE.illustrate === 'object' && STYLE.illustrate ? STYLE.illustrate : {};
  return { ...g, ...(typeof v === 'object' ? v : {}) };
}

// ---- colour ----------------------------------------------------------------------------------------
const isHex = (c) => typeof c === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c);
export function hexToHsl(hex) {
  let c = hex.slice(1); if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = 60 * (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  }
  return [h, s, l];
}
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s); l = clamp(l);
  const a = s * Math.min(l, 1 - l), k = (n) => (n + h / 30) % 12, f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return '#' + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
// rotate hue h toward target by at most amt degrees (the short way round)
const toward = (h, target, amt) => { const d = ((target - h + 540) % 360) - 180; return h + Math.sign(d) * Math.min(Math.abs(d), amt); };
// tint(hex, {h, s, l}): shift hue (deg), saturation and lightness (additive, 0..1). Non-hex colours pass through.
export function tint(hex, { h = 0, s = 0, l = 0 } = {}) {
  if (!isHex(hex)) return hex;
  const [H, S, L] = hexToHsl(hex); return hslToHex(H + h, S + s, L + l);
}
// tones(base, {contrast}) -> {base, light, glow, dark, deep, line, shadow, spec}: the illustrator ramp of one fill.
// Lights warm slightly toward yellow, shadows cool toward blue-violet and gain saturation (hue shifts scale with the
// base saturation, so greys stay grey); line is the darker rim stroke of the same hue.
export function tones(base, { contrast = 1 } = {}) {
  if (!isHex(base)) return { base, light: base, glow: '#ffffff', dark: base, deep: base, line: '#555b66', shadow: '#1d2230', spec: '#ffffff' };
  const [h, s, l] = hexToHsl(base), c = contrast, hs = Math.min(1, s * 3), C = s * (1 - Math.abs(2 * l - 1));
  // colour by chroma, so a darker tone keeps (or slightly gains) the base's colourfulness instead of jumping in saturation
  const mk = (hh, k, ll) => { ll = clamp(ll); const room = 1 - Math.abs(2 * ll - 1); return hslToHex(hh, room > 1e-6 ? Math.min(1, C * k / room) : 0, ll); };
  const warm = toward(h, 50, 7 * c * hs), cool = toward(h, 235, 10 * c * hs);
  return {
    base,
    light: mk(warm, 1 - 0.1 * c, l + Math.min(0.5 * (1 - l), 0.16) * c),
    glow: mk(warm, 0.6, l + (1 - l) * 0.75),
    dark: mk(cool, 1 + 0.12 * c, l - Math.min(0.16, 0.24 * l) * c),
    deep: mk(cool, 1 + 0.2 * c, l - Math.min(0.28, 0.4 * l) * c),
    line: mk(toward(h, 235, 8 * hs), 1.15, l * 0.58),
    shadow: hslToHex(toward(h, 235, 25), Math.min(0.3, s * 0.5), 0.2),
    spec: mk(warm, 0.2, 0.985),
  };
}

// ---- seeded randomness -------------------------------------------------------------------------------
// rng(seed) -> () => [0, 1): deterministic (mulberry32). hashSeed(...numbers) -> a 32-bit seed (e.g. from a position).
export function rng(seed = 1) {
  let a = (Math.floor(Math.abs(seed) * 1000003) ^ 0x9e3779b9) >>> 0 || 1;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const hashSeed = (...v) => v.reduce((h, x) => { h = Math.imul(h ^ (Math.round(x * 1000) | 0), 2654435761) >>> 0; return (h ^ (h >>> 13)) >>> 0; }, 2166136261) % 1000003 + 1;

// vary(seed, i, {size, rot, aspect, hue, lum, sat, jitter}) -> {k, rot, aspect, dx, dy, dh, dl, ds, seed, rand, tint(hex)}
// Per-instance variation for item i of a repeated set: size factor k = 1 +- size (default 0.08), rot +- deg (12), aspect
// 1 +- aspect (0.08), dx, dy +- jitter (0, in your units), hue +- deg (5), lightness +- lum (0.04), saturation +- sat (0.04).
// seed is a fresh per-instance seed for the item's own outline noise. Same (seed, i) -> same draw.
export function vary(seed, i, o = {}) {
  const R = rng(hashSeed(seed, i, 17)), u = () => 2 * R() - 1;
  const v = { k: 1 + (o.size ?? 0.08) * u(), rot: (o.rot ?? 12) * u(), aspect: 1 + (o.aspect ?? 0.08) * u(), dx: (o.jitter ?? 0) * u(), dy: (o.jitter ?? 0) * u(),
    dh: (o.hue ?? 5) * u(), dl: (o.lum ?? 0.04) * u(), ds: (o.sat ?? 0.04) * u(), seed: Math.floor(R() * 999983) + 1, rand: R };
  v.tint = (hex) => tint(hex, { h: v.dh, s: v.ds, l: v.dl });
  return v;
}

// ---- organic outlines --------------------------------------------------------------------------------
// wobble(pts, {amp, seed, harmonics, closed, fine, weight(i, t)}) -> pts: pushes each point along the local normal by
// seeded low-frequency noise (a few harmonics with random phases; periodic on a closed outline, so it has no seam).
// amp in your units (default 3.5 % of the mean radius of a closed outline, 2 % of an open curve's length). fine adds a
// small high-frequency ripple (fraction of amp). weight(i, t) scales the push per point (0 pins it, e.g. a cell's base).
export function wobble(pts, o = {}) {
  const n = pts.length, closed = o.closed ?? true; if (n < 3) return pts.map((q) => [...q]);
  const cum = [0]; for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[n - 1] + (closed ? Math.hypot(pts[0][0] - pts[n - 1][0], pts[0][1] - pts[n - 1][1]) : 0) || 1;
  const amp = o.amp ?? (closed ? 0.035 * L / TAU : 0.02 * L), R = rng(o.seed ?? 1);
  const H = (o.harmonics ?? [2, 3, 4, 5, 7]).map((k) => ({ k, a: (0.5 + R()) / k ** 0.9, ph: R() * TAU }));
  const F = o.fine ? [11, 13, 17].map((k) => ({ k, a: o.fine * (0.5 + R()) / 3, ph: R() * TAU })) : [];
  const norm = H.reduce((s, h) => s + h.a, 0) / 1.7 || 1;
  return pts.map((q, i) => {
    const a = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1, t = cum[i] / L;
    let v = 0; for (const h of H) v += h.a * Math.sin(TAU * h.k * t + h.ph); v /= norm;
    for (const h of F) v += h.a * Math.sin(TAU * h.k * t + h.ph);
    const w = (o.weight ? o.weight(i, t) : 1) * amp * v;
    return [q[0] - ty / m * w, q[1] + tx / m * w];
  });
}
// blob(cx, cy, r, {seed, amp, n, aspect, rot, harmonics}) -> pts: a closed organic outline (round +- amp, default 0.06 r),
// stretched by aspect along rot (deg). Pass it to L.smooth(pts, true).
export function blob(cx, cy, r, o = {}) {
  const R = rng(o.seed ?? 1), n = o.n ?? 48, amp = o.amp ?? 0.06, as = o.aspect ?? 1, rot = (o.rot ?? 0) * Math.PI / 180;
  const H = (o.harmonics ?? [2, 3, 4, 5]).map((k) => ({ k, a: (0.5 + R()) / k ** 0.8, ph: R() * TAU })), norm = H.reduce((s, h) => s + h.a, 0) / 1.6;
  const c = Math.cos(rot), s = Math.sin(rot);
  return Array.from({ length: n }, (_, i) => {
    const t = i / n * TAU; let k = 0; for (const h of H) k += h.a * Math.cos(h.k * t + h.ph);
    const rr = r * (1 + amp * k / norm), x = rr * Math.cos(t) * Math.sqrt(as), y = rr * Math.sin(t) / Math.sqrt(as);
    return [cx + x * c - y * s, cy + x * s + y * c];
  });
}

// ---- paint servers (own id space, so figures that never illustrate keep their ids) ------------------
function defsOf(p) { let n = p.node || p; while (n && n.tagName !== 'svg') n = n.parentNode; return n.querySelector('defs'); }
let iid = 0;
const addStops = (g, stops) => { for (const [o, c, op] of stops) el(g, 'stop', { offset: f3(o), 'stop-color': c, 'stop-opacity': op ?? 1 }); };
// elliptical radial gradient in user space: centre (cx, cy), radii (rx, ry), turned rot deg
export function ellipseGradient(p, cx, cy, rx, ry, rot, stops) {
  const id = `il${++iid}`, g = el(defsOf(p), 'radialGradient', { id, gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 1,
    gradientTransform: `translate(${f3(cx)} ${f3(cy)}) rotate(${f3(rot || 0)}) scale(${f3(Math.max(rx, 1e-3))} ${f3(Math.max(ry, 1e-3))})` });
  addStops(g, stops); return `url(#${id})`;
}
function lineGradient(p, a, b, stops) {
  const id = `il${++iid}`, g = el(defsOf(p), 'linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: f3(a[0]), y1: f3(a[1]), x2: f3(b[0]), y2: f3(b[1]) });
  addStops(g, stops); return `url(#${id})`;
}
function clipOf(p, d) { const id = `il${++iid}`, c = el(defsOf(p), 'clipPath', { id }); el(c, 'path', { d }); return `url(#${id})`; }
function measure(p, d) { const t = el(p, 'path', { d }), b = t.getBBox(); t.remove(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }
const lightVec = (o) => {
  const gl = STYLE.illustrate && typeof STYLE.illustrate === 'object' ? STYLE.illustrate.light : undefined, a = (o.light ?? gl ?? -135) * Math.PI / 180;
  return [Math.cos(a), Math.sin(a), a];
};

// contactShadow(p, cx, cy, rx, ry, {opacity, color}) -> element: a soft elliptical shadow (gradient to transparent, vector)
export function contactShadow(p, cx, cy, rx, ry, o = {}) {
  const c = o.color ?? '#1d2230', op = o.opacity ?? 0.26;
  return el(p, 'ellipse', { cx: f3(cx), cy: f3(cy), rx: f3(rx), ry: f3(ry), fill: ellipseGradient(p, cx, cy, rx, ry, o.rot ?? 0, [[0, c, op], [0.5, c, op * 0.6], [1, c, 0]]), 'data-part': 'contact-shadow' });
}
// softSpot(p, cx, cy, rx, ry, rot, color, opacity) -> element: a soft glow / highlight ellipse fading to transparent
export function softSpot(p, cx, cy, rx, ry, rot, color = '#fff', op = 0.7) {
  return el(p, 'ellipse', { cx: f3(cx), cy: f3(cy), rx: f3(rx), ry: f3(ry), transform: rot ? `rotate(${f3(rot)} ${f3(cx)} ${f3(cy)})` : undefined,
    fill: ellipseGradient(p, cx, cy, rx, ry, 0, [[0, color, op], [0.45, color, op * 0.55], [1, color, 0]]), 'data-part': 'highlight' });
}

// finish(p, d, base, {light, contrast, shadow, rim, rimWidth, core, highlight, highlightAt, highlightSize, highlightRot,
//   outline, width, mottle, seed, box, tones, part}) -> {node, inner, over, box, tones, clip, fill}
// Draws the closed path d as an illustrated shape filled from the one colour `base`:
// - body: an elliptical gradient lit from `light` (page degrees the light comes from; -135 = upper left, the default),
//   light -> base -> dark -> deep; contrast scales every shift (0.5-0.7 for flat BioRender-like parts, 1.3 for glossy ones);
// - core (default 0.35): extra darkening in a band along the shadow-side edge; rim (0.7, false = none): reflected light in a
//   thin band along the same edge, which separates the shape from what is behind it; rimWidth (0.16 of the smaller radius);
// - highlight (0.75 opacity, false = none): a soft spot toward the light, at highlightAt [x, y], size highlightSize [fx, fy]
//   (fractions of the radii), long axis at highlightRot deg (default across the light direction);
// - outline (default the `line` tone: darker, same hue; false = none), width (pt, default STYLE.line.thin);
// - shadow: true | 'drop' (soft shadow offset away from the light) | 'ground' (flat ellipse under the shape) |
//   'offset' (the shape itself, shifted, at low opacity) | {kind, opacity, dx, dy, y, rx, ry};
// - mottle: n soft blotches of the light and dark tones inside (organic texture), seeded by seed.
// Draw the shape's contents (a nucleus, organelles) into `inner`: clipped, under the shading and the outline.
// box {x, y, w, h} skips the measuring (circles, many particles). fill = the body gradient url (reuse it to knock out
// interior detail in exactly the body colour).
export function finish(p, d, base, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'illustrated' });
  const b = o.box ?? measure(g, d), T = { ...tones(base, { contrast: o.contrast ?? 1 }), ...(o.tones ?? {}) };
  if (o.shadow) shapeShadow(g, d, b, T, o);
  const fill = bodyGradient(g, b, T, o);
  el(g, 'path', { d, fill, 'data-part': o.bodyPart ?? 'body' });
  const clip = clipOf(g, d), inner = el(g, 'g', { 'clip-path': clip });
  if (o.mottle) mottle(inner, b, T, o.mottle, o.seed);
  const over = shading(g, d, b, T, { ...o, clip });
  if (o.outline !== false) el(g, 'path', { d, fill: 'none', stroke: o.outline ?? T.line, 'stroke-width': f3(o.width ?? STYLE.line.thin), 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'data-part': o.outlinePart ?? 'outline' });
  return { node: g, inner, over, box: b, tones: T, clip, fill };
}
const radii = (b) => { const rx = b.w / 2 || 1, ry = b.h / 2 || 1; return [b.x + rx, b.y + ry, rx, ry, Math.min(rx, ry)]; };
// the pieces of finish, for parts that must interleave their own detail (see D.brainSagittal)
// bodyGradient(p, box, tones | base, o) -> url
export function bodyGradient(p, b, T, o = {}) {
  if (typeof T === 'string') T = tones(T, { contrast: o.contrast ?? 1 });
  const [cx, cy, rx, ry] = radii(b), [lx, ly] = lightVec(o);
  return ellipseGradient(p, cx + lx * 0.5 * rx, cy + ly * 0.5 * ry, rx * 1.6, ry * 1.6, 0, [[0, T.light], [0.33, T.base], [0.74, T.dark], [1, T.deep]]);
}
// shapeShadow(p, d, box, tones, {shadow}) -> element
export function shapeShadow(p, d, b, T, o = {}) {
  const [cx, cy, rx, ry, rm] = radii(b), [lx, ly] = lightVec(o);
  const sh = typeof o.shadow === 'object' ? o.shadow : { kind: o.shadow === true || !o.shadow ? 'drop' : o.shadow }, kind = sh.kind ?? 'drop', op = sh.opacity ?? (kind === 'ground' ? 0.3 : 0.2);
  if (kind === 'ground') return contactShadow(p, cx - lx * 0.1 * rx + (sh.dx ?? 0), sh.y ?? b.y + b.h, sh.rx ?? rx * 0.92, sh.ry ?? Math.max(0.09 * rx, 0.1 * ry), { opacity: op, color: T.shadow });
  if (kind === 'offset') return el(p, 'path', { d, fill: T.shadow, opacity: op, transform: `translate(${f3(sh.dx ?? -lx * 0.12 * rm)} ${f3(sh.dy ?? -ly * 0.12 * rm)})`, 'data-part': 'contact-shadow' });
  return contactShadow(p, cx - lx * 0.13 * rm + (sh.dx ?? 0), cy - ly * 0.13 * rm + (sh.dy ?? 0), rx * 1.1, ry * 1.1, { opacity: op, color: T.shadow });
}
function mottle(p, b, T, n, seed) {
  const [cx, cy, rx, ry, rm] = radii(b), R = rng(seed ?? 3);
  for (let i = 0; i < n; i++) {
    const a = R() * TAU, q = Math.sqrt(R()) * 0.75, mx = cx + Math.cos(a) * q * rx, my = cy + Math.sin(a) * q * ry, mr = rm * (0.16 + 0.2 * R());
    softSpot(p, mx, my, mr * (1 + 0.5 * R()), mr, R() * 180, i % 2 ? T.dark : T.light, 0.35);
  }
}
// shading(p, d, box, tones | base, {clip, core, coreWidth, rim, rimWidth, highlight, ...}) -> group: the core shadow, rim light and
// highlight, clipped to d; lay it over the body and its contents, under the outline. The two bands are wide clipped strokes
// tagged 'shade-block', so the gate does not count them as heavy lines.
export function shading(p, d, b, T, o = {}) {
  if (typeof T === 'string') T = tones(T, { contrast: o.contrast ?? 1 });
  const [cx, cy, rx, ry, rm] = radii(b), [lx, ly, la] = lightVec(o);
  const over = el(p, 'g', { 'clip-path': o.clip ?? clipOf(p, d), 'data-part': 'shading' });
  const A = [cx + lx * rx, cy + ly * ry], B = [cx - lx * rx, cy - ly * ry];
  const core = o.core ?? 0.35;
  if (core) el(over, 'path', { d, fill: 'none', stroke: lineGradient(p, A, B, [[0, T.deep, 0], [0.5, T.deep, 0], [1, T.deep, core]]), 'stroke-width': f3(Math.max(0.26, o.coreWidth ?? rm * 0.55)), 'stroke-linejoin': 'round', 'data-part': 'shade-block' });
  const rim = o.rim === false ? 0 : typeof o.rim === 'number' ? o.rim : 0.7;
  if (rim) el(over, 'path', { d, fill: 'none', stroke: lineGradient(p, A, B, [[0, T.glow, 0], [0.45, T.glow, 0], [1, T.glow, rim]]), 'stroke-width': f3(Math.max(0.26, o.rimWidth ?? rm * 0.16)), 'stroke-linejoin': 'round', 'data-part': 'shade-block' });
  const hl = o.highlight === false ? 0 : typeof o.highlight === 'number' ? o.highlight : 0.75;
  if (hl) {
    const [hx, hy] = o.highlightAt ?? [cx + lx * 0.46 * rx, cy + ly * 0.46 * ry], [sx, sy] = o.highlightSize ?? [0.42, 0.24];
    softSpot(over, hx, hy, sx * Math.max(rm, Math.min(rx, ry * 1.6)), sy * Math.max(rm, Math.min(ry, rx * 1.6)), o.highlightRot ?? la * 180 / Math.PI + 90, T.spec, hl);
  }
  return over;
}

// ball(p, cx, cy, r, color, {...finish opts}) -> {node, ...}: an illustrated sphere (particle, bead, atom, vesicle) in vector
export function ball(p, cx, cy, r, color, o = {}) {
  const d = `M${f3(cx - r)},${f3(cy)} a${f3(r)},${f3(r)} 0 1,0 ${f3(2 * r)},0 a${f3(r)},${f3(r)} 0 1,0 ${f3(-2 * r)},0Z`;
  return finish(p, d, color, { core: 0.25, rimWidth: r * 0.2, highlightSize: [0.46, 0.3], width: Math.max(STYLE.line.min * 1.04, Math.min(STYLE.line.thin, r * 0.12)), part: 'ball', ...o, box: { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r } });
}

// particles(p, pts, r, color, {seed, vary: {size, hue, lum, sat, jitter}, colors, ...ball opts}) -> {node, items: [{x, y, r, color}]}
// An array of illustrated balls at pts, each with its own size, tint and position jitter (L.vary), so no two are copies.
// colors: [c0, c1, ...] picks per item (cycling); vary defaults to size +-15 %, hue +-5 deg, lightness +-0.05.
export function particles(p, pts, r, color, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'particles' }), items = [], { vary: vo, colors, seed, part, ...bo } = o;
  pts.forEach(([x, y], i) => {
    const v = vary(seed ?? 1, i, { size: 0.15, lum: 0.05, ...(vo ?? {}) });
    const c = v.tint(colors ? colors[i % colors.length] : color), rr = r * v.k;
    ball(g, x + v.dx, y + v.dy, rr, c, { ...bo, part: 'particle' }); items.push({ x: x + v.dx, y: y + v.dy, r: rr, color: c });
  });
  return { node: g, items };
}
```

### `skills/schematic-figure/foundation/engine/light3.js`
```javascript
// Light in a 3D parallel projection (v14): beams, projection cones and transparent optics painted in depth order.
// Why: a beam drawn as one flat polygon with a lens pasted on top has no depth. The part of the beam in front
// of the glass, the part seen through it and the part outside it all look the same, and a projection cone runs
// over the device it comes out of and on through the surface it lands on. A physicist reads that at once
// (reviewer of the 2026-09-24 deliveries: "mixing 3D and 2D incorrectly"). Here every beam segment, lens and
// surface has a 3D plane, the projector's view direction decides what is in front, and a segment seen through
// glass is drawn attenuated and tinted inside the lens outline only.
//
// lightScene3(p, P, o) -> scene. P is a projector with P.view (L.obliqueProj; for a hand-made projection pass its
// on-page axis vectors: L.obliqueProj({x: [..], y: [..], z: [..], origin, below})). World units are P's.
//   scene.surface(name, {point, normal, draw(g), pts}) an opaque object the light leaves or lands on. Its drawing
//     goes in the slot group g (the draw callback, or scene.slots[name] after draw()), so the scene can put it in
//     front of light that is behind it (light leaving a device's hidden face). pts (3D) bound it for overlap
//     tests; without them it is tested against everything. Things drawn before the scene are behind all of it.
//     veil (default 1, needs pts): opacity factor of light lying in front of this surface inside its outline; a small
//     value keeps light arriving at a device's face from washing over the face.
//   scene.lens(name, {c, axis, r | e1, e2, t, n, rim, rimOpacity, face, stroke, width, highlight, seen})
//     a glass disc of thickness t along axis, centred at c: radius r, or semi-axes e1, e2 (3D vectors in its
//     plane; use them to match a disc drawn as a page ellipse). face: gradient stops [[offset, colour, opacity]]
//     across the visible face; highlight: false | {dir: page direction, span (deg), at (radius fraction)};
//     seen: {transmission, tint, mix} paints a beam seen through the glass (opacity x transmission, colour mixed
//     toward tint by mix). Defaults keep the glass light, so what is behind it shows. blend: true | {k, mix} (off by
//     default) paints every beam through the lens, inside its outline, as one continuous glass-tinted wash at k (default
//     transmission) of the beam's opacity, under the outline and highlight: no seam where a sheet crosses the lens plane,
//     no stacking of the light in front and behind, and the glass keeps its rim, highlight and thickness.
//   scene.beam(stops, {color, opacity, fade: [op0, ..., opN], part}) a light volume through the stops in order.
//     A stop is an aperture (array of 3D points), {at: surfaceName, pts} (an aperture on that surface), or
//     {at: lensName, pts?, fill?} (crossing that lens: pts on its mid-plane, default the ring at fill = 0.92 of
//     its radius). Each segment is the convex hull of its two apertures, so cones, frusta and fan-in sheets
//     (two-point apertures) all work. A lens splits the beam at its two faces; the piece inside the glass is
//     drawn tinted. fade grades the opacity along the beam: two values run from the first stop to the last, one value
//     per stop sets each stop's opacity.
//   scene.draw() -> {slots, order, lenses: {name: {silhouette, face}}, segments: [{page, beam}]} paints it all.
// Depth: for every pair that overlaps on the page, the plane of the lens or surface decides: the other item is in
// front when it lies on the viewer's side of that plane. Segments never occlude each other (all translucent).
import { el } from './core.js';
import { STYLE, shade, ramp } from './style.js';
import { polygon, path } from './draw.js';

const C = STYLE.color;
const f3 = (v) => +(+v).toFixed(3);
const add3 = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit3 = (a) => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const mean3 = (pts) => pts.reduce((s, q) => add3(s, q, 1 / pts.length), [0, 0, 0]);
const dPts = (pts) => 'M' + pts.map((q) => `${f3(q[0])},${f3(q[1])}`).join(' L') + 'Z';
let lid = 0;
function defsOf(p) { let n = p.node || p; while (n && n.tagName !== 'svg') n = n.parentNode; return n.querySelector('defs'); }
function gradient(p, a, b, stops) {
  const id = `l3g${++lid}`;
  const g = el(defsOf(p), 'linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: f3(a[0]), y1: f3(a[1]), x2: f3(b[0]), y2: f3(b[1]) });
  for (const [o, c, op] of stops) el(g, 'stop', { offset: o, 'stop-color': c, 'stop-opacity': f3(op ?? 1) });
  return `url(#${id})`;
}
function hull(pts) {
  const P = pts.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of P.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const bbox = (pts) => { const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const boxHit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
function basis(n) {
  const t = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = unit3(sub3(t, n.map((c) => c * dot3(t, n))));
  return [e1, cross3(n, e1)];
}

// ring3(c, e1, e2, n = 48) -> 3D points c + e1 cos t + e2 sin t: a circular or elliptical aperture.
export const ring3 = (c, e1, e2, n = 48) => Array.from({ length: n }, (_, k) => { const t = k / n * 2 * Math.PI; return add3(add3(c, e1, Math.cos(t)), e2, Math.sin(t)); });

export function lightScene3(p, P, o = {}) {
  if (!P || !P.view) throw new Error('lightScene3: the projector needs P.view (make it with L.obliqueProj)');
  const view = P.view, eps = o.eps ?? 1e-6;
  const items = [], named = {}, beams = [];
  const add = (it) => { it.idx = items.length; items.push(it); if (it.name) named[it.name] = it; return it; };
  const pg = (q) => P(q[0], q[1], q[2]);
  const S = { slots: {} };

  S.surface = (name, s) => {
    const sil = s.pts ? hull(s.pts.map(pg)) : null;
    add({ kind: 'surface', name, point: s.point, normal: unit3(s.normal), drawFn: s.draw, box: sil ? bbox(sil) : null, sil, veil: s.veil ?? 1 });
    return S;
  };

  S.lens = (name, s) => {
    const axis = unit3(s.axis), t = s.t ?? 4, n = s.n ?? 72;
    let e1 = s.e1, e2 = s.e2;
    if (!e1 || !e2) { const [b1, b2] = basis(axis), r = s.r ?? 10; e1 = b1.map((v) => v * r); e2 = b2.map((v) => v * r); }
    const front = dot3(axis, view) > 0 ? 1 : -1;                        // the face the viewer sees: c + front * t/2 * axis
    const ringAt = (side, k = 1) => ring3(add3(s.c, axis, side * t / 2), e1.map((v) => v * k), e2.map((v) => v * k), n);
    const faceRing = ringAt(front), backRing = ringAt(-front);
    const sil = hull(faceRing.concat(backRing).map(pg));
    const glass = s.glass ?? C.glass;
    add({ kind: 'lens', name, point: s.c, normal: axis, axis, t, e1, e2, n, front, faceRing, backRing, sil, box: bbox(sil), inner: [], blendSegs: [], s,
      seen: { transmission: 0.8, tint: '#2f7f95', mix: 0.35, ...(s.seen ?? {}) }, glass });
    return S;
  };

  S.beam = (stops, style = {}) => { beams.push({ stops, style }); return S; };

  // through-glass paint of a colour
  const seenColor = (col, L, k = 1) => ramp([col, L.seen.tint], Math.min(1, L.seen.mix * k));

  S.draw = () => {
    // ---- resolve beams into segments and in-glass pieces
    beams.forEach((b, bi) => {
      const st = b.stops.map((s) => {
        if (Array.isArray(s)) return { pts: s };
        const it = named[s.at];
        if (!it) throw new Error(`lightScene3: unknown stop "${s.at}"`);
        if (it.kind === 'surface') return { pts: s.pts, touch: it };
        const L = it, k = s.fill ?? 0.92;
        const pts = s.pts ?? ring3(L.point, L.e1.map((v) => v * k), L.e2.map((v) => v * k), 48);
        return { lens: L, mid: pts };
      });
      st.forEach((s, i) => {
        if (!s.lens) return;
        const L = s.lens, nb = st[i - 1] ?? st[i + 1], ref = mean3(nb.pts ?? nb.mid);
        const side = Math.sign(dot3(sub3(ref, L.point), L.axis)) || -1;   // side the light comes from (or goes to, at an end)
        const sgn = st[i - 1] ? side : -side;
        s.entry = s.mid.map((q) => add3(q, L.axis, sgn * L.t / 2)); s.exit = s.mid.map((q) => add3(q, L.axis, -sgn * L.t / 2));
        L.inner.push({ pts: s.entry.concat(s.exit), style: b.style, beam: bi });
      });
      const ends = st.map((s) => s.lens ? { a: s.entry, b: s.exit } : { a: s.pts, b: s.pts });
      const total = st.length - 1;
      for (let i = 0; i < total; i++) {
        const A = ends[i].b, B = ends[i + 1].a, page = hull(A.concat(B).map(pg));
        const seg = add({ kind: 'seg', beam: bi, i, total, pts3: A.concat(B), a3: mean3(A), b3: mean3(B), page, box: bbox(page), style: b.style, front: [], veils: [],
          blends: [st[i].lens, st[i + 1].lens].filter((L) => L && L.s.blend) });
        for (const L of seg.blends) L.blendSegs.push(seg);
      }
    });

    // ---- depth constraints from the planes of lenses and surfaces
    const side = (it, pl) => {
      const pts = it.kind === 'seg' ? it.pts3 : [it.point];
      let best = 0;
      for (const q of pts) { const d = dot3(sub3(q, pl.point), pl.normal); if (Math.abs(d) > Math.abs(best)) best = d; }
      return Math.abs(best) < eps ? 0 : Math.sign(best);
    };
    const before = items.map(() => new Set());                        // before[j] = items painted before j
    for (const pl of items) {
      if (pl.kind === 'seg') continue;
      const vs = Math.sign(dot3(view, pl.normal));
      for (const it of items) {
        if (it === pl) continue;
        if (pl.box && it.box && !boxHit(pl.box, it.box)) continue;
        const s = side(it, pl); if (!s || !vs) continue;
        if (s === vs) { before[it.idx].add(pl.idx); if (pl.kind === 'surface' && it.kind === 'seg' && pl.sil && pl.veil < 1) it.veils.push(pl); }
        else { before[pl.idx].add(it.idx); if (pl.kind === 'lens' && it.kind === 'seg') it.front.push(pl); }
      }
    }
    // topological order, ties by declaration; a cycle falls back to declaration order
    const order = [], done = new Set();
    while (order.length < items.length) {
      let next = items.find((it) => !done.has(it.idx) && [...before[it.idx]].every((j) => done.has(j)));
      if (!next) next = items.find((it) => !done.has(it.idx));
      done.add(next.idx); order.push(next);
    }

    // ---- paint
    const root = el(p, 'g', { 'data-part': o.part ?? 'light-scene' });
    const out = { slots: S.slots, order: order.map((it) => it.name ?? `beam${it.beam}.${it.i}`), lenses: {}, segments: [] };
    const fillOf = (g, it, colorFn, opk = 1) => {
      const col = colorFn(it.style.color ?? C.beamGreen), op = (it.style.opacity ?? 0.3) * opk, fd = it.style.fade;
      if (!fd) return { fill: col, fillOpacity: f3(op) };
      const a = pg(it.a3), b = pg(it.b3), u0 = it.i / it.total, u1 = (it.i + 1) / it.total;
      const at = (u) => { const x = u * (fd.length - 1), k = Math.min(fd.length - 2, Math.floor(x)); return fd[k] + (fd[k + 1] - fd[k]) * (x - k); };
      return { fill: gradient(g, a, b, [[0, col, at(u0) * opk], [1, col, at(u1) * opk]]) };
    };
    for (const it of order) {
      if (it.kind === 'surface') {
        const g = { node: el(root, 'g', { 'data-part': `surface-${it.name}` }) };
        S.slots[it.name] = g; if (it.drawFn) it.drawFn(g);
      } else if (it.kind === 'seg') {
        out.segments.push({ page: it.page, beam: it.beam });
        const part = it.style.part ?? 'beam';
        // regions of the page where this segment is not plain light: lenses in front (seen through the glass), blending
        // lenses it enters or leaves (painted by the lens, see blend), surfaces it lies in front of with a veil < 1
        const regions = [
          ...it.front.filter((L) => !it.blends.includes(L) && boxHit(L.box, it.box)).map((L) => ({ sil: L.sil, col: (c) => seenColor(c, L), k: L.seen.transmission, tag: 'through-glass' })),
          ...it.blends.map((L) => ({ sil: L.sil, skip: true })),
          ...it.veils.filter((S2) => boxHit(S2.box, it.box)).map((S2) => ({ sil: S2.sil, col: (c) => c, k: S2.veil, tag: 'on-surface' })),
        ];
        if (!regions.length) { polygon(root, it.page, { ...fillOf(root, it, (c) => c), part }); continue; }
        const [x0, y0, x1, y1] = it.box, id = `l3m${++lid}`;
        const m = el(defsOf(root), 'mask', { id, maskUnits: 'userSpaceOnUse', x: f3(x0 - 2), y: f3(y0 - 2), width: f3(x1 - x0 + 4), height: f3(y1 - y0 + 4) });
        el(m, 'rect', { x: f3(x0 - 2), y: f3(y0 - 2), width: f3(x1 - x0 + 4), height: f3(y1 - y0 + 4), fill: '#fff' });
        for (const R of regions) el(m, 'path', { d: dPts(R.sil), fill: '#000' });
        const gOut = el(root, 'g', { mask: `url(#${id})`, 'data-part': part });
        polygon(gOut, it.page, fillOf(root, it, (c) => c));
        for (const R of regions) {
          if (R.skip) continue;
          const cid = `l3c${++lid}`, cp = el(defsOf(root), 'clipPath', { id: cid }); el(cp, 'path', { d: dPts(R.sil) });
          const gIn = el(root, 'g', { 'clip-path': `url(#${cid})`, 'data-part': `${part}-${R.tag}` });
          polygon(gIn, it.page, fillOf(root, it, R.col, R.k));
        }
      } else {
        const L = it, s = L.s, g = el(root, 'g', { 'data-part': 'lens' }), glass = L.glass;
        const stroke = s.stroke ?? shade(glass, -0.5), width = s.width ?? STYLE.line.thin;
        // light inside the glass: seen through the front face, so tinted more than light behind the lens
        for (const q of L.inner) {
          if (s.blend) continue;
          const fake = { style: q.style, i: 0, total: 1, a3: q.pts[0], b3: q.pts[q.pts.length - 1] };
          polygon(g, hull(q.pts.map(pg)), fillOf(g, fake, (c) => seenColor(c, L, 1.4), L.seen.transmission));
        }
        // rim: the glass seen through its edge (outside the face only, so the face stays clear)
        const face = L.faceRing.map(pg);
        path(g, dPts(L.sil) + dPts(face), { fill: s.rim ?? shade(glass, -0.12), fillOpacity: s.rimOpacity ?? 0.6, part: 'lens-rim' }).setAttribute('fill-rule', 'evenodd');
        path(g, dPts(L.sil), { stroke, width, part: 'lens-edge' });
        // face: light glass with a gradient toward the highlight
        const [bx0, by0, bx1, by1] = bbox(face), hd = s.highlight === false ? [-0.8, -0.6] : (s.highlight?.dir ?? [-0.8, -0.6]);
        const hl = Math.hypot(hd[0], hd[1]) || 1, cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, rr = Math.max(bx1 - bx0, by1 - by0) / 2;
        const ga = [cx + hd[0] / hl * rr, cy + hd[1] / hl * rr], gb = [cx - hd[0] / hl * rr, cy - hd[1] / hl * rr];
        const stops = s.face ?? [[0, '#ffffff', 0.45], [0.35, glass, 0.06], [1, shade(glass, -0.15), 0.25]];
        polygon(g, face, { fill: gradient(g, ga, gb, stops), part: 'lens-face' });
        if (s.blend) {
          // blend: inside the outline, every beam through this lens (both sides and the piece in the glass) is one
          // translucent wash over the glass, with no seam where it crosses the lens plane. Each beam's pieces are filled
          // opaque inside a group whose opacity is the wash, so overlapping pieces never add up.
          const bo = s.blend === true ? {} : s.blend, cid = `l3c${++lid}`, cp = el(defsOf(g), 'clipPath', { id: cid });
          el(cp, 'path', { d: dPts(L.sil) });
          for (const bi of [...new Set(L.blendSegs.map((q) => q.beam))]) {
            const segs = L.blendSegs.filter((q) => q.beam === bi), st0 = segs[0].style;
            const gB = el(g, 'g', { 'clip-path': `url(#${cid})`, opacity: f3((st0.opacity ?? 0.3) * (bo.k ?? L.seen.transmission)), 'data-part': `${st0.part ?? 'beam'}-through-glass` });
            const col = ramp([st0.color ?? C.beamGreen, L.seen.tint], Math.min(1, bo.mix ?? L.seen.mix));
            // a thin stroke in the same colour closes the antialiasing seams where pieces meet (the group opacity
            // keeps the overlap from showing)
            const pc = { fill: col, stroke: col, width: 0.4, join: 'miter' };
            for (const q of segs) polygon(gB, q.page, pc);
            for (const q of L.inner.filter((q2) => q2.beam === bi)) polygon(gB, hull(q.pts.map(pg)), pc);
          }
        }
        if (s.highlight !== false) {
          const h = s.highlight ?? {}, at = h.at ?? 0.88, span = (h.span ?? 55) * Math.PI / 180;
          const off = (tt) => { const q = P.vec(add3(L.e1.map((v) => v * Math.cos(tt)), L.e2, Math.sin(tt))); return q; };
          let best = 0, bs = -Infinity;
          for (let k = 0; k < 360; k++) { const tt = k / 360 * 2 * Math.PI, q = off(tt), sc = (q[0] * hd[0] + q[1] * hd[1]) / (Math.hypot(q[0], q[1]) || 1); if (sc > bs) { bs = sc; best = tt; } }
          const c0 = add3(L.point, L.axis, L.front * L.t / 2);
          const arc = Array.from({ length: 25 }, (_, k) => { const tt = best - span + 2 * span * k / 24; return pg(add3(add3(c0, L.e1, at * Math.cos(tt)), L.e2, at * Math.sin(tt))); });
          path(g, 'M' + arc.map((q) => `${f3(q[0])},${f3(q[1])}`).join(' L'), { stroke: '#ffffff', width: h.width ?? 0.8, opacity: h.opacity ?? 0.9, part: 'lens-highlight' });
        }
        path(g, dPts(face), { stroke, width: s.faceWidth ?? width * 1.25, part: 'lens-outline' });
        out.lenses[L.name] = { silhouette: L.sil, face };
      }
    }
    return out;
  };
  return S;
}
```

### `skills/schematic-figure/foundation/engine/optics.js`
```javascript
// Optical components, drawn in side view (optical axis along +x unless rotated) as flat-shaded vector art.
// Each returns {node, ports} where ports are local points (in the parent's coordinates) such as in/out/top.
// Pass {F, name} to register the ports as figure anchors `${name}.${port}`.
import { el, text } from './core.js';
import { STYLE, shade } from './style.js';
import { path, line, rect, circle, polygon, ellipse, linearGradient, radialGradient, glow, shaded, smooth, sample } from './draw.js';

const C = STYLE.color;
function finish(F, name, g, ports) {
  if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, g.parentNode, x, y);
  return { node: g, ports };
}
const G = (p, x, y, rot, part) => el(p, 'g', { transform: `translate(${x} ${y})${rot ? ` rotate(${rot})` : ''}`, 'data-part': part });
const rotPt = (x, y, cx, cy, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [cx + x * c - y * s, cy + x * s + y * c]; };

// lens(p, x, y, {h, t, kind: 'biconvex'|'planoconvex'|'biconcave'|'cylindrical', rot})
export function lens(p, x, y, o = {}) {
  const h = o.h ?? 18, t = o.t ?? h * 0.22, rot = o.rot ?? 0, kind = o.kind ?? 'biconvex';
  const g = G(p, x, y, rot, 'lens'), hh = h / 2, fill = linearGradient(p, [[0, shade(C.glass, 0.5)], [0.5, C.glass], [1, shade(C.glass, -0.12)]], 0);
  let d;
  if (kind === 'biconvex') d = `M0,${-hh} Q${t},0 0,${hh} Q${-t},0 0,${-hh}Z`;
  else if (kind === 'planoconvex') d = `M${-t * 0.25},${-hh} L${-t * 0.25},${hh} Q${t * 0.9},0 ${-t * 0.25},${-hh}Z`;
  else if (kind === 'biconcave') d = `M${-t * 0.6},${-hh} L${t * 0.6},${-hh} Q${t * 0.1},0 ${t * 0.6},${hh} L${-t * 0.6},${hh} Q${-t * 0.1},0 ${-t * 0.6},${-hh}Z`;
  else d = `M${-t / 2},${-hh} L${t / 2},${-hh} L${t / 2},${hh} L${-t / 2},${hh}Z`;
  path(g, d, { fill, stroke: shade(C.glass, -0.45), width: STYLE.line.thin });
  // specular highlight
  path(g, `M${-t * 0.12},${-hh * 0.7} Q${t * 0.05},${-hh * 0.2} ${-t * 0.05},${hh * 0.15}`, { stroke: '#fff', width: 0.5, opacity: 0.8 });
  const [ix, iy] = rotPt(-t / 2, 0, x, y, rot), [ox, oy] = rotPt(t / 2, 0, x, y, rot), [tx, ty] = rotPt(0, -hh, x, y, rot), [bx, by] = rotPt(0, hh, x, y, rot);
  return finish(o.F, o.name, g, { in: [ix, iy], out: [ox, oy], top: [tx, ty], bottom: [bx, by], center: [x, y] });
}

// mirror(p, x, y, {h, rot}) — rot = angle of the mirror surface normal from +x (45 folds a beam up/down)
export function mirror(p, x, y, o = {}) {
  const h = o.h ?? 16, w = o.w ?? 2.4, rot = o.rot ?? 0;
  const g = G(p, x, y, rot, 'mirror');
  rect(g, 0, -h / 2, w, h, { fill: linearGradient(p, [[0, '#f4f6f8'], [1, C.metal]], 0), stroke: C.ink, width: STYLE.line.thin });
  line(g, [0, -h / 2], [0, h / 2], { stroke: C.ink, width: STYLE.line.normal * 1.3 });
  for (let yy = -h / 2 + 1.5; yy < h / 2; yy += 2) line(g, [w, yy], [w + 1.3, yy - 1.3], { stroke: C.mid, width: STYLE.line.hair });
  return finish(o.F, o.name, g, { center: [x, y], top: rotPt(0, -h / 2, x, y, rot), bottom: rotPt(0, h / 2, x, y, rot) });
}

// beam splitter cube (s = side)
export function beamSplitter(p, x, y, o = {}) {
  const s = o.s ?? 10, g = G(p, x, y, o.rot ?? 0, 'beamsplitter');
  rect(g, -s / 2, -s / 2, s, s, { fill: linearGradient(p, [[0, shade(C.glass, 0.4)], [1, C.glass]], 45), stroke: shade(C.glass, -0.5), width: STYLE.line.thin });
  line(g, [-s / 2, s / 2], [s / 2, -s / 2], { stroke: shade(C.glass, -0.55), width: STYLE.line.thin });
  return finish(o.F, o.name, g, { in: [x - s / 2, y], out: [x + s / 2, y], up: [x, y - s / 2], down: [x, y + s / 2], center: [x, y] });
}

// laser head box with aperture on the right; label optional
export function laser(p, x, y, o = {}) {
  const w = o.w ?? 22, h = o.h ?? 10, g = G(p, x, y, o.rot ?? 0, 'laser');
  rect(g, 0, -h / 2, w, h, { r: 1.2, fill: shaded(p, o.color ?? '#4a5563', 90), stroke: C.ink, width: STYLE.line.thin });
  rect(g, w, -h * 0.18, 1.6, h * 0.36, { fill: '#2b2f36', stroke: C.ink, width: STYLE.line.hair });
  circle(g, w * 0.18, -h * 0.22, 0.9, { fill: o.beam ?? C.beam });
  if (o.label) text(g, w / 2, 0, o.label, { anchor: 'middle', valign: 'middle', color: '#fff', size: o.labelSize ?? STYLE.text.small });
  return finish(o.F, o.name, g, { out: [x + w + 1.6, y], top: [x + w / 2, y - h / 2], bottom: [x + w / 2, y + h / 2] });
}

// camera / detector: body with a lens barrel facing left (the light comes in from -x)
export function camera(p, x, y, o = {}) {
  const w = o.w ?? 16, h = o.h ?? 12, g = G(p, x, y, o.rot ?? 0, 'camera');
  rect(g, -3.5, -h * 0.28, 3.5, h * 0.56, { fill: shaded(p, '#3a3f47', 90), stroke: C.ink, width: STYLE.line.thin });
  rect(g, 0, -h / 2, w, h, { r: 1.2, fill: shaded(p, o.color ?? '#5b6573', 90), stroke: C.ink, width: STYLE.line.thin });
  if (o.label) text(g, w / 2, 0, o.label, { anchor: 'middle', valign: 'middle', color: '#fff', size: o.labelSize ?? STYLE.text.small });
  return finish(o.F, o.name, g, { in: [x - 3.5, y], top: [x + w / 2, y - h / 2], bottom: [x + w / 2, y + h / 2], out: [x + w, y] });
}

// photodiode / single-pixel detector
export function detector(p, x, y, o = {}) {
  const r = o.r ?? 4, g = G(p, x, y, o.rot ?? 0, 'detector');
  path(g, `M0,${-r} A${r},${r} 0 0 1 0,${r} Z`, { fill: shaded(p, '#51606f', 90), stroke: C.ink, width: STYLE.line.thin });
  rect(g, -1.2, -r, 1.2, 2 * r, { fill: '#26303a' });
  return finish(o.F, o.name, g, { in: [x - 1.2, y], out: [x + r, y], center: [x, y] });
}

// objective lens (microscope): tapered barrel pointing toward +x
export function objective(p, x, y, o = {}) {
  const L = o.l ?? 14, h = o.h ?? 11, g = G(p, x, y, o.rot ?? 0, 'objective');
  polygon(g, [[0, -h / 2], [L * 0.62, -h / 2], [L, -h * 0.22], [L, h * 0.22], [L * 0.62, h / 2], [0, h / 2]], { fill: shaded(p, '#c2c8d0', 90), stroke: C.ink, width: STYLE.line.thin });
  rect(g, L * 0.2, -h / 2, 1.2, h, { fill: o.band ?? C.vermillion });
  return finish(o.F, o.name, g, { in: [x, y], out: [x + L, y], center: [x + L / 2, y] });
}

// Gaussian beam envelope between x0 and x1 with waist w0 at xw and Rayleigh range zR (in pt).
// Drawn as a filled envelope with soft glow and a bright core. {color, core}
export function gaussianBeam(p, x0, x1, y, { w0 = 1.2, xw = (x0 + x1) / 2, zR = 12, color = C.beam, opacity = 0.55, glowSd = 0.9, core = true } = {}) {
  const g = el(p, 'g', { 'data-part': 'beam' });
  const w = (x) => w0 * Math.sqrt(1 + ((x - xw) / zR) ** 2);
  const up = sample((x) => y - w(x), x0, x1, 80), dn = sample((x) => y + w(x), x0, x1, 80).reverse();
  const d = 'M' + up.concat(dn).map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(' L') + 'Z';
  path(g, d, { fill: linearGradient(p, [[0, color, opacity * 0.6], [0.5, color, opacity], [1, color, opacity * 0.6]], 90), filter: glow(p, glowSd) });
  if (core) line(g, [x0, y], [x1, y], { stroke: shade(color, 0.35), width: Math.max(STYLE.line.thin, w0 * 0.35), opacity: 0.9 });
  return g;
}

// straight beam segment (ray) with glow: beam(p, [pts], {color, width})
export function beam(p, pts, { color = C.beam, width = 1.6, opacity = 0.9, glowSd = 0.8, arrow = false } = {}) {
  const g = el(p, 'g', { 'data-part': 'beam' });
  const d = 'M' + pts.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(' L');
  path(g, d, { stroke: color, width: width * 2.2, opacity: opacity * 0.35, filter: glow(p, glowSd), cap: 'butt' });
  path(g, d, { stroke: color, width, opacity, cap: 'butt' });
  path(g, d, { stroke: shade(color, 0.55), width: width * 0.3, opacity: 0.9, cap: 'butt' });
  return g;
}

// focusing / diverging cone of light between an aperture of height h0 at x0 and h1 at x1
export function lightCone(p, x0, h0, x1, h1, y, { color = C.beam, opacity = 0.35 } = {}) {
  return polygon(p, [[x0, y - h0 / 2], [x1, y - h1 / 2], [x1, y + h1 / 2], [x0, y + h0 / 2]],
    { fill: linearGradient(p, [[0, color, opacity], [1, color, opacity * 0.7]], 0), part: 'beam' });
}

// pulse train along x: n Gaussian pulses (carrier optional) as a line plot
export function pulseTrain(p, x0, x1, y, { n = 4, amp = 5, width = 2.2, color = C.beam, carrier = 0, stroke = STYLE.line.normal } = {}) {
  const T = (x1 - x0) / n;
  const fn = (x) => { let v = 0; for (let k = 0; k < n; k++) { const c = x0 + T * (k + 0.5); v += Math.exp(-(((x - c) / width) ** 2)) * (carrier ? Math.cos((x - c) * carrier) : 1); } return y - amp * v; };
  return path(p, smooth(sample(fn, x0, x1, n * 40), false, 0.5), { stroke: color, width: stroke, part: 'pulses' });
}

// optical fibre: a smooth path with cladding + core; coil: {coil: {cx, cy, r, turns}} draws a spool instead
export function fiber(p, pts, { clad = 2.6, core = 0.9, color = '#f0c36a', coreColor = C.beam, glowCore = false, part } = {}) {
  const g = el(p, 'g', { 'data-part': part ?? 'fiber' }), d = smooth(pts, false, 0.5);
  path(g, d, { stroke: shade(color, -0.35), width: clad + 0.5 });
  path(g, d, { stroke: color, width: clad });
  path(g, d, { stroke: shade(color, 0.45), width: clad * 0.35, opacity: 0.9 });
  if (glowCore) path(g, d, { stroke: coreColor, width: core, opacity: 0.9, filter: glow(p, 0.6) });
  return g;
}
export function fiberCoil(p, cx, cy, { r = 9, turns = 5, pitch = 1.4, color = '#f0c36a', F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'fiber-coil' });
  ellipse(g, cx, cy, r + turns * pitch * 0.5 + 1.5, (r + turns * pitch * 0.5 + 1.5) * 0.42, { fill: '#e7e7e7', stroke: C.mid, width: STYLE.line.thin });
  for (let k = 0; k < turns; k++) {
    const rr = r + (k - turns / 2) * pitch * 0.5, yy = cy + (k - turns / 2) * pitch;
    ellipse(g, cx, yy, rr, rr * 0.42, { stroke: shade(color, -0.3), width: 1.4 });
    ellipse(g, cx, yy, rr, rr * 0.42, { stroke: color, width: 0.9 });
  }
  return finish(F, name, g, { center: [cx, cy], left: [cx - r, cy], right: [cx + r, cy] });
}

// pixelated modulator (SLM / DMD) in oblique view: n x m pixels; values in [0,1] from fn(i,j)
export function slm(p, x, y, { w = 16, h = 20, n = 8, m = 10, skew = 0.35, fn = (i, j) => 0.5 + 0.5 * Math.sin(i * 1.3 + j * 0.7), colors = ['#1b2a41', '#e8eef7'], frame = '#2b2f36', F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'slm' });
  const P = (u, v) => [x + u * w * (1 - skew * 0.5), y + v * h + u * h * skew * 0.5 - h / 2];   // u across (depth), v down
  const quad = (u0, v0, u1, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
  polygon(g, quad(-0.06, -0.05, 1.06, 1.05), { fill: frame, stroke: C.ink, width: STYLE.line.thin });
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const t = fn(i, j), c0 = colors[0], c1 = colors[1];
    const col = '#' + [1, 3, 5].map((k) => Math.round(parseInt(c0.slice(k, k + 2), 16) * (1 - t) + parseInt(c1.slice(k, k + 2), 16) * t).toString(16).padStart(2, '0')).join('');
    polygon(g, quad(i / n + 0.008, j / m + 0.008, (i + 1) / n - 0.008, (j + 1) / m - 0.008), { fill: col });
  }
  const c = P(0.5, 0.5);
  return finish(F, name, g, { center: c, top: P(0.5, -0.05), bottom: P(0.5, 1.05), left: P(0, 0.5), right: P(1, 0.5) });
}

// diffraction grating (side view): sawtooth surface
export function grating(p, x, y, { h = 16, teeth = 8, depth = 1.6, rot = 0, F, name } = {}) {
  const g = G(p, x, y, rot, 'grating'), s = h / teeth; let d = `M0,${-h / 2}`;
  for (let k = 0; k < teeth; k++) d += ` l${-depth},${s * 0.8} l${depth},${s * 0.2}`;
  d += ` L2,${h / 2} L2,${-h / 2}Z`;
  path(g, d, { fill: linearGradient(p, [[0, '#f2f2f2'], [1, C.metal]], 0), stroke: C.ink, width: STYLE.line.thin });
  return finish(F, name, g, { center: [x, y] });
}

// thin sample / screen / scatterer: a slab with optional speckle texture
export function scatterer(p, x, y, { w = 3, h = 18, seed = 3, color = '#c9c3b8', F, name } = {}) {
  const g = G(p, x, y, 0, 'scatterer');
  rect(g, -w / 2, -h / 2, w, h, { fill: color, stroke: C.ink, width: STYLE.line.thin });
  let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < h * 1.4; k++) circle(g, -w / 2 + rnd() * w, -h / 2 + rnd() * h, 0.25 + rnd() * 0.35, { fill: shade(color, -0.4) });
  return finish(F, name, g, { in: [x - w / 2, y], out: [x + w / 2, y], center: [x, y], top: [x, y - h / 2], bottom: [x, y + h / 2] });
}

// speckle / intensity pattern tile (e.g. camera image, multimode output): deterministic from seed
export function speckle(p, x, y, { w = 14, h = 14, n = 18, seed = 7, palette = ['#000004', '#51127c', '#b73779', '#fc8961', '#fcfdbf'], blobs = 26, r = 0.16, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'speckle' });
  let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const B = Array.from({ length: blobs }, () => [rnd(), rnd(), 0.4 + rnd() * 0.6]);
  const cw = w / n, ch = h / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const u = (i + 0.5) / n, v = (j + 0.5) / n; let val = 0;
    for (const [bx, by, a] of B) val += a * Math.exp(-(((u - bx) ** 2 + (v - by) ** 2) / (r * r * 0.25)));
    val = Math.min(1, val);
    const k = Math.min(palette.length - 1, Math.floor(val * (palette.length - 1) + 0.5));
    rect(g, x + i * cw, y + j * ch, cw + 0.05, ch + 0.05, { fill: palette[k] });
  }
  rect(g, x, y, w, h, { stroke: C.ink, width: STYLE.line.thin });
  return finish(F, name, g, { center: [x + w / 2, y + h / 2], left: [x, y + h / 2], right: [x + w, y + h / 2], top: [x + w / 2, y], bottom: [x + w / 2, y + h] });
}

// ---- flat beams that fold correctly (v9) ------------------------------------------------------------
// beamPath(p, pts, {width, color, opacity, hollow, inner, from, bends, edge, edgeWidth, core, coreWidth, arrows, arrowSize, arrowColor, part, F, name})
//   -> {node, ports, mirrors, edges, at(f)}
// Flat translucent beam band (S3 style, no glow) along the centre polyline pts, full width `width`. Every interior vertex is a
// mirror by default: each edge ray is cut on the mirror line (normal along d_out - d_in) and continues reflected, so the band
// keeps its true footprint and the rays swap sides at each fold, as in a real reflection; a stroked polyline instead mitres on
// the wrong diagonal. `bends: [i, ...]` marks vertices that bend without reflecting (fibre, prism: cut on the mitre line).
// hollow: true draws only the annulus |offset| in [inner, 1] x width/2 as two edge strips (an annular mask; inner default 0.6),
// from vertex `from` on (default 0; e.g. solid laser -> mask at vertex 1 -> hollow beyond). The band is one path, so overlaps at
// a fold never double the opacity. edge / core add thin edge-ray and centre lines; arrows: true (one chevron per segment) or
// fractions of the path length. mirrors: [{i, at, normal, surface, rot}] for each fold: normal (deg) points into the light side,
// surface is the mirror line's angle (pass it to L.plate as angle), rot is the value L.mirror needs to face the beam.
export function beamPath(p, pts, o = {}) {
  const hw = (o.width ?? 3) / 2, color = o.color ?? C.beam, n = pts.length, bends = new Set(o.bends ?? []);
  const g = el(p, 'g', { 'data-part': o.part ?? 'beam' });
  const unit = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
  const D = Array.from({ length: n - 1 }, (_, i) => unit([pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]]));
  const nrm = (d) => [-d[1], d[0]];
  // cut-line normal at each vertex
  const cut = pts.map((_, i) => {
    if (i === 0) return D[0]; if (i === n - 1) return D[n - 2];
    const a = D[i - 1], b = D[i], c = bends.has(i) ? [a[0] + b[0], a[1] + b[1]] : [b[0] - a[0], b[1] - a[1]];
    return Math.hypot(c[0], c[1]) < 1e-6 ? a : unit(c);
  });
  const trace = (s) => {
    let q = [pts[0][0] + nrm(D[0])[0] * s, pts[0][1] + nrm(D[0])[1] * s]; const out = [q];
    for (let i = 1; i < n; i++) {
      const d = D[i - 1], c = cut[i], den = d[0] * c[0] + d[1] * c[1];
      const t = Math.abs(den) < 1e-9 ? Math.hypot(pts[i][0] - q[0], pts[i][1] - q[1]) : ((pts[i][0] - q[0]) * c[0] + (pts[i][1] - q[1]) * c[1]) / den;
      q = [q[0] + d[0] * t, q[1] + d[1] * t]; out.push(q);
    }
    return out;
  };
  const hollow = !!o.hollow, from = hollow ? (o.from ?? 0) : n, ri = hw * (o.inner ?? 0.6), rays = new Map();
  const ray = (s) => { const k = s.toFixed(4); if (!rays.has(k)) rays.set(k, trace(s)); return rays.get(k); };
  const strips = (i) => (i < from ? [[-hw, hw]] : [[-hw, -ri], [ri, hw]]);
  const f2 = (v) => (+v).toFixed(3), area = (Q) => Q.reduce((s, q, k) => { const r = Q[(k + 1) % Q.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0);
  let d = '';
  for (let i = 0; i < n - 1; i++) for (const [sa, sb] of strips(i)) {
    const A = ray(sa), B = ray(sb); let Q = [A[i], A[i + 1], B[i + 1], B[i]]; if (area(Q) < 0) Q = Q.reverse();
    d += 'M' + Q.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' L') + 'Z';
  }
  path(g, d, { fill: color, opacity: o.opacity ?? 0.5, part: 'beam-band' });
  const seg = (R, i0, i1) => 'M' + R.slice(i0, i1 + 1).map(([x, y]) => `${f2(x)},${f2(y)}`).join(' L');
  const ec = o.edgeColor ?? shade(color, -0.25);
  if (o.edge) {
    for (const s of [-hw, hw]) path(g, seg(ray(s), 0, n - 1), { stroke: ec, width: o.edgeWidth ?? STYLE.line.hair * 1.2, cap: 'butt', join: 'miter', part: 'beam-edge' });
    if (hollow && from < n - 1) for (const s of [-ri, ri]) path(g, seg(ray(s), from, n - 1), { stroke: ec, width: o.edgeWidth ?? STYLE.line.hair * 1.2, cap: 'butt', join: 'miter', part: 'beam-edge' });
  }
  if (o.core && Math.min(from, n - 1) > 0) path(g, seg(ray(0), 0, Math.min(from, n - 1)), { stroke: o.coreColor ?? shade(color, -0.2), width: o.coreWidth ?? Math.max(0.35, hw * 0.25), opacity: 0.9, cap: 'butt', join: 'miter', part: 'beam-core' });
  // arc length of the centre line
  const C0 = ray(0), cum = [0]; for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(C0[i][0] - C0[i - 1][0], C0[i][1] - C0[i - 1][1]));
  const locate = (f) => { const s = Math.max(0, Math.min(1, f)) * cum[n - 1]; let i = 0; while (i < n - 2 && cum[i + 1] < s) i++; return [i, (s - cum[i]) / ((cum[i + 1] - cum[i]) || 1)]; };
  const lerp = (R, i, u) => [R[i][0] + (R[i + 1][0] - R[i][0]) * u, R[i][1] + (R[i + 1][1] - R[i][1]) * u];
  const at = (f) => { const [i, u] = locate(f); return lerp(C0, i, u); };
  if (o.arrows) {
    const fs = o.arrows === true ? D.map((_, i) => (cum[i] + cum[i + 1]) / 2 / cum[n - 1]) : o.arrows, sz = o.arrowSize ?? Math.max(1.4, Math.min(2.6, hw)), ac = o.arrowColor ?? shade(color, -0.3);
    for (const f of fs) {
      const [i, u] = locate(f), dd = D[i], nn = nrm(dd);
      for (const s of i < from ? [0] : [-(ri + hw) / 2, (ri + hw) / 2]) {
        const [x, y] = lerp(ray(s), i, u);
        polygon(g, [[x + dd[0] * sz, y + dd[1] * sz], [x - dd[0] * sz * 0.6 + nn[0] * sz * 0.8, y - dd[1] * sz * 0.6 + nn[1] * sz * 0.8], [x - dd[0] * sz * 0.2, y - dd[1] * sz * 0.2], [x - dd[0] * sz * 0.6 - nn[0] * sz * 0.8, y - dd[1] * sz * 0.6 - nn[1] * sz * 0.8]], { fill: ac, part: 'beam-arrow' });
      }
    }
  }
  const deg = (v) => Math.atan2(v[1], v[0]) * 180 / Math.PI, mirrors = [];
  for (let i = 1; i < n - 1; i++) if (!bends.has(i) && Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]) > 1e-6) {
    const nd = deg(cut[i]); mirrors.push({ i, at: [...pts[i]], normal: nd, surface: nd + 90, rot: nd + 180 });
  }
  const ports = { start: [...pts[0]], end: [...pts[n - 1]] }; for (let i = 1; i < n - 1; i++) ports[`v${i}`] = [...pts[i]];
  const r = finish(o.F, o.name, g, ports);
  return { ...r, mirrors, edges: [ray(-hw), ray(hw)], at };
}

// plate(p, x, y, len, {angle, t, kind: 'filter' | 'dichroic' | 'glass' | 'mask', tint, coat, side, open: [inner, outer], stroke, F, name}) -> {node, ports}
// flat optical plate centred at (x, y), length len, thickness t, its surface along `angle` degrees from +x (0 horizontal; 45 runs
// top-left to bottom-right on the page; pass beamPath's mirrors[i].surface to sit on a fold). filter: tinted slab; dichroic: glass
// with a coloured coating on one face (side -1 | 1); glass: clear slab; mask: opaque plate with an open annulus at
// |u| in [inner, outer] x len/2 (side view of an annular / TIR mask). Ports center, a, b (the ends), front, back.
export function plate(p, x, y, len, o = {}) {
  const ang = o.angle ?? 0, t = o.t ?? 1.6, kind = o.kind ?? 'filter', side = o.side ?? -1, st = o.stroke ?? C.ink, sw = STYLE.line.thin;
  const g = G(p, x, y, ang, 'plate');
  if (kind === 'mask') {
    const [ui, uo] = o.open ?? [0.42, 0.62], hl = len / 2, dark = o.tint ?? '#2b2f36';
    rect(g, -hl, -t / 2, len, t, { fill: '#ffffff', stroke: st, width: sw });
    for (const [u0, u1] of [[-1, -uo], [-ui, ui], [uo, 1]]) rect(g, u0 * hl, -t / 2, (u1 - u0) * hl, t, { fill: dark });
  } else {
    const fill = o.tint ?? (kind === 'glass' ? linearGradient(p, [[0, shade(C.glass, 0.5)], [1, C.glass]], 90) : kind === 'dichroic' ? '#eef5f9' : '#e9f1f6');
    rect(g, -len / 2, -t / 2, len, t, { fill, stroke: st, width: sw });
    if (kind === 'dichroic') line(g, [-len / 2, side * t / 2], [len / 2, side * t / 2], { stroke: o.coat ?? C.orange, width: Math.max(0.5, t * 0.35), cap: 'butt' });
  }
  return finish(o.F, o.name, g, { center: [x, y], a: rotPt(-len / 2, 0, x, y, ang), b: rotPt(len / 2, 0, x, y, ang), front: rotPt(0, side * t / 2, x, y, ang), back: rotPt(0, -side * t / 2, x, y, ang) });
}

// evanescent(p, cx, y, sigma, decay, {color, peak, zMax, w, dir, part}) -> {node}
// near-field glow at an interface (TIR, evanescent wave, surface plasmon): opacity = peak exp(-z / decay) exp(-x^2 / 2 sigma^2),
// separable, drawn as one rect under a mask (no banding, no blur filter). z runs away from the interface y: dir -1 (default)
// above it, 1 below; zMax (default 3 decay) and w (half-width, default 3 sigma) bound the drawn region.
let evid = 0;
export function evanescent(p, cx, y, sigma, decay, o = {}) {
  let sv = p.node || p; while (sv && sv.tagName !== 'svg') sv = sv.parentNode;
  const defs = sv.querySelector('defs'), color = o.color ?? C.beamGreen, peak = o.peak ?? 0.8, zMax = o.zMax ?? 3 * decay, w = o.w ?? 3 * sigma, dir = o.dir ?? -1, k = ++evid;
  const y0 = dir < 0 ? y - zMax : y, gv = `evg${k}`, gm = `evm${k}`, mk = `evk${k}`;
  const lg = el(defs, 'linearGradient', { id: gv, x1: 0, y1: dir < 0 ? 1 : 0, x2: 0, y2: dir < 0 ? 0 : 1 });
  for (let i = 0; i <= 12; i++) { const z = i / 12 * zMax; el(lg, 'stop', { offset: i / 12, 'stop-color': color, 'stop-opacity': (peak * Math.exp(-z / decay) * (1 - (i / 12) ** 3)).toFixed(4) }); }
  const lm = el(defs, 'linearGradient', { id: gm, x1: 0, y1: 0, x2: 1, y2: 0 });
  for (let i = 0; i <= 16; i++) { const xx = (i / 16 - 0.5) * 2 * w; el(lm, 'stop', { offset: i / 16, 'stop-color': '#fff', 'stop-opacity': Math.exp(-xx * xx / (2 * sigma * sigma)).toFixed(4) }); }
  const m = el(defs, 'mask', { id: mk, maskUnits: 'userSpaceOnUse', x: cx - w, y: y0, width: 2 * w, height: zMax });
  el(m, 'rect', { x: cx - w, y: y0, width: 2 * w, height: zMax, fill: `url(#${gm})` });
  const g = el(p, 'g', { mask: `url(#${mk})`, 'data-part': o.part ?? 'glow' });
  el(g, 'rect', { x: cx - w, y: y0, width: 2 * w, height: zMax, fill: `url(#${gv})` });
  return { node: g };
}
```

### `skills/schematic-figure/foundation/engine/forms.js`
```javascript
// v2 forms: generalised from the Level-1 test reports (lab-19, opt-23, qo-09); v12 stimulus and motion glyphs (bolt, cloud, lamp, trail).
import { el, text } from './core.js';
import { STYLE, shade, ramp } from './style.js';
import { path, line, polygon, ellipse, circle, smooth, sample, radialGradient, linearGradient, blur } from './draw.js';
import { userGradient } from './geo.js';

const C = STYLE.color;
const f2 = (v) => (+v).toFixed(2);

// curly brace between points a and b; the tip points to the side given by `side` (+1 = right/down of a->b, -1 = left/up)
export function brace(p, a, b, { depth = 3, side = 1, stroke = C.ink, width = STYLE.line.thin, label, labelGap = 1.5, size } = {}) {
  const g = el(p, 'g', { 'data-part': 'brace' });
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side;
  const P = (s, d) => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d];
  const q = depth / 2, m = L / 2;
  const pts = [P(0, 0), P(0, q), P(q, q), P(m - q, q), P(m - q * 0.2, q * 1.2), P(m, depth), P(m + q * 0.2, q * 1.2), P(m + q, q), P(L - q, q), P(L, q), P(L, 0)];
  const d = `M${f2(pts[0][0])},${f2(pts[0][1])} Q${f2(pts[1][0])},${f2(pts[1][1])} ${f2(pts[2][0])},${f2(pts[2][1])} L${f2(pts[3][0])},${f2(pts[3][1])} Q${f2(pts[4][0])},${f2(pts[4][1])} ${f2(pts[5][0])},${f2(pts[5][1])} Q${f2(pts[6][0])},${f2(pts[6][1])} ${f2(pts[7][0])},${f2(pts[7][1])} L${f2(pts[8][0])},${f2(pts[8][1])} Q${f2(pts[9][0])},${f2(pts[9][1])} ${f2(pts[10][0])},${f2(pts[10][1])}`;
  path(g, d, { stroke, width });
  if (label) { const [tx, ty] = P(m, depth + labelGap); text(g, tx, ty, label, { anchor: Math.abs(nx) > 0.5 ? (nx > 0 ? 'start' : 'end') : 'middle', valign: Math.abs(ny) > 0.5 ? (ny > 0 ? 'top' : 'bottom') : 'middle', size }); }
  return g;
}

// affine frame: maps unit square (u, v) in [0,1]^2 to the parallelogram with origin o, edge vectors eu, ev.
// Returns {node, P(u, v) -> [x, y], matrix} ; draw planar content inside `node` in unit coordinates
// (strokes are counter-scaled: pass widths through `w(pt)`), or map points with P for screen-space drawing.
export function plane(p, o, eu, ev, { fill = '#e9e9e9', stroke, width = STYLE.line.thin, opacity = 1, r = 0 } = {}) {
  const P = (u, v) => [o[0] + eu[0] * u + ev[0] * v, o[1] + eu[1] * u + ev[1] * v];
  const g = el(p, 'g', { 'data-part': 'plane' });
  const corners = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  if (fill || stroke) path(g, roundedPoly(corners, r), { fill, stroke, width, opacity });
  const inner = el(g, 'g', { transform: `matrix(${[eu[0], eu[1], ev[0], ev[1], o[0], o[1]].map(f2).join(' ')})` });
  const scale = Math.sqrt(Math.abs(eu[0] * ev[1] - eu[1] * ev[0]));
  return { node: g, inner, P, w: (pt) => pt / scale, corners };
}

// rounded polygon in screen space (corners rounded by r pt): no stroke distortion under skew
export function roundedPoly(pts, r = 0) {
  if (!r) return 'M' + pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' L') + 'Z';
  const n = pts.length; let d = '';
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]), rr = Math.min(r, la / 2, lc / 2);
    const p1 = [b[0] + (a[0] - b[0]) / la * rr, b[1] + (a[1] - b[1]) / la * rr], p2 = [b[0] + (c[0] - b[0]) / lc * rr, b[1] + (c[1] - b[1]) / lc * rr];
    d += `${i ? ' L' : 'M'}${f2(p1[0])},${f2(p1[1])} Q${f2(b[0])},${f2(b[1])} ${f2(p2[0])},${f2(p2[1])}`;
  }
  return d + 'Z';
}

// glossy 3D node (sphere-like ellipse): base colour, top-left highlight, soft ground shadow
export function glossyNode(p, cx, cy, rx, ry = rx, { color = C.blue, shadow = true, highlight = 0.55 } = {}) {
  const g = el(p, 'g', { 'data-part': 'glossy-node' });
  if (shadow) ellipse(g, cx + rx * 0.08, cy + ry * 0.95, rx * 0.8, ry * 0.18, { fill: '#000', opacity: 0.18, filter: blur(p, rx * 0.12) });
  ellipse(g, cx, cy, rx, ry, { fill: radialGradient(p, [[0, shade(color, highlight)], [0.55, color], [1, shade(color, -0.35)]], { cx: 0.35, cy: 0.3, r: 0.75 }) });
  ellipse(g, cx - rx * 0.32, cy - ry * 0.4, rx * 0.28, ry * 0.16, { fill: '#fff', opacity: 0.55, filter: blur(p, rx * 0.05) });
  return g;
}

// open (chevron) arrowhead at tip pointing along dir (unit vector); or use arrow(..., {headStyle:'open'})
export function chevron(p, tip, dir, { len = 2.6, spread = 0.55, stroke = C.ink, width = STYLE.line.normal } = {}) {
  const [ux, uy] = dir, nx = -uy, ny = ux;
  return path(p, `M${f2(tip[0] - ux * len + nx * len * spread)},${f2(tip[1] - uy * len + ny * len * spread)} L${f2(tip[0])},${f2(tip[1])} L${f2(tip[0] - ux * len - nx * len * spread)},${f2(tip[1] - uy * len - ny * len * spread)}`, { stroke, width, join: 'miter' });
}

// double-shaft (implies) arrow a -> b
export function doubleArrow(p, a, b, { gap = 1.1, stroke = C.ink, width = STYLE.line.thin, head = 2.4 } = {}) {
  const g = el(p, 'g', { 'data-part': 'double-arrow' });
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = -uy, ny = ux;
  for (const s of [-1, 1]) line(g, [a[0] + nx * gap * s / 2, a[1] + ny * gap * s / 2], [b[0] - ux * head * 0.6 + nx * gap * s / 2, b[1] - uy * head * 0.6 + ny * gap * s / 2], { stroke, width, cap: 'butt' });
  chevron(g, b, [ux, uy], { len: head, spread: 0.65, stroke, width });
  return g;
}

// Gaussian pulse sitting on a baseline at y (peak up), centred at cx, half-width sigma (pt), height h
export function pulse(p, cx, y, { sigma = 1.6, h = 6, span = 4, color = C.beam, fill, width = STYLE.line.normal, baseline = false } = {}) {
  const g = el(p, 'g', { 'data-part': 'pulse' });
  const pts = sample((x) => y - h * Math.exp(-((x - cx) ** 2) / (2 * sigma * sigma)), cx - span * sigma, cx + span * sigma, 80);
  if (fill !== false) polygon(g, [[pts[0][0], y], ...pts, [pts[pts.length - 1][0], y]], { fill: fill ?? shade(color, 0.6) });
  path(g, smooth(pts, false, 0.4), { stroke: color, width });
  if (baseline) line(g, [pts[0][0], y], [pts[pts.length - 1][0], y], { stroke: C.ink, width: STYLE.line.thin });
  return g;
}

// oblique 3-axis frame at origin o with axis vectors ax, ay, az (pt); labels and dashed axes optional
export function axes3(p, o, ax, ay, az, { labels = [], dashed = [], stroke = C.ink, width = STYLE.line.thin, head = 2.4, size = STYLE.text.label } = {}) {
  const g = el(p, 'g', { 'data-part': 'axes3' });
  [ax, ay, az].forEach((v, i) => {
    if (!v) return;
    const b = [o[0] + v[0], o[1] + v[1]], L = Math.hypot(v[0], v[1]), u = [v[0] / L, v[1] / L];
    line(g, o, [b[0] - u[0] * head * 0.7, b[1] - u[1] * head * 0.7], { stroke, width, dash: dashed[i] ? '1.6 1.2' : undefined });
    polygon(g, [b, [b[0] - u[0] * head - u[1] * head * 0.4, b[1] - u[1] * head + u[0] * head * 0.4], [b[0] - u[0] * head + u[1] * head * 0.4, b[1] - u[1] * head - u[0] * head * 0.4]], { fill: stroke });
    const lab = labels[i]; if (lab) {
      const ang = Math.atan2(v[1], v[0]) * 180 / Math.PI, flip = ang > 90 || ang < -90;
      const m = [o[0] + v[0] * 0.55 + u[1] * 2.6, o[1] + v[1] * 0.55 - u[0] * 2.6];
      text(g, m[0], m[1], lab, { anchor: 'middle', valign: 'middle', size, rotate: flip ? ang + 180 : ang });
    }
  });
  return g;
}

// height-field / waterfall surface in an oblique frame: rows of curves z(u, v) drawn back-to-front with fills.
// P(u, v) maps the ground plane (u, v in [0,1]) to screen; hz = pt per unit height; colour from ramp(stops, z).
export function surface(p, P, z, { rows = 24, cols = 120, hz = 12, stops = ['#2c1b6b', '#2f6bd6', '#8fd3f0', '#ffffff'], line: lineColor, width = 0.25, fillOpacity = 0.95 } = {}) {
  const g = el(p, 'g', { 'data-part': 'surface' });
  for (let r = rows - 1; r >= 0; r--) {
    const v = r / (rows - 1), pts = [];
    let zmax = 0;
    for (let c = 0; c <= cols; c++) { const u = c / cols, h = z(u, v); zmax = Math.max(zmax, h); const [x, y] = P(u, v); pts.push([x, y - h * hz]); }
    const [x0, y0] = P(0, v), [x1, y1] = P(1, v);
    const col = ramp(stops, Math.min(1, zmax));
    polygon(g, [[x0, y0], ...pts, [x1, y1]], { fill: linearGradient(p, [[0, col], [1, '#ffffff', 0.2]], 90), opacity: fillOpacity });
    path(g, 'M' + pts.map(([a, b]) => `${f2(a)},${f2(b)}`).join(' L'), { stroke: lineColor ?? shade(col, -0.3), width });
  }
  return g;
}

// thick ring glyph in oblique view (resonator, cavity): ellipse with a tube-like stroke
export function ringGlyph(p, cx, cy, rx, ry, { color = '#3b4a8f', width = 2.2, highlight = true } = {}) {
  const g = el(p, 'g', { 'data-part': 'ring-glyph' });
  ellipse(g, cx, cy, rx, ry, { stroke: shade(color, -0.25), width: width + 0.5 });
  ellipse(g, cx, cy, rx, ry, { stroke: color, width });
  if (highlight) path(g, `M${f2(cx - rx * 0.7)},${f2(cy - ry * 0.72)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(cx + rx * 0.5)},${f2(cy - ry * 0.86)}`, { stroke: shade(color, 0.5), width: width * 0.3, opacity: 0.8 });
  return g;
}

// ---- v3 parts (from the Level-2/3 reports) ----------------------------------------------------------

// disc seen obliquely from above (lens, wafer, plate): tilt = elevation of the view in degrees
// (90 = straight down, a circle; 30 = ellipse height/width 0.5; 15 = 0.26). thickness in pt shows the rim.
export function obliqueDisc(p, cx, cy, r, { tilt = 35, thickness = 2.2, top = '#dfe3e8', rim, glass = false, stroke = C.ink, width = STYLE.line.thin } = {}) {
  const g = el(p, 'g', { 'data-part': 'oblique-disc' }), ry = r * Math.sin(tilt * Math.PI / 180);
  const rimC = rim ?? shade(top, -0.3);
  path(g, `M${f2(cx - r)},${f2(cy)} A${f2(r)},${f2(ry)} 0 0 0 ${f2(cx + r)},${f2(cy)} L${f2(cx + r)},${f2(cy + thickness)} A${f2(r)},${f2(ry)} 0 0 1 ${f2(cx - r)},${f2(cy + thickness)} Z`,
    { fill: linearGradient(p, [[0, shade(rimC, 0.25)], [0.5, rimC], [1, shade(rimC, -0.2)]], 0), stroke, width });
  ellipse(g, cx, cy, r, ry, { fill: glass ? radialGradient(p, [[0, '#ffffff', 0.9], [0.7, top, 0.85], [1, shade(top, -0.15), 0.9]], { cx: 0.4, cy: 0.35, r: 0.7 }) : linearGradient(p, [[0, shade(top, 0.3)], [1, shade(top, -0.08)]], 90), stroke, width });
  if (glass) path(g, `M${f2(cx - r * 0.6)},${f2(cy - ry * 0.55)} A${f2(r * 0.8)},${f2(ry * 0.8)} 0 0 1 ${f2(cx + r * 0.1)},${f2(cy - ry * 0.85)}`, { stroke: '#fff', width: 0.8, opacity: 0.8 });
  return { node: g, ry, top: [cx, cy - ry], bottom: [cx, cy + ry + thickness], left: [cx - r, cy], right: [cx + r, cy] };
}

// panel device (SLM, DMD, display, detector array) seen obliquely: a slab of size w x d with thickness,
// display area inset, content drawn by fn(g, P) where P(u, v) maps the display's unit square to the page.
export function obliquePanel(p, cx, cy, w, d, { tilt = 35, skew = 0.25, thickness = 2.5, frame = '#c9ced6', side = '#2a3a66', inset = 0.08, fn } = {}) {
  const g = el(p, 'g', { 'data-part': 'oblique-panel' }), s = Math.sin(tilt * Math.PI / 180);
  const P0 = (u, v) => [cx + (u - 0.5) * w + (v - 0.5) * d * skew, cy + (v - 0.5) * d * s];
  const c = [P0(0, 0), P0(1, 0), P0(1, 1), P0(0, 1)];
  polygon(g, [c[3], c[2], [c[2][0], c[2][1] + thickness], [c[3][0], c[3][1] + thickness]], { fill: side });
  polygon(g, [c[1], c[2], [c[2][0], c[2][1] + thickness], [c[1][0], c[1][1] + thickness]], { fill: shade(side, -0.2) });
  polygon(g, c, { fill: linearGradient(p, [[0, shade(frame, 0.35)], [1, frame]], 90), stroke: C.ink, width: STYLE.line.thin });
  const P = (u, v) => P0(inset + u * (1 - 2 * inset), inset + v * (1 - 2 * inset));
  polygon(g, [P(0, 0), P(1, 0), P(1, 1), P(0, 1)], { fill: '#1d2230' });
  if (fn) fn(g, P);
  return { node: g, P, corners: c, top: P0(0.5, 0), bottom: [cx, c[2][1] + thickness], center: [cx, cy] };
}

// band that narrows to a waist (a pipeline with a bottleneck); segments [{x0, x1, h, fill}] with h the
// band height at that segment (pt); transitions between segments are smooth. cy = centre line.
export function waistBand(p, cy, segments, { r = 3, smoothLen = 8 } = {}) {
  const g = el(p, 'g', { 'data-part': 'waist-band' });
  segments.forEach((sg, i) => {
    const prev = segments[i - 1], next = segments[i + 1];
    const h0 = prev ? (prev.h + sg.h) / 2 : sg.h, h1 = next ? (next.h + sg.h) / 2 : sg.h, a = sg.x0, b = sg.x1, L = Math.min(smoothLen, (b - a) / 3);
    const top = `M${f2(a)},${f2(cy - h0 / 2)} C${f2(a + L)},${f2(cy - h0 / 2)} ${f2(a + L)},${f2(cy - sg.h / 2)} ${f2(a + 2 * L)},${f2(cy - sg.h / 2)} L${f2(b - 2 * L)},${f2(cy - sg.h / 2)} C${f2(b - L)},${f2(cy - sg.h / 2)} ${f2(b - L)},${f2(cy - h1 / 2)} ${f2(b)},${f2(cy - h1 / 2)}`;
    const bot = ` L${f2(b)},${f2(cy + h1 / 2)} C${f2(b - L)},${f2(cy + h1 / 2)} ${f2(b - L)},${f2(cy + sg.h / 2)} ${f2(b - 2 * L)},${f2(cy + sg.h / 2)} L${f2(a + 2 * L)},${f2(cy + sg.h / 2)} C${f2(a + L)},${f2(cy + sg.h / 2)} ${f2(a + L)},${f2(cy + h0 / 2)} ${f2(a)},${f2(cy + h0 / 2)} Z`;
    path(g, top + bot, { fill: sg.fill ?? C.tintGrey });
  });
  return g;
}

// column (or row) of binary cells, e.g. detector clicks: bits array of 0/1
export function bitColumn(p, x, y, bits, { cell = 3, on = C.green, off = '#ffffff', stroke = C.ink, horizontal = false, width = STYLE.line.hair * 1.4 } = {}) {
  const g = el(p, 'g', { 'data-part': 'bits' });
  bits.forEach((b, i) => { const cx = horizontal ? x + i * cell : x, cy = horizontal ? y : y + i * cell; rectP(g, cx, cy, cell, cell, { fill: b ? on : off, stroke, width }); });
  return g;
}
const rectP = (p, x, y, w, h, s) => polygon(p, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], s);

// digital projector (light engine) in 3/4 view, lens facing +x; returns lens point for a light cone
export function projector(p, x, y, { w = 22, h = 9, d = 10, color = '#e4e6ea' } = {}) {
  const g = el(p, 'g', { 'data-part': 'projector' });
  const dx = d * 0.55, dy = -d * 0.35;
  polygon(g, [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]], { fill: shade(color, 0.3), stroke: C.ink, width: STYLE.line.thin });
  polygon(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { fill: color, stroke: C.ink, width: STYLE.line.thin });
  polygon(g, [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + dy + h], [x + w, y + h]], { fill: shade(color, -0.18), stroke: C.ink, width: STYLE.line.thin });
  for (let k = 0; k < 4; k++) path(g, `M${f2(x + 2 + k * 1.6)},${f2(y + h * 0.3)} l0,${f2(h * 0.4)}`, { stroke: shade(color, -0.4), width: 0.5 });
  const lx = x + w + dx * 0.5, ly = y + h * 0.5 + dy * 0.5;
  ellipse(g, lx, ly, 1.6, 2.8, { fill: radialGradient(p, [[0, '#bfe8ff'], [1, '#2a6f97']], { cx: 0.4, cy: 0.4, r: 0.7 }), stroke: C.ink, width: STYLE.line.thin });
  return { node: g, lens: [lx + 1.6, ly] };
}

// ---- v9: springs and bent flow arrows ------------------------------------------------------------------
// spring(p, a, b, {n, amp, lead, style: 'zigzag' | 'coil', stroke, width, F, name}) -> {node, ports}
// elastic linker from a to b (bead-spring models, force probes, optical-trap stiffness): n zigzag periods (or coil loops) of
// half-height amp between straight leads, each lead a fraction `lead` of the length. Ports a, b, mid.
export function spring(p, a, b, { n = 6, amp = 2.2, lead = 0.18, style = 'zigzag', stroke = C.mid, width = STYLE.line.normal, F, name } = {}) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const s0 = lead * len, s1 = (1 - lead) * len, P = (s, q) => [a[0] + ux * s + nx * q, a[1] + uy * s + ny * q], pts = [a, P(s0, 0)];
  if (style === 'coil') {
    const N = n * 24, back = Math.min(1.1 * amp, 0.6 * (s1 - s0) / n);   // loops: the pen runs back by `back` on each turn
    for (let i = 1; i < N; i++) { const th = 2 * Math.PI * n * i / N; pts.push(P(s0 + (s1 - s0) * i / N + back * (1 - Math.cos(th)), amp * Math.sin(th))); }
  } else for (let i = 0; i < 2 * n; i++) pts.push(P(s0 + (s1 - s0) * (i + 0.5) / (2 * n), amp * (i % 2 ? -1 : 1)));
  pts.push(P(s1, 0), b);
  const node = el(p, 'polyline', { points: pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' '), fill: 'none', stroke, 'stroke-width': width, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'data-part': 'spring' });
  const ports = { a: [...a], b: [...b], mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
  if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, p.node || p, x, y);
  return { node, ports };
}

// flowArrow(p, pts, {width, head, headWidth, radius, fill, opacity, part, F, from, to, kind}) -> {node}
// fat flow arrow along a polyline with rounded bends (Sankey-style energy or mass flow that turns corners): constant width
// (pass value x one shared scale), a filled head at the last point. radius = centre-line bend radius (default = width).
export function flowArrow(p, pts, { width = 6, head, headWidth, radius, fill = C.light, opacity, part, F, from, to, kind } = {}) {
  const g = el(p, 'g', { 'data-part': part ?? 'flow-arrow', opacity });
  const hl = head ?? Math.max(3, 0.8 * width), hw = headWidth ?? width + 5, n = pts.length, e = pts[n - 1], q = pts[n - 2];
  const dl = Math.hypot(e[0] - q[0], e[1] - q[1]) || 1, u = [(e[0] - q[0]) / dl, (e[1] - q[1]) / dl], nn = [-u[1], u[0]], bb = [e[0] - u[0] * hl, e[1] - u[1] * hl];
  const P = pts.map((v) => [...v]); P[n - 1] = [bb[0] + u[0] * 0.3, bb[1] + u[1] * 0.3];
  const r = radius ?? width;
  let d = `M${f2(P[0][0])},${f2(P[0][1])}`;
  for (let i = 1; i < n - 1; i++) {
    const [px, py] = P[i], la = Math.hypot(px - P[i - 1][0], py - P[i - 1][1]) || 1, lb = Math.hypot(P[i + 1][0] - px, P[i + 1][1] - py) || 1;
    const rr = Math.min(r, la / 2, lb / 2), ua = [(px - P[i - 1][0]) / la, (py - P[i - 1][1]) / la], ub = [(P[i + 1][0] - px) / lb, (P[i + 1][1] - py) / lb];
    d += ` L${f2(px - ua[0] * rr)},${f2(py - ua[1] * rr)} Q${f2(px)},${f2(py)} ${f2(px + ub[0] * rr)},${f2(py + ub[1] * rr)}`;
  }
  d += ` L${f2(P[n - 1][0])},${f2(P[n - 1][1])}`;
  path(g, d, { stroke: fill, width, cap: 'butt', join: 'round', part: 'block-flow' });   // 'block' exempts the fat shaft from the heavy-stroke warning, as for L.blockArrow
  polygon(g, [e, [bb[0] + nn[0] * hw / 2, bb[1] + nn[1] * hw / 2], [bb[0] - nn[0] * hw / 2, bb[1] - nn[1] * hw / 2]], { fill, part: 'block-flow-head' });
  if (F && from && to) F.drawn.push({ from, to, kind: kind ?? 'flow' });
  return { node: g };
}

// ---- v12: stimulus and motion glyphs (from the Level-3 gap reports bio-13 and ind-11) ----------------------------------
const reg12 = (F, name, p, ports) => { if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, p.node || p, x, y); return ports; };

// bolt(p, x, y, w, h, {fill, stroke, width, flip, rot, F, name}) -> {node, ports}: a lightning bolt in the box x, y, w, h
// (footshock, electrical stimulation, discharge, a hazard mark): a zig-zag polygon, pale yellow with a dark outline.
// flip mirrors it; rot (deg) turns it about the box centre. Ports top, tip (the lower point), center.
export function bolt(p, x, y, w, h, { fill = '#fbf3c4', stroke = C.ink, width = STYLE.line.thin, flip = false, rot = 0, F, name } = {}) {
  const cx = x + w / 2, cy = y + h / 2, c = Math.cos(rot * Math.PI / 180), s = Math.sin(rot * Math.PI / 180);
  const M = ([a, b]) => { const dx = (flip ? 1 - a : a) * w - w / 2, dy = b * h - h / 2; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
  const u = [[0.52, 0], [1, 0.08], [0.62, 0.42], [0.74, 0.47], [0, 1], [0.36, 0.56], [0.24, 0.52]];
  const node = polygon(p, u.map(M), { fill, stroke, width, join: 'miter', part: 'bolt' });
  return { node, ports: reg12(F, name, p, { top: M([0.76, 0.04]), tip: M([0, 1]), center: [cx, cy] }) };
}

// cloud(p, cx, cy, w, h, {lobes, bulge, fill, stroke, width, seed, streaks, F, name}) -> {node, ports}: a lobed cloud outline
// (air puff, smoke, gas release, a thought bubble) about w x h, drawn as a ring of `lobes` arcs (default 8; bulge scales
// how far each arc swells) with a little seeded jitter. streaks: n speed lines leaving the right side (an air puff), or
// {n, len, side: 1 | -1}. Ports center, left, right, top, bottom.
export function cloud(p, cx, cy, w, h, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'cloud' }), n = o.lobes ?? 8, stroke = o.stroke ?? C.mid, width = o.width ?? STYLE.line.thin;
  let s = ((o.seed ?? 3) * 2654435761 >>> 0) || 1; const R = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const pts = Array.from({ length: n }, (_, i) => { const a = 2 * Math.PI * (i + 0.25 * (R() - 0.5)) / n - Math.PI / 2, k = 0.9 + 0.12 * R(); return [cx + Math.cos(a) * w * 0.36 * k, cy + Math.sin(a) * h * 0.33 * k]; });
  let d = `M${f2(pts[0][0])},${f2(pts[0][1])}`;
  pts.forEach((q, i) => { const e = pts[(i + 1) % n], r = Math.hypot(e[0] - q[0], e[1] - q[1]) * 0.55 / (o.bulge ?? 1); d += ` A${f2(r)},${f2(r)} 0 0 1 ${f2(e[0])},${f2(e[1])}`; });
  path(g, d + 'Z', { fill: o.fill ?? '#fff', stroke, width, join: 'round', part: 'cloud-outline' });
  if (o.streaks) {
    const st = typeof o.streaks === 'object' ? o.streaks : { n: o.streaks }, k = st.n ?? 2, side = st.side ?? 1, len = st.len ?? 1.4 * w;
    for (let i = 0; i < k; i++) { const yy = cy + (i - (k - 1) / 2) * h * 0.14, x0 = cx + side * w * 0.3; line(g, [x0, yy], [x0 + side * len, yy + h * 0.02 * i], { stroke, width, part: 'cloud-streak' }); }
  }
  return { node: g, ports: reg12(o.F, o.name, p, { center: [cx, cy], left: [cx - w / 2, cy], right: [cx + w / 2, cy], top: [cx, cy - h / 2], bottom: [cx, cy + h / 2] }) };
}

// lamp(p, x, y, {angle, size, beam, spread, color, body, stroke, width, F, name}) -> {node, ports}: a small lamp (light
// stimulus, torch, LED head): a grey head of width `size` whose emitting face is centred at (x, y), and a fading beam of
// length `beam` (default 1.6 size) along `angle` (deg, 90 = down), widening by `spread` (deg half-angle, default 18).
// Ports face, back, beam (the beam's far end).
export function lamp(p, x, y, o = {}) {
  const s = o.size ?? 8, a = (o.angle ?? 90) * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const T = (along, across) => [x + ux * along + nx * across, y + uy * along + ny * across];
  const g = el(p, 'g', { 'data-part': o.part ?? 'lamp' }), bl = o.beam ?? 1.6 * s, sp = Math.tan((o.spread ?? 18) * Math.PI / 180), col = o.color ?? '#fce77e';
  polygon(g, [T(0, -0.42 * s), T(bl, -0.42 * s - bl * sp), T(bl, 0.42 * s + bl * sp), T(0, 0.42 * s)], { fill: userGradient(g, T(0, 0), T(bl, 0), [[0, col, 1], [1, col, 0.15]]), part: 'lamp-beam' });
  const body = o.body ?? '#8d8d8d', st = o.stroke ? { stroke: o.stroke, width: o.width ?? STYLE.line.thin } : {};
  polygon(g, [T(-1.1 * s, -s / 2), T(0, -s / 2), T(0, s / 2), T(-1.1 * s, s / 2)], { fill: userGradient(g, T(0, -s / 2), T(0, s / 2), [[0, shade(body, 0.25)], [0.5, body], [1, shade(body, -0.25)]]), ...st, part: 'lamp-head' });
  return { node: g, ports: reg12(o.F, o.name, p, { face: [x, y], back: T(-1.1 * s, 0), beam: T(bl, 0) }) };
}

// trail(p, head, tail, {w, color, bend, blur, opacity, core, F, name}) -> {node, ports}: a glowing comet trail behind a
// moving particle, from `tail` (faded, thin) to `head` (full colour, width w): a tapered band bowed sideways by bend x its
// length (positive = left of travel), softly blurred, with a bright core line. Draw it before the particle at `head`.
export function trail(p, head, tail, o = {}) {
  const w = o.w ?? 6, color = o.color ?? '#39a6ff', bend = o.bend ?? 0.18, bl = o.blur ?? 0.18 * w, g = el(p, 'g', { 'data-part': o.part ?? 'trail' });
  const dx = head[0] - tail[0], dy = head[1] - tail[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, N = 16;
  const mid = (t) => [tail[0] + dx * t + nx * Math.sin(Math.PI * t) * bend * len * -1, tail[1] + dy * t + ny * Math.sin(Math.PI * t) * bend * len * -1];
  const side = (t, s) => { const [cx, cy] = mid(t), hw = w / 2 * Math.pow(t, 0.8); return [cx + nx * hw * s, cy + ny * hw * s]; };
  const pts = []; for (let i = 0; i <= N; i++) pts.push(side(i / N, 1)); for (let i = N; i >= 0; i--) pts.push(side(i / N, -1));
  path(g, smooth(pts, true, 0.3), { fill: userGradient(g, tail, head, [[0, color, 0], [0.55, color, 0.55], [1, color, 1]]), opacity: o.opacity ?? 0.9, filter: bl > 0 ? blur(g, bl) : undefined, part: 'trail-band' });
  if (o.core !== false) {
    const core = []; for (let i = 3; i <= N; i++) core.push(mid(i / N));
    path(g, smooth(core, false, 0.4), { stroke: userGradient(g, tail, head, [[0, '#ffffff', 0], [1, '#ffffff', 0.85]]), width: w * 0.18, cap: 'round', filter: bl > 0 ? blur(g, bl * 0.5) : undefined, part: 'trail-core' });
  }
  return { node: g, ports: reg12(o.F, o.name, p, { head: [...head], tail: [...tail], mid: mid(0.5) }) };
}
```

### `skills/schematic-figure/foundation/engine/blocks.js`
```javascript
// Neural-network diagrams, block diagrams, matrices, small plots and photonic-chip drawings.
import { el, text } from './core.js';
import { STYLE, shade, ramp, PALETTES } from './style.js';
import { path, line, rect, circle, polygon, smooth, sample, linearGradient, isoBox, arrow } from './draw.js';

const C = STYLE.color;
const reg = (F, name, parent, ports) => { if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, parent, x, y); return ports; };

// ---- block diagram ---------------------------------------------------------------------------------
// box(p, x, y, w, h, label, {fill, stroke, r, F, name, size, color}) — x,y is the top-left corner
export function box(p, x, y, w, h, label, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'box' });
  rect(g, x, y, w, h, { r: o.r ?? 1.6, fill: o.fill ?? C.tintBlue, stroke: o.stroke ?? shade(o.fill ?? C.tintBlue, -0.45), width: o.width ?? STYLE.line.thin, dash: o.dash });
  if (label) text(g, x + w / 2, y + h / 2, label, { anchor: 'middle', valign: 'middle', size: o.size, weight: o.weight, color: o.color });
  const ports = reg(o.F, o.name, p, { left: [x, y + h / 2], right: [x + w, y + h / 2], top: [x + w / 2, y], bottom: [x + w / 2, y + h], center: [x + w / 2, y + h / 2] });
  return { node: g, ports };
}

// ---- layered neural network ------------------------------------------------------------------------
// network(p, x, y, {layers: [3,5,5,2], w, h, r, colors, edges: 'full'|'none', edgeColor, F, name})
export function network(p, x, y, o = {}) {
  const layers = o.layers ?? [3, 4, 4, 2], w = o.w ?? 40, h = o.h ?? 24, r = o.r ?? 1.6;
  const g = el(p, 'g', { 'data-part': 'network' });
  const cols = o.colors ?? layers.map((_, i) => i === 0 ? C.sky : i === layers.length - 1 ? C.orange : C.blue);
  const pos = layers.map((n, i) => Array.from({ length: n }, (_, j) => [x + (layers.length === 1 ? w / 2 : i * w / (layers.length - 1)), y + h / 2 + (j - (n - 1) / 2) * Math.min(h / Math.max(1, n - 1), r * 4.2)]));
  if ((o.edges ?? 'full') === 'full') for (let i = 0; i + 1 < pos.length; i++) for (const a of pos[i]) for (const b of pos[i + 1])
    line(g, a, b, { stroke: o.edgeColor ?? C.light, width: o.edgeWidth ?? STYLE.line.hair, cap: 'butt' });
  pos.forEach((col, i) => col.forEach(([cx, cy]) => circle(g, cx, cy, r, { fill: cols[i], stroke: shade(cols[i], -0.4), width: STYLE.line.hair * 1.4 })));
  const ports = reg(o.F, o.name, p, { left: [x - r, y + h / 2], right: [x + w + r, y + h / 2], top: [x + w / 2, y], bottom: [x + w / 2, y + h] });
  return { node: g, ports, nodes: pos };
}

// matrix / weight heat map: values[i][j] in [0,1] (or fn), cell size s
export function matrix(p, x, y, { rows = 5, cols = 5, s = 2.4, fn = (i, j) => ((i * 7 + j * 3) % 10) / 9, stops = PALETTES.diverging, stroke = C.ink, gap = 0.2, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'matrix' });
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) rect(g, x + j * s + gap / 2, y + i * s + gap / 2, s - gap, s - gap, { fill: ramp(stops, fn(i, j)) });
  rect(g, x, y, cols * s, rows * s, { stroke, width: STYLE.line.thin });
  const W = cols * s, H = rows * s;
  const ports = reg(F, name, p, { left: [x, y + H / 2], right: [x + W, y + H / 2], top: [x + W / 2, y], bottom: [x + W / 2, y + H] });
  return { node: g, ports, w: W, h: H };
}

// stack of feature maps / image tiles in oblique view (like CNN diagrams): n tiles offset by (dx, dy)
export function tileStack(p, x, y, { n = 4, w = 10, h = 10, dx = 1.6, dy = -1.2, fill = '#dfe9f5', stroke = C.ink, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'tile-stack' });
  for (let k = n - 1; k >= 0; k--) rect(g, x + k * dx, y + k * dy, w, h, { fill: shade(fill, -0.06 * k), stroke, width: STYLE.line.thin });
  const ports = reg(F, name, p, { left: [x, y + h / 2], right: [x + w + (n - 1) * dx, y + h / 2 + (n - 1) * dy], center: [x + w / 2, y + h / 2] });
  return { node: g, ports };
}

// ---- small plots for insets ------------------------------------------------------------------------
// plot(p, x, y, w, h, {series: [{fn|pts, color, width, dash}], xr, yr, axes, xlabel, ylabel, ticks: false})
export function plot(p, x, y, w, h, o = {}) {
  const g = el(p, 'g', { 'data-part': 'plot' });
  const [x0, x1] = o.xr ?? [0, 1], [y0, y1] = o.yr ?? [0, 1];
  const X = (v) => x + (v - x0) / (x1 - x0) * w, Y = (v) => y + h - (v - y0) / (y1 - y0) * h;
  if (o.axes !== false) {
    arrow(g, [x, y + h], [x + w + 2, y + h], { width: STYLE.line.thin, head: 2.2 });
    arrow(g, [x, y + h], [x, y - 2], { width: STYLE.line.thin, head: 2.2 });
  }
  for (const s of o.series ?? []) {
    const P = s.pts ?? sample(s.fn, x0, x1, s.n ?? 100);
    if (s.bars) for (const [a, b] of P) rect(g, X(a) - s.bars / 2, Y(b), s.bars, Y(y0) - Y(b), { fill: s.color ?? C.blue });
    else if (s.dots) for (const [a, b] of P) circle(g, X(a), Y(b), s.dots, { fill: s.color ?? C.blue });
    else path(g, 'M' + P.map(([a, b]) => `${X(a).toFixed(2)},${Y(b).toFixed(2)}`).join(' L'), { stroke: s.color ?? C.blue, width: s.width ?? STYLE.line.normal, dash: s.dash });
  }
  if (o.xlabel) text(g, x + w / 2, y + h + 2, o.xlabel, { anchor: 'middle', valign: 'top', size: o.labelSize ?? STYLE.text.small });
  if (o.ylabel) { const t = text(g, 0, 0, o.ylabel, { anchor: 'middle', valign: 'bottom', size: o.labelSize ?? STYLE.text.small }); t.setAttribute('transform', `translate(${x - 1.5} ${y + h / 2}) rotate(-90) ${t.getAttribute('transform') ?? ''}`); }
  return { node: g, X, Y };
}

// ---- photonic chips -------------------------------------------------------------------------------
// chip(p, x, y, {w, d, t, proj, top, waveguides: [[pts in chip (u,v) coords 0..1]], wgColor, F, name})
// Draws an isometric slab; waveguides are polylines in the top face's (u, v) unit square.
export function chip(p, x, y, o = {}) {
  const w = o.w ?? 60, d = o.d ?? 36, t = o.t ?? 4, proj = o.proj;
  const g = el(p, 'g', { transform: `translate(${x} ${y})`, 'data-part': o.part ?? 'chip' });
  if (o.substrate !== false) isoBox(g, proj, [0, 0, -t * 0.8], [w, d, t * 0.8], { top: shade(C.substrate, -0.05), part: 'substrate' });
  isoBox(g, proj, [0, 0, 0], [w, d, t * 0.2], { top: o.top ?? '#eef1f5', part: 'chip-top' });
  const U = (u, v) => proj(u * w, v * d, t * 0.2);
  for (const wg of o.waveguides ?? []) {
    const P = wg.map(([u, v]) => U(u, v)), dd = smooth(P, false, 0.3);
    path(g, dd, { stroke: shade(o.wgColor ?? C.blue, -0.3), width: (o.wgWidth ?? 0.9) + 0.4 });
    path(g, dd, { stroke: o.wgColor ?? C.blue, width: o.wgWidth ?? 0.9 });
  }
  const ports = {}; for (const [k, [u, v]] of Object.entries(o.ports ?? {})) { const [a, b] = U(u, v); ports[k] = [x + a, y + b]; }
  reg(o.F, o.name, p, ports);
  return { node: g, ports, U: (u, v) => { const [a, b] = U(u, v); return [x + a, y + b]; } };
}

// top-view MZI mesh (Clements/Reck-style rectangular mesh): n modes, cols columns of MZIs
export function mziMesh(p, x, y, { n = 4, cols = 4, pitch = 5, cell = 12, color = C.blue, heater = C.gold, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'mzi-mesh' });
  const W = cols * cell, ys = (k) => y + k * pitch;
  // each mode is a horizontal guide with S-bends into couplers at MZI positions
  for (let k = 0; k < n; k++) {
    let d = `M${x - 4},${ys(k)}`;
    for (let c = 0; c < cols; c++) {
      const pairTop = (c % 2 === 0) ? (k % 2 === 0 ? k : k - 1) : (k % 2 === 1 ? k : k - 1);
      const inPair = pairTop >= 0 && pairTop + 1 < n;
      const x0 = x + c * cell, mid = inPair ? (ys(pairTop) + ys(pairTop + 1)) / 2 : ys(k), yk = ys(k);
      const yc = inPair ? mid + (yk < mid ? -0.9 : 0.9) : yk;
      d += ` L${x0 + 1},${yk} C${x0 + 2.5},${yk} ${x0 + 2.5},${yc} ${x0 + 4},${yc} L${x0 + 5},${yc} C${x0 + 6.5},${yc} ${x0 + 6.5},${yk} ${x0 + 8},${yk} L${x0 + cell},${yk}`;
    }
    d += ` L${x + W + 4},${ys(k)}`;
    path(g, d, { stroke: color, width: 0.8 });
  }
  for (let c = 0; c < cols; c++) for (let k = c % 2; k + 1 < n; k += 2) rect(g, x + c * cell + 8.4, ys(k) - 1.1, 3, 2.2, { fill: heater, stroke: shade(heater, -0.4), width: STYLE.line.hair, r: 0.4 });
  const ports = {}; for (let k = 0; k < n; k++) { ports[`in${k}`] = [x - 4, ys(k)]; ports[`out${k}`] = [x + W + 4, ys(k)]; }
  reg(F, name, p, ports);
  return { node: g, ports, w: W + 8, h: (n - 1) * pitch };
}

// ring resonator coupled to a bus waveguide (top view)
export function ring(p, cx, cy, { r = 5, gap = 0.8, bus = 14, color = C.blue, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'ring' });
  circle(g, cx, cy, r, { stroke: color, width: 0.9 });
  const yb = cy + r + gap + 0.9; line(g, [cx - bus / 2, yb], [cx + bus / 2, yb], { stroke: color, width: 0.9 });
  const ports = reg(F, name, p, { in: [cx - bus / 2, yb], out: [cx + bus / 2, yb], center: [cx, cy] });
  return { node: g, ports };
}
```

### `skills/schematic-figure/foundation/engine/signals.js`
```javascript
// Signals, data glyphs and overview-figure devices (v1; generalised from the Level-1 pilot's parts).
import { el, text, paint } from './core.js';
import { STYLE, shade, ramp } from './style.js';
import { path, line, rect, circle, polygon, smooth, sample, linearGradient, arrow, clipPath } from './draw.js';

const C = STYLE.color;
const f3 = (v) => +(+v).toFixed(3);

// step histogram: outline without a floor line, pale fill. bw = bin width or an array of edges; hs heights (pt, up)
export function stepHist(p, x0, base, bw, hs, { color = C.blue, fill, width = STYLE.line.normal, drop = 0, opacity = 1, floor = false } = {}) {
  const edges = Array.isArray(bw) ? bw : hs.map((_, i) => x0 + i * bw).concat([x0 + hs.length * bw]);
  const top = []; hs.forEach((h, i) => { top.push([edges[i], base - h], [edges[i + 1], base - h]); });
  const g = el(p, 'g', { 'data-part': 'histogram' });
  polygon(g, [[edges[0], base], ...top, [edges[edges.length - 1], base]], { fill: fill ?? shade(color, 0.78), opacity });
  polyline_(g, [[edges[0], base + drop], ...top, [edges[edges.length - 1], base + drop]], { stroke: color, width, join: 'miter', cap: 'butt', opacity });
  if (floor) line(g, [edges[0], base], [edges[edges.length - 1], base], { stroke: color, width });
  return { node: g, edges };
}
const polyline_ = (p, a, s) => path(p, 'M' + a.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L'), s);

// categorical axis labels under bins (e.g. class digits); highlight index gets bold ink
export function binLabels(p, edges, y, labels, { size = STYLE.text.label, color = C.text, highlight = -1 } = {}) {
  labels.forEach((s, k) => text(p, (edges[k] + edges[k + 1]) / 2, y, String(s), { anchor: 'middle', valign: 'middle', size, color: k === highlight ? C.text : color, weight: k === highlight ? 'bold' : 'normal' }));
}

// signal wave from x0 to x1 about y (either direction), optional pale band and arrowhead.
// shape: 'sine' | 'noise' (deterministic sum of sines) | fn(s in [0,1]) -> [-1, 1]
export function wave(p, x0, x1, y, { amp = 2.2, period = 7, color = C.blue, band, width = STYLE.line.normal, head = true, env = 0.25, shape = 'sine', seed = 1, headLen = 3 } = {}) {
  const g = el(p, 'g', { 'data-part': 'wave' });
  const dir = Math.sign(x1 - x0) || 1, n = 200, len = Math.abs(x1 - x0) - (head ? headLen * 0.9 : 0);
  const ph = [seed * 1.7, seed * 2.9, seed * 0.6];
  const f = typeof shape === 'function' ? shape : shape === 'noise'
    ? (s) => (Math.sin(2 * Math.PI * s * len / period + ph[0]) + 0.6 * Math.sin(2 * Math.PI * s * len / period * 1.73 + ph[1]) + 0.4 * Math.sin(2 * Math.PI * s * len / period * 0.47 + ph[2])) / 2
    : (s) => Math.sin(2 * Math.PI * s * len / period);
  const pts = []; for (let i = 0; i <= n; i++) { const s = i / n, e = 1 - env + env * Math.sin(Math.PI * s); pts.push([x0 + dir * s * len, y - amp * e * f(s)]); }
  if (band) polygon(g, [[x0, y], ...pts, [pts[n][0], y]], { fill: band, opacity: 0.55 });
  path(g, smooth(pts, false, 0.5), { stroke: color, width });
  if (head) arrow(g, pts[n], [x1, y], { stroke: color, width, head: headLen, headWidth: headLen * 0.42 });
  return g;
}

// sum-of-peaks spectrum above a baseline axis(x) (may slope, for perspective); peaks [[centre, height]] in pt
export function spectrum(p, x0, x1, axis, peaks, { color = C.vermillion, fill, sigma = 2.5, width = STYLE.line.normal } = {}) {
  const g = el(p, 'g', { 'data-part': 'spectrum' }), ax = typeof axis === 'number' ? () => axis : axis;
  const f = (x) => peaks.reduce((s, [c, h]) => s + h * Math.exp(-((x - c) ** 2) / (2 * sigma * sigma)), 0);
  const pts = sample((x) => ax(x) - f(x), x0, x1, 160);
  polygon(g, [[x0, ax(x0)], ...pts, [x1, ax(x1)]], { fill: fill ?? shade(color, 0.75) });
  path(g, smooth(pts, false, 0.4), { stroke: color, width });
  return g;
}

// three-dot ellipsis for chains
export function dots(p, x0, x1, y, { color = C.ink, r = 0.55 } = {}) {
  const g = el(p, 'g', { 'data-part': 'ellipsis' });
  for (let i = 0; i < 3; i++) circle(g, x0 + (x1 - x0) * i / 2, y, r, { fill: color });
  return g;
}

// two-tone circle (node, spin, qubit): left/right halves or top/bottom halves
export function splitNode(p, cx, cy, r, { a = C.sky, b = C.blue, vertical = true, stroke, width = STYLE.line.hair } = {}) {
  const g = el(p, 'g', { 'data-part': 'node' });
  if (vertical) { path(g, `M${cx},${cy - r} A${r},${r} 0 0 0 ${cx},${cy + r} Z`, { fill: a }); path(g, `M${cx},${cy - r} A${r},${r} 0 0 1 ${cx},${cy + r} Z`, { fill: b }); }
  else { path(g, `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z`, { fill: a }); path(g, `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} Z`, { fill: b }); }
  if (stroke) circle(g, cx, cy, r, { stroke, width });
  return g;
}

// one-layer network card: rounded card, input and output node columns, coloured edges.
// nodeIn/nodeOut: colour or {a, b} for split nodes. Returns {node, ports: left/right/top/bottom}
export function layerCard(p, x, y, w, h, { nIn = 4, nOut = 4, r = 2.2, card = C.tintGrey, cardR = 3, edge = C.orange, edgeW = STYLE.line.thin, nodeIn = C.vermillion, nodeOut = { a: C.sky, b: C.blue }, pad = 0.22, F, name } = {}) {
  const g = el(p, 'g', { 'data-part': 'layer-card' });
  rect(g, x, y, w, h, { r: cardR, fill: card });
  const xi = x + w * pad, xo = x + w * (1 - pad);
  const ys = (n) => Array.from({ length: n }, (_, i) => y + h * (0.16 + 0.68 * (n === 1 ? 0.5 : i / (n - 1))));
  const A = ys(nIn), B = ys(nOut);
  for (const a of A) for (const b of B) line(g, [xi, a], [xo, b], { stroke: edge, width: edgeW, cap: 'butt' });
  for (const yy of A) typeof nodeIn === 'string' ? circle(g, xi, yy, r, { fill: nodeIn }) : splitNode(g, xi, yy, r, nodeIn);
  for (const yy of B) typeof nodeOut === 'string' ? circle(g, xo, yy, r, { fill: nodeOut }) : splitNode(g, xo, yy, r, nodeOut);
  const ports = { left: [x, y + h / 2], right: [x + w, y + h / 2], top: [x + w / 2, y], bottom: [x + w / 2, y + h] };
  if (F && name) for (const [k, [px, py]] of Object.entries(ports)) F.anchor(`${name}.${k}`, p, px, py);
  return { node: g, ports };
}

// pixel image from data: rows x cols array of values in [0,1] (e.g. a real MNIST sample loaded from JSON),
// drawn as vector cells. palette: [low, high] hex or a stops array for ramp(). Skip near-background cells.
// overlap (fraction of a cell, e.g. 0.6): cells grow by that much under a clip to the image, each later cell covering the
// overlap of the earlier ones, so no hairline seams show between dark cells at any dpi (use skipBelow: 0 with it).
export function pixelImage(p, x, y, w, data, { palette = ['#ffffff', '#000000'], skipBelow = 0.03, frame = false, gap = 0, overlap } = {}) {  // gap: fraction of a cell
  const g = el(p, 'g', { 'data-part': 'pixel-image' }), R = data.length, Cc = data[0].length, s = w / Cc;
  const cg = overlap ? el(g, 'g', { 'clip-path': clipPath(p, `M${f3(x)},${f3(y)} h${f3(w)} v${f3(R * s)} h${f3(-w)} Z`) }) : g;
  for (let i = 0; i < R; i++) for (let j = 0; j < Cc; j++) {
    const v = data[i][j]; if (v < skipBelow) continue;
    const ov = overlap ? overlap * s : gap ? -gap * s : s * 0.04;   // overlap/gap scale with the cell, so the image works under any transform
    rect(cg, x + j * s, y + i * s, s + ov, s + ov, { fill: ramp(palette, v) });
  }
  if (frame) rect(g, x, y, w, R * s, { stroke: C.ink, width: STYLE.line.thin });
  return { node: g, w, h: R * s };
}

// card that fades to transparent toward one side ('left'|'right'|'top'|'bottom'): "and more" continuation
export function fadeCard(p, x, y, w, h, side = 'right', { fill = C.tintGrey, r = 3 } = {}) {
  const ang = { left: 0, right: 0, top: 90, bottom: 90 }[side];
  const st = side === 'left' || side === 'top' ? [[0, fill, 0], [1, fill, 1]] : [[0, fill, 1], [1, fill, 0]];
  return rect(p, x, y, w, h, { r, fill: linearGradient(p, st, ang), part: 'fade-card' });
}

// zoom flare: a filled pale funnel joining a narrow edge [x0, x1, y] to a wide edge [x0, x1, y] with concave sides
export function flare(p, [ax0, ax1, ay], [bx0, bx1, by], { fill = '#efefef', k = 0.6, fade = true } = {}) {
  const gr = fade ? linearGradient(p, [[0, fill, 1], [1, fill, 0.55]], 90) : fill;
  const d = `M${ax0},${ay} L${ax1},${ay} C${ax1},${ay + (by - ay) * k} ${bx1},${ay + (by - ay) * (1 - k) * 0.4} ${bx1},${by}`
    + ` L${bx0},${by} C${bx0},${ay + (by - ay) * (1 - k) * 0.4} ${ax0},${ay + (by - ay) * k} ${ax0},${ay} Z`;
  return path(p, d, { fill: gr, part: 'zoom' });
}

// translucent extruded prism (crystal, waveguide, cuvette) in oblique view: near face E = 4 corners, extrusion (dx, dy).
// Faces drawn far-first and semi-transparent so overlaps build the depth shading of glass.
export function glassSlab(p, E, dx, dy, { color = '#BFE6F6', opacity = 0.55, end = 0.8 } = {}) {
  const g = el(p, 'g', { 'data-part': 'glass-slab' }), sh = (q) => [q[0] + dx, q[1] + dy];
  const side = linearGradient(p, [[0, shade(color, -0.1)], [0.5, shade(color, 0.35)], [1, color]], 0);
  polygon(g, E.map(sh), { fill: color, opacity });
  for (let i = 0; i < 4; i++) { const a = E[i], b = E[(i + 1) % 4]; polygon(g, [a, b, sh(b), sh(a)], { fill: side, opacity }); }
  polygon(g, E, { fill: shade(color, -0.12), opacity: end });
  return g;
}

// statePolyline(p, pts, states, styles, {part}) -> {node, runs}; a trajectory whose style follows a state column: segment
// k (pts[k] -> pts[k + 1]) takes the style of states[k]; runs of one state are drawn as one polyline each (clamped vs free,
// on vs off). styles: {state: L.polyline style}; states missing from styles are not drawn.
export function statePolyline(p, pts, states, styles, { part } = {}) {
  const g = el(p, 'g', { 'data-part': part ?? 'state-polyline' }), runs = [];
  let k0 = 0;
  for (let k = 1; k <= pts.length - 1; k++) if (k === pts.length - 1 || states[k] !== states[k0]) { runs.push({ state: states[k0], pts: pts.slice(k0, k + 1) }); k0 = k; }
  for (const r of runs) { const s = styles[r.state]; if (s && r.pts.length > 1) el(g, 'polyline', { points: r.pts.map(([x, y]) => `${f3(x)},${f3(y)}`).join(' '), ...paint({ stroke: C.ink, ...s }), 'data-part': 'state-run' }); }
  return { node: g, runs };
}

// density(p, fn, x0, x1, base, {n, color, fill, width, shade: [xa, xb] | [[xa, xb], ...], shadeFill, baseline, opacity}) -> {node, pts}
// 1D density glyph above a baseline: y = base - fn(x) (fn in pt of height) with a pale fill, one or more shaded intervals
// (tail probability, lost fraction, acceptance window) and the baseline. Kernels, seed shadows, posteriors.
export function density(p, fn, x0, x1, base, { n = 120, color = C.blue, fill, width = STYLE.line.normal, shade: sh, shadeFill, baseline = true, opacity = 1 } = {}) {
  const g = el(p, 'g', { 'data-part': 'density', opacity: opacity === 1 ? undefined : opacity });
  const pts = sample((x) => base - fn(x), x0, x1, n), area = (a, b) => { const q = sample((x) => base - fn(x), a, b, Math.max(8, Math.round(n * (b - a) / (x1 - x0)))); return [[a, base], ...q, [b, base]]; };
  polygon(g, [[x0, base], ...pts, [x1, base]], { fill: fill ?? shade(color, 0.85), part: 'density-fill' });
  const ivs = !sh ? [] : Array.isArray(sh[0]) ? sh : [sh];
  for (const [a, b] of ivs) polygon(g, area(Math.max(x0, a), Math.min(x1, b)), { fill: shadeFill ?? shade(color, 0.45), part: 'density-shade' });
  path(g, 'M' + pts.map(([x, y]) => `${f3(x)},${f3(y)}`).join(' L'), { stroke: color, width, part: 'density-curve' });
  if (baseline) line(g, [x0, base], [x1, base], { stroke: C.ink, width: STYLE.line.thin, cap: 'butt' });
  return { node: g, pts };
}
```

### `skills/schematic-figure/foundation/engine/notation.js`
```javascript
// Notation parts (v10, from the Level-2 gap reports cs-22 and ind-13): TeX-style tall delimiters, a typeset
// number matrix, and patent-style reference-numeral leaders. Units pt; parent first; STYLE defaults.
import { el, text } from './core.js';
import { STYLE } from './style.js';
import { path, rect, circle, smooth, toLocal } from './draw.js';

const C = STYLE.color;
const f3 = (v) => +(+v).toFixed(3);
const reg = (F, name, parent, ports) => { if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, parent, x, y); return ports; };
const res = (F, p, q) => (typeof q === 'string' ? toLocal(F, p, F.at(q)) : q);
const MINUS = '−';

// ---- delimiters ---------------------------------------------------------------------------------
// delim(p, kind, x, y0, y1, {w, mid, end, color, part}) -> {node, x0, x1, y0, y1, inner}
//   A tall delimiter filling the box x..x+w, y0..y1, drawn as a filled shape so it keeps TeX proportions at any
//   height (a stretched text glyph gets heavy). kind: '(' ')' (crescents: thin ends `end`, thickest `mid` at the
//   middle), '[' ']' (bar `mid` thick with arms of length w), '|' or '‖' (bars). Defaults scale with the height:
//   w = 0.12 h (2..6 pt), mid = 0.5 + 0.0095 h. `inner` is the x of the side facing the contents.
export function delim(p, kind, x, y0, y1, o = {}) {
  const h = y1 - y0, w = o.w ?? Math.min(6, Math.max(2, 0.12 * h)), mid = o.mid ?? 0.5 + 0.0095 * h, end = o.end ?? 0.22;
  const g = el(p, 'g', { 'data-part': o.part ?? 'delim' }), st = { fill: o.color ?? C.text };
  let d, x0 = x, x1 = x + w;
  if (kind === '(' || kind === ')') {
    const L = kind === '(', s = L ? 1 : -1, xe = L ? x1 : x0, xb = L ? x0 : x1;
    const ctl = (e, b) => e + (b - e) * 4 / 3, k = 0.2 * h;      // controls at 4/3 of the bow put the belly on xb
    const xe2 = xe + s * end, xb2 = xb + s * mid;
    d = `M${f3(xe)},${f3(y0)} C${f3(ctl(xe, xb))},${f3(y0 + k)} ${f3(ctl(xe, xb))},${f3(y1 - k)} ${f3(xe)},${f3(y1)}`
      + ` L${f3(xe2)},${f3(y1)} C${f3(ctl(xe2, xb2))},${f3(y1 - k)} ${f3(ctl(xe2, xb2))},${f3(y0 + k)} ${f3(xe2)},${f3(y0)}Z`;
  } else if (kind === '[' || kind === ']') {
    const t = o.mid ?? mid * 0.8, ta = t * 0.85, L = kind === '[';
    const xo = L ? x0 : x1, s = L ? 1 : -1;
    d = `M${f3(xo)},${f3(y0)} L${f3(xo + s * w)},${f3(y0)} L${f3(xo + s * w)},${f3(y0 + ta)} L${f3(xo + s * t)},${f3(y0 + ta)}`
      + ` L${f3(xo + s * t)},${f3(y1 - ta)} L${f3(xo + s * w)},${f3(y1 - ta)} L${f3(xo + s * w)},${f3(y1)} L${f3(xo)},${f3(y1)}Z`;
  } else if (kind === '|' || kind === '‖' || kind === '||') {
    const t = o.mid ?? mid * 0.6, n = kind === '|' ? 1 : 2, gap = o.gap ?? t * 2.2;
    x1 = x + t * n + gap * (n - 1); d = '';
    for (let i = 0; i < n; i++) { const a = x + i * (t + gap); d += `M${f3(a)},${f3(y0)} L${f3(a + t)},${f3(y0)} L${f3(a + t)},${f3(y1)} L${f3(a)},${f3(y1)}Z`; }
  } else throw new Error(`delim: unknown kind "${kind}"`);
  path(g, d, st);
  const inner = kind === ')' || kind === ']' ? x0 : x1;
  return { node: g, x0, x1, y0, y1, inner };
}
const CLOSE = { '(': ')', '[': ']', '|': '|', '‖': '‖', '||': '||' };

// ---- typeset matrix ------------------------------------------------------------------------------
// texMatrix(p, x, y, rows, {size, family, math, color, cellColor(r, c, v), colGap, colXs, uniform, rowPitch,
//   hangMinus, delim: '(' | '[' | '|' | 'none', delimGap, vPad, delimW, delimMid, rowTint: [fill] | fn(r),
//   tintPad, anchor: 'start'|'middle'|'end', valign: 'middle'|'top', capHeight, F, name})
//   -> {node, cells[r][c]: {x, y, cy}, colXs, rowYs, rowCenters, x0, x1, y0, y1, w, h, ports}
//   A matrix of typeset entries (numbers or rich-text strings) between tall delimiters. Entries are centred on
//   their column; with hangMinus (default) a leading '-' is set as a true minus hanging left of the column so the
//   digits stay aligned. Columns are one pitch apart (uniform, default) or packed by their own widths. x is the
//   left edge of the left delimiter (anchor 'start'); y is the vertical centre of the rows (valign 'middle') or the
//   top of the delimiters. cells[r][c].x is the column centre, .y the baseline, .cy the cap-height centre.
export function texMatrix(p, x, y, rows, o = {}) {
  const size = o.size ?? STYLE.text.label, fam = o.family, latex = fam && /Latin Modern/.test(fam);
  const capH = (o.capHeight ?? (latex ? 0.683 : 0.716)) * size, hang = o.hangMinus ?? true;
  const g = el(p, 'g', { 'data-part': o.part ?? 'tex-matrix' });
  const ts = { size, family: fam, math: o.math, color: o.color };
  const measure = (s) => { const t = text(g, 0, 0, s, ts); const w = t.getBBox().width; t.remove(); return w; };
  const nr = rows.length, nc = Math.max(...rows.map((r) => r.length));
  const minusW = measure(MINUS);
  const ent = rows.map((row) => row.map((v) => {
    if (v === null || v === undefined || v === '') return null;
    let s = String(v), neg = false;
    if (hang && (s[0] === '-' || s[0] === MINUS)) { neg = true; s = s.slice(1); }
    else if (s[0] === '-') s = MINUS + s.slice(1);
    return { s, neg, w: measure(s), v };
  }));
  const colW = Array.from({ length: nc }, (_, c) => Math.max(0, ...ent.map((r) => (r[c] ? r[c].w : 0))));
  const colNeg = Array.from({ length: nc }, (_, c) => ent.some((r) => r[c] && r[c].neg));
  const baseGap = o.colGap ?? size * 0.9;
  let xs;
  if (o.colXs) xs = o.colXs.map((v) => v - (o.colXs[0] ?? 0));
  else {
    const uni = o.uniform ?? true, Wmax = Math.max(...colW);
    const gapFor = (c) => Math.max(baseGap, colNeg[c] ? minusW + size * 0.15 : 0);
    const G = uni ? Math.max(...colW.map((_, c) => gapFor(c))) : 0;
    xs = [0];
    for (let c = 1; c < nc; c++) xs.push(uni ? xs[c - 1] + Wmax + G : xs[c - 1] + colW[c - 1] / 2 + gapFor(c) + colW[c] / 2);
  }
  const pitch = o.rowPitch ?? size * 1.3;
  const rc = Array.from({ length: nr }, (_, r) => r * pitch);       // row cap-height centres, relative
  const dGap = o.delimGap ?? size * 0.35, vPad = o.vPad ?? size * 0.35;
  const innerL = xs[0] - colW[0] / 2 - (colNeg[0] ? minusW : 0) - dGap, innerR = xs[nc - 1] + colW[nc - 1] / 2 + dGap;
  const dy0 = rc[0] - capH / 2 - vPad, dy1 = rc[nr - 1] + capH / 2 + vPad, dh = dy1 - dy0;
  const kind = o.delim ?? '(', dw = kind === 'none' ? 0 : o.delimW ?? Math.min(6, Math.max(2, 0.12 * dh));
  const barW = kind === '|' || kind === '‖' || kind === '||' ? (o.delimMid ?? (0.5 + 0.0095 * dh) * 0.6) * (kind === '|' ? 1 : 3.2) : dw;
  const totalW = innerR - innerL + 2 * barW;
  const an = o.anchor ?? 'start', left = an === 'start' ? x : an === 'middle' ? x - totalW / 2 : x - totalW;
  const ox = left + barW - innerL;                                   // parent x of relative 0
  const oy = (o.valign ?? 'middle') === 'top' ? y - dy0 : y - (rc[0] + rc[nr - 1]) / 2;
  const tint = o.rowTint;
  if (tint) {
    const tp = o.tintPad ?? 0;
    for (let r = 0; r < nr; r++) {
      const f = typeof tint === 'function' ? tint(r) : tint[r];
      if (f) rect(g, ox + innerL - tp, oy + rc[r] - pitch / 2, innerR - innerL + 2 * tp, pitch, { fill: f, part: 'matrix-row-tint' });
    }
  }
  const cells = ent.map((row, r) => Array.from({ length: nc }, (_, c) => {
    const cx = ox + xs[c], cy = oy + rc[r], base = cy + capH / 2, e = row[c];
    if (e) {
      const col = o.cellColor ? o.cellColor(r, c, e.v) : undefined, s2 = { ...ts, color: col ?? ts.color };
      text(g, cx, base, e.s, { ...s2, anchor: 'middle' });
      if (e.neg) text(g, cx - e.w / 2, base, MINUS, { ...s2, anchor: 'end' });
    }
    return { x: cx, y: base, cy };
  }));
  const y0 = oy + dy0, y1 = oy + dy1;
  let L = null, R = null;
  if (kind !== 'none') {
    const dopt = { w: o.delimW, mid: o.delimMid, color: o.delimColor ?? o.color };
    L = delim(g, kind, left, y0, y1, dopt);
    R = delim(g, CLOSE[kind] ?? kind, ox + innerR, y0, y1, dopt);
  }
  const x1 = left + totalW;
  const ports = reg(o.F, o.name, p, { left: [left, (y0 + y1) / 2], right: [x1, (y0 + y1) / 2], top: [(left + x1) / 2, y0], bottom: [(left + x1) / 2, y1], center: [(left + x1) / 2, (y0 + y1) / 2] });
  return { node: g, cells, colXs: xs.map((v) => ox + v), rowYs: cells.map((r) => r[0].y), rowCenters: rc.map((v) => oy + v), x0: left, x1, y0, y1, w: totalW, h: y1 - y0, ports, delims: [L, R] };
}

// ---- reference-numeral leaders --------------------------------------------------------------------
function cubicAt(a, c1, c2, b, t) {
  const m = 1 - t;
  return [m * m * m * a[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * b[0], m * m * m * a[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t * t * t * b[1]];
}
// leader(p, from, to, {c1, c2, bend, wavy, via, head: false|'solid'|'arrow'|'dot', headLen, headHalf, dotR, stroke,
//   width, gap1, F}) -> {node, d, start, end, dir}
//   A patent-style leader: one smooth cubic from `from` (beside a numeral) to `to` (a point on the part). Controls:
//   explicit c1, c2; or bend (signed fraction of the chord, default 0.22) for a C-curve; wavy: true for an S-curve
//   (the controls on opposite sides); or via: [points] for a smooth curve through them. head 'solid' ends in a
//   small solid wedge (headLen 2.6, headHalf 0.9 pt), 'arrow' a notched arrowhead, 'dot' a dot; the default ends plain.
//   gap1 stops short of the target (pt). Endpoints may be figure anchors (strings, with F).
export function leader(p, from, to, o = {}) {
  const a = res(o.F, p, from); let b = res(o.F, p, to);
  const stroke = o.stroke ?? C.ink, width = o.width ?? STYLE.line.thin;
  const g = el(p, 'g', { 'data-part': o.part ?? 'leader' });
  const dx = b[0] - a[0], dy = b[1] - a[1], Lc = Math.hypot(dx, dy) || 1, n = [-dy / Lc, dx / Lc];
  let pts = null, c1, c2;
  if (o.via && o.via.length) pts = [a, ...o.via.map((q) => res(o.F, p, q)), b];
  else {
    const bend = o.bend ?? 0.22, b2 = o.wavy ? -bend : bend;
    c1 = o.c1 ? res(o.F, p, o.c1) : [a[0] + dx / 3 + n[0] * bend * Lc, a[1] + dy / 3 + n[1] * bend * Lc];
    c2 = o.c2 ? res(o.F, p, o.c2) : [a[0] + 2 * dx / 3 + n[0] * b2 * Lc, a[1] + 2 * dy / 3 + n[1] * b2 * Lc];
  }
  // end tangent
  const prev = pts ? pts[pts.length - 2] : (Math.hypot(b[0] - c2[0], b[1] - c2[1]) > 1e-6 ? c2 : c1);
  let ux = b[0] - prev[0], uy = b[1] - prev[1]; const un = Math.hypot(ux, uy) || 1; ux /= un; uy /= un;
  if (o.gap1) b = [b[0] - ux * o.gap1, b[1] - uy * o.gap1];
  const head = o.head ?? false, hl = o.headLen ?? (head === 'arrow' ? STYLE.arrow.head : 2.6), hh = o.headHalf ?? (head === 'arrow' ? hl * 0.42 : 0.9);
  const trim = head === 'solid' || head === 'arrow' ? hl * 0.8 : 0;
  const e = [b[0] - ux * trim, b[1] - uy * trim];
  let d;
  if (pts) { const q = pts.slice(); q[q.length - 1] = e; d = smooth(q, false, o.tension ?? 0.5); }
  else d = `M${f3(a[0])},${f3(a[1])} C${f3(c1[0])},${f3(c1[1])} ${f3(c2[0])},${f3(c2[1])} ${f3(e[0])},${f3(e[1])}`;
  path(g, d, { stroke, width, cap: 'round', part: 'leader-line' });
  if (head === 'solid' || head === 'arrow') {
    const bx = b[0] - ux * hl, by = b[1] - uy * hl, nt = head === 'arrow' ? 0.18 : 0;
    const tri = [[b[0], b[1]], [bx - uy * hh, by + ux * hh], [b[0] - ux * hl * (1 - nt), b[1] - uy * hl * (1 - nt)], [bx + uy * hh, by - ux * hh]];
    path(g, 'M' + tri.map((q) => `${f3(q[0])},${f3(q[1])}`).join(' L') + 'Z', { fill: stroke, part: 'arrowhead' });
  } else if (head === 'dot') circle(g, b[0], b[1], o.dotR ?? 0.7, { fill: stroke, part: 'leader-dot' });
  return { node: g, d, start: a, end: b, dir: [ux, uy], at: pts ? null : (t) => cubicAt(a, c1, c2, e, t) };
}

// numeral(p, x, y, str, {to: point | [point | {to, ...leader opts}], underline, size, anchor, valign, color, gap,
//   ...leader opts (bend, wavy, head, width, stroke)}) -> {node, text, box, leaders}
//   A reference numeral (patent drawing, exploded view) with one leader per target. Each leader starts on the
//   numeral's padded box (gap, default 0.8 pt) where the line toward its first control point leaves it.
//   underline: true underlines the numeral (the patent convention for a numeral that sits on the part it names).
//   Also numeral(p, x, y, str, target, {curve, ...}): the target (a point, an anchor name or a list of them) as the
//   fifth argument. curve: a number (signed bend, fraction of the chord), 'S' (an S-shaped lead), 0 (straight).
//   assembly: true ends the lead in an arrowhead (a numeral naming a whole assembly, 1.84(r)(1)).
//   In the patent profile the text is tagged role 'numeral' and the group records its lead count for the gate.
export function numeral(p, x, y, str, o = {}, o2) {
  if (o2 !== undefined || typeof o === 'string' || Array.isArray(o)) o = { ...(o2 ?? {}), to: o };
  if (o.curve !== undefined || o.assembly) {
    const { curve, assembly, ...rest } = o; o = rest;
    if (curve === 'S' || curve === 'wavy') o.wavy = true; else if (typeof curve === 'number') o.bend = curve; else if (curve === false) o.bend = 0;
    if (assembly && o.head === undefined) o.head = 'arrow';
  }
  const pat = STYLE.format === 'patent';
  const g = el(p, 'g', { 'data-part': o.part ?? 'numeral' });
  const t = text(g, x, y, str, { size: o.size, anchor: o.anchor ?? 'middle', valign: o.valign ?? 'middle', color: o.color, underline: o.underline, family: o.family, weight: o.weight, italic: o.italic, role: o.role ?? (pat ? 'numeral' : undefined) });
  const b = t.getBBox(), m = t.transform.baseVal.consolidate(), ty = m ? m.matrix.f : 0, gp = o.gap ?? 0.8;
  const box = { x0: b.x - gp, x1: b.x + b.width + gp, y0: b.y + ty - gp, y1: b.y + ty + b.height + gp };
  const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
  const edge = (q) => {         // where the ray from the box centre toward q leaves the box
    const dx = q[0] - cx, dy = q[1] - cy, sx = dx ? (dx > 0 ? box.x1 - cx : box.x0 - cx) / dx : Infinity, sy = dy ? (dy > 0 ? box.y1 - cy : box.y0 - cy) / dy : Infinity;
    const s = Math.min(sx, sy); return [cx + dx * s, cy + dy * s];
  };
  const targets = o.to === undefined ? [] : !Array.isArray(o.to) || typeof o.to[0] === 'number' ? [o.to] : o.to;
  const { to, underline, size, anchor, valign, color, gap, part, family, weight, italic, ...lo } = o;
  const leaders = targets.map((tg) => {
    const spec = typeof tg === 'object' && !Array.isArray(tg) ? tg : { to: tg };
    const opts = { ...lo, ...spec }, T = res(opts.F, p, spec.to);
    const toward = opts.c1 ? res(opts.F, p, opts.c1) : opts.via && opts.via.length ? res(opts.F, p, opts.via[0]) : T;
    return leader(g, edge(toward), T, opts);
  });
  if (pat) { g.setAttribute('data-leads', leaders.length); if (o.underline) g.setAttribute('data-under', '1'); }
  return { node: g, text: t, box, leaders };
}
```

### `skills/schematic-figure/foundation/engine/patent.js`
```javascript
// Patent drawing parts (37 CFR 1.84): view labels, section hatching, surface shading lines, numbered boxes,
// flowchart steps, section and centre lines, and circuit symbols. Everything is black line art on white.
// Use with `export const figure = {format: 'patent'}` (core.js switches STYLE to the patent profile); the parts also
// work in other formats, where they draw in STYLE.color.ink.
import { el, text } from './core.js';
import { STYLE, PATENT } from './style.js';
import { path, line, polyline, polygon, rect, circle, arrow, toLocal } from './draw.js';
import { numeral } from './notation.js';

const f3 = (v) => +(+v).toFixed(3);
const C = STYLE.color;
const res = (F, p, q) => (typeof q === 'string' ? toLocal(F, p, F.at(q)) : q);
const reg = (F, name, parent, ports) => { if (F && name) for (const [k, [x, y]] of Object.entries(ports)) F.anchor(`${name}.${k}`, parent, x, y); return ports; };
function defsOf(p) { let n = p.node || p; while (n && n.tagName !== 'svg') n = n.parentNode; return n.querySelector('defs'); }
let cid = 0;
const isRings = (s) => Array.isArray(s) && Array.isArray(s[0]) && Array.isArray(s[0][0]);
const ringsD = (rings) => rings.map((r) => 'M' + r.map(([x, y]) => `${f3(x)},${f3(y)}`).join(' L') + 'Z').join(' ');
const shapeD = (s) => (typeof s === 'string' ? s : ringsD(isRings(s) ? s : [s]));

// ---- view labels ------------------------------------------------------------------------------------
// figLabel(p, x, y, 'FIG. 1', {size, anchor, weight, valign}) -> text element (role 'figlabel').
//   1.84(u): views are numbered FIG. 1, FIG. 2, ...; the label is larger than the reference numerals.
export function figLabel(p, x, y, str = 'FIG. 1', o = {}) {
  return text(p, x, y, str, { size: o.size ?? PATENT.text.fig, anchor: o.anchor ?? 'middle', valign: o.valign ?? 'baseline', weight: o.weight ?? 'bold', role: 'figlabel', rotate: o.rotate });
}

// ---- clipped line fields ----------------------------------------------------------------------------
// parallel lines across `d`'s bounding box at page angle `angle` (deg, counter-clockwise from +x as seen), at offsets
// ts along the normal; returns the path data (one path)
function lineField(b, angle, ts) {
  const a = angle * Math.PI / 180, u = [Math.cos(a), -Math.sin(a)], n = [Math.sin(a), Math.cos(a)];
  const cs = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]];
  const su = cs.map(([x, y]) => x * u[0] + y * u[1]), s0 = Math.min(...su) - 1, s1 = Math.max(...su) + 1;
  return ts.map((t) => `M${f3(t * n[0] + s0 * u[0])},${f3(t * n[1] + s0 * u[1])} L${f3(t * n[0] + s1 * u[0])},${f3(t * n[1] + s1 * u[1])}`).join(' ');
}
function normalRange(b, angle) {
  const a = angle * Math.PI / 180, n = [Math.sin(a), Math.cos(a)];
  const tn = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => x * n[0] + y * n[1]);
  return [Math.min(...tn), Math.max(...tn)];
}
function clipTo(p, d) {
  const id = `pclip${++cid}`, c = el(defsOf(p), 'clipPath', { id, clipPathUnits: 'userSpaceOnUse' });
  el(c, 'path', { d, 'clip-rule': 'evenodd' });
  return `url(#${id})`;
}
function bboxOf(p, d) { const t = path(p, d, {}); const b = t.getBBox(); t.remove(); return b; }

// hatchSection(p, shape, {spacing, angle, width, outline, outlineWidth, fill, part}) -> {node, d}
//   A cut surface in a sectional view (1.84(h)(3)): evenly spaced oblique parallel lines clipped to `shape` (path
//   data, a point list, or a list of rings where inner rings are holes), over a white fill that hides what lies
//   behind, with the outline on top. Hatch adjacent parts at different angles (45, 135) or spacings.
export function hatchSection(p, shape, o = {}) {
  const d = shapeD(shape), g = el(p, 'g', { 'data-part': o.part ?? 'hatch-section' });
  if (o.fill !== false) path(g, d, { fill: o.fill ?? '#ffffff', part: 'hatch-fill' }).setAttribute('fill-rule', 'evenodd');
  const b = bboxOf(g, d), angle = o.angle ?? PATENT.hatch.angle, sp = o.spacing ?? PATENT.hatch.spacing;
  const [t0, t1] = normalRange(b, angle), ts = [];
  for (let t = t0 + sp / 2; t < t1; t += sp) ts.push(t);
  const hg = el(g, 'g', { 'clip-path': clipTo(p, d) });
  path(hg, lineField(b, angle, ts), { stroke: o.stroke ?? C.ink, width: o.width ?? PATENT.hatch.width, cap: 'butt', part: 'hatch-line' });
  if (o.outline !== false) path(g, d, { stroke: o.stroke ?? C.ink, width: o.outlineWidth ?? STYLE.line.normal, part: 'hatch-outline' });
  return { node: g, d };
}

// surfaceShade(p, shape, {angle, side, extent, n, power, width, part}) -> {node}
//   Surface shading by spaced lines (1.84(m)): `n` thin lines parallel to `angle`, crowded toward the shaded edge
//   (side 1: the edge at the far end of the normal [sin a, cos a]; for angle 90 (vertical lines) that is the right
//   edge; side -1 the other) and thinning out over `extent` (fraction of the width). Use on cylinders, cones and
//   spheres; never solid black. Draw it after the part's fill and before its outline, or pass a closed outline.
export function surfaceShade(p, shape, o = {}) {
  const d = shapeD(shape), g = el(p, 'g', { 'data-part': o.part ?? 'surface-shade' });
  const b = bboxOf(g, d), angle = o.angle ?? 90, side = o.side ?? 1, n = o.n ?? 6, pw = o.power ?? 1.8;
  const [t0, t1] = normalRange(b, angle), span = (o.extent ?? 0.35) * (t1 - t0), edge = side > 0 ? t1 : t0;
  const ts = Array.from({ length: n }, (_, k) => edge - side * span * Math.pow((k + 0.6) / n, pw));
  const hg = el(g, 'g', { 'clip-path': clipTo(p, d) });
  path(hg, lineField(b, angle, ts), { stroke: o.stroke ?? C.ink, width: o.width ?? STYLE.line.hair, cap: 'butt', part: 'shade-line' });
  return { node: g };
}

// ---- boxes and flowchart steps ----------------------------------------------------------------------
// the numeral position and lead target for a box edge
//   (the numeral's near edge sits `lead` pt from the target, so the lead line has that length whatever the numeral's width)
function numeralPlace(x, y, w, h, at, lead) {
  if (Array.isArray(at)) return { pos: at, to: null, anchor: 'middle' };
  const ty = y + Math.min(h * 0.4, 14);
  switch (at) {
    case 'left': return { pos: [x - lead, ty - lead * 0.55], to: [x, ty], anchor: 'end' };
    case 'top': return { pos: [x + w * 0.8 + lead * 0.45, y - lead * 0.9], to: [x + w * 0.8, y], anchor: 'start' };
    case 'bottom': return { pos: [x + w * 0.8 + lead * 0.45, y + h + lead * 0.9], to: [x + w * 0.8, y + h], anchor: 'start' };
    default: return { pos: [x + w + lead, ty - lead * 0.55], to: [x + w, ty], anchor: 'start' };
  }
}

// pBox(p, x, y, w, h, legend, num, {numeralAt: 'right'|'left'|'top'|'bottom'|'inside'|[x, y], numeralTo, lead,
//   curve, size, width, dash, r, fill, F, name, part}) -> {node, ports, numeral}
//   A block-diagram box in patent convention: a black outline, an optional short legend inside (a few words,
//   1.84(o); '\n' breaks lines), and its reference numeral outside with a short lead line that touches the box
//   (default 'right'), or underlined inside the box ('inside'). x, y is the top-left corner. A dashed box
//   (dash: true) marks an optional or software element. Ports left, right, top, bottom, center.
export function pBox(p, x, y, w, h, legend, num, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'pbox' });
  rect(g, x, y, w, h, { r: o.r ?? 0, fill: o.fill ?? '#ffffff', stroke: C.ink, width: o.width ?? STYLE.line.normal, dash: o.dash === true ? '6 3' : o.dash });
  const size = o.size ?? PATENT.text.legend, inside = o.numeralAt === 'inside' && num;
  if (legend) text(g, x + w / 2, y + h / 2 - (inside ? size * 0.55 : 0), legend, { size, anchor: 'middle', valign: 'middle', role: 'legend' });
  let nm = null;
  if (inside) nm = numeral(g, x + w / 2, legend ? y + h / 2 + size * 0.75 : y + h / 2, String(num), { size: o.numeralSize, underline: true });
  else if (num) {
    const pl = numeralPlace(x, y, w, h, o.numeralAt ?? 'right', o.lead ?? 18);
    nm = numeral(g, pl.pos[0], pl.pos[1], String(num), o.numeralTo ?? pl.to, { curve: o.curve ?? 0.3, size: o.numeralSize, anchor: pl.anchor, F: o.F });
  }
  const ports = reg(o.F, o.name, p, { left: [x, y + h / 2], right: [x + w, y + h / 2], top: [x + w / 2, y], bottom: [x + w / 2, y + h], center: [x + w / 2, y + h / 2] });
  return { node: g, ports, numeral: nm };
}

// flowStep(p, cx, cy, w, h, legend, num, {shape: 'process'|'decision'|'terminal'|'io', numeralAt, lead, curve,
//   size, width, F, name}) -> {node, ports, numeral}
//   A flowchart step centred at (cx, cy): a rectangle (process), a diamond (decision), a rounded terminal
//   (START / END) or a parallelogram (input/output), with its legend inside and its step numeral (e.g. 'S102'
//   or '102') outside with a lead line. Ports top, bottom, left, right, center (the diamond's vertices).
export function flowStep(p, cx, cy, w, h, legend, num, o = {}) {
  const g = el(p, 'g', { 'data-part': o.part ?? 'flow-step' }), shape = o.shape ?? 'process';
  const x = cx - w / 2, y = cy - h / 2, st = { fill: '#ffffff', stroke: C.ink, width: o.width ?? STYLE.line.normal };
  let to;
  if (shape === 'decision') { polygon(g, [[cx, y], [x + w, cy], [cx, y + h], [x, cy]], { ...st, part: 'flow-decision' }); to = [cx + w / 4, cy - h / 4]; }
  else if (shape === 'terminal') { rect(g, x, y, w, h, { ...st, r: h / 2, part: 'flow-terminal' }); to = [x + w - h * 0.2, y + h * 0.1]; }
  else if (shape === 'io') { const k = h * 0.3; polygon(g, [[x + k, y], [x + w, y], [x + w - k, y + h], [x, y + h]], { ...st, part: 'flow-io' }); to = [x + w - k * 0.6, y + h * 0.4]; }
  else { rect(g, x, y, w, h, { ...st, part: 'flow-process' }); to = [x + w, y + Math.min(h * 0.4, 14)]; }
  if (legend) text(g, cx, cy, legend, { size: o.size ?? PATENT.text.legend, anchor: 'middle', valign: 'middle', role: 'legend' });
  let nm = null;
  if (num) {
    const lead = o.lead ?? 18, at = o.numeralAt, left = at === 'left';
    const tgt = left ? (shape === 'decision' ? [cx - w / 4, cy - h / 4] : [x + (shape === 'io' ? h * 0.3 * 0.6 : 0), to[1]]) : to;
    const pos = Array.isArray(at) ? at : [tgt[0] + (left ? -lead : lead) * (shape === 'decision' ? 1.6 : 1), tgt[1] - lead * 0.55];
    nm = numeral(g, pos[0], pos[1], String(num), o.numeralTo ?? tgt, { curve: o.curve ?? (left ? -0.3 : 0.3), size: o.numeralSize, anchor: Array.isArray(at) ? 'middle' : left ? 'end' : 'start', F: o.F });
  }
  const ports = reg(o.F, o.name, p, { top: [cx, y], bottom: [cx, y + h], left: [x, cy], right: [x + w, cy], center: [cx, cy] });
  return { node: g, ports, numeral: nm };
}

// flowLink(p, from, to, {via, label, labelAt, labelSide, F, kind}) -> arrow group
//   A flowchart connector: straight or elbowed (via points, square corners) with a solid arrowhead; `label` is a
//   one-word legend such as 'YES' / 'NO', set beside the start of the link (or at labelAt). from/to: points or
//   anchor names ('s1.bottom'); with anchor names on both ends the link is recorded for the gate's relation check.
export function flowLink(p, from, to, o = {}) {
  const g = arrow(p, from, to, { F: o.F, via: o.via, radius: 0.001, width: o.width ?? STYLE.line.normal, kind: o.kind, part: 'flow-link' });
  if (o.label) {
    const a = res(o.F, p, from), nx = o.via && o.via.length ? o.via[0] : res(o.F, p, to);
    const dx = nx[0] - a[0], dy = nx[1] - a[1], L = Math.hypot(dx, dy) || 1, u = [dx / L, dy / L], s = o.labelSide ?? 1;
    const at = o.labelAt ?? [a[0] + u[0] * 11 - u[1] * 9 * s, a[1] + u[1] * 11 + u[0] * 9 * s];
    text(p, at[0], at[1], o.label, { size: PATENT.text.legend, anchor: Math.abs(u[1]) > 0.5 ? (s * u[1] > 0 ? 'end' : 'start') : 'middle', valign: 'middle', role: 'legend' });
  }
  return g;
}

// ---- section and centre lines -----------------------------------------------------------------------
// sectionLine(p, a, b, label, {side, len, width}) -> {node}: the cutting plane of a sectional view (1.84(h)(3)):
//   a heavy chain line from a to b with an arrow at each end pointing in the viewing direction (side +1: the left
//   normal of a->b) and the view number at each arrow ('2' for FIG. 2, read as section 2-2).
export function sectionLine(p, a, b, label, o = {}) {
  const g = el(p, 'g', { 'data-part': 'section-line' }), w = o.width ?? STYLE.line.bold;
  path(g, `M${f3(a[0])},${f3(a[1])} L${f3(b[0])},${f3(b[1])}`, { stroke: C.ink, width: w, dash: '18 4 3 4', cap: 'butt' });
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, s = o.side ?? 1, n = [dy / L * s, -dx / L * s], len = o.len ?? 16;
  for (const q of [a, b]) {
    arrow(g, q, [q[0] + n[0] * len, q[1] + n[1] * len], { width: STYLE.line.normal });
    if (label) text(g, q[0] + n[0] * (len + 9), q[1] + n[1] * (len + 9), String(label), { size: PATENT.text.numeral, anchor: 'middle', valign: 'middle', role: 'section' });
  }
  return { node: g };
}
// centerLine(p, a, b, {width}) -> path: an axis or centre line (thin long-dash, short-dash chain).
export const centerLine = (p, a, b, o = {}) => path(p, `M${f3(a[0])},${f3(a[1])} L${f3(b[0])},${f3(b[1])}`, { stroke: C.ink, width: o.width ?? STYLE.line.hair, dash: o.dash ?? '14 3 2 3', cap: 'butt', part: 'center-line' });

// ---- circuit symbols --------------------------------------------------------------------------------
// Two-terminal symbols run from terminal a to terminal b (any direction); the body (length `len`, default 24 pt)
// sits at the midpoint and straight leads fill the rest. They return {node, ports: {a, b, mid}}.
function twoTerm(p, a, b, len, part, body, o) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), hl = Math.min(len, L) / 2;
  const g = el(p, 'g', { 'data-part': part, transform: `translate(${f3((a[0] + b[0]) / 2)} ${f3((a[1] + b[1]) / 2)}) rotate(${f3(Math.atan2(dy, dx) * 180 / Math.PI)})` });
  const st = { stroke: C.ink, width: o.width ?? STYLE.line.normal };
  if (L / 2 > hl) { line(g, [-L / 2, 0], [-hl, 0], st); line(g, [hl, 0], [L / 2, 0], st); }
  body(g, hl, st);
  const ports = reg(o.F, o.name, p, { a, b, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] });
  return { node: g, ports };
}
export const resistor = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 24, 'resistor', (g, hl, st) => {
  const n = 6, amp = o.amp ?? 4.5, pts = [[-hl, 0]];
  for (let i = 0; i < n; i++) pts.push([-hl + (i + 0.5) * 2 * hl / n, i % 2 ? amp : -amp]);
  pts.push([hl, 0]); polyline(g, pts, { ...st, join: 'miter' });
}, o);
export const capacitor = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 6, 'capacitor', (g, hl, st) => {
  const hp = o.plate ?? 9; line(g, [-hl, -hp], [-hl, hp], { ...st, width: STYLE.line.bold }); line(g, [hl, -hp], [hl, hp], { ...st, width: STYLE.line.bold });
}, o);
export const inductor = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 28, 'inductor', (g, hl, st) => {
  const n = o.turns ?? 4, r = hl / n; let d = `M${f3(-hl)},0`;
  for (let i = 0; i < n; i++) d += ` A${f3(r)},${f3(r)} 0 0 1 ${f3(-hl + (i + 1) * 2 * r)},0`;
  path(g, d, st);
}, o);
export const diode = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 12, 'diode', (g, hl, st) => {
  const hh = o.half ?? 6; polygon(g, [[-hl, -hh], [hl, 0], [-hl, hh]], { ...st, fill: o.open ? '#ffffff' : C.ink });
  line(g, [hl, -hh], [hl, hh], st);
}, o);
export const battery = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 6, 'battery', (g, hl, st) => {
  line(g, [-hl, -10], [-hl, 10], st); line(g, [hl, -5], [hl, 5], { ...st, width: STYLE.line.bold * 1.6 });
}, o);
export const switchSym = (p, a, b, o = {}) => twoTerm(p, a, b, o.len ?? 22, 'switch', (g, hl, st) => {
  circle(g, -hl, 0, 1.6, { ...st, fill: '#ffffff' }); circle(g, hl, 0, 1.6, { ...st, fill: '#ffffff' });
  line(g, [-hl + 1.4, -0.8], [hl * 0.8, o.closed ? -1 : -hl * 0.9], st);
}, o);
// groundSym(p, x, y, {stem, w, F, name}): earth symbol hanging below the terminal (x, y). Port 'top'.
export function groundSym(p, x, y, o = {}) {
  const g = el(p, 'g', { 'data-part': 'ground' }), st = { stroke: C.ink, width: o.width ?? STYLE.line.normal }, s = o.stem ?? 8, w = o.w ?? 16;
  line(g, [x, y], [x, y + s], st);
  [1, 0.62, 0.25].forEach((k, i) => line(g, [x - w / 2 * k, y + s + i * 3.2], [x + w / 2 * k, y + s + i * 3.2], st));
  return { node: g, ports: reg(o.F, o.name, p, { top: [x, y] }) };
}
// junction(p, x, y, {r}): a connection dot where wires join.
export const junction = (p, x, y, o = {}) => circle(p, x, y, o.r ?? 2, { fill: C.ink, part: 'junction' });
// wire(p, pts, {width, dash}): a conductor along a polyline (square corners).
export const wire = (p, pts, o = {}) => polyline(p, pts, { stroke: C.ink, width: o.width ?? STYLE.line.normal, dash: o.dash, join: 'miter', cap: 'square', part: 'wire' });
// opamp(p, x, y, {size, flip, F, name}) -> {node, ports: {plus, minus, out}}: an amplifier or comparator triangle,
//   input side's centre at (x, y), pointing right (flip: left). The + and - marks are drawn as strokes, not text.
export function opamp(p, x, y, o = {}) {
  const s = o.size ?? 40, k = o.flip ? -1 : 1, g = el(p, 'g', { 'data-part': 'opamp' }), st = { stroke: C.ink, width: o.width ?? STYLE.line.normal };
  polygon(g, [[x, y - s / 2], [x + k * s * 0.87, y], [x, y + s / 2]], { ...st, fill: '#ffffff' });
  const yi = s * 0.25, mx = x + k * 6, m = 2.6;
  line(g, [mx - m, y - yi], [mx + m, y - yi], st); line(g, [mx, y - yi - m], [mx, y - yi + m], st);   // + (upper)
  line(g, [mx - m, y + yi], [mx + m, y + yi], st);                                                  // - (lower)
  const ports = reg(o.F, o.name, p, { plus: [x, y - yi], minus: [x, y + yi], out: [x + k * s * 0.87, y] });
  return { node: g, ports };
}
```

### `skills/schematic-figure/foundation/tools/lib/gate.mjs`
```javascript
// gate.mjs — shared DOM + canvas pixel + 37 CFR 1.84 + 3D hero calibration gate.
// Exported as runGate({ cdp, M, figAbs, out, final, A }) so both check.mjs and render.mjs (--check) can run it in a single Chromium session.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { patentGate } from './patentgate.mjs';

const WIDTHS = [89, 120, 136, 183];
const HOLE = 0.18;   // largest empty square above this share of a panel: warn.
const FORMATS = { journal: { min: 5, max: 8, line: 0.25, heavy: 2.5, ppi: 300 }, slide: { min: 14, max: 40, line: 0.8, heavy: 8, ppi: 150 }, poster: { min: 20, max: 120, line: 1.5, heavy: 12, ppi: 150 } };
const ROUTE = /vector\s*3d|lightScene3|blender|illustrated\s*finish/i;

function heroLine(figAbs) {
  const spec = join(dirname(figAbs), '..', 'docs', 'spec.md');
  const srcs = [];
  if (existsSync(spec)) srcs.push([readFileSync(spec, 'utf8'), /^\W*hero\W*:(.*)$/im, /^\W*hero\W*:\W*none\b/im]);
  if (existsSync(figAbs)) srcs.push([readFileSync(figAbs, 'utf8'), /^\s*\/\/\s*hero\s*:(.*)$/im, /^\s*\/\/\s*hero\s*:\s*none\b/im]);
  const routed = srcs.some(([t, h]) => { const m = h.exec(t); return !!m && ROUTE.test(m[1]); });
  return { has: srcs.some(([t, h]) => h.test(t)), none: srcs.some(([t, , n]) => n.test(t)), routed, spec: existsSync(spec) };
}

export async function runGate({ cdp, M, figAbs, out, final = false, A = {}, buildMs = null }) {
  const res = { fail: [], warn: [], info: [] };
  const F_ = (m) => res.fail.push(m), W_ = (m) => res.warn.push(m), I_ = (m) => res.info.push(m);

  if (buildMs != null) {
    I_(`build ${buildMs} ms; ${M.widthMM} x ${M.heightMM} mm; ${M.texts.length} texts, ${M.strokes.length} strokes, ${M.images.length} images, ${M.panels.length} panels`);
  } else {
    I_(`${M.widthMM} x ${M.heightMM} mm; ${M.texts.length} texts, ${M.strokes.length} strokes, ${M.images.length} images, ${M.panels.length} panels`);
  }

  // patent drawing sheets (37 CFR 1.84) have their own rule set in place of the journal checks below
  if (M.format === 'patent') {
    await patentGate({ cdp, M, figAbs, out, F_, W_, I_, A: { ...A, final } });
    return finishGate(res, out);
  }

  // page
  const FM = FORMATS[M.format] || FORMATS.journal;
  if (M.format === 'journal' || !M.format) {
    if (!WIDTHS.includes(M.widthMM)) W_(`width ${M.widthMM} mm is not a Nature column width (${WIDTHS.join(', ')})`);
    if (M.heightMM > 247) F_(`height ${M.heightMM} mm exceeds the 247 mm page depth`);
  } else I_(`format ${M.format}: text ${FM.min}-${FM.max} pt, lines >= ${FM.line} pt`);

  // text
  const T = M.texts.filter((t) => t.s.trim());
  if (M.format === 'journal' || !M.format) {
    const L = T.filter((t) => t.role !== 'panel').map((t) => t.size).sort((a, b) => a - b);
    if (L.length) {
      const med = L[L.length >> 1], rel = med / M.W;
      I_(`median label ${med} pt = ${(rel * 100).toFixed(2)}% of the width (published Fig. 1s: median 2.2%, 25th percentile 1.65%)`);
      if (rel < 0.0165) W_(`text is small for the figure: median label ${med} pt at ${M.widthMM} mm, where published Fig. 1s read like ${(0.0217 * M.W).toFixed(1)} pt. Draw it narrower (120 or 136 mm) with 7-8 pt labels, enlarging the main objects and dropping minor ones to make room`);
    }
  }
  const bad = (c, msg) => { const L = T.filter(c); if (L.length) W_(`${msg}: ${L.slice(0, 8).map((t) => JSON.stringify(t.s.slice(0, 24))).join(', ')}${L.length > 8 ? ` (+${L.length - 8})` : ''}`); return L; };
  const fam = [...new Set(T.map((t) => t.family))]; if (fam.length > 1) W_(`more than one font family: ${fam.join(' | ')}`);
  const tooSmall = T.filter((t) => t.role !== 'panel' && t.size < FM.min - 1e-6);
  if (tooSmall.length) F_(`text below ${FM.min} pt: ${tooSmall.slice(0, 8).map((t) => `${JSON.stringify(t.s.slice(0, 20))} ${t.size.toFixed(1)}pt`).join(', ')}`);
  const REP = M.mode === 'replicate';
  if (REP) I_('replicate mode: text above 8 pt, coloured text and heavy lines are reported as info, not warnings');
  const soft = REP ? I_ : W_;
  { const L = T.filter((t) => t.role !== 'panel' && t.size > FM.max + 1e-6); if (L.length) soft(`text above ${FM.max} pt: ${L.slice(0, 8).map((t) => JSON.stringify(t.s.slice(0, 24))).join(', ')}`); }
  bad((t) => t.minSize < FM.min * 0.72, `sub/superscript below ${(FM.min * 0.72).toFixed(1)} pt`);
  // text budget: published schematics carry 0.20-0.45 words per cm2 (5 figures measured); designs drift to 1+
  const nWords = T.filter((t) => t.role !== 'panel').reduce((n, t) => n + (t.s.match(/[A-Za-z]{2,}|\d+(?:\.\d+)?/g) || []).length, 0);
  const dens = nWords / (M.widthMM * M.heightMM / 100);
  const msg = `text: ${nWords} words, ${dens.toFixed(2)} words/cm2 (calibration from 5 published schematics: 0.20-0.45)`;
  if (dens > 0.5 && !REP && M.format !== 'poster') W_(msg + ': smell test, check whether caption material is on the figure'); else I_(msg);
  const panels = T.filter((t) => t.role === 'panel');
  if (M.panels.length > 1) {
    const labs = panels.map((t) => t.s);
    const want = labs.map((_, i) => String.fromCharCode(97 + i));
    if (labs.join() !== want.join()) W_(`panel labels ${labs.join(',')} are not a, b, c, ... in drawing order`);
  }
  // headings as sentences (P31)
  {
    const heads = T.filter((t) => t.role === 'title' || (t.role === 'label' && /^(bold|[6-9]00)$/.test(String(t.weight))));
    const L = heads.filter((t) => /[?!]\s*$/.test(t.s) || /[a-z]\.\s*$/.test(t.s) || (t.s.match(/[A-Za-z]{2,}/g) || []).length >= 6);
    if (L.length && !REP) W_(`sentence-style headings (P31: name the content with a noun phrase): ${L.slice(0, 6).map((t) => JSON.stringify(t.s.slice(0, 40))).join(', ')}`);
  }
  // caption-like labels
  {
    const words = (t) => (t.s.match(/[A-Za-z]{2,}/g) || []).length;
    const L = T.filter((t) => t.role === 'label' && !/^(bold|[6-9]00)$/.test(String(t.weight)) && (words(t) >= 6 || /[A-Za-z]{3,}:\s/.test(t.s) || /[A-Za-z]{2,}, (no|not|cut|only|so|but)\b/i.test(t.s)));
    if (L.length && !REP) W_(`caption-like labels (a label names a thing in 2-4 words; explanation goes to docs/caption.md): ${L.slice(0, 8).map((t) => JSON.stringify(t.s.slice(0, 40))).join(', ')}`);
  }
  { const L = T.filter((t) => t.color && !/^#(1a1a1a|000|000000|222|2b2b2b|fff|ffffff)$/i.test(t.color) && t.role !== 'panel'); if (L.length) I_(`coloured text (fine when the hue is the colour of the entity it names, P15; never for emphasis alone): ${L.slice(0, 8).map((t) => JSON.stringify(t.s.slice(0, 24))).join(', ')}`); }
  // overlaps between text boxes (shrunk by 0.4 pt to tolerate touching)
  const ov = [];
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
    const a = T[i].box, b = T[j].box, e = (T[i].italic || T[j].italic) ? 0.9 : 0.4;
    if (T[i].rotate || T[j].rotate) continue;
    if (a.x + e < b.x + b.w - e && b.x + e < a.x + a.w - e && a.y + e < b.y + b.h - e && b.y + e < a.y + a.h - e) ov.push(`${JSON.stringify(T[i].s.slice(0, 18))} x ${JSON.stringify(T[j].s.slice(0, 18))}`);
  }
  if (ov.length) F_(`overlapping text (${ov.length}): ${ov.slice(0, 6).join('; ')}`);
  const off = T.filter((t) => t.box.x < -0.5 || t.box.y < -0.5 || t.box.x + t.box.w > M.W + 0.5 || t.box.y + t.box.h > M.H + 0.5);
  if (off.length) F_(`text off the page: ${off.map((t) => JSON.stringify(t.s.slice(0, 20))).join(', ')}`);

  // strokes
  const thin = M.strokes.filter((s) => s.w < FM.line - 1e-6);
  if (thin.length) W_(`${thin.length} strokes thinner than ${FM.line} pt at final size (min ${Math.min(...thin.map((s) => s.w)).toFixed(3)} pt) in: ${[...new Set(thin.map((s) => s.part || s.tag))].slice(0, 6).join(', ')}`);
  const heavy = M.strokes.filter((s) => s.w > FM.heavy && !/beam|fiber|block|glow/.test(s.part));
  if (heavy.length) soft(`${heavy.length} strokes heavier than ${FM.heavy} pt outside beams/fibres`);

  // raster images + 2D <-> 3D Scene Calibration Check [Addresses FM-4]
  const figDir = dirname(figAbs);
  const projDir = dirname(figDir);
  for (const im of M.images) {
    if (!im.px[0]) { W_(`image without pixel size (pass pxw/pxh): ${im.href}`); continue; }
    const ppi = im.px[0] / (im.box.w / 72);
    if (ppi < FM.ppi) F_(`image ${im.href.slice(0, 40)} is ${ppi.toFixed(0)} ppi at placed size (needs ${FM.ppi})`);

    // Resolve <im.href>.json relative to figure dir or project root
    const cleanHref = im.href.replace(/^[./\\]+/, '');
    const cands = [
      resolve(figDir, `${im.href}.json`),
      resolve(figDir, `${cleanHref}.json`),
      resolve(projDir, `${im.href}.json`),
      resolve(projDir, `${cleanHref}.json`),
      resolve(projDir, 'figure', `${cleanHref}.json`),
    ];
    const metaPath = cands.find((p) => existsSync(p));
    if (metaPath) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
        if (meta && meta.fig_width_mm) {
          const placedMM = im.box.w / (72 / 25.4);
          if (Math.abs(placedMM - meta.fig_width_mm) / meta.fig_width_mm > 0.12) {
            W_(`image ${im.href} placed at ${placedMM.toFixed(1)} mm but rendered with fig_width_mm=${meta.fig_width_mm} mm: Freestyle outline weights will scale off-target; update fig_width_mm in render3d.py and re-render`);
          }
        }
      } catch {}
    }
  }

  // Optional figure/scene-contract.json verification
  const contractCands = [join(figDir, 'scene-contract.json'), join(projDir, 'figure', 'scene-contract.json')];
  const contractPath = contractCands.find((p) => existsSync(p));
  if (contractPath) {
    try {
      const sc = JSON.parse(readFileSync(contractPath, 'utf8'));
      if (sc && sc.fig_width_mm && M.images.length === 1) {
        const placedMM = M.images[0].box.w / (72 / 25.4);
        if (Math.abs(placedMM - sc.fig_width_mm) / sc.fig_width_mm > 0.12) {
          W_(`image ${M.images[0].href} placed at ${placedMM.toFixed(1)} mm but scene-contract.json specifies fig_width_mm=${sc.fig_width_mm} mm`);
        }
      }
    } catch {}
  }

  // relations: declared (F.relate) vs drawn (L.connect between anchors)
  const key = (r) => `${r.from}->${r.to}`;
  const drawn = new Set(M.drawn.map(key)), declared = new Set(M.relations.map(key));
  const missing = M.relations.filter((r) => !drawn.has(key(r)) && !drawn.has(`${r.to}->${r.from}`));
  const reversed = M.relations.filter((r) => !drawn.has(key(r)) && drawn.has(`${r.to}->${r.from}`));
  if (missing.length) F_(`declared relations not drawn: ${missing.map(key).join(', ')}`);
  if (reversed.length) F_(`relations drawn in the wrong direction: ${reversed.map(key).join(', ')}`);
  const extra = M.drawn.filter((r) => !declared.has(key(r)));
  if (M.relations.length && extra.length) I_(`drawn connectors not declared as relations: ${extra.map(key).join(', ')}`);
  if (!M.relations.length) I_('no relations declared (F.relate): the connectivity check is off');

  // anchors off the page (e.g. Blender anchors that fell outside the render)
  const offA = Object.entries(M.anchors).filter(([, a]) => a.x < 0 || a.y < 0 || a.x > M.W || a.y > M.H);
  if (offA.length) W_(`anchors off the page: ${offA.map(([k]) => k).join(', ')}`);

  // pixel checks in the page: text over busy art, and ink density per panel
  const px = await cdp.evaluate(`(async () => {
    const svg = document.querySelector('#host svg'), s = svg.cloneNode(true);
    s.querySelectorAll('text').forEach(t => t.remove());
    for (const im of s.querySelectorAll('image')) {   // an SVG decoded as <img> cannot fetch: inline rasters first
      const h = im.getAttribute('href'); if (!h || h.startsWith('data:')) continue;
      const b = await (await fetch(new URL(h, location.href))).blob();
      im.setAttribute('href', await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }));
    }
    const W = ${M.W}, H = ${M.H}, k = 4;           // 4 px per pt
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(s));
    await img.decode();
    const c = document.createElement('canvas'); c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    const D = g.getImageData(0, 0, c.width, c.height).data;
    const at = (x, y) => { const i = (y * c.width + x) * 4; return [D[i], D[i + 1], D[i + 2]]; };
    const busy = [];
    for (const t of window.__manifest.texts) {
      if (!t.s.trim() || t.halo || t.rotate) continue;   // rotated boxes cover their surroundings
      const x0 = Math.max(0, Math.floor(t.box.x * k)), y0 = Math.max(0, Math.floor(t.box.y * k)), x1 = Math.min(c.width - 1, Math.ceil((t.box.x + t.box.w) * k)), y1 = Math.min(c.height - 1, Math.ceil((t.box.y + t.box.h) * k));
      const P = []; for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) P.push(at(x, y));
      if (!P.length) continue;
      const med = [0, 1, 2].map(ch => P.map(p => p[ch]).sort((a, b) => a - b)[P.length >> 1]);
      const diff = P.filter(p => Math.abs(p[0] - med[0]) + Math.abs(p[1] - med[1]) + Math.abs(p[2] - med[2]) > 60).length / P.length;
      if (diff > 0.06) busy.push([t.s.slice(0, 24), +diff.toFixed(2)]);
    }
    let ink = 0, n = 0; for (let i = 0; i < D.length; i += 16) { n++; if (D[i] + D[i + 1] + D[i + 2] < 720) ink++; }
    // empty space per panel: 1-pt grid, a cell is full if any sampled pixel is inked or a text box covers it
    const GW = Math.ceil(W), GH = Math.ceil(H), G = new Uint8Array(GW * GH);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
      let f = 0;
      for (let yy = y * k; yy < Math.min(c.height, (y + 1) * k) && !f; yy += 2) for (let xx = x * k; xx < Math.min(c.width, (x + 1) * k); xx += 2) { const i = (yy * c.width + xx) * 4; if (D[i] + D[i + 1] + D[i + 2] < 735) { f = 1; break; } }
      G[y * GW + x] = f;
    }
    for (const t of window.__manifest.texts) { if (!t.s.trim()) continue; for (let y = Math.max(0, Math.floor(t.box.y)); y < Math.min(GH, Math.ceil(t.box.y + t.box.h)); y++) for (let x = Math.max(0, Math.floor(t.box.x)); x < Math.min(GW, Math.ceil(t.box.x + t.box.w)); x++) G[y * GW + x] = 1; }
    const S = new Int32Array((GW + 1) * (GH + 1));
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) S[(y + 1) * (GW + 1) + x + 1] = G[y * GW + x] + S[y * (GW + 1) + x + 1] + S[(y + 1) * (GW + 1) + x] - S[y * (GW + 1) + x];
    const sum = (x0, y0, x1, y1) => S[y1 * (GW + 1) + x1] - S[y0 * (GW + 1) + x1] - S[y1 * (GW + 1) + x0] + S[y0 * (GW + 1) + x0];
    const holes = [];
    for (const P of window.__manifest.panels) {
      // inset by 4 pt so the panel's own margins do not count
      const x0 = Math.max(0, Math.round(P.x) + 4), y0 = Math.max(0, Math.round(P.y) + 4), x1 = Math.min(GW, Math.round(P.x + P.w) - 4), y1 = Math.min(GH, Math.round(P.y + P.h) - 4);
      if (x1 - x0 < 20 || y1 - y0 < 20) continue;
      const fits = (sq) => { for (let y = y0; y + sq <= y1; y += 2) for (let x = x0; x + sq <= x1; x += 2) if (sum(x, y, x + sq, y + sq) === 0) return true; return false; };
      let lo = 0, hi = Math.min(x1 - x0, y1 - y0);
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (fits(m)) lo = m; else hi = m - 1; }
      holes.push([P.label || '?', +(lo * lo / ((x1 - x0) * (y1 - y0))).toFixed(3), lo]);
    }
    return { busy, ink: ink / n, holes };
  })()`);
  if (px.busy.length) W_(`text over busy art (use a halo, move it, or add a leader line): ${px.busy.slice(0, 8).map(([s, d]) => `${JSON.stringify(s)} ${d}`).join(', ')}`);
  I_(`ink coverage ${(px.ink * 100).toFixed(1)}% of the page (calibration: see reference/style.md)`);
  I_(`largest empty square per panel (share of panel area): ${px.holes.map(([l, f]) => `${l} ${f}`).join(', ')}`);
  { const L = px.holes.filter(([, f]) => f > HOLE); if (L.length && !REP && M.format === 'journal') W_(`large empty area in panel ${L.map(([l, f, s]) => `${l} (${Math.round(f * 100)}% of the panel, ${(s / 72 * 25.4).toFixed(0)} mm square)`).join(', ')}: enlarge the main art, move a neighbour in, or shrink the panel`); }

  // rendered hero
  if (!REP && M.format === 'journal' && !M.images.length) {
    const hl = heroLine(figAbs);
    if (!hl.none && !hl.routed) W_('no rendered hero: render the hero object in Blender (blender/bio3d.py, device3d.py, apparatus3d.py), name the route in a "Hero:" line (vector 3D, lightScene3, Blender, illustrated finish), or write "Hero: none, <reason>" in docs/spec.md or as a "// Hero: none, <reason>" comment in the figure file');
  }

  // drawing route of device figures
  const st = await cdp.evaluate(`(() => {
    const parts = new Set([...document.querySelectorAll('#host svg [data-part]')].map((e) => e.getAttribute('data-part')));
    const own = [...document.querySelectorAll('#host svg text')].map((t) => { const g = t.closest('[data-panel]'); return g ? g.getAttribute('data-panel') : null; });
    return { parts: [...parts], illustrate: !!(window.__F && window.__F.style && window.__F.style.illustrate), own };
  })()`);
  if (M.format !== 'patent') {
    const has3d = st.parts.some((p) => /^(oblique-box|cylinder(-body)?|prism(-side|-top)?|box-back|tray|tube-array|wire-box|wheel)$/.test(p));
    const hasBeam = st.parts.some((p) => /^beam/.test(p));
    const hasScene = st.parts.some((p) => p === 'light-scene' || /^surface-/.test(p) || /through-glass$/.test(p) || /^lens-(face|rim)$/.test(p));
    if (has3d && hasBeam && !hasScene) W_('oblique 3D parts and beams, but no L.lightScene3 scene: beams drawn as flat polygons look the same in front of, through and beside glass (SKILL.md step 7, "Light meets 3D parts")');
    if (has3d && !st.illustrate) W_('3D parts without the illustrated finish: set illustrate: true in the figure export, or say in docs/spec.md why the figure stays flat (SKILL.md step 7)');
    const hl = heroLine(figAbs);
    if (hl.spec && !hl.has) W_('docs/spec.md and the figure file have no "Hero:" line: write "Hero: <object>, rendered with <kit function>" or "Hero: none, <reason>", and report the drawing route to the user (SKILL.md step 3)');
  }
  // label spill
  {
    const own = st.own, spill = [];
    M.texts.forEach((t, i) => {
      const lab = own[i]; if (lab == null || !t.s.trim() || t.rotate) return;
      const P = M.panels.find((q) => q.label === lab); if (!P) return;
      const b = t.box, tol = 0.5;
      if (b.x >= P.x - tol && b.y >= P.y - tol && b.x + b.w <= P.x + P.w + tol && b.y + b.h <= P.y + P.h + tol) return;
      const into = M.panels.find((q) => q !== P && Math.min(b.x + b.w, q.x + q.w) - Math.max(b.x, q.x) > 1 && Math.min(b.y + b.h, q.y + q.h) - Math.max(b.y, q.y) > 1);
      if (into) spill.push(`${JSON.stringify(t.s.slice(0, 24))} (panel ${lab || '?'} into panel ${into.label || '?'})`);
    });
    if (spill.length) W_(`text crosses its panel's bounds into another panel (${spill.length}): ${spill.slice(0, 8).join(', ')}${spill.length > 8 ? ` (+${spill.length - 8})` : ''}. Shorten the label, move it, or widen its panel`);
  }

  // leader lines across other things
  {
    const leadRes = await cdp.evaluate(`(() => { try {
      const svg = document.querySelector('#host svg'), rootInv = svg.getScreenCTM().inverse();
      const toRoot = (e) => rootInv.multiply(e.getScreenCTM());
      const LEAD = '[data-part="callout"], [data-part="leader"]', HIDE = 'defs, clipPath, mask, pattern, marker, symbol, [data-part="callout"], [data-part="leader"]';
      const STEP = 0.5, END = 1.5, RUN = 1.2, JIT = 0.8;
      const opac = (e) => { let o = 1; for (let n = e; n && n.nodeType === 1 && n !== svg.parentNode; n = n.parentNode) o *= parseFloat(getComputedStyle(n).opacity || '1'); return o; };
      const cands = [];
      for (const e of svg.querySelectorAll('rect, circle, ellipse, polygon, path, polyline')) {
        if (e.closest(HIDE)) continue;
        const cs = getComputedStyle(e);
        if (cs.fill === 'none' || cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (parseFloat(cs.fillOpacity || '1') * opac(e) < 0.3) continue;
        let b; try { b = e.getBBox(); } catch (_) { continue; }
        const M = toRoot(e), cs4 = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(M));
        const x0 = Math.min(...cs4.map((p) => p.x)), x1 = Math.max(...cs4.map((p) => p.x)), y0 = Math.min(...cs4.map((p) => p.y)), y1 = Math.max(...cs4.map((p) => p.y));
        if (Math.min(x1 - x0, y1 - y0) < 1.2 || (x1 - x0) * (y1 - y0) < 4) continue;
        cands.push({ e, inv: M.inverse(), x0, y0, x1, y1 });
      }
      const inside = (c, x, y) => x >= c.x0 && x <= c.x1 && y >= c.y0 && y <= c.y1 && c.e.isPointInFill(new DOMPoint(x, y).matrixTransform(c.inv));
      const name = (e) => { const p = e.closest('[data-part]'); return (p ? p.getAttribute('data-part') : e.tagName) + (e.closest('[data-panel]') ? ' in panel ' + (e.closest('[data-panel]').getAttribute('data-panel') || '?') : ''); };
      const texts = [...svg.querySelectorAll('text')], boxes = window.__manifest.texts;
      const found = []; let nLines = 0;
      for (const g of svg.querySelectorAll(LEAD)) {
        if (g.parentElement.closest(LEAD)) continue;
        const own = [...g.querySelectorAll('text')], label = own.map((t) => t.textContent).join(' ').trim() || g.getAttribute('data-part');
        for (const ln of g.querySelectorAll('polyline, line, path')) {
          if (getComputedStyle(ln).fill !== 'none') continue;
          const len = ln.getTotalLength(); if (!(len > 2 * END + RUN)) continue;
          nLines++;
          const M = toRoot(ln), pts = [];
          for (let s = 0; s <= len; s += STEP) { const q = ln.getPointAtLength(s).matrixTransform(M); pts.push({ x: q.x, y: q.y, s }); }
          const a = pts[0], z = pts[pts.length - 1], mid = pts.filter((p) => p.s >= END && p.s <= len - END);
          const ends = [a, z].flatMap((p) => [[0, 0], [JIT, 0], [-JIT, 0], [0, JIT], [0, -JIT]].map(([dx, dy]) => [p.x + dx, p.y + dy]));
          for (const c of cands) {
            if (mid.every((p) => p.x < c.x0 || p.x > c.x1 || p.y < c.y0 || p.y > c.y1)) continue;
            if (ends.some(([x, y]) => inside(c, x, y))) continue;
            let run = 0, best = 0, at = null;
            for (const p of mid) { if (inside(c, p.x, p.y)) { run += STEP; if (run > best) { best = run; at = p; } } else run = 0; }
            if (best >= RUN) found.push({ kind: 'shape', leader: label, what: name(c.e) + ', ' + ((c.x1 - c.x0) / 72 * 25.4).toFixed(1) + ' x ' + ((c.y1 - c.y0) / 72 * 25.4).toFixed(1) + ' mm', x: at.x, y: at.y });
          }
          boxes.forEach((t, i) => {
            if (!t.s.trim() || t.rotate || own.includes(texts[i])) return;
            const bx = t.box, x0 = bx.x + 0.3, x1 = bx.x + bx.w - 0.3, y0 = bx.y + 0.3, y1 = bx.y + bx.h - 0.3;
            if (ends.some(([x, y]) => x >= x0 - END && x <= x1 + END && y >= y0 - END && y <= y1 + END)) return;
            let run = 0, best = 0, at = null;
            for (const p of mid) { if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) { run += STEP; if (run > best) { best = run; at = p; } } else run = 0; }
            if (best >= RUN) found.push({ kind: 'label', leader: label, what: t.s.slice(0, 24), x: at.x, y: at.y });
          });
        }
      }
      return { found, nLines };
    } catch (e) { return { err: String(e && e.stack || e) }; } })()`);
    const lead = leadRes && leadRes.found ? leadRes.found : [];
    if (!leadRes || leadRes.err) I_('leader check did not run: ' + (leadRes ? leadRes.err : 'no result'));
    const mm = (v) => (v / 72 * 25.4).toFixed(0);
    if (leadRes && leadRes.nLines) I_(`leader lines checked for crossings: ${leadRes.nLines}`);
    if (lead.length) W_(`leader line crosses another drawn object (${lead.length}): ${lead.slice(0, 6).map((f) => `${JSON.stringify(f.leader.slice(0, 24))} runs through ${f.kind === 'label' ? 'the label ' + JSON.stringify(f.what) : 'a shape (' + f.what + ')'} at ${mm(f.x)}, ${mm(f.y)} mm`).join('; ')}${lead.length > 6 ? ` (+${lead.length - 6})` : ''}. Move the label, bend the leader (elbow), or point it at a part that is not behind another`);
  }

  writeFileSync(join(out, 'onscreen-text.txt'), T.map((t) => `${t.role}\t${t.size.toFixed(1)}pt\t${t.s}`).join('\n') + '\n');
  if (final || A.final) {
    const facts = join(dirname(figAbs), '..', 'docs', 'facts.md');
    if (!existsSync(facts)) W_('docs/facts.md missing: every label and number must be sourced');
    else {
      const norm = (x) => x.replace(/[\s\u2009\u200A\u00A0]+/g, '');
      const ledger = norm(readFileSync(facts, 'utf8'));
      const unsourced = T.filter((t) => t.role !== 'panel' && t.s.length > 1 && !ledger.includes(norm(t.s)));
      if (unsourced.length) W_(`on-screen strings not quoted in docs/facts.md: ${unsourced.slice(0, 12).map((t) => JSON.stringify(t.s)).join(', ')}`);
    }
  }

  return finishGate(res, out);
}

export function finishGate(res, out) {
  writeFileSync(join(out, 'check.json'), JSON.stringify(res, null, 1));
  for (const m of res.fail) console.log('FAIL ' + m);
  for (const m of res.warn) console.log('WARN ' + m);
  for (const m of res.info) console.log('info ' + m);
  console.log(res.fail.length ? `\nGATE: ${res.fail.length} fail, ${res.warn.length} warn` : `\nGATE: green (${res.warn.length} warn). Green does not mean good: look at the render.`);
  if (res.fail.length) process.exitCode = 1;
  return res;
}
```

### `skills/schematic-figure/foundation/tools/lib/patentgate.mjs`
```javascript
// patentgate.mjs — the gate for `format: 'patent'` figures (37 CFR 1.84), called by check.mjs in place of the
// journal checks. Each rule FAILs (the Office would object) or WARNs (likely objection, or a convention broken).
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const MM = 72 / 25.4;
const CAP = 0.716, XH = 0.519;          // Arial cap/digit height and x-height per unit font size
const MIN_MM = 3.2;                     // 1.84(p)(3)
const FLOOR = 0.3;                      // pt: thinnest stroke that reproduces (1.84(l))
const SHEETS = { letter: [215.9, 279.4], a4: [210, 297] };
const LEGEND_WORDS = 5;                 // 1.84(o): "as few words as possible"
const NUM_ONE = String.raw`S?\d{1,5}[A-Za-z]{0,2}['′″]*`;
export const NUMERAL = new RegExp(`^${NUM_ONE}(\\s*,\\s*${NUM_ONE})*$`);
const FIG = /^FIG\. \d+[A-Z]?$/;
const FIGISH = /^(fig|figure)\b/i;
const SHEET = /^\d+\/\d+$/;
const BRACKETED = /^[([{“"'‘<]\s*S?\d+[A-Za-z]*\s*[)\]}”"'’>]$/;

// numerals.md: one reference character per line, '- 10: housing', '10 — housing', '| 10 | housing |'
export function parseNumerals(src) {
  const map = new Map();
  for (const ln of src.split(/\r?\n/)) {
    if (/^\s*#/.test(ln) || /^\s*\|?\s*-{3,}/.test(ln)) continue;
    const m = /^\s*(?:[-*+]\s+|\|\s*)?`?([A-Za-z]{0,3}\d+[A-Za-z]{0,2}['′″]*|[A-Za-z]{1,3}\d{0,3}['′]*)`?\s*(?::|\||—|–|\s-\s)\s*(\S.*)$/.exec(ln);
    if (m) map.set(m[1], m[2].replace(/\|\s*$/, '').trim());
  }
  return map;
}

export async function patentGate({ cdp, M, figAbs, out, F_, W_, I_, A }) {
  const P = M.patent, T = M.texts.filter((t) => t.s.trim());
  const capMM = (t) => t.minSize * CAP / MM;

  // sheet and sight (1.84(f), (g))
  const sz = Object.entries(SHEETS).find(([, [w, h]]) => Math.abs(M.widthMM - w) < 0.6 && Math.abs(M.heightMM - h) < 0.6);
  if (!sz) F_(`sheet ${M.widthMM} x ${M.heightMM} mm is neither US letter (215.9 x 279.4) nor A4 (210 x 297) (1.84(f))`);
  I_(`patent sheet ${sz ? sz[0] : '?'} ${M.widthMM} x ${M.heightMM} mm; sight ${(P.sight.w / MM).toFixed(1)} x ${(P.sight.h / MM).toFixed(1)} mm; ${T.length} texts, ${M.strokes.length} strokes`);
  const fz = P.forced; if (fz && (fz.stroke + fz.fill + fz.text + fz.opacity + fz.width)) I_(`patent profile forced ${fz.stroke} stroke colours, ${fz.fill} fills, ${fz.text} text colours, ${fz.opacity} opacities/filters and ${fz.width} widths to black-and-white line art: check nothing that carried meaning was lost`);

  // numerals ledger
  const docPath = P.numeralsDoc ? resolve(dirname(figAbs), P.numeralsDoc) : join(dirname(figAbs), '..', 'docs', 'numerals.md');
  const ledger = existsSync(docPath) ? parseNumerals(readFileSync(docPath, 'utf8')) : null;
  if (!ledger) F_(`numerals list missing: write ${docPath} ('- 10: housing', one reference character per line, names from the description)`);
  else I_(`numerals list: ${ledger.size} entries in ${docPath}`);

  // classify every string
  const kind = (t) => {
    if (t.role === 'sheet' && SHEET.test(t.s)) return 'sheet';
    if (t.role === 'section') return 'section';
    if (FIG.test(t.s)) return 'fig';
    if (NUMERAL.test(t.s)) return 'numeral';
    if (ledger && ledger.has(t.s)) return 'refchar';        // letter reference characters (L1, A4) listed in the ledger
    if (SHEET.test(t.s)) return 'sheet';
    return 'legend';
  };
  for (const t of T) t.kind = kind(t);
  const nums = T.filter((t) => t.kind === 'numeral' || t.kind === 'refchar'), figs = T.filter((t) => t.kind === 'fig');
  const legends = T.filter((t) => t.kind === 'legend');

  // text height (1.84(p)(3)); lowercase letters are shorter than capitals
  { const L = T.filter((t) => capMM(t) < MIN_MM - 0.005); if (L.length) F_(`characters below 0.32 cm (1/8 inch) high (1.84(p)(3)): ${L.slice(0, 8).map((t) => `${JSON.stringify(t.s.slice(0, 20))} ${capMM(t).toFixed(2)} mm`).join(', ')}`); }
  { const L = T.filter((t) => /[a-z]/.test(t.s.replace(/^FIG\./, '')) && t.kind !== 'numeral' && t.minSize * XH / MM < MIN_MM - 0.005); if (L.length) W_(`lowercase letters below 0.32 cm high (x-height ${(L[0].minSize * XH / MM).toFixed(2)} mm): set legends in capitals, or larger: ${L.slice(0, 6).map((t) => JSON.stringify(t.s.slice(0, 24))).join(', ')}`); }

  // view labels (1.84(u)) and sheet numbers (1.84(t))
  if (!figs.length) F_(`no view label: every view is labelled 'FIG. 1', 'FIG. 2', ... (1.84(u)); use L.figLabel`);
  { const L = T.filter((t) => FIGISH.test(t.s) && !FIG.test(t.s)); if (L.length) F_(`view labels must read 'FIG.' + number, e.g. 'FIG. 1' (1.84(u)(1)): ${L.map((t) => JSON.stringify(t.s)).join(', ')}`); }
  const maxNum = Math.max(0, ...nums.map((t) => t.size));
  { const L = T.filter((t) => (t.kind === 'fig' || t.kind === 'sheet') && t.size <= maxNum + 1e-6); if (L.length) W_(`view labels and sheet numbers should be larger than the reference numerals (${maxNum.toFixed(1)} pt) (1.84(t), (u)(2)): ${L.map((t) => JSON.stringify(t.s)).join(', ')}`); }

  // reference characters (1.84(p))
  { const L = T.filter((t) => BRACKETED.test(t.s)); if (L.length) F_(`reference characters in brackets or quotation marks (1.84(p)(1)): ${L.map((t) => JSON.stringify(t.s)).join(', ')}`); }
  if (ledger) {
    const ids = nums.filter((t) => t.kind === 'numeral').flatMap((t) => t.s.split(/\s*,\s*/));
    const missing = [...new Set(ids.filter((s) => !ledger.has(s)))];
    if (missing.length) F_(`numerals not defined in ${docPath.split(/[\\/]/).slice(-2).join('/')} (list each with the part's name from the description): ${missing.join(', ')}`);
    const shown = new Set(ids); I_(`numerals shown: ${[...shown].join(', ') || 'none'}; listed but not shown in this view: ${[...ledger.keys()].filter((k) => !shown.has(k) && /\d/.test(k)).join(', ') || 'none'}`);
  }
  { const L = nums.filter((t) => t.role !== 'section' && !t.under && !(t.leads > 0)); if (L.length) W_(`reference numerals without a lead line (1.84(q): a lead line from the numeral to the part, or underline a numeral that sits on its surface): ${[...new Set(L.map((t) => t.s))].slice(0, 12).join(', ')}`); }
  { const L = T.filter((t) => t.role === 'numeral' && t.kind === 'legend'); if (L.length) W_(`L.numeral text that is not a reference character: ${L.map((t) => JSON.stringify(t.s)).join(', ')}`); }

  // legends (1.84(o))
  const words = (t) => (t.s.match(/[A-Za-z0-9]+/g) || []).length;
  { const L = legends.filter((t) => words(t) > LEGEND_WORDS); if (L.length) W_(`legends longer than ${LEGEND_WORDS} words (1.84(o): only where indispensable, as few words as possible): ${L.slice(0, 8).map((t) => JSON.stringify(t.s.slice(0, 40))).join(', ')}`); }
  if (legends.length) I_(`legends (${legends.length}; keep only those needed to understand the drawing): ${legends.slice(0, 12).map((t) => JSON.stringify(t.s.slice(0, 24))).join(', ')}`);

  // strokes (1.84(l))
  { const L = M.strokes.filter((s) => s.w < FLOOR - 1e-6); if (L.length) F_(`${L.length} strokes below ${FLOOR} pt at final size (min ${Math.min(...L.map((s) => s.w)).toFixed(3)} pt) will not reproduce (1.84(l)): ${[...new Set(L.map((s) => s.part || s.tag))].slice(0, 6).join(', ')}`); }
  { const ws = M.strokes.map((s) => s.w); if (ws.length) I_(`stroke weights ${Math.min(...ws).toFixed(2)}-${Math.max(...ws).toFixed(2)} pt`); }

  // overlapping text
  const ov = [];
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
    const a = T[i].box, b = T[j].box, e = 0.4;
    if (T[i].rotate || T[j].rotate) continue;
    if (a.x + e < b.x + b.w - e && b.x + e < a.x + a.w - e && a.y + e < b.y + b.h - e && b.y + e < a.y + a.h - e) ov.push(`${JSON.stringify(T[i].s.slice(0, 18))} x ${JSON.stringify(T[j].s.slice(0, 18))}`);
  }
  if (ov.length) F_(`overlapping text (${ov.length}): ${ov.slice(0, 6).join('; ')}`);

  // relations, as in the journal gate
  const key = (r) => `${r.from}->${r.to}`, drawn = new Set(M.drawn.map(key));
  const missing = M.relations.filter((r) => !drawn.has(key(r)) && !drawn.has(`${r.to}->${r.from}`));
  const reversed = M.relations.filter((r) => !drawn.has(key(r)) && drawn.has(`${r.to}->${r.from}`));
  if (missing.length) F_(`declared relations not drawn: ${missing.map(key).join(', ')}`);
  if (reversed.length) F_(`relations drawn in the wrong direction: ${reversed.map(key).join(', ')}`);

  // DOM and pixel checks in the page
  const S = P.sight;
  const px = await cdp.evaluate(`(async () => {
    const svg = document.querySelector('#host svg'), inv = svg.getScreenCTM().inverse();
    const toRoot = (e, x, y) => { const m = inv.multiply(e.getScreenCTM()); const q = new DOMPoint(x, y).matrixTransform(m); return [q.x, q.y]; };
    const boxRoot = (e) => { const b = e.getBBox(); const c = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => toRoot(e, x, y));
      const xs = c.map((q) => q[0]), ys = c.map((q) => q[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
    const rgb = (v) => { const m = /rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?/.exec(v); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
    const cls = (v) => { if (!v || v === 'none') return 'none'; if (v.startsWith('url')) return 'paint-server'; const c = rgb(v); if (!c) return 'unknown ' + v;
      if (c[3] === 0) return 'none'; if (c[3] < 1) return 'translucent';
      if (c[0] === 0 && c[1] === 0 && c[2] === 0) return 'black'; if (c[0] === 255 && c[1] === 255 && c[2] === 255) return 'white';
      return (c[0] === c[1] && c[1] === c[2]) ? 'grey' : 'colour'; };
    const bad = { colour: [], grey: [], server: [], opacity: [], filter: [], image: [], blackArea: [] };
    const tag = (e) => ((e.closest('[data-part]:not([data-part=sight])')?.dataset.part || e.tagName)) + (e.tagName === 'text' || e.tagName === 'tspan' ? ' ' + JSON.stringify(e.textContent.slice(0, 16)) : '');
    for (const e of svg.querySelectorAll('*')) {
      if (e.closest('defs,clipPath,mask,marker,pattern,linearGradient,radialGradient')) continue;
      const t = e.tagName, cs = getComputedStyle(e);
      if (t === 'image') { bad.image.push(tag(e)); continue; }
      if (+cs.opacity < 1) bad.opacity.push(tag(e));
      if (cs.filter && cs.filter !== 'none') bad.filter.push(tag(e));
      if (!['path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse', 'text', 'tspan'].includes(t)) continue;
      if (e.dataset.role === 'background') continue;
      const chans = [['stroke', cs.stroke, +cs.strokeOpacity]];
      if (t !== 'line') chans.push(['fill', cs.fill, +cs.fillOpacity]);
      for (const [ch, v, op] of chans) {
        let c = cls(v); if (c !== 'none' && op < 1) c = op === 0 ? 'none' : 'translucent';
        if (ch === 'stroke' && (cs.strokeWidth === '0px')) continue;
        if (c === 'colour') bad.colour.push(ch + ' ' + v + ' in ' + tag(e));
        else if (c === 'grey' || c === 'translucent') bad.grey.push(ch + ' ' + v + ' in ' + tag(e));
        else if (c === 'paint-server') bad.server.push(ch + ' in ' + tag(e));
      }
      if (t !== 'line' && t !== 'text' && t !== 'tspan' && cls(cs.fill) === 'black') { const b = boxRoot(e); if (b.w * b.h > ${(5 * MM) ** 2}) bad.blackArea.push(tag(e) + ' ' + (b.w / ${MM}).toFixed(1) + 'x' + (b.h / ${MM}).toFixed(1) + ' mm'); }
    }
    // lead lines must not cross (1.84(q))
    const leads = [...svg.querySelectorAll('[data-part=leader-line]')].map((e) => {
      const n = 48, L = e.getTotalLength(), pts = []; for (let i = 0; i <= n; i++) { const q = e.getPointAtLength(L * i / n); pts.push(toRoot(e, q.x, q.y)); }
      return { pts, grp: e.closest('[data-part=numeral]'), label: e.closest('[data-part=numeral]')?.querySelector('text')?.textContent || '?' };
    });
    const segX = (a, b, c, d) => { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return null;
      const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [a[0] + t * r[0], a[1] + t * r[1]] : null; };
    const near = (q, P) => Math.hypot(q[0] - P[0][0], q[1] - P[0][1]) < 1 || Math.hypot(q[0] - P[P.length - 1][0], q[1] - P[P.length - 1][1]) < 1;
    const cross = [];
    for (let i = 0; i < leads.length; i++) for (let j = i + 1; j < leads.length; j++) {
      if (leads[i].grp && leads[i].grp === leads[j].grp) continue;
      const A = leads[i].pts, B = leads[j].pts; let hit = false;
      for (let a = 0; a + 1 < A.length && !hit; a++) for (let b = 0; b + 1 < B.length && !hit; b++) { const q = segX(A[a], A[a + 1], B[b], B[b + 1]); if (q && !near(q, A) && !near(q, B)) hit = true; }
      if (hit) cross.push(leads[i].label + ' x ' + leads[j].label);
    }
    // numerals enclosed in circles or ellipses (1.84(p)(1))
    const enclosed = [];
    const texts = [...svg.querySelectorAll('text')].filter((t) => /^S?\\d{1,5}[A-Za-z]{0,2}$/.test(t.textContent.replace(/\\u200b/g, '').trim()));
    const rings = [...svg.querySelectorAll('circle,ellipse')].filter((e) => !e.closest('defs')).map((e) => boxRoot(e));
    for (const t of texts) { const b = boxRoot(t);
      if (rings.some((r) => r.x <= b.x + 0.5 && r.y <= b.y + 0.5 && r.x + r.w >= b.x + b.w - 0.5 && r.y + r.h >= b.y + b.h - 0.5 && r.w * r.h < 5 * b.w * b.h)) enclosed.push(t.textContent); }
    // pixels: ink outside the sight, and line work under text (1.84(p)(3))
    const draw = async (s, k) => {
      for (const im of s.querySelectorAll('image')) { const h = im.getAttribute('href'); if (!h || h.startsWith('data:')) continue;
        const b = await (await fetch(new URL(h, location.href))).blob(); im.setAttribute('href', await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); })); }
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(s)); await img.decode();
      const c = document.createElement('canvas'); c.width = Math.ceil(${M.W} * k); c.height = Math.ceil(${M.H} * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      return { D: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height };
    };
    const k = 3, s1 = svg.cloneNode(true); s1.querySelectorAll('[data-role=background]').forEach((e) => e.remove());
    const R1 = await draw(s1, k), sx0 = (${S.x} - 0.5) * k, sy0 = (${S.y} - 0.5) * k, sx1 = (${S.x + S.w} + 0.5) * k, sy1 = (${S.y + S.h} + 0.5) * k;
    let outN = 0, ob = [1e9, 1e9, -1e9, -1e9], ib = [1e9, 1e9, -1e9, -1e9];
    for (let y = 0; y < R1.h; y++) for (let x = 0; x < R1.w; x++) { const i = (y * R1.w + x) * 4; if (R1.D[i] + R1.D[i + 1] + R1.D[i + 2] > 600) continue;
      const bb = (x < sx0 || x > sx1 || y < sy0 || y > sy1) ? (outN++, ob) : ib; bb[0] = Math.min(bb[0], x); bb[1] = Math.min(bb[1], y); bb[2] = Math.max(bb[2], x); bb[3] = Math.max(bb[3], y); }
    const s2 = svg.cloneNode(true); s2.querySelectorAll('[data-role=background],text,[data-part=underline]').forEach((e) => e.remove());
    const R2 = await draw(s2, k), under = [];
    for (const t of window.__manifest.texts) { if (!t.s.trim() || t.rotate) continue;
      const x0 = Math.max(0, Math.floor(t.box.x * k) + 1), y0 = Math.max(0, Math.floor(t.box.y * k) + 1), x1 = Math.min(R2.w - 1, Math.ceil((t.box.x + t.box.w) * k) - 1), y1 = Math.min(R2.h - 1, Math.ceil((t.box.y + t.box.h) * k) - 1);
      let n = 0, m = 0; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const i = (y * R2.w + x) * 4; n++; if (R2.D[i] + R2.D[i + 1] + R2.D[i + 2] < 450) m++; }
      if (n && m / n > 0.01) under.push([t.s.slice(0, 20), +(m / n).toFixed(3)]); }
    return { bad, cross, enclosed, outN, ob: ob.map((v) => v / k), ib: ib.map((v) => v / k), under };
  })()`);
  const lst = (a) => [...new Set(a)].slice(0, 6).join('; ') + (new Set(a).size > 6 ? ` (+${new Set(a).size - 6})` : '');
  if (px.bad.colour.length) F_(`colour on a black-and-white drawing (1.84(a)(1)): ${lst(px.bad.colour)}`);
  if (px.bad.grey.length) F_(`grey or translucent paint: lines and fills must be solid black or white (1.84(l), (m)): ${lst(px.bad.grey)}`);
  if (px.bad.server.length) F_(`gradient or pattern paint (tonal rendering; shade with spaced lines, L.surfaceShade, 1.84(m)): ${lst(px.bad.server)}`);
  if (px.bad.opacity.length) F_(`opacity below 1 renders grey: ${lst(px.bad.opacity)}`);
  if (px.bad.filter.length) F_(`filters (blur, glow, shadow) are tonal rendering: ${lst(px.bad.filter)}`);
  if (px.bad.image.length) F_(`raster image on the sheet (photographs only where nothing else can show the invention, 1.84(b)): ${lst(px.bad.image)}`);
  if (px.bad.blackArea.length) W_(`solid black areas (1.84(m): no solid black shading; use hatching or spaced lines): ${lst(px.bad.blackArea)}`);
  if (px.cross.length) F_(`lead lines cross each other (1.84(q)): ${lst(px.cross)}`);
  if (px.enclosed.length) F_(`reference numerals enclosed in a circle or ellipse (1.84(p)(1)): ${lst(px.enclosed)}`);
  if (px.outN) F_(`marks outside the sight (margins top 25, left 25, right 15, bottom 10 mm, 1.84(g)): ${px.outN} px, spanning ${(px.ob[0] / MM).toFixed(1)}-${(px.ob[2] / MM).toFixed(1)} x ${(px.ob[1] / MM).toFixed(1)}-${(px.ob[3] / MM).toFixed(1)} mm`);
  if (px.under.length) W_(`characters over line work (1.84(p)(3): numerals and letters sit in clear space, or leave a gap in hatching): ${px.under.slice(0, 8).map(([s, f]) => `${JSON.stringify(s)} ${f}`).join(', ')}`);
  if (px.ib[2] > px.ib[0]) {
    const fw = (px.ib[2] - px.ib[0]) / S.w, fh = (px.ib[3] - px.ib[1]) / S.h;
    I_(`drawing spans ${Math.round(fw * 100)}% x ${Math.round(fh * 100)}% of the sight`);
    if (Math.max(fw, fh) < 0.5) W_(`the drawing uses under half the sight in both directions: draw it larger (1.84(k): clear without crowding when reduced to two thirds)`);
  }

  writeFileSync(join(out, 'onscreen-text.txt'), T.map((t) => `${t.kind}\t${t.size.toFixed(1)}pt\t${capMM(t).toFixed(2)}mm\t${t.s}`).join('\n') + '\n');
}
```
