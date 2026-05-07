import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperienceListSection } from './ExperienceListSection';

const mockDeleteSubItem = vi.fn();
vi.mock('../../../../context/PortfolioContext', () => ({
  usePortfolio: () => ({
    deleteSubItem: mockDeleteSubItem,
  }),
}));

describe('ExperienceListSection', () => {
  const mockExperiences = [
    {
      id: 'uuid-1',
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      duration: '2022 - Presente',
      description: 'Desenvolvimento Fullstack',
      technologies: ['React', 'NestJS'],
      date: new Date(),
    },
    {
      id: 'uuid-2',
      role: 'Frontend Developer',
      company: 'Startup X',
      duration: '2020 - 2022',
      description: 'Angular e UI/UX',
      technologies: ['React', 'NestJS'],
      date: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de experiências corretamente', () => {
    render(<ExperienceListSection experiences={mockExperiences} />);

    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(
      screen.getByText(/Tech Corp • 2022 - Presente/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('deve abrir o modal vazio ao clicar no botão de adicionar', async () => {
    render(<ExperienceListSection experiences={mockExperiences} />);

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    await userEvent.click(addButton);

    expect(screen.getByText(/nova experiência/i)).toBeInTheDocument();
  });

  it('deve abrir o modal com dados preenchidos ao clicar em editar', async () => {
    render(<ExperienceListSection experiences={mockExperiences} />);

    const editButtons = screen.getAllByLabelText(/edit/i);
    await userEvent.click(editButtons[0]);

    expect(screen.getByText(/editar experiência/i)).toBeInTheDocument();
  });

  it('deve chamar deleteSubItem e exibir toast de sucesso ao excluir uma experiência', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ExperienceListSection experiences={mockExperiences} />);

    const deleteButtons = screen.getAllByLabelText(/delete/i);
    await userEvent.click(deleteButtons[0]);

    await waitFor(
      () => {
        expect(mockDeleteSubItem).toHaveBeenCalledWith(
          'experiences',
          mockExperiences[0].id,
        );
      },
      { timeout: 2000 },
    );

    expect(
      await screen.findByText(/experiência removida com sucesso/i),
    ).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('deve exibir mensagem de lista vazia quando não houver experiências', () => {
    render(<ExperienceListSection experiences={[]} />);
    expect(
      screen.getByText(/nenhuma experiência cadastrada/i),
    ).toBeInTheDocument();
  });
});
