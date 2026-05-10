import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading Component', () => {
  it('renderiza como um elemento h2 por padrão', () => {
    render(<Heading>Título de Teste</Heading>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('aplica classes personalizadas passadas via className', () => {
    render(<Heading className="custom-class">Título</Heading>);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('custom-class');
    expect(heading).toHaveClass('text-2xl');
  });

  it('repassa atributos adicionais para o elemento h2', () => {
    render(<Heading id="main-title">Título</Heading>);
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'main-title');
  });

  it('deve permitir alteração de cor via prop', () => {
    const { container } = render(
      <Heading color="text-red-500">Título de Teste</Heading>,
    );
    expect(container.firstChild).toHaveClass('text-red-500');
  });
});
