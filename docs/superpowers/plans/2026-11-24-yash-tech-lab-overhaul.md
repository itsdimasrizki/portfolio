# Yash Ahire-Inspired Tech Lab Portfolio Overhaul Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul Dimas Rizki's portfolio into an interactive "Yash Ahire Tech Lab Edition" with an interactive particle canvas, liquid cursor glow, dynamic typewriter greeting, interactive hero flagship console (IoT & AI simulator), live WIB telemetry navbar, filterable project dossiers, and clean technical log.

**Architecture:**
- Create `InteractiveBackground` using an HTML5 Canvas node network reacting to cursor coordinates.
- Create `FluidCursor` providing an ambient light spotlight that follows the pointer.
- Redesign `HeroContent` with dynamic typing multilingual greeting and technical role selector.
- Build `HeroConsole` (tabbed interactive widget for Agro Melon IoT sensor sim, Matcha AI agent pipeline, and Engineer profile).
- Upgrade `Navbar` with live WIB time telemetry and monospace indexing.
- Upgrade `Projects` section with interactive category filter tabs and dossier cards.
- Verify with Playwright screenshots.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion, HTML5 Canvas, Space Grotesk, Silkscreen, Lucide React.

---

## Tasks

### Task 1: Interactive Background & Liquid Cursor
- [ ] Create `src/components/effects/particle-canvas.tsx` (interactive 60fps mesh connecting nodes with cursor).
- [ ] Create `src/components/effects/fluid-cursor.tsx` (smooth tracking glow aura).
- [ ] Wire both into `src/app/(site)/[locale]/layout.tsx` so all pages feature the living mesh background.

### Task 2: Live Telemetry Navbar
- [ ] In `src/components/layout/navbar.tsx`, add live real-time Yogyakarta clock (WIB) with pulsing status beacon.
- [ ] Format navigation links with monospace technical indices (`01 // PROJECTS`, `02 // EXPERIENCE`, etc.).

### Task 3: Dynamic Typewriter Hero & Interactive Flagship Console
- [ ] Create `src/components/sections/hero/typewriter-greeting.tsx` (cycling multi-language greetings: Halo, Hello, Sugeng Rawuh, Bonjour with blinking cursor).
- [ ] Create `src/components/sections/hero/hero-console.tsx` (interactive tabbed console with Agro IoT live sensor monitor, Matcha LangGraph pipeline, and profile view).
- [ ] Update `src/components/sections/hero/index.tsx` and `src/components/sections/hero/hero-content.tsx` to mount the new console and dynamic headline.

### Task 4: Filterable Project Dossiers & Clean Technical Log
- [ ] In `src/components/sections/projects/project-grid.tsx`, add interactive category filters (`[ALL]`, `[AI & AGENTS]`, `[IOT & HARDWARE]`, `[WEB APPS]`).
- [ ] Ensure `ProjectCard` maintains split spec-sheet layout, terminal chips, and no dead `#` links.

### Task 5: Build Verification & Playwright Screenshots
- [ ] Run `pnpm build` to verify zero TypeScript/Next.js regressions.
- [ ] Capture desktop and mobile screenshots with Playwright MCP to verify visual craft and motion.
