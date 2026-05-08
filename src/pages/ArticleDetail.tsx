import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { RiShareLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Image } from '../Lib/Image';
import { Subheading } from '../Lib/Subheading';
import { Text } from '../Lib/Text';
import { Toast } from '../Lib/Toast';

const ArticleDetail: React.FC = () => {
  const { articleSlug } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const { articles = [] } = usePortfolio() as { articles: IArticle[] };
  const formatArticleDate = (date: Date | string | number): string => {
    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR');
    }

    const parsedDate = new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('pt-BR');
    }

    return String(date);
  };

  const article = articles.find((a: IArticle) => a.slug === articleSlug);
  const formattedDate = article
    ? formatArticleDate(article.date as Date | string | number)
    : '';

  const handleShare = async () => {
    if (!article) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({
        message: 'Link copiado para a área de transferência!',
        type: 'success',
      });
    }
  };

  if (!article) {
    return (
      <div className="mt-24 flex justify-center">
        <Text>Artigo não encontrado.</Text>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl lg:max-w-5xl flex-1 w-full mt-24"
    >
      <Card variant="outline">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <Heading className="text-4xl">{article.title}</Heading>
            <Subheading className="mb-4 text-sm mt-4 tracking-widest">
              Publicado em {formattedDate}
            </Subheading>

            <div className="flex items-center gap-6 my-6">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-zinc-500 hover:text-teal-500 transition-colors cursor-pointer"
              >
                <RiShareLine size={24} />
                <span className="text-sm font-medium">Compartilhar</span>
              </button>
            </div>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="self-end sm:self-start gap-2"
          >
            Voltar
          </Button>
        </div>

        {article.image && (
          <Image
            src={article.image}
            alt="Carregando..."
            className="mt-8 aspect-video rounded-2xl object-cover shadow-md scale-110"
          />
        )}

        <div className="mt-12">
          <div
            className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }}
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
    </motion.div>
  );
};

export default ArticleDetail;
