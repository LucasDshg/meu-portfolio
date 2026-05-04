import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { LexicalEditor } from '../../../../components/lexical-editor/LexicalEditor';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { ECollection } from '../../../../data/firebase.service';
import { IArticle } from '../../../../interface/article.interface';
import { Button } from '../../../../Lib/Button';
import { Card } from '../../../../Lib/Card';
import { Heading } from '../../../../Lib/Heading';
import { Input } from '../../../../Lib/Input';
import { Textarea } from '../../../../Lib/Textarea';
import { Toast } from '../../../../Lib/Toast';

const ArticleEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, saveSubItem } = usePortfolio();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [formData, setFormData] = useState<Partial<IArticle>>(() => {
    if (id && articles) {
      const article = articles.find((a) => String(a.id) === id);
      if (article) return article;
    }
    return {
      title: '',
      description: '',
      slug: '',
      date: new Date().toLocaleDateString('pt-BR'),
      content: '',
      image: '',
    };
  });

  const handleHtmlChange = useCallback((html: string) => {
    setFormData((prev) => ({ ...prev, content: html }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSubItem(ECollection.ARTICLES, {
        ...formData,
        id: id ? (isNaN(Number(id)) ? id : Number(id)) : Date.now(),
      });
      setToast({
        message: 'Artigo publicado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      logAppError('Admin_Artigo_Save', error);
      setToast({
        message: 'Erro ao salvar artigo.',
        type: 'error',
      });
    }
  };

  return (
    <div className="mt-32 max-w-5xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RiArrowLeftLine size={24} />
          </button>
          <Heading>{id ? 'Editar Artigo' : 'Novo Artigo'}</Heading>
        </div>
        <Button onClick={handleSubmit} className="gap-2">
          <RiSaveLine size={20} />
          Publicar Artigo
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card variant="outline" className="space-y-4">
          <Input
            label="Slug da URL"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="url-do-artigo"
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
            rows={4}
            required
          />
        </Card>
        <Card variant="outline" className="space-y-4">
          <Input
            label="Título do Artigo"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ex: Como configurar o Firebase..."
            required
          />
          <div className="prose dark:prose-invert max-w-none">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1 text-left">
              Conteúdo
            </label>
            <LexicalEditor
              value={formData.content || ''}
              onChange={handleHtmlChange}
              placeholder="Escreva seu conhecimento técnico aqui..."
            />
          </div>
        </Card>
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default ArticleEditor;
