# SaaS Chat · Pixel Generation & Spatial Gallery (Remotion)

A deterministic Remotion 4 recreation (`1920x1080`, `60fps`, `1655` frames / `27.583s`) featuring SaaS prompt typing, jumpy scrolling feature lists, retro handheld pixel generation UI, workspace timeline zoom transitions, a 3D orbital photo gallery, 4-column staggered vertical slice reveals, stepped layer-writing logs, and synthesized soundtrack & UI SFX.

## Project Structure

- `src/index.ts` — Font imports (`@fontsource/inter`, `@fontsource/anton`) and Remotion root registration
- `src/Root.tsx` — Composition registration (`SaasChatPixelGallery`)
- `src/SaasChatPixelGallery.tsx` — Master 15-scene `<Sequence>` timeline and `<Audio>` track
- `src/theme.ts` — Centralized palette, typography stacks, and frame timings
- `src/components/` — Reusable visual systems (`CuttingMatBackdrop`, `Sonic3Console`, `CursorPointer`, `SpatialGallery3D`)
- `src/scenes/` — Modular scene components covering all 15 beats
- `scripts/generate-audio.mjs` — Deterministic Node audio synthesizer producing `public/assets/soundtrack.wav`

## Timeline Overview

| Scene | Time | Frames | Description |
| :--- | :--- | :--- | :--- |
| 1. Train Window | `0.00s – 1.25s` | `0 – 75` | Vintage train window push-in |
| 2. ChatGPT Prompt | `1.25s – 3.30s` | `75 – 198` | Botanical backdrop, typewriter prompt & zoom-in |
| 3. Scroll List I | `3.30s – 4.85s` | `198 – 291` | Tilted cutting mat & feature wheel scroll to `Generating Image` |
| 4. Sonic 3 Mat I | `4.85s – 5.60s` | `291 – 336` | Retro console slide-in & cursor `Generate` click |
| 5. Editor Workspace | `5.60s – 8.60s` | `336 – 516` | Timeline UI, toolbar, zoom into viewport & gallery swap |
| 6. Kinetic Dome | `8.60s – 11.75s` | `516 – 705` | `And` -> `pretty` -> neon-lime dome rising with `Sure →` |
| 7. 3D Gallery I | `11.75s – 14.00s` | `705 – 840` | Fullscreen multi-ring 3D spatial photo orbit |
| 8. Vertical Slices | `14.00s – 16.55s` | `840 – 993` | 4-column staggered living room reveal & frosted typography |
| 9. THREE Badge | `16.55s – 18.20s` | `993 – 1092` | Condensed `THREE` pop-in with mini `SONIC 3` console |
| 10. Sonic 3 Mat II | `18.20s – 19.35s` | `1092 – 1161` | Re-entry on green cutting mat & `Generate` click |
| 11. 3D Gallery II | `19.35s – 20.60s` | `1161 – 1236` | High-speed spatial gallery return |
| 12. Layer Writing | `20.60s – 23.65s` | `1236 – 1419` | Stepped `Writing` / `Wrote` HUD & preview stack |
| 13. Scroll List II | `23.65s – 25.10s` | `1419 – 1506` | Feature wheel scroll back to `Generating Image` |
| 14. Sonic 3 Mat III | `25.10s – 26.35s` | `1506 – 1581` | Console click transition |
| 15. Split Eyes Outro | `26.35s – 27.58s` | `1581 – 1655` | Split-screen macro framing, orbital arcs & `All you need to do` |

## Commands

```bash
# Install dependencies
pnpm install

# Regenerate deterministic soundtrack & SFX (optional, already included in public/assets)
pnpm run generate-audio

# Typecheck
pnpm run typecheck

# Open Remotion Studio preview
pnpm run dev

# Render final 1080p 60fps MP4
pnpm run render
```
