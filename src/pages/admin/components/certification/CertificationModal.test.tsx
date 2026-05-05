import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CertificationModal } from './CertificationModal';

const mockSaveSubItem = vi.fn();
vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    saveSubItem: mockSaveSubItem,
  }),
}));

vi.mock('../../../../data/analytics.service');

describe('CertificationModal', () => {
  const mockOnClose = vi.fn();
  const mockSetToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve preencher os campos corretamente ao editar', () => {
    const existingCert = {
      id: 123,
      name: 'Certificado de Teste',
      institution: 'Instituição X',
      year: 2022,
    };

    render(
      <CertificationModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
        certification={existingCert as any}
      />,
    );

    expect(screen.getByLabelText(/nome do curso/i)).toHaveValue(
      'Certificado de Teste',
    );
    expect(screen.getByLabelText(/instituição/i)).toHaveValue('Instituição X');
    expect(screen.getByLabelText(/ano de conclusão/i)).toHaveValue(2022);
  });

  it('deve salvar uma nova certificação com sucesso', async () => {
    render(
      <CertificationModal
        isOpen={true}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );

    fireEvent.change(screen.getByLabelText(/nome do curso/i), {
      target: { value: 'Novo Curso' },
    });
    fireEvent.change(screen.getByLabelText(/instituição/i), {
      target: { value: 'Nova Escola' },
    });
    fireEvent.change(screen.getByLabelText(/ano de conclusão/i), {
      target: { value: '2024' },
    });

    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveSubItem).toHaveBeenCalledWith(
        'certifications',
        expect.objectContaining({
          name: 'Novo Curso',
          institution: 'Nova Escola',
          year: 2024,
        }),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('não deve renderizar se isOpen for false', () => {
    render(
      <CertificationModal
        isOpen={false}
        onClose={mockOnClose}
        setToast={mockSetToast}
      />,
    );

    expect(screen.queryByText('Nova Certificação')).not.toBeInTheDocument();
  });
});
