import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import Home from './Home';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('Page: Home', () => {
  it('deve retornar null se estiver carregando', () => {
    (usePortfolio as any).mockReturnValue({ loading: true });
    const { container } = render(<Home />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar as seções principais quando os dados carregarem', () => {
    (usePortfolio as any).mockReturnValue({
      loading: false,
      profile: {
        name: 'Lucas',
        imageUrl: 'img.jpg',
        pages: { home: { title: 'Olá', description: 'Dev' } },
      },
      projects: [],
      articles: [],
      experiences: [],
    });

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
