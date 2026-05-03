import { IProfile } from '../interface/portfolio.interface';

export const INITIAL_PROFILE_DATA: IProfile = {
  name: '',
  imageUrl: '',
  cvLink: '',
  phone: '',
  email: '',
  slug: '',
  socials: [
    { id: 'github', name: 'GitHub', link: null, order: 1 },
    { id: 'linkedin', name: 'LinkedIn', link: null, order: 2 },
    { id: 'instagram', name: 'Instagram', link: null, order: 4 },
    { id: 'facebook', name: 'Facebook', link: null, order: 5 },
    { id: 'threads', name: 'Threads', link: null, order: 6 },
    { id: 'twitter', name: 'Twitter', link: null, order: 7 },
  ],
  pages: {
    home: {
      name: 'Início',
      show: true,
      order: 1,
      title: '',
      description: '',
    },
    about: {
      name: 'Sobre',
      show: true,
      order: 2,
      title: '',
      description: [],
    },
    experience: {
      name: 'Experiência',
      show: true,
      order: 3,
      title: '',
      description: '',
      disponibleText: '',
    },
    project: {
      name: 'Projetos',
      show: true,
      order: 4,
      title: '',
      description: '',
    },
    articles: {
      name: 'Artigos',
      show: false,
      order: 5,
      title: '',
      description: '',
    },
  },
};
