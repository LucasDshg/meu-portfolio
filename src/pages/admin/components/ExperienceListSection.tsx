import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
} from 'react-icons/ri';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ECollection } from '../../../data/firebase.service';
import { IExperience } from '../../../interface/experience.interface';
import { Button } from '../../../Lib/Button';
import { Heading } from '../../../Lib/Heading';
import { Input } from '../../../Lib/Input';
import { Textarea } from '../../../Lib/Textarea';
import { Toast } from '../../../Lib/Toast';

export const ExperienceListSection = ({
  experiences,
}: {
  experiences: IExperience[];
}) => {
  const { saveSubItem, deleteSubItem } = usePortfolio();
  const [editingItem, setEditingItem] = useState<Partial<IExperience> | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const itemToSave = {
        ...editingItem,
        technologies: Array.isArray(editingItem.technologies)
          ? editingItem.technologies
          : (editingItem.technologies as unknown as string)
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
      };

      await saveSubItem<Partial<IExperience>>(
        ECollection.EXPERIENCES,
        itemToSave,
      );
      setEditingItem(null);
      setToast({ message: 'Experiência salva com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao salvar experiência.', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubItem(ECollection.EXPERIENCES, id);
      setToast({
        message: 'Experiência removida com sucesso!',
        type: 'success',
      });
    } catch (error) {
      setToast({ message: 'Erro ao remover experiência.', type: 'error' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Heading className="mb-8">Gerenciar Experiências Profissionais</Heading>
      {!editingItem ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() =>
              setEditingItem({
                company: '',
                role: '',
                duration: '',
                description: '',
                technologies: [],
              })
            }
          >
            <RiAddLine size={20} /> Adicionar Experiência
          </Button>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
            {experiences
              .sort((a, b) => b.id - a.id)
              .map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between py-4 group"
                >
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {exp.role}
                    </h4>
                    <p className="text-sm text-zinc-500">
                      {exp.company} • {exp.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="!p-2"
                      onClick={() => setEditingItem(exp)}
                    >
                      <RiEditLine size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-2 text-red-500"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <RiDeleteBinLine size={18} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Empresa"
              value={editingItem.company}
              onChange={(e) =>
                setEditingItem({ ...editingItem, company: e.target.value })
              }
            />
            <Input
              label="Cargo"
              value={editingItem.role}
              onChange={(e) =>
                setEditingItem({ ...editingItem, role: e.target.value })
              }
            />
            <Input
              label="Duração"
              value={editingItem.duration}
              onChange={(e) =>
                setEditingItem({ ...editingItem, duration: e.target.value })
              }
              placeholder="Ex: Jan 2022 — Atualmente"
            />
            <Input
              label="Tecnologias (Vírgula)"
              value={editingItem.technologies?.join(', ')}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  technologies: e.target.value as any,
                })
              }
            />
          </div>
          <Textarea
            label="Descrição"
            value={editingItem.description}
            onChange={(e) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
            rows={5}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setEditingItem(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} type="button" className="gap-2">
              <RiSaveLine size={18} /> Salvar
            </Button>
          </div>
        </div>
      )}

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
