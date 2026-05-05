import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticlePageSection } from './ArticlePageSection';

describe('ArticlePageSection', () => {
  const mockData = {
    title: 'Blog Técnico',
    description: 'Artigos sobre desenvolvimento',
    show: true,
  };

  it('deve renderizar os campos com os valores iniciais', () => {
    render(<ArticlePageSection data={mockData} />);

    expect(screen.getByLabelText(/título/i)).toHaveValue('Blog Técnico');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue(
      'Artigos sobre desenvolvimento',
    );
    expect(screen.getByLabelText(/mostrar página/i)).toBeChecked();
  });

  it('deve renderizar campos vazios se data não for fornecido', () => {
    render(<ArticlePageSection data={undefined} />);

    expect(screen.getByLabelText(/título/i)).toHaveValue('');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('');
    expect(screen.getByLabelText(/mostrar página/i)).not.toBeChecked();
  });
});
