import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RiCodeSSlashLine } from 'react-icons/ri';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { ECollection } from '../../../../data/firebase.service';
import { IProject } from '../../../../interface/project.interface';
import { Toast } from '../../../../Lib/Toast';
import { AdminListSection } from '../AdminListSection';
import { ProjectModal } from './ProjectModal';

interface IProjectListSectionProps {
  projects: IProject[];
}

// eslint-disable-next-line no-undef
export const ProjectListSection: React.FC<IProjectListSectionProps> = ({
  projects,
}) => {
  const { deleteSubItem } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IProject | undefined>(
    undefined,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteSubItem(ECollection.PROJECTS, id);
      setToast({ message: 'Projeto removido com sucesso!', type: 'success' });
    } catch (error) {
      logAppError('ProjectList_Delete', error);
      setToast({ message: 'Erro ao remover projeto.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <AdminListSection
        title="Projetos"
        icon={RiCodeSSlashLine}
        addButtonLabel="Adicionar Projeto"
        items={[...(projects || [])].sort((a, b) => b.id - a.id)}
        emptyMessage="Nenhum projeto cadastrado."
        onAdd={() => {
          setEditingItem(undefined);
          setIsModalOpen(true);
        }}
        onEdit={(project) => {
          setEditingItem(project);
          setIsModalOpen(true);
        }}
        onDelete={(project) => handleDelete(project.id)}
        renderItemTitle={(project) => project.name}
        renderItemSubtitle={(project) =>
          project.technologies.slice(0, 3).join(', ') +
          (project.technologies.length > 3 ? '...' : '')
        }
        deleteConfirmationMessage="Excluir projeto?"
      />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingItem}
        setToast={setToast}
      />

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
