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
import { ICertifications } from '../../../interface/certifications.interface';
import { Button } from '../../../Lib/Button';
import { Heading } from '../../../Lib/Heading';
import { Input } from '../../../Lib/Input';
import { Toast } from '../../../Lib/Toast';

export const CertificationListSection = ({
  certifications,
}: {
  certifications: ICertifications[];
}) => {
  const { saveSubItem, deleteSubItem } = usePortfolio();
  const [editingItem, setEditingItem] =
    useState<Partial<ICertifications> | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSave = async () => {
    if (!editingItem) return;

    if (!editingItem.name || !editingItem.institution || !editingItem.year) {
      setToast({ message: 'Todos os campos são obrigatórios.', type: 'error' });
      return;
    }

    try {
      await saveSubItem<Partial<ICertifications>>(
        ECollection.CERTIFICATIONS,
        editingItem,
      );
      setEditingItem(null);
      setToast({ message: 'Certificação salva com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao salvar certificação.', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubItem(ECollection.CERTIFICATIONS, id);
      setToast({
        message: 'Certificação removida com sucesso!',
        type: 'success',
      });
    } catch (error) {
      setToast({ message: 'Erro ao remover certificação.', type: 'error' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Heading className="mb-8">Gerenciar Certificações</Heading>
      {!editingItem ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() =>
              setEditingItem({
                name: '',
                institution: '',
                year: new Date().getFullYear(),
              })
            }
          >
            <RiAddLine size={20} /> Adicionar Certificação
          </Button>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
            {certifications
              ?.sort((a, b) => b.year - a.year)
              .map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between py-4 group"
                >
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {cert.name}
                    </h4>
                    <p className="text-sm text-zinc-500">
                      {cert.institution} • {cert.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="!p-2"
                      onClick={() => setEditingItem(cert)}
                    >
                      <RiEditLine size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-2 text-red-500"
                      onClick={() => handleDelete(cert.id)}
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
              label="Nome do Curso/Certificado"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              required
            />
            <Input
              label="Instituição"
              value={editingItem.institution}
              onChange={(e) =>
                setEditingItem({ ...editingItem, institution: e.target.value })
              }
              required
            />
            <Input
              label="Ano de Conclusão"
              type="number"
              value={editingItem.year}
              onChange={(e) =>
                setEditingItem({ ...editingItem, year: Number(e.target.value) })
              }
              required
            />
          </div>
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
