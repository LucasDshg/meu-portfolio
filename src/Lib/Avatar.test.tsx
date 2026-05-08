import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  it('deve renderizar uma imagem quando a prop src é fornecida', () => {
    const src = 'https://example.com/avatar.jpg';
    const alt = 'User Photo';

    render(<Avatar src={src} alt={alt} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', src);
    expect(img).toHaveAttribute('alt', alt);
  });

  it('deve renderizar as iniciais quando a prop src não é fornecida', () => {
    const initials = 'JD';

    render(<Avatar initials={initials} />);

    expect(screen.getByText(initials)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('deve aplicar classes CSS personalizadas via prop className', () => {
    const customClass = 'custom-size';

    const { container } = render(<Avatar className={customClass} />);

    const avatarContainer = container.querySelector('[data-slot="avatar"]');

    expect(avatarContainer).toHaveClass(customClass);
    expect(avatarContainer).toHaveClass('inline-flex');
  });
  it('deve repassar atributos adicionais (props) para o elemento span', () => {
    render(<Avatar id="avatar-test" aria-label="user-avatar" />);

    const avatarContainer = screen.getByLabelText('user-avatar');
    expect(avatarContainer).toHaveAttribute('id', 'avatar-test');
  });
});
