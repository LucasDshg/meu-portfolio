import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import { DangerZoneSection } from '../pages/admin/components/DangerZoneSection';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../data/analytics.service', () => ({
  logAppError: vi.fn(),
}));

describe('DangerZoneSection', () => {
  const mockDeleteAccount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      deleteAccount: mockDeleteAccount,
    });
  });

  it('deve renderizar o título e o botão de exclusão corretamente', () => {
    render(<DangerZoneSection />);
    expect(screen.getByText('Zona de Perigo')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    ).toBeInTheDocument();
  });

  it('não deve chamar deleteAccount se o usuário cancelar a confirmação nativa', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<DangerZoneSection />);

    fireEvent.click(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    );
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });

  it('deve chamar deleteAccount se o usuário confirmar a exclusão', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<DangerZoneSection />);

    fireEvent.click(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    );
    expect(mockDeleteAccount).toHaveBeenCalled();
  });

  it('deve exibir um toast de erro se a função deleteAccount falhar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockDeleteAccount.mockRejectedValue(new Error('Falha na exclusão'));
    render(<DangerZoneSection />);

    fireEvent.click(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    );

    expect(await screen.findByText('Falha na exclusão')).toBeInTheDocument();
  });
});
