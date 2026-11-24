# Visual & UX Overhaul: Deep Obsidian Lab / Dark Hardware Terminal

- **Date:** 2026-11-24
- **Status:** Proposed (Awaiting Approval)
- **Author:** Dimas Rizki Ardiansyah & Agent

---

## 1. Intent & The Why

The portfolio currently exhibits hallmarks of AI-generated SaaS starter templates ("AI slop"):
- A generic pale `#f7f7f5` base clashed with default Tailwind teal accents (`oklch(0.47 0.11 184)` / `bg-teal-50 text-teal-700`).
- Uninspired typography relying exclusively on unstyled `Geist Sans`, ignoring rich typography assets (`Space Grotesk` and `Silkscreen` in `public/fonts`).
- Cookie-cutter cards (`rounded-2xl`, uniform aspect ratios, hover jump) treating disparate domains (LangGraph AI Multi-Agent, IoT ESP32 hardware, PHP POS) with identical, flat containers.
- Gimmicky elements like the spinning teal role rotator and standard pill badges.
- Broken links in the footer (GitHub pointing to generic `github.com`, dummy phone/email) and clickable "Live Demo" buttons linking to dead `#` anchors.

The goal is to rebuild the portfolio's visual identity into a **tactile, high-contrast "Deep Obsidian Lab / Dark Hardware Terminal"** that authentically represents a Fullstack, IoT, and AI Engineer while preserving all Sanity CMS data logic and bilingual localization.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
1. **Distinct Visual Identity (Obsidian Terminal):** Implement a dark palette (`#0a0d12` base, `#12161f` surface, `#1b2230` borders, `#f1f5f9` text) with **Industrial Amber / Signal Orange** (`#f59e0b` / `#ea580c`) telemetry accents.
2. **Typography Upgrade:** Activate `Space Grotesk` for headings and display, Geist/Monospace for telemetry and tech specs, and clean sans for readability.
3. **Card & Section Overhaul:**
   - **Featured Projects:** Replace uniform bento cards with an **Interactive Spec Sheet / Split Showcase** format emphasizing architecture, hardware specs (ESP32, MQTT), and AI pipelines (LangGraph).
   - **Experience & Certificates:** Convert bulky bento cards into a **Clean Technical Log / Engineering Index** with monospace timestamps and compact rows.
   - **Hero Section:** Retain multi-discipline roles, but replace the dizzying rotator with a sleek, technical role switcher and a live status telemetry indicator (`SYS: ACTIVE // OPEN TO ROLES`).
4. **Purposeful Motion:** Add subtle, tactile micro-interactions (magnetic/interactive hover states, border tracing hairlines, scroll progress telemetry, fluid card transitions) without sluggish or bouncy spring physics.
5. **Fix Broken Links & Dead Buttons:**
   - Replace generic footer links with actual links (`github.com/itsdimasrizki`).
   - If `liveDemo` is `#` or empty, do not render a misleading active link; instead, show a muted "Repository Only" or "Hardware Prototype" badge and promote the GitHub repository button.

### Non-Goals
- Altering Sanity CMS schemas, queries, or fetching logic.
- Rewriting content strings stored in Sanity CMS.
- Breaking bilingual routing (`/[locale]/...`) or i18n dictionaries.

### Anti-Goals
- Swapping one slop trend for another (no purple nebulas, no floating 3D clay orbs, no glassmorphism blur traps, no rainbow charts).
- Over-animating the page such that layout shifts occur or low-power devices stutter.

---

## 3. Constraints
- **Preserve Data Pipeline:** All project lists, experiences, certificates, and site settings must continue to be fed by existing services (`project.service.ts`, `experience.service.ts`, `certificate.service.ts`, `settings.service.ts`).
- **Framework & CSS:** Next.js 16 App Router, Tailwind CSS v4, Framer Motion.
- **RTL & i18n Safe:** Must work seamlessly across `/en` and `/id` routes.

---

## 4. Design Details: The 6 Passes

### 4.1. Color Tokens (`globals.css`)
- **Background:** `#090b0e` (Deep void obsidian)
- **Surface / Card:** `#11151c` (Raised dark slate panel)
- **Elevated Hover Surface:** `#171d26`
- **Border / Hairline:** `rgba(255, 255, 255, 0.08)` / `#1e2634`
- **Primary Text:** `#f1f5f9` (Slate 100)
- **Secondary Text:** `#94a3b8` (Slate 400)
- **Muted Text / Mono Metadata:** `#64748b` (Slate 500)
- **Accent:** `#f59e0b` (Industrial Amber / Safety Warning Signal)
- **Accent Subtle Surface:** `rgba(245, 158, 11, 0.1)` with hairline `#f59e0b` / `rgba(245, 158, 11, 0.3)`

### 4.2. Typography
- Register local or google font `Space Grotesk` via `next/font/local` or `next/font/google` in `layout.tsx`.
- Headings: `font-display` (`Space Grotesk`), tight tracking (`tracking-tight`), weights 500 & 600.
- Labels, Tags, Index Numbers: Monospace (`font-mono`), uppercase or tabular numbers (`01 //`, `[AI_AGENT]`, `[IOT_FSM]`).
- Body: Clean neutral sans (`Geist Sans` or system sans).

### 4.3. Hero & Navigation
- **Navbar:** Sticky frosted obsidian bar (`backdrop-blur-md bg-[#090b0e]/80`) with a thin scroll progress line underneath. Monospace nav indices.
- **Hero:**
  - Status pill: `[SYS: IDLE // READY FOR ROLES]` with pulsing amber status dot.
  - Heading: "Dimas Rizki Ardiansyah" set boldly in Space Grotesk.
  - Multi-role presentation: Rather than a chaotic spinning teal text, render an elegant, technical role selector / segmented pill row displaying his domains (Full Stack • AI/ML • IoT & Embedded • Data Science).
  - Profile Image: Framed inside an engineering card with subtle grid crosshairs and technical corner brackets (`+` markers).

### 4.4. Featured Projects (Dossier / Split Spec Sheet)
- Replace generic `rounded-2xl` cards.
- Layout: Asymmetric split view.
  - Left: Interactive preview frame with technical image slider, aspect ratio framing, and subtle zoom/glow on hover.
  - Right: System architecture spec sheet including category tag, year, project title, concise description, tech chip tags styled as terminal badges, and action buttons.
- **Button Logic:**
  - If `liveDemo` exists and is NOT `#`: Render primary "Live Demo" button with external link icon.
  - If `liveDemo` is `#` or null: Omit the dead demo button and render a technical badge `[CODE REPO ONLY]` or `[LOCAL/HARDWARE SYSTEM]`, focusing primary action on `View Source (GitHub)`.

### 4.5. Experience & Certificates (Technical Index)
- Replace bulky cards with a structured, scan-friendly log:
  - Left column: Period range (`2025 - Present`) in monospace muted text.
  - Middle: Role title in Space Grotesk + Organization with clean verification mark.
  - Right: Technical summary narrative.
- Certificates: Grid of compact credential cards with direct PDF preview links and issue dates.

### 4.6. Footer & Contact
- Update `constants/contact.ts`:
  - `github`: `https://github.com/itsdimasrizki`
  - Ensure links open securely (`target="_blank" rel="noopener noreferrer"`).
- Technical footer with system copyright, clean monospace navigation links, and terminal-styled social links.

---

## 5. Verification Plan
1. **Playwright Visual Verification:** Re-run Playwright MCP at desktop (1440×900) and mobile (390×844) resolutions to capture screenshots of the overhauled dark theme.
2. **Link & UX Check:** Verify no broken `#` buttons trigger navigation jumps, and verify footer links point to legitimate URLs.
3. **Build & Typecheck:** Run `pnpm build` or `next build` to verify zero TypeScript or Next.js build regressions.
