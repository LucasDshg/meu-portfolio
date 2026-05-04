import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePageSection } from './HomePageSection';

const mockHomeData = {
  name: 'Home',
  show: true,
  order: 1,
  title: 'Senior Software Engineer',
  description: 'Especialista em Angular e NestJS',
};

describe('HomePageSection', () => {
  it('deve carregar os dados iniciais nos campos de título e descrição', () => {
    render(<HomePageSection data={mockHomeData} />);

    const titleInput = screen.getByLabelText(/Título \(Hero\)/i);
    const descTextarea = screen.getByDisplayValue(
      'Especialista em Angular e NestJS',
    );

    expect(titleInput).toHaveValue('Senior Software Engineer');
    expect(descTextarea).toBeInTheDocument();
  });

  it('deve marcar os campos como obrigatórios', () => {
    render(<HomePageSection data={mockHomeData} />);

    const titleInput = screen.getByLabelText(/Título/i);

    const descByAttribute = document.querySelector(
      'textarea[name="home-description"]',
    );

    expect(titleInput).toBeRequired();
    expect(descByAttribute).toBeRequired();
  });
});
