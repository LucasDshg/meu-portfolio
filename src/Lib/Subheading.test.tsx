import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Subheading } from './Subheading';

describe('Subheading Component', () => {
  it('deve renderizar como um h3 por padrão', () => {
    render(<Subheading>Subtítulo</Subheading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('deve permitir alteração de cor via prop', () => {
    const { container } = render(
      <Subheading color="text-red-500">Texto</Subheading>,
    );
    expect(container.firstChild).toHaveClass('text-red-500');
  });

  it('deve aceitar classes personalizadas', () => {
    render(<Subheading className="my-custom-class">Texto</Subheading>);
    expect(screen.getByRole('heading')).toHaveClass('my-custom-class');
  });
});
