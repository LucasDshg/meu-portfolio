import React, { useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ECollection } from '../../../../data/firebase.service';
import { ICertifications } from '../../../../interface/certifications.interface';
import { Button } from '../../../../Lib/Button';
import { Input } from '../../../../Lib/Input';
import { Modal } from '../../../../Lib/Modal';

interface ICertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification?: ICertifications;
}

export const CertificationModal: React.FC<ICertificationModalProps> = ({
  isOpen,
  onClose,
  certification,
}) => {
  const { saveSubItem } = usePortfolio();
  const [formData, setFormData] = useState<Partial<ICertifications>>({
    name: '',
    institution: '',
    year: new Date().getFullYear(),
  });

  if (
    isOpen &&
    (formData.id !== certification?.id || (!certification && formData.id))
  ) {
    setFormData(
      certification || {
        name: '',
        institution: '',
        year: new Date().getFullYear(),
      },
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSubItem(ECollection.CERTIFICATIONS, {
        ...formData,
        id: certification?.id || Date.now(),
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar certificação:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification ? 'Editar Certificação' : 'Nova Certificação'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Nome do Curso/Certificado"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Instituição"
            value={formData.institution || ''}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            required
          />
          <Input
            label="Ano de Conclusão"
            type="number"
            value={formData.year || ''}
            onChange={(e) =>
              setFormData({ ...formData, year: Number(e.target.value) })
            }
            required
          />
        </div>

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
