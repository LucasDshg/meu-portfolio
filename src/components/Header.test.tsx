import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import { useNavigationMenu } from '../utils/navigation.utils';
import Header from './Header';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../utils/navigation.utils', () => ({
  useNavigationMenu: vi.fn(),
}));

vi.mock('../Lib/Avatar', () => ({
  Avatar: ({ src, className }: any) => (
    <img data-testid="avatar" src={src} alt="Avatar" className={className} />
  ),
}));

vi.mock('./ThemeToggle', () => ({
  ThemeToggle: ({ darkMode, setDarkMode }: any) => (
    <button data-testid="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
      Toggle Theme
    </button>
  ),
}));

describe('Header', () => {
  const mockProfile = {
    slug: 'lucas-gomes',
    name: 'Lucas Gomes',
    imageUrl: 'profile.jpg',
    email: 'test@example.com',
    socials: [],
    pages: {
      home: { title: 'Home', description: '', show: true, order: 1 },
      about: { title: 'About', description: [], show: true, order: 2 },
      experience: {
        title: 'Experience',
        description: '',
        disponibleText: '',
        show: true,
        order: 3,
      },
      project: { title: 'Projects', description: '', show: true, order: 4 },
      articles: { title: 'Articles', description: '', show: true, order: 5 },
    },
  };
  const mockMenus = [
    { id: 'home', name: 'Início', href: '/u/lucas-gomes' },
    { id: 'about', name: 'Sobre', href: '/u/lucas-gomes/about' },
  ];

  it('deve renderizar o avatar e o menu de navegação quando não estiver na página inicial ou admin', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: mockProfile,
      user: null,
    });
    (useNavigationMenu as Mock).mockReturnValue({
      menus: mockMenus,
      pathname: '/u/lucas-gomes/about',
      basePath: '/u/lucas-gomes',
    });

    render(
      <MemoryRouter initialEntries={['/u/lucas-gomes/about']}>
        <Header darkMode={false} setDarkMode={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('não deve renderizar o avatar quando estiver na página inicial', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: mockProfile,
      user: null,
    });
    (useNavigationMenu as Mock).mockReturnValue({
      menus: mockMenus,
      pathname: '/u/lucas-gomes',
      basePath: '/u/lucas-gomes',
    });

    render(
      <MemoryRouter initialEntries={['/u/lucas-gomes']}>
        <Header darkMode={false} setDarkMode={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
  });

  it('não deve renderizar o menu de navegação quando estiver na página de administração', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: mockProfile,
      user: { uid: '123' },
    });
    (useNavigationMenu as Mock).mockReturnValue({
      menus: mockMenus,
      pathname: '/admin',
      basePath: '/u/lucas-gomes',
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Header darkMode={false} setDarkMode={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Início')).not.toBeInTheDocument();
    expect(screen.queryByText('Sobre')).not.toBeInTheDocument();
  });
});
