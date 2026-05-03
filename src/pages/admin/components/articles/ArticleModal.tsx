import React, { useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ECollection } from '../../../../data/firebase.service';
import { IArticle } from '../../../../interface/article.interface';
import { Button } from '../../../../Lib/Button';
import { Input } from '../../../../Lib/Input';
import { Modal } from '../../../../Lib/Modal';
import { Textarea } from '../../../../Lib/Textarea';

interface IArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: IArticle;
}

export const ArticleModal: React.FC<IArticleModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const { saveSubItem } = usePortfolio();

  const [formData, setFormData] = useState<Partial<IArticle>>({});

  if (isOpen && (formData.id !== article?.id || (!article && formData.id))) {
    setFormData(
      article || {
        title: '',
        description: '',
        slug: '',
        date: new Date().toLocaleDateString('pt-BR'),
        content: '',
        image: '',
      },
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSubItem(ECollection.ARTICLES, {
        ...formData,
        id: article?.id || Date.now(),
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={article ? 'Editar Artigo' : 'Novo Artigo'}
      maxWidth="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <Input
            label="Slug (ex: meu-primeiro-artigo)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
          <Input
            label="URL da Imagem de Capa"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            placeholder="https://..."
          />
          <Textarea
            label="Breve Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={3}
          />
        </div>

        <div className="flex flex-col h-full">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Conteúdo (Markdown suportado)
          </label>
          <textarea
            className="flex-1 min-h-[300px] w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-zinc-800 dark:text-zinc-100"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="# Título do Artigo&#10;&#10;Escreva seu conteúdo aqui..."
            required
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button type="submit">Salvar Artigo</Button>
        </div>
      </form>
    </Modal>
  );
};
