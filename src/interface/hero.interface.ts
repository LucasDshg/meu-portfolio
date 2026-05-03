import { ISocials } from './portfolio.interface';

export interface IHeroSectionProps {
  name: string;
  title: string;
  description: string;
  phone?: string;
  imageUrl: string;
  email: string;
  socials: ISocials[];
}
