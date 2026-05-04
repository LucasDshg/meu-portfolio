import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea Component', () => {
  it('renderiza o label e o número de linhas padrão', () => {
    render(<Textarea label="Descrição" />);
    const textarea = screen.getByRole('textbox');
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('exibe o asterisco quando obrigatório', () => {
    render(<Textarea label="Mensagem" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('ativa o estado isTouched ao perder o foco (onBlur)', () => {
    render(<Textarea label="Bio" required />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).not.toHaveClass('invalid:border-red-500');

    fireEvent.blur(textarea);

    expect(textarea).toHaveClass('invalid:border-red-500');
  });
});
