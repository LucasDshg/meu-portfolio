import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExperiencePageSection } from './ExperiencePageSection';

describe('ExperiencePageSection', () => {
  const mockExperienceData = {
    name: 'Experiência',
    order: 1,
    show: true,
    title: 'Minha Trajetória Profissional',
    description: 'Experiência como Senior Software Engineer.',
    disponibleText: 'Atualmente focado em projetos full-stack.',
  };

  it('deve renderizar todos os campos com os valores iniciais passados via data', () => {
    render(<ExperiencePageSection data={mockExperienceData} />);

    const switchElement = screen.getByRole('checkbox', {
      name: /mostrar página no menu/i,
    });
    expect(switchElement).toBeChecked();

    const titleInput = screen.getByLabelText(/título/i);
    expect(titleInput).toHaveValue(mockExperienceData.title);
    expect(titleInput).toHaveAttribute(
      'placeholder',
      'Título da página de Experiência',
    );

    const descriptionTextarea = screen.getByLabelText(/descrição/i);
    expect(descriptionTextarea).toHaveValue(mockExperienceData.description);

    const availabilityTextarea = screen.getByLabelText(
      /texto de disponibilidade/i,
    );
    expect(availabilityTextarea).toHaveValue(mockExperienceData.disponibleText);
    expect(availabilityTextarea).toHaveAttribute(
      'placeholder',
      'Ex: Disponível para novos desafios',
    );
  });

  it('deve renderizar campos com valores padrão vazios quando data for undefined', () => {
    render(<ExperiencePageSection data={undefined} />);

    expect(
      screen.getByRole('checkbox', { name: /mostrar página no menu/i }),
    ).not.toBeChecked();
    expect(screen.getByLabelText(/título/i)).toHaveValue('');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('');
    expect(screen.getByLabelText(/texto de disponibilidade/i)).toHaveValue('');
  });

  it('deve validar se os campos essenciais possuem o atributo required', () => {
    render(<ExperiencePageSection data={mockExperienceData} />);

    expect(screen.getByLabelText(/título/i)).toBeRequired();
    expect(screen.getByLabelText(/descrição/i)).toBeRequired();
    expect(screen.getByLabelText(/texto de disponibilidade/i)).toBeRequired();
  });
});
