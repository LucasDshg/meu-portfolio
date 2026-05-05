import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../../../../context/PortfolioContext';
import ArticleEditor from './ArticleEditor';

vi.mock('../../../../components/lexical-editor/LexicalEditor', () => ({
  LexicalEditor: ({ value, onChange }: any) => (
    <textarea
      data-testid="lexical-mock"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ArticleEditor', () => {
  const mockSaveSubItem = vi.fn();
  const mockArticles = [
    {
      id: 1,
      title: 'Artigo Existente',
      description: 'Desc',
      slug: 'slug-existente',
      content: '<p>Conteúdo</p>',
      image: 'img.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      articles: mockArticles,
      saveSubItem: mockSaveSubItem,
    });
  });

  it('deve renderizar o modo de criação corretamente', () => {
    render(
      <MemoryRouter initialEntries={['/admin/articles/new']}>
        <Routes>
          <Route path="/admin/articles/new" element={<ArticleEditor />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Novo Artigo')).toBeInTheDocument();
    expect(screen.getByLabelText(/slug da url/i)).toHaveValue('');
  });

  it('deve carregar dados existentes no modo de edição', () => {
    render(
      <MemoryRouter initialEntries={['/admin/articles/edit/1']}>
        <Routes>
          <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Editar Artigo')).toBeInTheDocument();
    expect(screen.getByLabelText(/título do artigo/i)).toHaveValue(
      'Artigo Existente',
    );
    expect(screen.getByTestId('lexical-mock')).toHaveValue('<p>Conteúdo</p>');
  });

  it('deve chamar saveSubItem ao salvar o artigo', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/articles/new']}>
        <Routes>
          <Route path="/admin/articles/new" element={<ArticleEditor />} />
        </Routes>
      </MemoryRouter>,
    );

    const titleInput = screen.getByLabelText(/título do artigo/i);
    const slugInput = screen.getByLabelText(/slug da url/i);
    const saveButton = screen.getByRole('button', { name: /publicar artigo/i });

    await userEvent.type(titleInput, 'Novo Título');
    await userEvent.type(slugInput, 'novo-slug');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveSubItem).toHaveBeenCalledWith(
        'articles',
        expect.objectContaining({
          title: 'Novo Título',
          slug: 'novo-slug',
        }),
      );
    });
  });
});
