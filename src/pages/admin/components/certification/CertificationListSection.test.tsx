import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CertificationListSection } from './CertificationListSection';

const mockDeleteSubItem = vi.fn();
vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    deleteSubItem: mockDeleteSubItem,
  }),
}));

vi.mock('../../../../data/analytics.service');

describe('CertificationListSection', () => {
  const mockCertifications = [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      institution: 'Amazon Web Services',
      year: 2021,
      date: new Date(),
    },
    {
      id: 'cert-2',
      name: 'Angular Expert',
      institution: 'Udemy',
      year: 2023,
      date: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de certificações ordenada por ano (decrescente)', () => {
    render(<CertificationListSection certifications={mockCertifications} />);

    expect(screen.getByText('Angular Expert')).toBeInTheDocument();
    expect(screen.getByText(/Udemy • 2023/i)).toBeInTheDocument();
    expect(
      screen.getByText('AWS Certified Cloud Practitioner'),
    ).toBeInTheDocument();
  });

  it('deve abrir o modal de nova certificação ao clicar no botão de adicionar', async () => {
    render(<CertificationListSection certifications={mockCertifications} />);

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    await userEvent.click(addButton);

    expect(screen.getByText('Nova Certificação')).toBeInTheDocument();
  });

  it('deve abrir o modal preenchido ao clicar no botão de editar', async () => {
    render(<CertificationListSection certifications={mockCertifications} />);

    const editButtons = screen.getAllByLabelText(/edit/i);
    await userEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Certificação')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do curso/i)).toHaveValue(
      'Angular Expert',
    );
  });

  it('deve chamar deleteSubItem ao confirmar a exclusão', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<CertificationListSection certifications={mockCertifications} />);

    // Queremos excluir o primeiro item da lista renderizada (2023 - id 2)
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteSubItem).toHaveBeenCalledWith(
        'certifications',
        'cert-2',
      );
    });

    expect(
      await screen.findByText(/certificação removida com sucesso/i),
    ).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('deve exibir mensagem de lista vazia', () => {
    render(<CertificationListSection certifications={[]} />);
    expect(
      screen.getByText(/nenhuma certificação cadastrada/i),
    ).toBeInTheDocument();
  });
});
