import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RiBriefcaseLine } from 'react-icons/ri';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { ECollection } from '../../../../data/firebase.service';
import { IExperience } from '../../../../interface/experience.interface';
import { Toast } from '../../../../Lib/Toast';
import { AdminListSection } from '../AdminListSection';
import { ExperienceModal } from './ExperienceModal';

interface IExperienceListSectionProps {
  experiences: IExperience[];
}

// eslint-disable-next-line no-undef
export const ExperienceListSection: React.FC<IExperienceListSectionProps> = ({
  experiences,
}) => {
  const { deleteSubItem } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IExperience | undefined>(
    undefined,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleEdit = (exp: IExperience) => {
    setEditingItem(exp);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteSubItem(ECollection.EXPERIENCES, id);
      setToast({
        message: 'Experiência removida com sucesso!',
        type: 'success',
      });
    } catch (error) {
      logAppError('ExperienceList_Delete', error);
      setToast({ message: 'Erro ao remover experiência.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <AdminListSection
        title="Experiências Profissionais"
        icon={RiBriefcaseLine}
        addButtonLabel="Adicionar"
        items={[...(experiences || [])].sort((a, b) => b.id - a.id)}
        emptyMessage="Nenhuma experiência cadastrada."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(exp) => handleDelete(exp.id)}
        renderItemTitle={(exp) => exp.role}
        renderItemSubtitle={(exp) => `${exp.company} • ${exp.duration}`}
        deleteConfirmationMessage="Excluir experiência?"
      />

      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={editingItem}
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
