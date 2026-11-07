# Schematic Studio (`schematic-studio` v2.0.0)

A first-class **Google Antigravity / Gemini Plugin** (and Claude/Codex skill suite) upgraded from [`lgwrightlab/schematic-figure`](https://github.com/lgwrightlab/schematic-figure) for designing, rendering, and auditing **publication-quality scientific schematic figures** (Nature-style SVG/PDF/PNG/PPTX with procedural vector illustration and headless Blender 3D hero elements) and **37 CFR 1.84 USPTO patent drawing sheets**.

The story behind the original foundation engine is in the blog post, [Automating schematic figure making](https://lgwrightlab.github.io/schematic-figure/).

![A slideshow of five papers: the published figure, Opus 5.5 without the skill, and Opus 5.5 with the skill](docs/launch.gif)

Each paper shows the published figure, Opus 5.5 without the skill, and Opus 5.5 with the skill. The first four papers were published after the model's training cutoff. The last is from our own lab, Wang et al. (2022). All five are CC BY.

**⚠️ The plugin does not replace the person who designs the figure.** It gives a fast first draft, parallel concept exploration, and deterministic + multimodal spatial checks. You still check the science and fine-tune the details.

<details>
<summary>Figure credits</summary>

Published figures are shown resized for display, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

- Physics: Chaturvedi et al., [Trion Hall effect in electron–hole double layers](https://doi.org/10.1038/s41567-026-03444-8), Nature Physics (2026).
- Chemistry: Peng et al., [Divergent ring opening and functionalization of N-alkyl aziridines via boryl radical fragmentation](https://doi.org/10.1038/s41557-026-02247-x), Nature Chemistry (2026).
- Biology: Wang et al., [Scaling biodiversity-stability relationships from populations to meta-communities across trophic levels](https://doi.org/10.1038/s41467-026-75366-1), Nature Communications (2026).
- Materials: Liu et al., [Ultrafast directional hot carrier transfer in bilayer perovskite heterojunctions](https://doi.org/10.1038/s41467-026-76790-z), Nature Communications (2026).
- Optics: Wang et al., [An optical neural network using less than 1 photon per multiplication](https://doi.org/10.1038/s41467-021-27774-8), Nature Communications (2022).

</details>

## What's New in `schematic-studio` v2.0.0 (Gemini / Antigravity Upgrade)

1. **Native Antigravity Plugin Manifest & Guardrails (`plugin.json`, `rules/AGENTS.md`, `assets/logo.svg`)**:
   - Top-level `skills/schematic-figure` and `skills/patent-drawing` with a backward-compatible `.claude/skills -> ../skills` symlink so all `foundation/tools/*.mjs` relative paths work seamlessly across Gemini Antigravity, Claude Code, and Codex.
2. **5 Specialized Subagents (`agents/*.md`) for True Clean-Room Verification**:
   - `schematic-architect`: Upfront Steps 1–4 planner (`docs/brief.md`, `docs/facts.md`, `docs/spec.md`, `figure/scene-contract.json`).
   - `schematic-3d-specialist`: Headless Blender 3D hero (`blender/*.py`) and RDKit molecular SVG (`tools/molecule.py`) builder.
   - `schematic-drafter`: Isolated vector code author (`figure/figure_a.js`, `figure/figure_b.js`, `figure/figure.js`).
   - `schematic-blind-reader`: Clean-room Step 10 cold reader that sees *only* `<name>-thumb.png` and `<name>.png` (strictly forbidden from reading `docs/brief.md`, `docs/spec.md`, or `figure/*.js`).
   - `schematic-art-director`: Parallel draft adjudicator (`docs/choice.md`), Gemini 2D spatial auditor, and subtraction-first critic (`docs/critique-independent.md`).
3. **Zero-npm Progressive-Disclosure & Spatial Grounding Tools**:
   - `node skills/schematic-figure/foundation/tools/query-parts.mjs`: Zero-LLM API & part signature slicer (`< 4 KB` output) across all 11 core engine modules, 5 domain libraries (`bio`, `chem`, `cs`, `ind`, `qc`), and 5 Blender 3D kits.
   - `node skills/schematic-figure/foundation/tools/render.mjs --fig <path> --quick --check`: Single-pass rendering and full DOM/canvas pixel gate in one headless Chromium session (with container-safe `--no-sandbox` / `--disable-dev-shm-usage` flags).
   - `node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs`: Zero-npm Gemini REST API spatial auditor that converts normalized `0..1000` bounding boxes into exact figure `pt` and `mm` coordinates (with clean `exit 0` fallback when `GEMINI_API_KEY` is unset).
   - **2D $\leftrightarrow$ 3D Freestyle Outline Calibration**: `blender/scene.py` exports `fig_width_mm` into `<out_png>.json` and `check.mjs` warns if the placed width in `figure.js` drifts by `> 12%`.

## Install

### Google Antigravity / Gemini Plugin
Clone the repository directly into your workspace or connect it as an Antigravity plugin (`plugin.json` at the repository root automatically registers `skills/`, `agents/`, and `rules/AGENTS.md`).

### Claude Code / Codex
Both `skills/` and `.claude/skills/` are provided out of the box:

```bash
git clone https://github.com/PhilAlton/schematic-figure.git
mkdir -p ~/.claude/skills
cp -r schematic-figure/skills/* ~/.claude/skills/
```

Requirements: **Node.js `>= 22`** (uses built-in `WebSocket` and `fetch`; **zero `npm install`**) and a **Chromium** browser (`google-chrome`, `chromium`, or `msedge`). **Blender 4.x/5.x** and **RDKit** are optional for 3D renders and molecular structures.

## Quick CLI Reference

```bash
# 1. Discover domain part signatures (< 4 KB progressive disclosure)
node skills/schematic-figure/foundation/tools/query-parts.mjs --list-domains
node skills/schematic-figure/foundation/tools/query-parts.mjs --domains optics,bio --route lightScene3

# 2. Single-pass inner loop: render 300 dpi PNG + 360px thumb + run full DOM/pixel gate
node skills/schematic-figure/foundation/tools/render.mjs --fig skills/schematic-figure/foundation/demo/figure.js --quick --check

# 3. Standalone deterministic gate (journal or 37 CFR 1.84 patent sheets)
node skills/schematic-figure/foundation/tools/check.mjs --fig skills/schematic-figure/foundation/demo/patent.js

# 4. Gemini 2D spatial grounding check (optional; exits 0 when GEMINI_API_KEY is unset)
node skills/schematic-figure/foundation/tools/gemini-vision-check.mjs --img skills/schematic-figure/foundation/demo/out/demo.png
```

## Use

Tips to use the plugin in practice:

- **Give it the full story.** A short request will work for well-known concepts. For a novel scientific concept, provide a detailed technical description:

  > "Use schematic-figure to design a two-column (183 mm) Nature-style Fig. 1 for our paper with three parallel concept drafts [attach technical description]."

- **Show it a style to follow.** An example figure from your earlier papers or one you admire gives a target for colours, line weights, and level of detail:

  > "Replicate the attached schematic figure as clean editable vector code and verify it with the geometry and Gemini vision gates."

- **Generate 37 CFR 1.84 Patent Drawings:**

  > "Use patent-drawing to generate a 37 CFR 1.84 compliant FIG. 1 sheet and reference numeral ledger from our patent claims."

## Citation

If you find this plugin useful in your work, please cite the original blog post:

```bibtex
@article{zhao2026automating,
  title   = {Automating schematic figure making},
  author  = {Zhao, Jinchen and Wright, Logan},
  journal = {lgwrightlab.github.io},
  year    = {2026},
  month   = {Oct},
  url     = {https://lgwrightlab.github.io/schematic-figure/}
}
```

## License

MIT. The Latin Modern fonts in `skills/schematic-figure/foundation/fonts/` are under the GUST Font License, which ships beside them.
