import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectPageSection } from './ProjectPageSection';

describe('ProjectPageSection', () => {
  const mockData = {
    show: true,
    name: 'Projetos',
    order: 3,
    title: 'Meus Projetos Técnicos',
    description: 'Lista de projetos desenvolvidos com Angular e NestJS',
  };

  it('deve renderizar todos os campos com os valores iniciais corretos', () => {
    render(<ProjectPageSection data={mockData} />);

    const switchElement = screen.getByRole('checkbox', {
      name: /mostrar página no menu/i,
    });
    expect(switchElement).toBeChecked();

    const titleInput = screen.getByLabelText(/título/i);
    expect(titleInput).toHaveValue(mockData.title);
    expect(titleInput).toHaveAttribute(
      'placeholder',
      'Título da página de Projetos',
    );

    const descriptionTextarea = screen.getByLabelText(/descrição/i);
    expect(descriptionTextarea).toHaveValue(mockData.description);
    expect(descriptionTextarea).toHaveAttribute(
      'placeholder',
      'Resumo dos projetos',
    );
  });

  it('deve renderizar campos vazios quando não houver dados (data undefined)', () => {
    render(<ProjectPageSection data={undefined} />);

    expect(
      screen.getByRole('checkbox', { name: /mostrar página no menu/i }),
    ).not.toBeChecked();
    expect(screen.getByLabelText(/título/i)).toHaveValue('');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('');
  });

  it('deve garantir que os campos obrigatórios possuam o atributo required', () => {
    render(<ProjectPageSection data={mockData} />);

    expect(screen.getByLabelText(/título/i)).toBeRequired();
    expect(screen.getByLabelText(/descrição/i)).toBeRequired();
  });
});
