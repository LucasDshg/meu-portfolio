import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as firebaseService from '../data/firebase.service';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

vi.mock('../data/firebase', () => ({
  auth: {},
}));

vi.mock('../data/firebase.service', () => ({
  getProfileByUid: vi.fn(),
  getSubCollectionItems: vi.fn(() => Promise.resolve([])),
  getProfileAndUidBySlug: vi.fn(),
  createInitialProfileDocument: vi.fn(),
  updateProfileDocument: vi.fn(),
  saveSubCollectionItem: vi.fn(),
  deleteSubCollectionItem: vi.fn(),
  deleteUserPortfolioData: vi.fn(),
  ECollection: {
    EXPERIENCES: 'experiences',
    PROJECTS: 'projects',
    CERTIFICATIONS: 'certifications',
    ARTICLES: 'articles',
  },
}));

const TestComponent = () => {
  const { profile, loading, articles, deleteAccount } = usePortfolio();
  if (loading) return <div data-testid="loading">Carregando...</div>;
  return (
    <div>
      <div data-testid="profile-name">{profile?.name}</div>
      <div data-testid="articles-count">{articles.length}</div>
      <button data-testid="delete-btn" onClick={() => deleteAccount()}>
        Excluir
      </button>
    </div>
  );
};

describe('PortfolioContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve iniciar em estado de loading', () => {
    (onAuthStateChanged as any).mockReturnValueOnce(vi.fn());

    vi.spyOn(firebaseService, 'getProfileAndUidBySlug').mockReturnValue(
      new Promise(() => {}),
    );

    render(
      <MemoryRouter initialEntries={['/u/lucas-slug']}>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('deve carregar dados do perfil quando um slug está presente na URL', async () => {
    const mockProfile = {
      name: 'Lucas Gomes',
      pages: { articles: { title: 'Blog' } },
    };

    vi.spyOn(firebaseService, 'getProfileAndUidBySlug').mockResolvedValue({
      profile: mockProfile as any,
      uid: 'user123',
    });

    vi.spyOn(firebaseService, 'getProfileByUid').mockResolvedValue(
      mockProfile as any,
    );

    render(
      <MemoryRouter initialEntries={['/u/lucas-slug']}>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-name')).toHaveTextContent(
        'Lucas Gomes',
      );
    });
  });

  it('deve carregar dados do usuário logado se não houver slug na URL', async () => {
    const mockUser = { uid: 'auth123', email: 'lucas@test.com' };
    const mockProfile = {
      name: 'Admin User',
      pages: { articles: { title: 'Blog' } },
    };

    (onAuthStateChanged as any).mockImplementationOnce(
      (auth: any, callback: any) => {
        callback(mockUser);
        return () => {};
      },
    );

    vi.spyOn(firebaseService, 'getProfileByUid').mockResolvedValue(
      mockProfile as any,
    );

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-name')).toHaveTextContent(
        'Admin User',
      );
    });
  });

  it('deve chamar os serviços de exclusão ao executar deleteAccount', async () => {
    const mockUser = {
      uid: 'auth123',
      delete: vi.fn().mockResolvedValue(undefined),
    };
    (onAuthStateChanged as any).mockImplementationOnce(
      (auth: any, callback: any) => {
        callback(mockUser);
        return () => {};
      },
    );
    const deleteSpy = vi
      .spyOn(firebaseService, 'deleteUserPortfolioData')
      .mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </MemoryRouter>,
    );

    await waitFor(() => fireEvent.click(screen.getByTestId('delete-btn')));

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('auth123');
      expect(mockUser.delete).toHaveBeenCalled();
    });
  });

  it('deve disparar erro se usePortfolio for usado fora do Provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'usePortfolio deve ser usado dentro de um PortfolioProvider',
    );

    consoleSpy.mockRestore();
  });
});
