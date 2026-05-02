export interface IExperience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface IExperienceSectionProps {
  experiences: IExperience[];
}
