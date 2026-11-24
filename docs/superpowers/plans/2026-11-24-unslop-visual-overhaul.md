# Visual & UX Overhaul: Deep Obsidian Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a tactile "Deep Obsidian Lab / Dark Hardware Terminal" with Space Grotesk typography, industrial amber accents, split project spec sheets, clean technical logs, and working links.

**Architecture:** Update Tailwind v4 color variables in `globals.css` to dark obsidian tokens, wire `Space Grotesk` font into `layout.tsx`, redesign hero presentation & telemetry, rebuild `ProjectCard` with split spec sheet architecture and dead-link prevention, compact the experience/certificates sections, fix footer links, and visually verify with Playwright.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion, Space Grotesk font, Lucide React / React Icons, Playwright MCP.

**Spec:** `docs/superpowers/specs/2026-11-24-unslop-visual-overhaul-design.md`

## Global Constraints
- Preserve all Sanity CMS fetching logic and data types (`types/project.ts`, `types/experience.ts`, etc.).
- Maintain bilingual routing (`/[locale]/...`) and i18n dictionary compatibility.
- Ensure all color contrasts pass WCAG AA standards on dark surfaces.
- Never render dead `#` anchor buttons for projects without live demos.

## Review Focus
- Projects with `liveDemo === '#'` or `undefined` must render `[Source Only]` or omit demo button without throwing hydration errors.
- External links must maintain `target="_blank" rel="noopener noreferrer"`.
- Mobile layout (390px) must stack cleanly without horizontal overflow.
- Space Grotesk font loads reliably across Next.js SSR and client hydration.

---

## Tasks

### Task 1: Color Tokens & Typography Foundation
- [ ] In `src/app/globals.css`, replace pale cream/teal variables with Deep Obsidian tokens (`--background: #090b0e`, `--card: #11151c`, `--border: rgba(255,255,255,0.08)`, `--primary: #f59e0b` amber).
- [ ] In `src/app/(site)/[locale]/layout.tsx`, integrate `Space Grotesk` (via Google Fonts or local font) alongside `Geist Sans` and `Geist Mono` so `font-display` and `font-mono` are accessible globally.
- [ ] Verify build and styling loads cleanly with `pnpm build` or fast validation.

### Task 2: Footer Links & Contact Info Fix
- [ ] In `src/constants/contact.ts`, update `github` URL to `https://github.com/itsdimasrizki`.
- [ ] In `src/components/layout/footer.tsx`, style footer with dark terminal aesthetics (hairline top border, monospace category labels, verified external link attributes).

### Task 3: Hero Section & Telemetry Overhaul
- [ ] In `src/components/sections/hero/hero-content.tsx`, replace the green pill badge with a technical telemetry badge (`[SYS: ACTIVE // READY FOR ROLES]` with a live pulsing amber indicator).
- [ ] Redesign multi-role rotator: replace chaotic spinning teal text with a clean, high-contrast segmented role display or structured subtitle that maintains full-stack/AI/IoT roles with dignity.
- [ ] Add technical corner crosshairs (`+`) to profile image container in `src/components/sections/hero/hero-image.tsx`.

### Task 4: Featured Projects Split Spec Sheet & Dead Link Fix
- [ ] In `src/components/sections/projects/project-card.tsx`:
  - Overhaul card styling from bubbly `rounded-2xl` to refined industrial slate card (`rounded-lg`, hairline border `border-white/10`, subtle amber hover glow).
  - Add logic: if `project.liveDemo && project.liveDemo !== '#'`, render active "Live Demo" button. If not, omit demo link and render a subtle `[Code Repo Only]` badge, prioritizing GitHub button.
  - Reorganize tech badges into compact monospace terminal chips.

### Task 5: Experience & Certificate Technical Log
- [ ] In `src/components/sections/experience/experience-card.tsx` / `experience-timeline.tsx`, redesign experience items into a scan-friendly technical log with monospace timestamps and clean institutional hierarchy.
- [ ] In `src/components/sections/certificates/certificate-card.tsx`, apply matching dark slate styling, monospace dates, and clean PDF link triggers.

### Task 6: Visual & Playwright Verification
- [ ] Run Playwright MCP at desktop resolution (1440x900) to capture `desktop-overhaul.png`.
- [ ] Run Playwright MCP at mobile resolution (390x844) to capture `mobile-overhaul.png`.
- [ ] Verify console logs for zero runtime errors.
