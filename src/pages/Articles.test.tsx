import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import Articles from './Articles';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('Page: Articles', () => {
  it('deve renderizar a lista de artigos quando existirem dados', () => {
    (usePortfolio as any).mockReturnValue({
      profile: {
        pages: { articles: { title: 'Meus Artigos', description: 'Desc' } },
      },
      articles: [
        {
          slug: 'artigo-1',
          title: 'Primeiro Artigo',
          date: '2024',
          description: 'Resumo',
        },
      ],
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>,
    );

    expect(screen.getByText('Meus Artigos')).toBeInTheDocument();
    expect(screen.getByText('Primeiro Artigo')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não houver artigos', () => {
    (usePortfolio as any).mockReturnValue({
      profile: {
        pages: { articles: { title: 'Artigos', description: 'Desc' } },
      },
      articles: [],
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('Nenhum artigo publicado ainda.'),
    ).toBeInTheDocument();
  });
});
