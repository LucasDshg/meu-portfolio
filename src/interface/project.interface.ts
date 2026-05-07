export interface IProject {
  id: string;
  order: number;
  date: Date;
  name: string;
  description: string;
  technologies: string[];
  githubLink: string | null;
  liveLink: string | null;
  images?: string[];
  image: string | null;
}

export interface IProjectsSectionProps {
  projects: IProject[];
}
