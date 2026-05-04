import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialSection } from './SocialSection';

const mockSocials = [
  { id: '1', name: 'LinkedIn', link: 'linkedin.com/in/lucas', order: 2 },
  { id: '2', name: 'GitHub', link: 'github.com/lucas', order: 1 },
];

describe('SocialSection', () => {
  it('deve renderizar os inputs sociais ordenados pelo campo order', () => {
    render(<SocialSection socials={mockSocials} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('value', 'github.com/lucas');
    expect(inputs[1]).toHaveAttribute('value', 'linkedin.com/in/lucas');
  });

  it('deve exibir o label correto para cada rede social', () => {
    render(<SocialSection socials={mockSocials} />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });
});
