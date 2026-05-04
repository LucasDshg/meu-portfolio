import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe('ThemeToggle', () => {
  it('deve renderizar o botão com o label de acessibilidade correto', () => {
    render(<ThemeToggle darkMode={false} setDarkMode={vi.fn()} />);

    expect(screen.getByLabelText('Alternar tema')).toBeInTheDocument();
  });

  it('deve ter o atributo aria-pressed como false no modo claro', () => {
    render(<ThemeToggle darkMode={false} setDarkMode={vi.fn()} />);

    const button = screen.getByLabelText('Alternar tema');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('deve ter o atributo aria-pressed como true no modo escuro', () => {
    render(<ThemeToggle darkMode={true} setDarkMode={vi.fn()} />);

    const button = screen.getByLabelText('Alternar tema');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('deve chamar setDarkMode com o valor oposto ao clicar no botão', () => {
    const setDarkModeMock = vi.fn();

    const { rerender } = render(
      <ThemeToggle darkMode={false} setDarkMode={setDarkModeMock} />,
    );
    fireEvent.click(screen.getByLabelText('Alternar tema'));
    expect(setDarkModeMock).toHaveBeenCalledWith(true);

    rerender(<ThemeToggle darkMode={true} setDarkMode={setDarkModeMock} />);
    fireEvent.click(screen.getByLabelText('Alternar tema'));
    expect(setDarkModeMock).toHaveBeenCalledWith(false);
  });
});
