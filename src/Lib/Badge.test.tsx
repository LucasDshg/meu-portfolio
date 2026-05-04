import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('deve renderizar o conteúdo corretamente', () => {
    render(<Badge>Texto do Badge</Badge>);

    expect(screen.getByText('Texto do Badge')).toBeInTheDocument();
  });

  it('deve aplicar a cor padrão (zinc) quando nenhuma cor é fornecida', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild;

    expect(badge).toHaveClass('bg-zinc-50');
    expect(badge).toHaveClass('text-zinc-600');
  });

  it('deve aplicar as classes da cor primária corretamente', () => {
    const { container } = render(<Badge color="primary">Primary</Badge>);
    const badge = container.firstChild;

    expect(badge).toHaveClass('bg-teal-50');
    expect(badge).toHaveClass('text-teal-700');
  });

  it('deve aplicar as classes da cor secundária corretamente', () => {
    const { container } = render(<Badge color="secondary">Secondary</Badge>);
    const badge = container.firstChild;

    expect(badge).toHaveClass('bg-blue-50');
    expect(badge).toHaveClass('text-blue-700');
  });

  it('deve permitir a adição de classes CSS personalizadas', () => {
    const customClass = 'mt-4 font-bold';
    const { container } = render(<Badge className={customClass}>Custom</Badge>);
    const badge = container.firstChild;

    expect(badge).toHaveClass('mt-4');
    expect(badge).toHaveClass('font-bold');
    expect(badge).toHaveClass('inline-flex');
  });
});
