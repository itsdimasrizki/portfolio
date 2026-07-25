import { FaFigma } from "react-icons/fa6";
import {
  Code2,
  Database,
  Globe,
  Server,
  Settings,
} from "lucide-react";

export const skills = [
  {
    title: "Frontend Development",
    description:
      "Building responsive, accessible, and modern user interfaces using React, Next.js, TypeScript, and Tailwind CSS.",
    icon: Code2,
  },
  {
    title: "Backend Development",
    description:
      "Developing scalable RESTful APIs, authentication systems, and server-side applications.",
    icon: Server,
  },
  {
    title: "Database Management",
    description:
      "Designing and managing relational and NoSQL databases with efficient data modeling.",
    icon: Database,
  },
  {
    title: "UI Implementation",
    description:
      "Transforming Figma designs into clean, responsive, and pixel-perfect web interfaces.",
    icon: FaFigma,
  },
  {
    title: "API Integration",
    description:
      "Integrating frontend applications with internal and third-party APIs efficiently.",
    icon: Globe,
  },
  {
    title: "Deployment & DevOps",
    description:
      "Deploying applications using Vercel, Docker, Git, and modern development workflows.",
    icon: Settings,
  },
];