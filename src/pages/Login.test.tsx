import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Login from './Login';

// Mock do Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Page: Login', () => {
  it('deve permitir preencher email e senha e submeter o login', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitBtn = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'admin@dev.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('deve alternar entre modo de Login e Cadastro', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const toggleBtn = screen.getByText(/não tem uma conta\? cadastre-se/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /criar conta/i }),
    ).toBeInTheDocument();
  });
});
