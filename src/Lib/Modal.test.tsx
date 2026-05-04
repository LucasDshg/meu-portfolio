import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
    document.body.style.overflow = 'unset';
  });

  it('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={onClose} title="Teste">
        Conteúdo
      </Modal>,
    );
    expect(screen.queryByText('Teste')).not.toBeInTheDocument();
  });

  it('deve renderizar o título e conteúdo quando isOpen é true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Título Modal">
        Conteúdo Modal
      </Modal>,
    );
    expect(screen.getByText('Título Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo Modal')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão fechar', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Teste">
        Corpo
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao pressionar a tecla Escape', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Teste">
        Corpo
      </Modal>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve bloquear o scroll do body quando aberto', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="Teste">
        Corpo
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });
});
