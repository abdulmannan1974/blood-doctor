# CLAUDE.md - Project Memory

## Project Overview

**Blood Doctor** is an Interactive Haematology Learning & Clinical Tools platform — a collection of mobile-first web applications providing educational resources and clinical decision support for haematology professionals.

**Creator:** Dr Abdul Mannan (Consultant Haematologist, FRCPath FCPS)

## Project Structure

```
blood-doctor/
├── projects/
│   ├── cmml/              # Chronic Myelomonocytic Leukaemia educational app
│   ├── pe/                # Pulmonary Embolism investigation guide app
│   └── myeloid-sarcoma/   # Myeloid Sarcoma of the Breast — diagnosis & management
├── docs/                  # Built assets for GitHub Pages deployment
└── CLAUDE.md              # This file
```

Each project under `projects/` is a standalone React SPA with its own `package.json`, `vite.config.ts`, and build setup.

## Tech Stack

- **React 19.2** with TypeScript 5.8
- **Vite 6.2** for build/dev
- **Tailwind CSS** (loaded via CDN)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Three.js / @react-three/fiber** (CMML project only, for 3D visualizations)

## Development Commands

```bash
# CMML project
cd projects/cmml && npm install && npm run dev  # Dev server on port 3000

# PE project
cd projects/pe && npm install && npm run dev     # Dev server on port 3001

# Myeloid Sarcoma of the Breast project
cd projects/myeloid-sarcoma && npm install && npm run dev  # Dev server on port 3002
```

## Build & Deployment

- PE project builds to `/docs/` for GitHub Pages (`vite.config.ts` sets `outDir` and `base`)
- Run `npm run build` inside a project directory to build
- The `docs/` directory is served by GitHub Pages

## Architecture Patterns

- **Single main `App.tsx`** per project with section-based layout
- **Components** in `components/` subfolder for reusable/complex pieces
- **Local state only** — no global state management (useState/useRef)
- **Mobile-first** responsive design with Tailwind breakpoints
- **Glass morphism** UI pattern with gradient text, animated underlines, noise overlays
- **Professional medical color scheme** (blues, reds, golds)
- **Fonts:** Playfair Display (headers), Inter (body)

## Key Files

| File | Description |
|------|-------------|
| `projects/cmml/App.tsx` | CMML main app component |
| `projects/cmml/components/ClinicalDiagrams.tsx` | Interactive clinical diagrams |
| `projects/cmml/components/HematologyScene.tsx` | 3D blood cell visualization |
| `projects/pe/App.tsx` | PE main app component |
| `projects/pe/components/PEInvestigations.tsx` | Investigation guide with calculators |
| `projects/myeloid-sarcoma/App.tsx` | Myeloid Sarcoma of the Breast main app component |
| `projects/myeloid-sarcoma/components/MyeloidSarcomaContent.tsx` | Diagnosis, pitfalls, management & references sections |

## Content Sources

- **CMML:** Based on British Journal of Haematology 2025, Vol. 207, pp. 350-364 (HHU Düsseldorf review)
- **PE:** Based on ESC/ERS 2019, NICE, and BTS guidelines
- **Myeloid Sarcoma of the Breast:** Based on peer-reviewed literature (case reports, small series and reviews; e.g. Patkowska 2025, Magdy 2019, Chisholm 2019, Bakst 2011, plus breast-specific cases) — see in-app References section. No breast-specific prospective trials exist; recommendations extrapolate from MS/AML data.

## Important Notes

- All clinical tools carry a disclaimer: decisions must be based on individual patient assessment and current guidelines
- This is an **educational-use-only** project
- Print media queries are included for clinical printouts
- No `.env` files or secrets are used in this project
