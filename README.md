# Dimas Rizki — Personal Portfolio v2

Modern, responsive, and dynamic developer portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Sanity CMS**, and **Resend API**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Sanity CMS](https://img.shields.io/badge/Sanity-CMS-red?style=flat-square&logo=sanity)
![Resend](https://img.shields.io/badge/Resend-API-black?style=flat-square)

---

## ✨ Features

- **🎨 Modern Aesthetic & Glassmorphism**: Clean layout, smooth transitions, dark mode-ready design, and fluid micro-animations powered by Framer Motion.
- **🏷️ Dynamic Projects Showcase**: Multi-category tagging (Web App, Dashboard, AI/ML, Backend, etc.) with real-time interactive filtering.
- **📜 Certifications & Experience**: Dynamic listings fetched from Sanity CMS with instant category switching.
- **📄 Dynamic CV / Resume Upload**: Manage & update your PDF CV directly from Sanity Studio without re-deploying code.
- **✉️ Functional Contact Form**: Direct email delivery to your inbox integrated via Resend API and Next.js Route Handlers.
- **⚡ Headless CMS (Sanity)**: Manage content for Projects, Experiences, Certificates, Tech Stack, Skills, and Site Settings visually in `/studio`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components, Lucide Icons, React Icons
- **Animations**: Framer Motion
- **Content Management**: Sanity CMS (`next-sanity`, `@sanity/image-url`)
- **Email Service**: Resend REST API
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have Node.js (v18+ recommended) and `npm` installed.

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
SANITY_REVALIDATE_SECRET="your_revalidate_secret"
RESEND_API_KEY="re_your_resend_api_key"
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (pages & API routes)
│   ├── about/            # About page
│   ├── api/contact/      # Contact email endpoint (Resend API)
│   ├── certificates/     # Certificates page
│   ├── contact/          # Contact page
│   ├── experience/       # Experience timeline
│   ├── projects/         # Projects showcase
│   └── studio/           # Embedded Sanity Studio CMS
├── components/           # UI Components (Layout, Cards, Sections, Motion)
├── constants/            # Static navigation & fallback data
├── lib/                  # Motion variants & helper utilities
├── sanity/               # Sanity schemas, queries, and client setup
├── services/             # Data fetchers for Sanity content
└── types/                # TypeScript definitions
```

---

## 📝 License

Distributed under the MIT License. Built with ❤️ by [Dimas Rizki](https://github.com/itsdimasrizki).
