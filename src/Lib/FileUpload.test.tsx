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

  it('deve mostrar erro ao selecionar um tipo de arquivo não permitido', () => {
    const { container } = render(
      <FileUpload
        label="Upload"
        accept="image/*"
        onFileSelect={mockOnFileSelect}
      />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    // Tentando subir um arquivo de texto quando o accept é apenas imagens
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByTestId('toast')).toHaveTextContent(
      /Tipo de arquivo inválido/i,
    );
    expect(screen.queryByText(/Aguardando envio/i)).not.toBeInTheDocument();
  });

  it('deve mostrar erro ao selecionar um arquivo maior que 5MB', () => {
    const { container } = render(
      <FileUpload label="Upload" onFileSelect={mockOnFileSelect} />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const largeFile = new File([''], 'large-image.png', { type: 'image/png' });

    // Mockando a propriedade size do arquivo para 6MB
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(screen.getByTestId('toast')).toHaveTextContent(
      /Arquivo muito grande/i,
    );
    expect(screen.queryByText(/Aguardando envio/i)).not.toBeInTheDocument();
  });

  it('deve remover a URL e limpar o valor do input ao clicar no botão de lixeira', () => {
    const { container } = render(
      <FileUpload
        label="Upload"
        onFileSelect={mockOnFileSelect}
        initialUrl="url-antiga.jpg"
        name="profileImage"
      />,
    );

    expect(screen.getByText('url-antiga.jpg')).toBeInTheDocument();

    const removeButton = screen.getByTitle(/remover arquivo/i);
    fireEvent.click(removeButton);

    expect(screen.queryByText('url-antiga.jpg')).not.toBeInTheDocument();
    const hiddenInput = container.querySelector(
      'input[name="profileImage"]',
    ) as HTMLInputElement;
    expect(hiddenInput.value).toBe('');
  });
});
