import { AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react';
import {
  RiFileTextLine,
  RiImageLine,
  RiLoader4Line,
  RiUpload2Line,
} from 'react-icons/ri';
import { Toast } from './Toast';

interface IFileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File) => Promise<string>;
  initialUrl?: string;
  className?: string;
  name?: string;
  id?: string;
}

export const FileUpload: React.FC<IFileUploadProps> = ({
  label,
  accept,
  onFileSelect,
  initialUrl,
  className = '',
  id,
  name,
}) => {
  const [url, setUrl] = useState<string | undefined>(initialUrl);
  const [prevInitialUrl, setPrevInitialUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (initialUrl !== prevInitialUrl) {
    setPrevInitialUrl(initialUrl);
    setUrl(initialUrl);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage =
        accept?.includes('image') && file.type.startsWith('image/');
      const isPdf = accept?.includes('.pdf') && file.type === 'application/pdf';

      if (accept && !isImage && !isPdf) {
        setToast({
          message: `Tipo de arquivo inválido. Use apenas ${accept.includes('image') ? 'Imagens' : ''}${accept.includes('image') && accept.includes('pdf') ? ' ou ' : ''}${accept.includes('pdf') ? 'PDF' : ''}.`,
          type: 'error',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setToast({
          message: 'Arquivo muito grande (máximo 5MB).',
          type: 'error',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const downloadUrl = await onFileSelect(selectedFile);
      setUrl(downloadUrl);
      setSelectedFile(null);
      setToast({ message: 'Upload concluído com sucesso!', type: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
      setToast({ message: 'Falha ao enviar arquivo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 
            bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm cursor-pointer
            transition-all hover:border-teal-500 dark:hover:border-teal-400
            ${loading ? 'opacity-70 cursor-wait' : ''}
          `}
        >
          <div className="flex-none text-zinc-400 group-hover:text-teal-500 transition-colors">
            {loading ? (
              <RiLoader4Line className="animate-spin size-5" />
            ) : accept?.includes('image') ? (
              <RiImageLine className="size-5" />
            ) : (
              <RiFileTextLine className="size-5" />
            )}
          </div>

          <div className="flex-1 truncate text-xs sm:text-sm font-normal">
            {selectedFile ? (
              <span className="text-teal-600 dark:text-teal-400 font-medium italic">
                Aguardando envio: {selectedFile.name}
              </span>
            ) : url ? (
              <span className="text-zinc-600 dark:text-zinc-400">{url}</span>
            ) : (
              <span className="text-zinc-400 italic">
                Clique para selecionar...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedFile && !loading && (
              <button
                type="button"
                onClick={handleUpload}
                className="bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Enviar
              </button>
            )}
            <div className="flex-none bg-zinc-50 dark:bg-zinc-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {loading ? 'Enviando' : <RiUpload2Line className="size-3" />}
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          id={inputId}
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        <input type="hidden" name={name} value={url || ''} />
      </div>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
