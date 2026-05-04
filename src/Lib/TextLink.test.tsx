import { render, screen } from '@testing-library/react';
import { RiBugLine } from 'react-icons/ri';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TextLink } from './TextLink';

describe('TextLink Component', () => {
  it('renderiza como um link externo (<a>) para URLs completas', () => {
    render(<TextLink href="https://google.com">Google</TextLink>);
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://google.com');
  });

  it('renderiza como componente Link do router para caminhos internos', () => {
    render(
      <BrowserRouter>
        <TextLink href="/dashboard">Dashboard</TextLink>
      </BrowserRouter>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('aplica estilos da variante "icon"', () => {
    const { container } = render(
      <MemoryRouter>
        <TextLink variant="icon" href="/#">
          <RiBugLine data-testid="icon" />
        </TextLink>
      </MemoryRouter>,
    );

    expect(container.firstChild).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
    );
  });
});
