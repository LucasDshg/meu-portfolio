import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import { ProPlanCard } from './ProPlanCard';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../data/analytics.service', () => ({
  logInteraction: vi.fn(),
}));

describe('ProPlanCard', () => {
  const mockFetchData = vi.fn();
  const mockProfile = {
    slug: 'lucas-gomes',
    adFreeUntil: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      fetchData: mockFetchData,
    });
  });

  it('deve renderizar a oferta do plano pro quando não estiver ativo', () => {
    render(<ProPlanCard profile={mockProfile as any} />);
    expect(screen.getByText('Plano Pro')).toBeInTheDocument();
    expect(screen.getByText(/Remova todos os anúncios/i)).toBeInTheDocument();
  });

  it('deve mostrar a data de validade quando o plano estiver ativo', () => {
    const activeDate = new Date();
    activeDate.setFullYear(activeDate.getFullYear() + 1);

    const activeProfile = { ...mockProfile, adFreeUntil: activeDate };
    render(<ProPlanCard profile={activeProfile as any} />);

    expect(
      screen.getByText(/Sua assinatura está ativa até/i),
    ).toBeInTheDocument();
  });

  it('deve alternar para o modo de validação após clicar em ativar', async () => {
    render(<ProPlanCard profile={mockProfile as any} />);

    fireEvent.click(screen.getByText('Ativar Plano Pro'));

    expect(screen.getByText('Pagamento realizado?')).toBeInTheDocument();

    const validateBtn = screen.getByText('Validar Pagamento');
    fireEvent.click(validateBtn);

    expect(validateBtn).toBeDisabled();
    expect(screen.getByText('Validando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalled();
    });
  });
});
