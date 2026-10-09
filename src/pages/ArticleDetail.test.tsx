import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import ArticleDetail from './ArticleDetail';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

const mockLikeArticle = vi.fn().mockResolvedValue(undefined);

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
      id: 'article-1',
      title: 'Título do Artigo',
      date: '20/05/2026',
      content: '<p>Conteúdo HTML</p>',
      image: 'image.png',
      like: 2,
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    mockLikeArticle.mockClear();
    mockLikeArticle.mockResolvedValue(undefined);
  });

  it('deve renderizar o artigo corretamente baseado no slug da URL', () => {
    (usePortfolio as any).mockReturnValue({
      articles: mockArticles,
      loading: false,
      likeArticle: mockLikeArticle,
    });

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
    (usePortfolio as any).mockReturnValue({ articles: [], loading: false });

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

    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('deve navegar para a página anterior ao clicar no botão Voltar', () => {
    (usePortfolio as any).mockReturnValue({
      articles: mockArticles,
      loading: false,
      likeArticle: mockLikeArticle,
    });

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

  it('deve registrar um único gostei por artigo neste navegador', async () => {
    (usePortfolio as any).mockReturnValue({
      articles: mockArticles,
      loading: false,
      likeArticle: mockLikeArticle,
    });

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

    const likeButton = await screen.findByRole('button', {
      name: /gostei, 2 curtidas/i,
    });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockLikeArticle).toHaveBeenCalledWith('article-1');
      expect(
        screen.getByRole('button', { name: /gostei, 3 curtidas/i }),
      ).toBeDisabled();
    });

    expect(window.localStorage.getItem('article-like:slug:meu-artigo')).toBe(
      'true',
    );
  });

  it('deve exibir um artigo previamente curtido neste navegador', async () => {
    window.localStorage.setItem('article-like:slug:meu-artigo', 'true');
    (usePortfolio as any).mockReturnValue({
      articles: mockArticles,
      loading: false,
      likeArticle: mockLikeArticle,
    });

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

    expect(
      await screen.findByRole('button', { name: /gostei, 2 curtidas/i }),
    ).toBeDisabled();
    expect(mockLikeArticle).not.toHaveBeenCalled();
  });
});
