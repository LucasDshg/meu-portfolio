import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

vi.mock('./Toast', () => ({
  Toast: ({ message }: { message: string }) => (
    <div data-testid="toast">{message}</div>
  ),
}));

describe('FileUpload Component', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o label corretamente', () => {
    render(
      <FileUpload label="Foto de Perfil" onFileSelect={mockOnFileSelect} />,
    );

    expect(screen.getByText('Foto de Perfil')).toBeInTheDocument();
  });

  it('deve permitir a seleção de um arquivo', () => {
    const { container } = render(
      <FileUpload label="Upload" onFileSelect={mockOnFileSelect} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText(/Aguardando envio: hello.png/i),
    ).toBeInTheDocument();
  });

  it('deve chamar onFileSelect e mostrar sucesso ao clicar em Enviar', async () => {
    mockOnFileSelect.mockResolvedValue('https://fakeurl.com/hello.png');

    const { container } = render(
      <FileUpload label="Upload" onFileSelect={mockOnFileSelect} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);

    await waitFor(() => {
      expect(screen.getByTestId('toast')).toHaveTextContent(
        'Upload concluído com sucesso!',
      );
    });
  });

  it('deve mostrar erro se o upload falhar', async () => {
    mockOnFileSelect.mockRejectedValue(new Error('Falha'));

    const { container } = render(
      <FileUpload label="Upload" onFileSelect={mockOnFileSelect} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File([''], 'test.jpg')] },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByTestId('toast')).toHaveTextContent(
        'Falha ao enviar arquivo.',
      );
    });
  });

  it('deve atualizar a URL exibida quando o initialUrl mudar', () => {
    const { rerender } = render(
      <FileUpload
        label="Upload"
        onFileSelect={mockOnFileSelect}
        initialUrl="url-1.jpg"
      />,
    );

    expect(screen.getByText('url-1.jpg')).toBeInTheDocument();

    rerender(
      <FileUpload
        label="Upload"
        onFileSelect={mockOnFileSelect}
        initialUrl="url-2.jpg"
      />,
    );

    expect(screen.getByText('url-2.jpg')).toBeInTheDocument();
  });
});
