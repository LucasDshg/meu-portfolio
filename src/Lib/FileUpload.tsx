import React, { useRef, useState } from "react";
import {
  RiFileTextLine,
  RiImageLine,
  RiLoader4Line,
  RiUpload2Line,
} from "react-icons/ri";

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File) => Promise<string>;
  initialUrl?: string;
  className?: string;
  name?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onFileSelect,
  initialUrl,
  className = "",
  name,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const downloadUrl = await onFileSelect(file);
      setUrl(downloadUrl);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Erro ao enviar arquivo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 
            bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm cursor-pointer
            transition-all hover:border-teal-500 dark:hover:border-teal-400
            ${loading ? "opacity-70 cursor-wait" : ""}
          `}
        >
          <div className="flex-none text-zinc-400 group-hover:text-teal-500 transition-colors">
            {loading ? (
              <RiLoader4Line className="animate-spin size-5" />
            ) : accept?.includes("image") ? (
              <RiImageLine className="size-5" />
            ) : (
              <RiFileTextLine className="size-5" />
            )}
          </div>

          <div className="flex-1 truncate text-xs sm:text-sm font-normal">
            {url ? (
              <span className="text-zinc-600 dark:text-zinc-400">{url}</span>
            ) : (
              <span className="text-zinc-400 italic">
                Clique para selecionar...
              </span>
            )}
          </div>

          <div className="flex-none bg-zinc-50 dark:bg-zinc-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {loading ? "Enviando" : <RiUpload2Line className="size-3" />}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        <input type="hidden" name={name} value={url || ""} />
      </div>
    </div>
  );
};
