import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
  SiExpress,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiPostman,
  SiVercel,
  SiSanity,
} from "react-icons/si";

import {
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaFigma,
} from "react-icons/fa6";

export const technologies = [
  {
    title: "Frontend",
    items: [
      {
        name: "Next.js",
        icon: SiNextdotjs,
      },
      {
        name: "React",
        icon: FaReact,
      },
      {
        name: "TypeScript",
        icon: SiTypescript,
      },
      {
        name: "Tailwind CSS",
        icon: SiTailwindcss,
      },
      {
        name: "shadcn/ui",
        icon: SiShadcnui,
      },
      {
        name: "Framer Motion",
        icon: SiFramer,
      },
    ],
  },
  {
    title: "Backend",
    items: [
      {
        name: "Node.js",
        icon: FaNodeJs,
      },
      {
        name: "Express",
        icon: SiExpress,
      },
      {
        name: "Laravel",
        icon: FaLaravel,
      },
    ],
  },
  {
    title: "Database",
    items: [
      {
        name: "PostgreSQL",
        icon: SiPostgresql,
      },
      {
        name: "MySQL",
        icon: SiMysql,
      },
      {
        name: "MongoDB",
        icon: SiMongodb,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Git",
        icon: FaGitAlt,
      },
      {
        name: "GitHub",
        icon: FaGithub,
      },
      {
        name: "Docker",
        icon: FaDocker,
      },
      {
        name: "Postman",
        icon: SiPostman,
      },
      {
        name: "Figma",
        icon: FaFigma,
      },
      {
        name: "Vercel",
        icon: SiVercel,
      },
      {
        name: "Sanity",
        icon: SiSanity,
      },
    ],
  },
];