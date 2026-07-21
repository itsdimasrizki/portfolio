export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
}