import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperienceModal } from './ExperienceModal';

const mockSaveSubItem = vi.fn();
vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    saveSubItem: mockSaveSubItem,
  }),
}));

vi.mock('../../../../data/analytics.service');

describe('ExperienceModal', () => {
  const mockOnClose = vi.fn();
  const mockSetToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o título "Nova Experiência" quando não houver experiência inicial', () => {
    render(
      <ExperienceModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );
    expect(screen.getByText('Nova Experiência')).toBeInTheDocument();
  });

  it('deve preencher os campos corretamente ao editar uma experiência existente', () => {
    const existingExperience = {
      id: 123,
      company: 'Google',
      role: 'Software Engineer',
      duration: '2020 - 2024',
      description: 'Atuação no time de Core',
      technologies: ['Go', 'Kubernetes'],
    };

    render(
      <ExperienceModal
        isOpen={true}
        onClose={mockOnClose}
        experience={existingExperience as any}
        setToast={mockSetToast}
      />,
    );

    expect(screen.getByLabelText(/empresa/i)).toHaveValue('Google');
    expect(screen.getByLabelText(/cargo/i)).toHaveValue('Software Engineer');
    expect(screen.getByLabelText(/tecnologias/i)).toHaveValue('Go, Kubernetes');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue(
      'Atuação no time de Core',
    );
  });

  it('deve converter a string de tecnologias em array e salvar com sucesso', async () => {
    render(
      <ExperienceModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );

    fireEvent.change(screen.getByLabelText(/empresa/i), {
      target: { value: 'Apple' },
    });
    fireEvent.change(screen.getByLabelText(/cargo/i), {
      target: { value: 'Frontend Dev' },
    });
    fireEvent.change(screen.getByLabelText(/duração/i), {
      target: { value: '2023' },
    });
    fireEvent.change(screen.getByLabelText(/tecnologias/i), {
      target: { value: 'React, Swift, CSS' },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Descrição Apple' },
    });

    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveSubItem).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          company: 'Apple',
          technologies: ['React', 'Swift', 'CSS'],
        }),
      );
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockSetToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('não deve renderizar nada se isOpen for false', () => {
    render(
      <ExperienceModal
        isOpen={false}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );
    expect(screen.queryByText('Nova Experiência')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar Experiência')).not.toBeInTheDocument();
  });
});
