import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ExperienceSection from './ExperienceSection';

const mockExperiences = [
  {
    id: '1',
    role: 'Dev 1',
    duration: '2020-2021',
    description: 'Desc 1',
    company: 'Tech Corp',
    technologies: ['React'],
    date: new Date(),
  },
  {
    id: '2',
    role: 'Dev 2',
    duration: '2021-2022',
    company: 'Tech Corp',
    description: 'Desc 2',
    technologies: ['Angular'],
    date: new Date(),
  },
  {
    id: '3',
    role: 'Dev 3',
    company: 'Tech Corp',
    duration: '2022-2023',
    description: 'Desc 3',
    technologies: ['NestJS'],
    date: new Date(),
  },
];

describe('ExperienceSection', () => {
  it('deve renderizar apenas as 2 primeiras experiências', () => {
    render(
      <MemoryRouter>
        <ExperienceSection experiences={mockExperiences} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dev 1')).toBeInTheDocument();
    expect(screen.getByText('Dev 2')).toBeInTheDocument();
    expect(screen.queryByText('Dev 3')).not.toBeInTheDocument();
  });

  it('deve renderizar as tecnologias de cada experiência', () => {
    render(
      <MemoryRouter>
        <ExperienceSection experiences={[mockExperiences[0]]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
