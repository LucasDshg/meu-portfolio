import React, { useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { ECollection } from '../../../../data/firebase.service';
import { IExperience } from '../../../../interface/experience.interface';
import { Button } from '../../../../Lib/Button';
import { Input } from '../../../../Lib/Input';
import { Modal } from '../../../../Lib/Modal';
import { Textarea } from '../../../../Lib/Textarea';

interface IExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: IExperience;
  setToast: (
    toast: { message: string; type: 'success' | 'error' } | null,
  ) => void;
}

export const ExperienceModal: React.FC<IExperienceModalProps> = ({
  isOpen,
  experience,
  onClose,
  setToast,
}) => {
  const { saveSubItem } = usePortfolio();
  const [prevExperience, setPrevExperience] = useState<IExperience | undefined>(
    undefined,
  );
  const [formData, setFormData] = useState<Partial<IExperience>>({});

  if (experience !== prevExperience) {
    setPrevExperience(experience);
    setFormData(
      experience || {
        company: '',
        role: '',
        duration: '',
        description: '',
        technologies: [],
      },
    );
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const itemToSave = {
        ...formData,
        technologies: Array.isArray(formData.technologies)
          ? formData.technologies
          : ((formData.technologies as unknown as string) || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
        id: experience?.id || Date.now(),
      };

      await saveSubItem(ECollection.EXPERIENCES, itemToSave);
      onClose();
      setToast({
        message: 'Experiência salvo com sucesso!',
        type: 'success',
      });
    } catch (error) {
      logAppError('Project_Modal_Save', error);
      setToast({
        message: 'Erro ao salvar experiência.',
        type: 'error',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={experience ? 'Editar Experiência' : 'Nova Experiência'}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Empresa"
            value={formData.company || ''}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            required
          />
          <Input
            label="Cargo"
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
          <Input
            label="Duração"
            value={formData.duration || ''}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="Ex: Jan 2022 — Atualmente"
            required
          />
          <Input
            label="Tecnologias (Separadas por vírgula)"
            value={
              Array.isArray(formData.technologies)
                ? formData.technologies.join(', ')
                : formData.technologies || ''
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                technologies: e.target.value as any,
              })
            }
          />
        </div>
        <Textarea
          label="Descrição"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={6}
          required
        />
        <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
