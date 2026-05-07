import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import Experience from './Experience';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('Page: Experience', () => {
  const mockData = {
    profile: {
      email: 'teste@dev.com',
      cvLink: 'link-cv.pdf',
      pages: {
        experience: {
          title: 'Trajetória',
          description: 'Minha história',
          disponibleText: 'Livre',
        },
      },
    },
    experiences: [
      {
        id: '1',
        role: 'Dev Senior',
        company: 'Tech Corp',
        duration: '2020-2024',
        description: 'Deveres',
        technologies: ['React', 'Node'],
      },
    ],
  };

  it('deve renderizar experiências e informações de contato', () => {
    (usePortfolio as any).mockReturnValue(mockData);

    render(
      <MemoryRouter>
        <Experience />
      </MemoryRouter>,
    );

    expect(screen.getByText('Trajetória')).toBeInTheDocument();
    expect(screen.getByText('Dev Senior')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /enviar email/i })).toHaveAttribute(
      'href',
      'mailto:teste@dev.com',
    );
  });
});
