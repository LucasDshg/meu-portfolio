export interface IExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
  date: Date;
}

export interface IExperienceSectionProps {
  experiences: IExperience[];
}
