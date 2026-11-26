# Multi-Agent Workflow: Portfolio Overhaul Execution (v2.1)

Dokumen ini mendefinisikan pembagian domain sub-agen, batas tanggung jawab file, dependensi, dan quality gate untuk mengeksekusi Wave B (v2.1 Polish, Sanity Portrait CMS, Scroll/Sequence Hardening & Dead Code Cleanup) setelah dokumen perencanaan disetujui.

---

## 1. Agent Roster & File Ownership

```
                      +-----------------------------+
                      |   Orchestrator Agent (Lead) |
                      +--------------+--------------+
                                     |
       +---------------+-------------+-------------+---------------+
       |               |                           |               |
+------v-------+ +-----v-------+             +-----v-------+ +-----v-------+
| Agent 1      | | Agent 2     |             | Agent 3     | | Agent 4     |
| Sanity CMS & | | Unslop UI   |             | Scroll Snap | | Dead Code   |
| Asset Schema | | Navbar/Hero |             | & Sequence  | | Cleanup     |
+--------------+ +-------------+             +-------------+ +-------------+
                                                           |
                                                     +-----v-------+
                                                     | Agent 5     |
                                                     | QA & Visual |
                                                     | Playwright  |
                                                     +-------------+
```

### Agent 1: Sanity CMS & Portrait Pipeline (`agent-sanity`)
- **Owned Files:**
  - `src/sanity/schemaTypes/siteSettings.schema.ts`
  - `src/sanity/queries/siteSettings.queries.ts`
  - `src/types/siteSettings.ts`
  - `src/services/settings.service.ts`
- **Scope:** Tambah field `heroPortrait`, `aboutPortrait`, dan `scrollSequenceFrames` dengan metadata dimensi + fallback lokal yang akurat (`666×375` & `375×666`).

### Agent 2: Unslop Visual, Navbar, Hero & About (`agent-ui`)
- **Owned Files:**
  - `src/components/layout/navbar.tsx`
  - `src/components/sections/hero/index.tsx` & `hero-content.tsx`
  - `src/components/sections/about/about-hero.tsx` & `education-section.tsx`
  - `src/components/sections/certificates/index.tsx`
  - `src/i18n/messages/en.json` & `src/i18n/messages/id.json`
- **Depends On:** Agent 1 (`ResolvedSettings` portrait types).
- **Scope:** Hilangkan glow blobs, looping `animate-ping`, CTA ke-3 di Hero, hardcoded unverified stats, uppercase `01 //` clutter; lokalisasi `AboutHero` story; samakan `<Section>` di `EducationSection`; terapkan `--bg-surface-subtle` pada `FeaturedCertificates`.

### Agent 3: Scroll-Snapping & Sequence Engine (`agent-motion`)
- **Owned Files:**
  - `src/app/globals.css`
  - `src/components/motion/image-sequence-canvas.tsx`
  - `src/hooks/use-smart-scroll-snap.ts`
- **Scope:** Tambah `scroll-padding-top: 4rem` pada `.snap-proximity-y`, tambah `--bg-surface-subtle`, perbaiki memory cleanup `bitmap.close()` + nearest-frame fallback di `ImageSequenceCanvas`, dan pangkas unused keyframes.

### Agent 4: Dead Code Cleanup (`agent-cleanup`)
- **Owned Files:** 10 orphan files terverifikasi di `src/components/sections/hero/*` dan `src/components/sections/about/*`.
- **Depends On:** Agent 2 (memastikan tidak ada import tersisa).
- **Scope:** Hapus file dengan 0 caller setelah verifikasi `grep`; **dilarang** menghapus `project-grid.tsx`, `cta/index.tsx`, atau `download-portfolio-button.tsx`.

### Agent 5: QA & Playwright Verification (`agent-qa`)
- **Depends On:** Agents 1–4.
- **Scope:** Jalankan `pnpm test`, `pnpm lint`, `pnpm build`, dan verifikasi live render dengan **Playwright MCP** pada viewport `1440×900`, `1024×768`, dan `390×844` untuk `/en`, `/id`, `/en/about`, `/id/about`.

---

## 2. Guardrails & Quality Gates

1. **Docs-First Gate:** Tidak ada modifikasi kode `src/` sebelum dokumen di `docs/redesign/` dan `docs/superpowers/plans/2026-11-27-portfolio-visual-and-interaction-overhaul.md` ditinjau dan disetujui pengguna.
2. **Bilingual Completeness:** Setiap key UI baru wajib ada di `en.json` dan `id.json` (diverifikasi oleh `tests/i18n/messages.test.ts`).
3. **Caller-Verified Deletion:** Dilarang menghapus file komponen tanpa bukti `grep` menunjukkan 0 caller aktif.
4. **Zero Console/Hydration Errors:** Playwright verification wajib melaporkan `Errors: 0` sebelum task ditandai selesai.
