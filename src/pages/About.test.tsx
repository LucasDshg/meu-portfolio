import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import About from './About';

// Mock do hook de contexto
vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('Page: About', () => {
  const mockData = {
    profile: {
      imageUrl: 'test-img.jpg',
      pages: {
        about: {
          title: 'Sobre Mim',
          description: ['Parágrafo 1', 'Parágrafo 2'],
        },
      },
      socials: [
        { id: '1', name: 'GitHub', link: 'https://github.com', order: 1 },
      ],
    },
    certifications: [
      { id: 'c1', name: 'Angular Expert', institution: 'Udemy', year: '2024' },
    ],
  };

  it('deve renderizar o título, descrição e imagem de perfil', () => {
    (usePortfolio as any).mockReturnValue(mockData);

    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sobre Mim')).toBeInTheDocument();
    expect(screen.getByText('Parágrafo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Foto de perfil')).toHaveAttribute(
      'src',
      'test-img.jpg',
    );
  });

  it('deve renderizar a lista de redes sociais e certificações', () => {
    (usePortfolio as any).mockReturnValue(mockData);

    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Angular Expert')).toBeInTheDocument();
    expect(screen.getByText(/Udemy — 2024/)).toBeInTheDocument();
  });
});
