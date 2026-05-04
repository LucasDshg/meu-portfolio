import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image Component', () => {
  it('renderiza a imagem com os atributos obrigatórios', () => {
    render(<Image src="test.jpg" alt="Descrição da imagem" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'Descrição da imagem');
  });

  it('aplica as configurações padrão de performance', () => {
    render(<Image src="test.jpg" alt="Acessibilidade" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('permite sobrescrever as configurações padrão', () => {
    render(
      <Image src="test.jpg" alt="Eager" loading="eager" decoding="sync" />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('decoding', 'sync');
  });
});
