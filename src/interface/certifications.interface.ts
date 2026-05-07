export interface ICertifications {
  id: string;
  name: string;
  institution: string;
  year: number;
  date: Date;
}

export interface ICertificationsSectionProps {
  certifications: ICertifications[];
}
