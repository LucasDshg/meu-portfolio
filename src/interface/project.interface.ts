export interface IProject {
  id: number;
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
