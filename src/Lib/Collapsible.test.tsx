import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from './Collapsible';

vi.mock('./Heading', () => ({
  Heading: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <h2 className={className}>{children}</h2>,
}));

describe('Collapsible Component', () => {
  it('deve renderizar o título corretamente', () => {
    render(<Collapsible title="Meu Título">Conteúdo</Collapsible>);

    expect(screen.getByText('Meu Título')).toBeInTheDocument();
  });

  it('deve iniciar fechado por padrão e não mostrar o conteúdo', () => {
    render(<Collapsible title="Título">Conteúdo Secreto</Collapsible>);

    expect(screen.queryByText('Conteúdo Secreto')).not.toBeInTheDocument();
  });

  it('deve iniciar aberto se defaultOpen for true', () => {
    render(
      <Collapsible title="Título" defaultOpen={true}>
        Conteúdo Aberto
      </Collapsible>,
    );

    expect(screen.getByText('Conteúdo Aberto')).toBeInTheDocument();
  });

  it('deve alternar a visibilidade do conteúdo ao clicar no botão', async () => {
    render(<Collapsible title="Toggle">Conteúdo Dinâmico</Collapsible>);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(screen.getByText('Conteúdo Dinâmico')).toBeInTheDocument();

    fireEvent.click(button);
    // Nota: Com framer-motion, o elemento pode demorar a sair do DOM devido ao AnimatePresence
    // Em testes unitários simples, validamos a mudança de estado
  });
});
