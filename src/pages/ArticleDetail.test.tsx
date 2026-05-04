import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import ArticleDetail from './ArticleDetail';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

// Mock do useNavigate para capturar a navegação de volta
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Page: ArticleDetail', () => {
  const mockArticles = [
    {
      slug: 'meu-artigo',
      title: 'Título do Artigo',
      date: '20/05/2026',
      content: '<p>Conteúdo HTML</p>',
      image: 'image.png',
    },
  ];

  it('deve renderizar o artigo corretamente baseado no slug da URL', () => {
    (usePortfolio as any).mockReturnValue({ articles: mockArticles });

    render(
      <MemoryRouter initialEntries={['/u/slug/articles/meu-artigo']}>
        <Routes>
          <Route
            path="/u/:slug/articles/:articleSlug"
            element={<ArticleDetail />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Título do Artigo')).toBeInTheDocument();
    expect(screen.getByText(/Publicado em 20\/05\/2026/)).toBeInTheDocument();
    expect(screen.getByText('Conteúdo HTML')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando o artigo não for encontrado', () => {
    (usePortfolio as any).mockReturnValue({ articles: [] });

    render(
      <MemoryRouter initialEntries={['/u/slug/articles/slug-inexistente']}>
        <Routes>
          <Route
            path="/u/:slug/articles/:articleSlug"
            element={<ArticleDetail />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Artigo não encontrado.')).toBeInTheDocument();
  });

  it('deve navegar para a página anterior ao clicar no botão Voltar', () => {
    (usePortfolio as any).mockReturnValue({ articles: mockArticles });

    render(
      <MemoryRouter initialEntries={['/u/slug/articles/meu-artigo']}>
        <Routes>
          <Route
            path="/u/:slug/articles/:articleSlug"
            element={<ArticleDetail />}
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
