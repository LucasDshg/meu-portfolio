import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NotFound from './NotFound';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Page: NotFound', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('deve renderizar o código 404 e a mensagem de erro', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('deve navegar para a página de login ao clicar no botão', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /ir para o início/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
