import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../context/PortfolioContext';
import Projects from './Projects';

vi.mock('../context/PortfolioContext', () => ({
  usePortfolio: vi.fn(),
}));

describe('Page: Projects', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const mockProjects = [
    {
      id: '1',
      name: 'Projeto Teste',
      description: 'Descrição do projeto teste',
      technologies: ['React', 'TypeScript'],
      images: ['img1.jpg', 'img2.jpg'],
      githubLink: 'https://github.com',
      liveLink: 'https://live.com',
    },
  ];

  const mockProfile = {
    pages: {
      project: { title: 'Meus Projetos', description: 'Intro projetos' },
    },
  };

  it('deve renderizar o título e a lista de projetos', () => {
    (usePortfolio as any).mockReturnValue({
      projects: mockProjects,
      profile: mockProfile,
    });

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    expect(screen.getByText('Meus Projetos')).toBeInTheDocument();
    expect(screen.getByText('Projeto Teste')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
