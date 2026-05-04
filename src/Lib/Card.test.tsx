import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card Component', () => {
  it('deve renderizar o conteúdo corretamente', () => {
    render(
      <Card>
        <div data-testid="content">Conteúdo do Card</div>
      </Card>,
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
  });

  it('deve aplicar a variante outline por padrão', () => {
    const { container } = render(<Card>Default Card</Card>);

    const cardElement = container.querySelector('.rounded-2xl');
    expect(cardElement).toHaveClass('border-zinc-100');
  });

  it('deve aplicar a variante primary corretamente', () => {
    const { container } = render(<Card variant="primary">Primary Card</Card>);

    const cardElement = container.querySelector('.rounded-2xl');
    expect(cardElement).toHaveClass('bg-zinc-50');
  });

  it('deve aplicar a classe de altura personalizada', () => {
    const { container } = render(<Card height="h-64">Height Card</Card>);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('h-64');
  });

  it('deve permitir classes CSS adicionais via prop className', () => {
    const { container } = render(
      <Card className="custom-card-class">Custom Class</Card>,
    );

    const cardElement = container.querySelector('.rounded-2xl');
    expect(cardElement).toHaveClass('custom-card-class');
  });
});
