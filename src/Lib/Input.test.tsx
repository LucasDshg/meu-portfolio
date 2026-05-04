import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('renderiza o label quando fornecido', () => {
    render(<Input label="Nome" />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('exibe o asterisco de obrigatoriedade quando required é true', () => {
    render(<Input label="E-mail" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('repassa atributos nativos para o input', () => {
    render(<Input placeholder="Digite algo..." name="username" />);
    const input = screen.getByPlaceholderText('Digite algo...');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('atualiza o estado visual após o primeiro desfoque (onBlur)', () => {
    render(<Input label="Validar" required />);
    const input = screen.getByRole('textbox');

    expect(input).not.toHaveClass('invalid:border-red-500');

    fireEvent.blur(input);

    expect(input).toHaveClass('invalid:border-red-500');
  });

  it('permite a digitação de texto', () => {
    render(<Input placeholder="Teste" />);
    const input = screen.getByPlaceholderText('Teste') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Novo valor' } });
    expect(input.value).toBe('Novo valor');
  });
});
