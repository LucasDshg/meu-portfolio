import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { storage } from '../../../../data/firebase';
import { ECollection } from '../../../../data/firebase.service';
import { IProject } from '../../../../interface/project.interface';
import { Button } from '../../../../Lib/Button';
import { FileUpload } from '../../../../Lib/FileUpload';
import { Input } from '../../../../Lib/Input';
import { Modal } from '../../../../Lib/Modal';
import { Textarea } from '../../../../Lib/Textarea';

interface IProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: IProject;
}

export const ProjectModal: React.FC<IProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { saveSubItem, user } = usePortfolio();
  const [formData, setFormData] = useState<Partial<IProject>>({});
  const [prevProjectId, setPrevProjectId] = useState<
    string | number | undefined
  >(undefined);

  if (isOpen && project?.id !== prevProjectId) {
    setPrevProjectId(project?.id);
    setFormData(
      project || {
        name: '',
        description: '',
        technologies: [],
        githubLink: '',
        liveLink: '',
        images: [],
        image: '',
      },
    );
  }

  const handleUpload = async (
    file: File,
    fileName: string,
  ): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');
    const projectId = project?.id || Date.now();
    const extension = file.name.split('.').pop();
    const path = `${user.uid}/projects/${projectId}/${fileName}.${extension}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemToSave = {
        ...formData,
        technologies: Array.isArray(formData.technologies)
          ? formData.technologies
          : (formData.technologies as unknown as string)
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
        images: (formData.images || []).filter(Boolean),
        id: project?.id || Date.now(),
      };

      await saveSubItem(ECollection.PROJECTS, itemToSave);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Projeto' : 'Novo Projeto'}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome do Projeto"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Tecnologias (Separadas por vírgula)"
            value={
              Array.isArray(formData.technologies)
                ? formData.technologies.join(', ')
                : ''
            }
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value as any })
            }
            required
          />
          <Input
            label="Link GitHub"
            value={formData.githubLink || ''}
            onChange={(e) =>
              setFormData({ ...formData, githubLink: e.target.value })
            }
          />
          <Input
            label="Link Live Demo"
            value={formData.liveLink || ''}
            onChange={(e) =>
              setFormData({ ...formData, liveLink: e.target.value })
            }
          />
        </div>

        <div className="space-y-4">
          <FileUpload
            label="Logo do Projeto"
            accept="image/*"
            initialUrl={formData.image || ''}
            onFileSelect={async (file) => {
              const url = await handleUpload(file, 'logo');
              setFormData((prev) => ({ ...prev, image: url }));
              return url;
            }}
          />
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
              Imagens de Apresentação (Carrossel)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <FileUpload
                  key={i}
                  label={`Imagem ${i + 1}`}
                  accept="image/*"
                  initialUrl={formData.images?.[i] || ''}
                  onFileSelect={async (file) => {
                    const url = await handleUpload(file, `carousel-${i}`);
                    const newImages = [...(formData.images || [])];
                    newImages[i] = url;
                    setFormData((prev) => ({ ...prev, images: newImages }));
                    return url;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <Textarea
          label="Descrição"
          value={formData.description || ''}
          rows={6}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
};
