import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    onClose.mockClear();
  });

  it('exibe a mensagem corretamente', () => {
    render(<Toast message="Sucesso!" type="success" onClose={onClose} />);
    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
  });

  it('aplica estilos específicos para o tipo erro', () => {
    const { container } = render(
      <Toast message="Erro!" type="error" onClose={onClose} />,
    );
    expect(container.firstChild).toHaveClass('bg-red-500');
  });

  it('chama onClose após o tempo de duração padrão', () => {
    render(<Toast message="Toast" type="success" onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('chama onClose imediatamente ao clicar no botão de fechar', () => {
    render(<Toast message="Toast" type="success" onClose={onClose} />);
    const closeButton = screen.getByRole('button');

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
