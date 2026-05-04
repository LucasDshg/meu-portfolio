import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import Admin from './Admin';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Page: Admin', () => {
  const mockUpdateProfile = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('deve redirecionar para /login se o usuário não estiver autenticado', () => {
    (usePortfolio as any).mockReturnValue({
      user: null,
      loading: false,
      profile: null,
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve chamar updateProfile ao submeter o formulário de salvar', async () => {
    (usePortfolio as any).mockReturnValue({
      user: { uid: '123' },
      loading: false,
      profile: {
        name: 'Lucas',
        socials: [],
        pages: {
          home: { title: 'Home', description: 'Desc' },
          about: { title: 'Sobre', description: ['D1'], show: true },
          experience: {
            title: 'Exp',
            description: 'D',
            disponibleText: 'S',
            show: true,
          },
          project: { title: 'Proj', description: 'D', show: true },
          articles: { title: 'Art', description: 'D', show: true },
        },
      },
      updateProfile: mockUpdateProfile,
    });

    const { container } = render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>,
    );

    const form = container.querySelector('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/configurações salvas com sucesso/i),
    ).toBeInTheDocument();
  });
});
