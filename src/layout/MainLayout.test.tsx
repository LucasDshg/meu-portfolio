import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import MainLayout from './MainLayout';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../components/Header', () => ({
  default: () => <header data-testid="mock-header" />,
}));
vi.mock('../components/Footer', () => ({
  default: () => <footer data-testid="mock-footer" />,
}));
vi.mock('../components/LoadingPage', () => ({
  LoadingPage: () => <div data-testid="loading-page" />,
}));
vi.mock('./AdUnit', () => ({
  AdUnit: ({ slot }: { slot: string }) => (
    <div data-testid={`ad-unit-${slot}`} />
  ),
}));

vi.mock('../data/analytics.service', () => ({
  logPageView: vi.fn(),
}));

describe('MainLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
      })),
    });
  });

  it('deve renderizar a LoadingPage quando loading estiver true', () => {
    (usePortfolio as any).mockReturnValue({
      loading: true,
      profile: null,
    });

    render(
      <MemoryRouter>
        <MainLayout>Content</MainLayout>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();
  });

  it('deve renderizar Header e Footer quando não estiver na página de login e tiver perfil', () => {
    (usePortfolio as any).mockReturnValue({
      loading: false,
      profile: { name: 'Test User' },
    });

    render(
      <MemoryRouter initialEntries={['/u/test-user']}>
        <MainLayout>
          <div>Main Content</div>
        </MainLayout>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('NÃO deve renderizar Header e Footer na página de login', () => {
    (usePortfolio as any).mockReturnValue({
      loading: false,
      profile: { name: 'Test User' },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <MainLayout>Login Form</MainLayout>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('deve aplicar a classe "dark" no documento se darkMode estiver ativo', () => {
    Storage.prototype.getItem = vi.fn(() => 'dark');

    (usePortfolio as any).mockReturnValue({
      loading: false,
      profile: {},
    });

    render(
      <MemoryRouter>
        <MainLayout>Content</MainLayout>
      </MemoryRouter>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
