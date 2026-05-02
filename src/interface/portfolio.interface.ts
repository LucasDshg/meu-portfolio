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
  email: string;
  slug: string;

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
