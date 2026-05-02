export interface ICertifications {
  id: number;
  name: string;
  institution: string;
  year: number;
}

export interface ICertificationsSectionProps {
  certifications: ICertifications[];
}
