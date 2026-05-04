import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import { useNavigationMenu } from '../utils/navigation.utils';
import Footer from './Footer';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../utils/navigation.utils', () => ({
  useNavigationMenu: vi.fn(),
}));

describe('Footer', () => {
  const mockMenus = [
    { id: '1', name: 'Início', href: '/u/lucas' },
    { id: '2', name: 'Sobre', href: '/u/lucas/about' },
  ];

  it('deve renderizar os links de navegação do menu corretamente', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: { name: 'Lucas' },
      user: null,
    });
    (useNavigationMenu as Mock).mockReturnValue({ menus: mockMenus });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
  });

  it('deve mostrar "Editar meu portfólio" quando o usuário estiver logado', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: { name: 'Lucas' },
      user: { uid: '123' },
    });
    (useNavigationMenu as Mock).mockReturnValue({ menus: mockMenus });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const adminLink = screen.getByText('Editar meu portfólio');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest('a')).toHaveAttribute('href', '/admin');
  });

  it('deve mostrar "Criar meu portfólio" quando o usuário não estiver logado', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: { name: 'Lucas' },
      user: null,
    });
    (useNavigationMenu as Mock).mockReturnValue({ menus: mockMenus });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText('Criar meu portfólio')).toBeInTheDocument();
  });

  it('deve exibir o ano atual no texto de copyright', () => {
    (usePortfolio as Mock).mockReturnValue({
      profile: { name: 'Lucas' },
      user: null,
    });
    (useNavigationMenu as Mock).mockReturnValue({ menus: [] });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
