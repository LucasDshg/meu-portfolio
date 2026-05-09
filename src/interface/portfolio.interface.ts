import { IArticle } from './article.interface';

export interface ISocials {
  id: string;
  name: string;
  link: string | null;
  order: number;
}

export interface IProfile {
  name: string;
  imageUrl: string;
  cvLink: string;
  phone?: string;
  email: string;
  slug: string;
  adFreeUntil: Date;
  articles: IArticle[];
  socials: ISocials[];
  pages: {
    home: {
      name: string;
      show: boolean;
      order: number;
      title: string;
      description: string;
    };
    about: {
      name: string;
      show: boolean;
      order: number;
      title: string;
      description: string[];
    };
    experience: {
      name: string;
      show: boolean;
      order: number;
      title: string;
      description: string;
      disponibleText: string;
    };
    project: {
      name: string;
      show: boolean;
      order: number;
      title: string;
      description: string;
    };
    articles: {
      name: string;
      show: boolean;
      order: number;
      title: string;
      description: string;
    };
  };
}
