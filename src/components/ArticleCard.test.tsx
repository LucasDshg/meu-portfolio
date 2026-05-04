import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IArticle } from '../interface/article.interface';
import { ArticleCard } from './ArticleCard';

vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: any) => (
      <article {...props}>{children}</article>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    profile: { slug: 'lucas-gomes', name: 'Lucas Gomes' },
  }),
}));

vi.mock('../utils/navigation.utils', () => ({
  useNavigationMenu: () => ({
    basePath: '/u/lucas-gomes',
  }),
}));

describe('ArticleCard', () => {
  const mockArticle: IArticle = {
    id: '1',
    title: 'Testando React com Vitest',
    description: 'Um guia prático sobre testes unitários.',
    slug: 'testando-react-com-vitest',
    date: '10/10/2023',
    content: '<p>Conteúdo</p>',
    image: 'https://test.com/image.jpg',
  };

  it('deve renderizar o título e a descrição do artigo corretamente', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.description)).toBeInTheDocument();
  });

  it('deve conter o link correto para a página do artigo', () => {
    render(<ArticleCard article={mockArticle} />);

    const link = screen.getByRole('link', { name: /ler artigo/i });
    expect(link).toHaveAttribute(
      'href',
      `/u/lucas-gomes/articles/${mockArticle.slug}`,
    );
  });

  it('deve renderizar a imagem de fundo quando fornecida', () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByAltText('');
    expect(image).toHaveAttribute('src', mockArticle.image);
  });
});
