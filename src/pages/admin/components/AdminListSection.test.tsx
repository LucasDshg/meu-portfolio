import { fireEvent, render, screen } from '@testing-library/react';
import { RiUserLine } from 'react-icons/ri';
import { describe, expect, it, vi } from 'vitest';
import { AdminListSection } from './AdminListSection';

const mockItems = [
  { id: '1', name: 'Item 1', role: 'Dev' },
  { id: '2', name: 'Item 2', role: 'Designer' },
];

describe('AdminListSection', () => {
  const onAdd = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  const defaultProps = {
    title: 'Lista de Teste',
    icon: RiUserLine,
    addButtonLabel: 'Adicionar Novo',
    items: mockItems,
    emptyMessage: 'Nenhum item encontrado',
    onAdd,
    onEdit,
    onDelete,
    renderItemTitle: (item: any) => item.name,
    renderItemSubtitle: (item: any) => item.role,
  };

  it('deve renderizar o título e os itens da lista corretamente', () => {
    render(<AdminListSection {...defaultProps} />);

    expect(screen.getByText('Lista de Teste')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('deve exibir a mensagem de lista vazia quando não houver itens', () => {
    render(<AdminListSection {...defaultProps} items={[]} />);
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });

  it('deve chamar onAdd ao clicar no botão de adicionar', () => {
    render(<AdminListSection {...defaultProps} />);
    fireEvent.click(screen.getByText('Adicionar Novo'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onEdit com o item correto ao clicar no botão de editar', () => {
    render(<AdminListSection {...defaultProps} />);

    const editButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg'));

    fireEvent.click(editButtons[1]);
    expect(onEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  it('deve chamar onDelete apenas se o usuário confirmar a exclusão', () => {
    const confirmSpy = vi.spyOn(window, 'confirm');
    render(<AdminListSection {...defaultProps} />);

    confirmSpy.mockReturnValueOnce(false);

    const firstItemDeleteBtn = screen.getAllByRole('button')[2];

    fireEvent.click(firstItemDeleteBtn);
    expect(onDelete).not.toHaveBeenCalled();

    confirmSpy.mockReturnValueOnce(true);
    fireEvent.click(firstItemDeleteBtn);

    expect(onDelete).toHaveBeenCalledWith(mockItems[0]);

    confirmSpy.mockRestore();
  });
});
