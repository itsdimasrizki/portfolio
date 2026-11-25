/**
 * Mock / dummy data untuk development lokal tanpa Sanity CMS.
 *
 * Aktifkan dengan menambahkan ke .env.local:
 *   NEXT_PUBLIC_USE_MOCK_DATA=true
 *
 * Data ini TIDAK pernah dikirim ke production build.
 */

import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { Skill } from "@/types/skill";
import type { Certificate } from "@/types/certificate";
import type { TechnologyGroup } from "@/types/technology";
import type { ResolvedSettings } from "@/types/siteSettings";
import type { PageContent } from "@/types/pageContent";

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------
export const MOCK_SETTINGS: ResolvedSettings = {
  fullName: "Dimas Rizki Ardiansyah",
  roles: [
    "Fullstack Software Engineer",
    "AI Enthusiast",
    "Open Source Contributor",
  ],
  bio: "Informatics Engineering student at UPN \"Veteran\" Yogyakarta with a passion for building production-grade fullstack applications and exploring AI-powered systems.",
  portfolioUrl: "https://dimasrizki.dev",
  email: "dimasrizkia477@gmail.com",
  phone: "+62 812-3456-7890",
  location: "Yogyakarta, Indonesia",
  locationMapUrl: "https://maps.google.com/?q=Yogyakarta,Indonesia",
  githubUrl: "https://github.com/itsdimasrizki",
  linkedinUrl: "https://www.linkedin.com/in/dimas-rizki-ardiansyah-28580233b/",
  instagramUrl: "https://www.instagram.com/drzkyyy__/",
};

// ---------------------------------------------------------------------------
// Page Content
// ---------------------------------------------------------------------------
export const MOCK_PAGE_CONTENT: PageContent = {
  heroBadge: "Open to Work · Freelance & Full-time",
  heroHeadline: "I build things for the web",
  heroHighlight: "& AI",
  heroDescription:
    "Fullstack engineer focused on shipping fast, scalable, and human-centered digital products — from idea to production.",
  storyEyebrow: "Who am I",
  storyTitle: "Engineer by logic, builder by passion.",
  storyParagraphs: [
    "I'm Dimas, a final-year Informatics Engineering student who loves turning complex problems into elegant software. My stack spans React, Next.js, Node.js, Python, and a growing suite of AI integrations.",
    "I've shipped production systems handling real users — from IoT monitoring dashboards to AI-augmented SaaS tools — and I care deeply about code quality, performance, and developer experience.",
    "Outside coding, I mentor peers, contribute to open-source, and chase the perfect pour-over coffee.",
  ],
  statLabels: ["Projects shipped", "Years coding", "Cups of coffee", "PRs merged"],
  deckIntro: "A quick visual deck of my work and experience.",
};

// ---------------------------------------------------------------------------
// Experiences
// ---------------------------------------------------------------------------
export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    company: "PT. Maju Bersama Teknologi",
    position: "Fullstack Software Engineer Intern",
    location: "Jakarta, Indonesia (Remote)",
    startDate: "2025-01",
    endDate: "2025-06",
    description:
      "Developed and maintained a React + Next.js dashboard for real-time IoT sensor monitoring. Reduced API latency by 40% through query optimization and Redis caching. Collaborated with hardware teams to integrate MQTT-based data pipelines.",
    technologies: ["Next.js", "TypeScript", "Redis", "MQTT", "PostgreSQL"],
  },
  {
    id: "exp-2",
    company: "Freelance",
    position: "Web Developer",
    location: "Yogyakarta, Indonesia",
    startDate: "2024-03",
    endDate: "2024-12",
    description:
      "Delivered five client projects ranging from landing pages to full e-commerce platforms. Worked end-to-end: requirements gathering, UI design, backend API, deployment on VPS.",
    technologies: ["React", "Laravel", "MySQL", "Tailwind CSS", "Vercel"],
  },
  {
    id: "exp-3",
    company: "UPN Veteran Yogyakarta — IT Lab",
    position: "Laboratory Assistant",
    location: "Yogyakarta, Indonesia",
    startDate: "2024-02",
    endDate: "2025-12",
    description:
      "Assisted 120+ students in Algorithms, Data Structures, and Web Programming courses. Created supplementary exercises and graded practical exams.",
    technologies: ["C++", "Python", "JavaScript", "HTML/CSS"],
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "AgriSense — IoT Crop Monitoring",
    description:
      "Real-time precision agriculture dashboard combining ESP32 soil/climate sensors with a Next.js frontend, WebSocket streams, and ML anomaly detection for early disease alerts.",
    images: [
      "https://placehold.co/800x500/0f172a/22d3ee?text=AgriSense+Dashboard",
    ],
    year: "2025",
    categories: ["IoT & Hardware", "Web Apps"],
    technologies: ["Next.js", "TypeScript", "MQTT", "FastAPI", "PostgreSQL", "TensorFlow Lite"],
    status: "ongoing",
    github: "https://github.com/itsdimasrizki/agrisense",
  },
  {
    id: "proj-2",
    title: "NoteAI — AI-Powered Study Notes",
    description:
      "SaaS application that converts lecture recordings into structured Markdown notes using Whisper + GPT-4. Features quiz generation, spaced-repetition scheduler, and team workspaces.",
    images: [
      "https://placehold.co/800x500/0f172a/a855f7?text=NoteAI+App",
    ],
    year: "2024",
    categories: ["AI & Agents", "Web Apps"],
    technologies: ["Next.js", "OpenAI", "Whisper", "Supabase", "Stripe"],
    status: "completed",
    github: "https://github.com/itsdimasrizki/noteai",
    liveDemo: "https://noteai.vercel.app",
  },
  {
    id: "proj-3",
    title: "SmartBudget — Personal Finance Tracker",
    description:
      "Mobile-first PWA for expense tracking with smart categorisation via local ML model and an AI chat interface for financial advice. Offline-first architecture with IndexedDB sync.",
    images: [
      "https://placehold.co/800x500/0f172a/4ade80?text=SmartBudget+PWA",
    ],
    year: "2024",
    categories: ["Web Apps"],
    technologies: ["React", "TypeScript", "IndexedDB", "TensorFlow.js", "Cloudflare Workers"],
    status: "completed",
    github: "https://github.com/itsdimasrizki/smartbudget",
    liveDemo: "https://smartbudget.pages.dev",
  },
  {
    id: "proj-4",
    title: "CoDeXplore — Multi-Agent Code Review",
    description:
      "GitHub App that orchestrates multiple LLM agents (security, performance, style) to generate comprehensive PR reviews and auto-suggest fixes via inline comments.",
    images: [
      "https://placehold.co/800x500/0f172a/f97316?text=CoDeXplore+Review",
    ],
    year: "2025",
    categories: ["AI & Agents"],
    technologies: ["Python", "LangChain", "GitHub API", "FastAPI", "Redis"],
    status: "ongoing",
    github: "https://github.com/itsdimasrizki/codexplore",
  },
  {
    id: "proj-5",
    title: "Warung Digital — UMKM POS System",
    description:
      "Point-of-sale and inventory management system tailored for Indonesian micro-businesses. Supports offline mode, receipt printing, and daily sales reports via WhatsApp.",
    images: [
      "https://placehold.co/800x500/0f172a/fbbf24?text=Warung+Digital+POS",
    ],
    year: "2024",
    categories: ["Web Apps"],
    technologies: ["Laravel", "Vue.js", "MySQL", "Thermal Printer API", "WhatsApp Cloud API"],
    status: "completed",
    github: "https://github.com/itsdimasrizki/warung-digital",
    liveDemo: "https://warung-digital.vercel.app",
  },
];

// ---------------------------------------------------------------------------
// Skills (soft-skill categories shown in About section)
// ---------------------------------------------------------------------------
export const MOCK_SKILLS: Skill[] = [
  {
    title: "Problem Solving",
    description:
      "Breaking complex challenges into clear, testable sub-problems and iterating rapidly toward elegant solutions.",
    iconName: "SiBrain",
  },
  {
    title: "Team Collaboration",
    description:
      "Experienced in async remote teams, agile sprints, code review culture, and pair-programming sessions.",
    iconName: "SiSlack",
  },
  {
    title: "Technical Writing",
    description:
      "Clear documentation, ADRs, and READMEs that onboard new contributors without hand-holding.",
    iconName: "SiMarkdown",
  },
  {
    title: "Continuous Learning",
    description:
      "Keeping pace with rapidly evolving tech — currently deep-diving into LLM agents and edge computing.",
    iconName: "SiCoursera",
  },
];

// ---------------------------------------------------------------------------
// Technologies (grouped for the Tech Stack section)
// ---------------------------------------------------------------------------
export const MOCK_TECHNOLOGIES: TechnologyGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "TypeScript", iconName: "SiTypescript" },
      { name: "Python", iconName: "SiPython" },
      { name: "JavaScript", iconName: "SiJavascript" },
      { name: "C++", iconName: "SiCplusplus" },
      { name: "PHP", iconName: "SiPhp" },
      { name: "Go", iconName: "SiGo" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", iconName: "SiReact" },
      { name: "Next.js", iconName: "SiNextdotjs" },
      { name: "Tailwind CSS", iconName: "SiTailwindcss" },
      { name: "Framer Motion", iconName: "SiFramer" },
      { name: "Vue.js", iconName: "SiVuedotjs" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", iconName: "SiNodedotjs" },
      { name: "FastAPI", iconName: "SiFastapi" },
      { name: "Laravel", iconName: "SiLaravel" },
      { name: "Express", iconName: "SiExpress" },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "PostgreSQL", iconName: "SiPostgresql" },
      { name: "MySQL", iconName: "SiMysql" },
      { name: "MongoDB", iconName: "SiMongodb" },
      { name: "Redis", iconName: "SiRedis" },
      { name: "Supabase", iconName: "SiSupabase" },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git", iconName: "SiGit" },
      { name: "Docker", iconName: "SiDocker" },
      { name: "GitHub Actions", iconName: "SiGithubactions" },
      { name: "Vercel", iconName: "SiVercel" },
      { name: "Linux", iconName: "SiLinux" },
      { name: "Figma", iconName: "SiFigma" },
    ],
  },
  {
    title: "AI & ML",
    items: [
      { name: "LangChain", iconName: "SiLangchain" },
      { name: "OpenAI", iconName: "SiOpenai" },
      { name: "TensorFlow", iconName: "SiTensorflow" },
      { name: "Hugging Face", iconName: "SiHuggingface" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issuedAt: "2025-03",
    image: "https://placehold.co/800x600/0f172a/f97316?text=AWS+CCP",
    credentialUrl: "https://aws.amazon.com/verification",
  },
  {
    id: "cert-2",
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    issuedAt: "2024-11",
    image: "https://placehold.co/800x600/0f172a/4ade80?text=TF+Dev+Cert",
    credentialUrl: "https://www.credential.net/example",
  },
  {
    id: "cert-3",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (Coursera)",
    issuedAt: "2024-07",
    image: "https://placehold.co/800x600/0f172a/60a5fa?text=Meta+FE+Cert",
    credentialUrl: "https://www.coursera.org/account/accomplishments/example",
  },
  {
    id: "cert-4",
    title: "Dicoding — Belajar Pengembangan Machine Learning",
    issuer: "Dicoding Indonesia",
    issuedAt: "2024-05",
    image: "https://placehold.co/800x600/0f172a/a855f7?text=Dicoding+ML",
    credentialUrl: "https://www.dicoding.com/certificates/example",
  },
  {
    id: "cert-5",
    title: "Hacktiv8 Full-Stack JavaScript Bootcamp",
    issuer: "Hacktiv8",
    issuedAt: "2024-02",
    image: "https://placehold.co/800x600/0f172a/f43f5e?text=Hacktiv8+FS",
  },
];
