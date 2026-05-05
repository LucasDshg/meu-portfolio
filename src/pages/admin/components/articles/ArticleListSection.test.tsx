import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ArticleListSection } from './ArticleListSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('ArticleListSection', () => {
  const mockDeleteSubItem = vi.fn();
  const mockArticles = [
    {
      id: '1',
      title: 'Artigo 1',
      date: '10/10/2023',
      slug: 'artigo-1',
      image: 'image.png',
      description: 'Desc',
      content: '<p>Conteúdo</p>',
    },
    {
      id: '2',
      title: 'Artigo 2',
      date: '11/10/2023',
      slug: 'artigo-2',
      image: 'image.png',
      description: 'Desc',
      content: '<p>Conteúdo</p>',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      deleteSubItem: mockDeleteSubItem,
    });
  });

  it('deve renderizar a lista de artigos corretamente', () => {
    render(
      <MemoryRouter>
        <ArticleListSection articles={mockArticles} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Artigo 1')).toBeInTheDocument();
    expect(screen.getByText('Artigo 2')).toBeInTheDocument();
  });

  it('deve navegar para a página de criação ao clicar em Novo Artigo', () => {
    render(
      <MemoryRouter>
        <ArticleListSection articles={mockArticles} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/novo artigo/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/articles/new');
  });

  it('deve navegar para a página de edição ao clicar no botão editar', () => {
    render(
      <MemoryRouter>
        <ArticleListSection articles={mockArticles} />
      </MemoryRouter>,
    );

    const editButtons = screen.getAllByRole('button', {
      name: /editar artigo/i,
    });
    fireEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/articles/edit/1');
  });

  it('deve chamar deleteSubItem ao clicar no botão excluir e confirmar', () => {
    window.confirm = vi.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <ArticleListSection articles={mockArticles} />
      </MemoryRouter>,
    );

    const deleteButtons = screen.getAllByRole('button', {
      name: /excluir artigo/i,
    });
    fireEvent.click(deleteButtons[0]); // Clica no excluir do primeiro artigo (ID 1)
    expect(mockDeleteSubItem).toHaveBeenCalledWith('articles', '1');
  });
});
