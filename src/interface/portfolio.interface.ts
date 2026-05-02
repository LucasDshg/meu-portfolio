export interface ISocials {
  id: string;
  name: string;
  link: string | null;
  order: number;
}

export interface IMenuItem {
  id: string;
  name: string;
  show: boolean;
  order: number;
}

export interface IProfile {
  name: string;
  imageUrl: string;
  cvLink: string;
  slug: string;
  menu: IMenuItem[];
  socials: ISocials[];
  pages: {
    home: {
      title: string;
      description: string;
    };
    about: {
      title: string;
      description: string[];
    };
    experience: {
      title: string;
      description: string;
      disponibleText: string;
    };
    project: {
      title: string;
      description: string;
    };
  };
}
