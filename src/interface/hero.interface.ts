import { ISocials } from "./portfolio.interface";

export interface IHeroSectionProps {
  name: string;
  title: string;
  description: string;
  profileImageUrl: string;
  cvLink?: string;
  socials: ISocials;
}
