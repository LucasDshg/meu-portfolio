import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs Component', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div data-testid="content1">Content 1</div>,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div data-testid="content2">Content 2</div>,
    },
  ];

  it('deve renderizar todos os labels das abas', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('deve exibir o conteúdo da primeira aba por padrão', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByTestId('content1')).toBeVisible();
    expect(screen.getByTestId('content2').parentElement).toHaveClass('hidden');
  });

  it('deve trocar o conteúdo ao clicar em uma nova aba', () => {
    render(<Tabs tabs={mockTabs} />);
    fireEvent.click(screen.getByText('Tab 2'));

    expect(screen.getByTestId('content2').parentElement).not.toHaveClass(
      'hidden',
    );
    expect(screen.getByTestId('content1').parentElement).toHaveClass('hidden');
  });

  it('deve aplicar classes de estilo ativas no botão selecionado', () => {
    render(<Tabs tabs={mockTabs} />);
    const tab1 = screen.getByRole('button', { name: 'Tab 1' });
    expect(tab1).toHaveClass('text-teal-700');
  });
});
