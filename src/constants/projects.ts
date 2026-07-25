import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    title: "SaaS Analytics Suite",
    description:
      "Multi-tenant analytics platform with live dashboards and billing, currently in active development.",
    image: "/images/projects/analytics.jpg",
    year: "2026",
    category: "Web App",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "ongoing",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "2",
    title: "AI Content Studio",
    description:
      "Workspace for drafting and scheduling content with AI assistance, being built in the open.",
    image: "/images/projects/landing.jpg",
    year: "2026",
    category: "Web App",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    status: "ongoing",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "3",
    title: "Portfolio Website",
    description:
      "Modern portfolio built with Next.js, Tailwind CSS and Sanity.",
    image: "/images/projects/portfolio.jpg",
    year: "2025",
    category: "Personal",
    technologies: ["Next.js", "TypeScript", "Sanity"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "4",
    title: "E-Commerce Platform",
    description:
      "Full-stack storefront with cart, checkout, and admin dashboard.",
    image: "/images/projects/ecommerce.jpg",
    year: "2025",
    category: "Web App",
    technologies: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "5",
    title: "Task Management App",
    description:
      "Collaborative task board with real-time updates and team workspaces.",
    image: "/images/projects/tasks.jpg",
    year: "2024",
    category: "Web App",
    technologies: ["React", "Node.js", "MongoDB"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "6",
    title: "Analytics Dashboard",
    description:
      "Data visualization dashboard with charts, filters, and exports.",
    image: "/images/projects/analytics.jpg",
    year: "2024",
    category: "Dashboard",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "7",
    title: "REST API Service",
    description:
      "Scalable RESTful API with authentication and role-based access.",
    image: "/images/projects/api.jpg",
    year: "2024",
    category: "Backend",
    technologies: ["Node.js", "Express", "PostgreSQL"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
  {
    id: "8",
    title: "Landing Page",
    description:
      "High-converting marketing landing page with subtle animations.",
    image: "/images/projects/landing.jpg",
    year: "2023",
    category: "Marketing",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    status: "completed",
    github: "#",
    liveDemo: "#",
  },
];

export const featuredProjects: Project[] = projects.slice(0, 3);
