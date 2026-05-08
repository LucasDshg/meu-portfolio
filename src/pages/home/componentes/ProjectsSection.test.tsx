import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProjectsSection from './ProjectsSection';

const mockProjects = [
  {
    id: '1',
    name: 'Projeto A',
    description: 'Desc A',
    image: 'a.jpg',
    technologies: ['TS'],
    githubLink: 'git.com',
    liveLink: 'live.link.com',
    order: 1,
    date: new Date(),
  },
];

describe('ProjectsSection', () => {
  it('deve renderizar o card do projeto com o link do GitHub', () => {
    render(
      <MemoryRouter initialEntries={['/u/lucas-dev']}>
        <ProjectsSection projects={mockProjects} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Projeto A')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'git.com',
    );
  });

  it('deve conter o link para ver todos os projetos com o slug correto', () => {
    render(
      <MemoryRouter initialEntries={['/u/lucas-dev']}>
        <ProjectsSection projects={mockProjects} />
      </MemoryRouter>,
    );

    const seeAllLink = screen.getByRole('link', {
      name: /ver todaos os projetos/i,
    });

    expect(seeAllLink).toHaveAttribute('href', '/u/lucas-dev/project');
  });
});
