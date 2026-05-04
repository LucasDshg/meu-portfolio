import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutPageSection } from './AboutPageSection';

const mockAboutData = {
  name: 'Sobre',
  order: 2,
  show: true,
  title: 'Sobre mim',
  description: ['Parágrafo 1', 'Parágrafo 2'],
};

describe('AboutPageSection', () => {
  it('deve renderizar o switch de visibilidade com o estado correto', () => {
    render(<AboutPageSection data={mockAboutData} />);
    const switchElement = screen.getByLabelText(/Mostrar página no menu/i);
    expect(switchElement).toBeChecked();
  });

  it('deve renderizar um textarea para cada parágrafo da descrição', () => {
    render(<AboutPageSection data={mockAboutData} />);

    const desc1 = screen.getByDisplayValue('Parágrafo 1');
    const desc2 = screen.getByDisplayValue('Parágrafo 2');

    expect(desc1).toBeInTheDocument();
    expect(desc1).toHaveAttribute('name', 'about-description-1');
    expect(desc2).toBeInTheDocument();
    expect(desc2).toHaveAttribute('name', 'about-description-2');
  });

  it('deve exigir apenas o primeiro parágrafo como obrigatório', () => {
    render(<AboutPageSection data={mockAboutData} />);

    const desc1 = screen.getByDisplayValue('Parágrafo 1');
    const desc2 = screen.getByDisplayValue('Parágrafo 2');

    expect(desc1).toBeRequired();
    expect(desc2).not.toBeRequired();
  });
});
