import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectModal } from './ProjectModal';

const mockSaveSubItem = vi.fn();
vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    saveSubItem: mockSaveSubItem,
    user: { uid: 'user123' },
  }),
  PortfolioProvider: ({ children }: any) => <div>{children}</div>,
}));

describe('ProjectModal', () => {
  const mockOnClose = vi.fn();
  const mockSetToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o título "Novo Projeto" quando não houver projeto inicial', () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );
    expect(screen.getByText('Novo Projeto')).toBeInTheDocument();
  });

  it('deve preencher os campos corretamente ao editar um projeto existente', () => {
    const existingProject = {
      id: '123',
      name: 'Projeto Alfa',
      description: 'Descrição Alfa',
      technologies: ['React', 'NestJS'],
      image: 'logo.png',
      order: 10,
    };

    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        project={existingProject as any}
        setToast={mockSetToast}
      />,
    );

    expect(screen.getByLabelText(/nome do projeto/i)).toHaveValue(
      'Projeto Alfa',
    );
    expect(screen.getByLabelText(/tecnologias/i)).toHaveValue('React, NestJS');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('Descrição Alfa');
    expect(screen.getByLabelText(/ordem/i)).toHaveValue(10);
  });

  it('deve converter a string de tecnologias em array ao salvar', async () => {
    render(
      <ProjectModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );

    fireEvent.change(screen.getByLabelText(/nome do projeto/i), {
      target: { value: 'Novo Projeto' },
    });
    fireEvent.change(screen.getByLabelText(/tecnologias/i), {
      target: { value: 'Angular, Vitest, Tailwind' },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Descrição do novo projeto' },
    });
    fireEvent.change(screen.getByLabelText(/ordem/i), {
      target: { value: '5' },
    });

    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);

    await waitFor(
      () => {
        expect(mockSaveSubItem).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            name: 'Novo Projeto',
            technologies: ['Angular', 'Vitest', 'Tailwind'],
            order: 5,
          }),
        );
      },
      { timeout: 2000 },
    );
  });

  it('não deve renderizar nada se isOpen for false', () => {
    render(
      <ProjectModal
        isOpen={false}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );
    expect(screen.queryByText('Novo Projeto')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar Projeto')).not.toBeInTheDocument();
  });
});
