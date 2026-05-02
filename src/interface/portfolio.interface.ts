export interface ISocials {
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  instagram: string | null;
  email: string | null;
}

export interface IMenuItem {
  name: string;
  show: boolean;
  order: number;
}

export interface IProfile {
  name: string;
  title: string;
  description: string;
  experience: string;
  project: string;
  profileImageUrl: string;
  cvLink: string;
  slug: string;
  aboutBio: string[];
  menu: Record<string, IMenuItem>;
  socials: ISocials;
}

export interface IExperience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  githubLink: string | null;
  liveLink: string | null;
  images: string[];
  image: string | null;
}

export interface IPortfolioData {
  profile: IProfile | null;
  experiences: IExperience[];
  projects: IProject[];
}
