import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RiAwardLine } from 'react-icons/ri';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { ECollection } from '../../../../data/firebase.service';
import { ICertifications } from '../../../../interface/certifications.interface';
import { Toast } from '../../../../Lib/Toast';
import { AdminListSection } from '../AdminListSection';
import { CertificationModal } from './CertificationModal';

export const CertificationListSection = ({
  certifications,
}: {
  certifications: ICertifications[];
}) => {
  const { deleteSubItem } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ICertifications | undefined>(
    undefined,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleEdit = (cert: ICertifications) => {
    setEditingItem(cert);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubItem(ECollection.CERTIFICATIONS, id);
      setToast({
        message: 'Certificação removida com sucesso!',
        type: 'success',
      });
    } catch (error) {
      logAppError('ExperienceCertificação_Remove', error);
      setToast({ message: 'Erro ao remover certificação.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <AdminListSection
        title="Certificações"
        icon={RiAwardLine}
        addButtonLabel="Adicionar"
        items={[...(certifications || [])].sort((a, b) => b.year - a.year)}
        emptyMessage="Nenhuma certificação cadastrada."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(cert) => handleDelete(cert.id)}
        renderItemTitle={(cert) => cert.name}
        renderItemSubtitle={(cert) => `${cert.institution} • ${cert.year}`}
        deleteConfirmationMessage="Excluir certificação?"
      />

      <CertificationModal
        isOpen={isModalOpen}
        setToast={setToast}
        onClose={() => setIsModalOpen(false)}
        certification={editingItem}
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
