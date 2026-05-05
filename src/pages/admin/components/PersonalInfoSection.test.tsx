import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../../../context/PortfolioContext';
import { PersonalInfoSection } from './PersonalInfoSection';

vi.mock('../../../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock('../../../data/firebase', () => ({
  storage: {},
}));

describe('PersonalInfoSection', () => {
  const mockProfile = {
    name: 'Lucas Gomes',
    slug: 'lucas-gomes',
    email: 'lucas@test.com',
    phone: '5527999999999',
    imageUrl: 'http://image.jpg',
    cvLink: 'http://cv.pdf',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      user: { uid: 'user123' },
    });
  });

  it('deve realizar o upload de imagem corretamente quando selecionada', async () => {
    render(<PersonalInfoSection profile={mockProfile as any} />);

    const file = new File(['hello'], 'profile.png', { type: 'image/png' });

    const input = screen.getByLabelText(/Foto de Perfil/i, {
      selector: 'input[type="file"]',
    });

    await userEvent.upload(input, file);

    const submitButton = await screen.findByRole('button', { name: /enviar/i });
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(uploadBytes).toHaveBeenCalled();
        expect(getDownloadURL).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });

  it('deve exibir erro se o usuário tentar fazer upload sem estar autenticado', async () => {
    (usePortfolio as any).mockReturnValue({ user: null });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<PersonalInfoSection profile={mockProfile as any} />);

    const file = new File(['pdf content'], 'cv.pdf', {
      type: 'application/pdf',
    });

    const input = screen.getByLabelText(/Currículo \(PDF\)/i, {
      selector: 'input[type="file"]',
    });

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(uploadBytes).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
