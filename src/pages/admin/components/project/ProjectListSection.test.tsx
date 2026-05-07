import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ProjectListSection } from './ProjectListSection';

vi.mock('../../../../context/PortfolioContext');
vi.mock('firebase/storage');
vi.mock('../../../../data/analytics.service');

const mockProjects = [
  {
    id: 'proj-1',
    name: 'Projeto Alfa',
    description: 'Descrição Alfa',
    technologies: ['React', 'NestJS'],
    image: 'http://alfa.jpg',
    images: [],
    githubLink: '',
    liveLink: '',
    order: 1,
    date: new Date(),
  },
];

describe('ProjectListSection & ProjectModal', () => {
  const mockSaveSubItem = vi.fn();
  const mockDeleteSubItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      user: { uid: 'user123' },
      saveSubItem: mockSaveSubItem,
      deleteSubItem: mockDeleteSubItem,
    });

    (uploadBytes as any).mockResolvedValue({});
    (getDownloadURL as any).mockResolvedValue(
      'http://firebase-storage.com/new-image.png',
    );
  });

  it('deve abrir o modal de "Novo Projeto" ao clicar no botão de adicionar', async () => {
    render(<ProjectListSection projects={mockProjects} />);

    const addButton = screen.getByRole('button', {
      name: /adicionar projeto/i,
    });
    await userEvent.click(addButton);

    expect(screen.getByText('Novo Projeto')).toBeInTheDocument();
  });

  it('deve realizar o upload da logo e salvar o projeto com sucesso', async () => {
    render(<ProjectListSection projects={mockProjects} />);

    await userEvent.click(
      screen.getByRole('button', { name: /adicionar projeto/i }),
    );

    await userEvent.type(screen.getByLabelText(/nome do projeto/i), 'Novo App');
    await userEvent.type(
      screen.getByLabelText(/tecnologias/i),
      'Angular, Ionic',
    );

    const file = new File(['image-content'], 'logo.png', { type: 'image/png' });

    const logoContainer = screen.getByText(/logo do projeto/i).closest('div');
    const input = within(logoContainer!).getByLabelText(/logo do projeto/i, {
      selector: 'input[type="file"]',
    });

    await userEvent.upload(input, file);

    const sendButton = within(logoContainer!).getByRole('button', {
      name: /enviar/i,
    });
    await userEvent.click(sendButton);

    await waitFor(() => {
      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
    });

    const saveButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveSubItem).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Novo App' }),
      );
      expect(
        screen.getByText(/projeto salvo com sucesso/i),
      ).toBeInTheDocument();
    });
  });

  it('deve excluir um projeto da lista ao clicar no botão de delete e confirmar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<ProjectListSection projects={mockProjects} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(
      () => {
        expect(mockDeleteSubItem).toHaveBeenCalledWith('projects', 'proj-1');
      },
      { timeout: 2000 },
    );
    confirmSpy.mockRestore();
  });
});
