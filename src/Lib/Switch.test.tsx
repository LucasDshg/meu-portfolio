import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('deve renderizar o label corretamente', () => {
    render(<Switch label="Ativar Notificações" />);
    expect(screen.getByText('Ativar Notificações')).toBeInTheDocument();
  });

  it('deve iniciar desmarcado por padrão', () => {
    render(<Switch label="Toggle" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('deve iniciar marcado se defaultChecked for true', () => {
    render(<Switch label="Toggle" defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('deve alternar o valor ao ser clicado', () => {
    render(<Switch label="Toggle" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
