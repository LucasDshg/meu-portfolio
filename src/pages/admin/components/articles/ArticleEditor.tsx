import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { LexicalEditor } from '../../../../components/lexical-editor/LexicalEditor';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { logAppError } from '../../../../data/analytics.service';
import { storage } from '../../../../data/firebase';
import { ECollection } from '../../../../data/firebase.service';
import { IArticle } from '../../../../interface/article.interface';
import { Button } from '../../../../Lib/Button';
import { Card } from '../../../../Lib/Card';
import { FileUpload } from '../../../../Lib/FileUpload';
import { Heading } from '../../../../Lib/Heading';
import { Input } from '../../../../Lib/Input';
import { Textarea } from '../../../../Lib/Textarea';
import { Toast } from '../../../../Lib/Toast';

const ArticleEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, saveSubItem, user } = usePortfolio();
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
      date: new Date(),
      content: '',
      image: '',
    };
  });

  const handleHtmlChange = useCallback((html: string) => {
    setFormData((prev) => ({ ...prev, content: html }));
  }, []);

  const handleUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');
    const articleId = id;
    const extension = file.name.split('.').pop();
    const path = `${user.uid}/articles/${articleId}/cover.${extension}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSubItem(ECollection.ARTICLES, {
        ...formData,
        id: id,
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
    <div className="mt-9 max-w-5xl mx-auto pb-20 px-4">
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
            name="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="url-do-artigo"
            required
          />
          <FileUpload
            label="Imagem de Capa"
            name="image"
            accept="image/*"
            initialUrl={formData.image}
            onFileSelect={async (file) => {
              const url = await handleUpload(file);
              setFormData((prev) => ({ ...prev, image: url }));
              return url;
            }}
          />
          <Textarea
            label="Breve Descrição"
            name="description"
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
            name="title"
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
