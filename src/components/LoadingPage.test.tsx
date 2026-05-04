import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoadingPage } from './LoadingPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('LoadingPage', () => {
  it('deve renderizar a imagem de carregamento com o alt text correto', () => {
    render(<LoadingPage />);

    const image = screen.getByAltText('Carregando...');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('h-20', 'w-20');
  });

  it('deve possuir as classes de layout para preencher a tela inteira', () => {
    const { container } = render(<LoadingPage />);
    const mainDiv = container.firstChild;

    expect(mainDiv).toHaveClass(
      'fixed',
      'inset-0',
      'z-50',
      'flex',
      'items-center',
      'justify-center',
    );
    expect(mainDiv).toHaveClass('bg-white', 'dark:bg-zinc-950');
  });
});
