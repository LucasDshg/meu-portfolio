import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text Component', () => {
  it('renderiza como um parágrafo por padrão', () => {
    render(<Text>Conteúdo de texto</Text>);
    const textElement = screen.getByText('Conteúdo de texto');
    expect(textElement.tagName).toBe('P');
  });

  it('aplica as classes de cor padrão', () => {
    const { container } = render(<Text>Texto colorido</Text>);
    expect(container.firstChild).toHaveClass(
      'text-zinc-600',
      'dark:text-zinc-400',
    );
  });

  it('permite sobrescrever a cor via prop', () => {
    const { container } = render(<Text color="text-red-500">Texto erro</Text>);
    expect(container.firstChild).toHaveClass('text-red-500');
  });
});
