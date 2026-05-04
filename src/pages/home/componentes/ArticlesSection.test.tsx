import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ArticlesSection } from './ArticlesSection';

vi.mock('../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    profile: { slug: 'lucas-dev' },
  }),
}));

const mockArticles = [
  {
    id: 1,
    title: 'Artigo 1',
    description: 'Resumo 1',
    date: '2024-01-01',
    slug: 'art-1',
    image: 'img.jpg',
    content: 'Conteúdo do artigo 1',
  },
];

describe('ArticlesSection', () => {
  it('não deve renderizar nada se a lista de artigos estiver vazia', () => {
    const { container } = render(
      <MemoryRouter>
        <ArticlesSection articles={[]} />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar o título da seção e os artigos', () => {
    render(
      <MemoryRouter>
        <ArticlesSection articles={mockArticles} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Artigos Recentes')).toBeInTheDocument();
    expect(screen.getByText('Artigo 1')).toBeInTheDocument();
  });
});
