import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HeroSection from './HeroSection';

const mockHeroProps = {
  title: 'Senior Software Engineer',
  description: 'Desenvolvedor Full Stack',
  imageUrl: 'perfil.jpg',
  email: 'test@example.com',
  name: 'Test',
  socials: [{ id: '1', name: 'GitHub', link: 'github.com', order: 1 }],
};

describe('HeroSection', () => {
  it('deve renderizar o título e a descrição corretamente', () => {
    render(<HeroSection {...mockHeroProps} />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor Full Stack')).toBeInTheDocument();
  });

  it('deve exibir botão de WhatsApp se o telefone for fornecido', () => {
    render(<HeroSection {...mockHeroProps} phone="5527999999999" />);
    const link = screen.getByRole('link', { name: /entre em contato/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/5527999999999');
  });

  it('deve exibir botão de Email se o telefone não for fornecido', () => {
    render(<HeroSection {...mockHeroProps} />);
    const link = screen.getByRole('link', { name: /mandar email/i });
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });
});
