import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { RiHeart3Fill, RiHeart3Line, RiShareLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from '../components/NotFound';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Image } from '../Lib/Image';
import { Subheading } from '../Lib/Subheading';
import { Toast } from '../Lib/Toast';

const ArticleDetail: React.FC = () => {
  const { slug, articleSlug } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const { articles = [], loading, likeArticle } = usePortfolio();
  const [likedOptimistic, setLikedOptimistic] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
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
  const likeStorageKey =
    slug && articleSlug ? `article-like:${slug}:${articleSlug}` : null;
  const formattedDate = article
    ? formatArticleDate(article.date as Date | string | number)
    : '';

  // Derive liked state from localStorage and an optimistic flag to avoid
  // calling setState synchronously inside effects.
  const storedLiked = likeStorageKey
    ? window.localStorage.getItem(likeStorageKey) === 'true'
    : false;
  const baseLikeCount = article?.like ?? 0;
  const displayLikeCount =
    baseLikeCount + (likedOptimistic && !storedLiked ? 1 : 0);
  const hasLiked = storedLiked || likedOptimistic;

  const handleLike = async () => {
    if (!article || !likeStorageKey || hasLiked || isLiking) return;

    setIsLiking(true);
    try {
      // Optimistically update UI to reflect the like immediately.
      setLikedOptimistic(true);

      await likeArticle(article.id);

      // Persist in localStorage only after success to avoid hiding the optimistic
      // increment when localStorage is read synchronously on the next render.
      try {
        if (likeStorageKey) window.localStorage.setItem(likeStorageKey, 'true');
      } catch (storageError) {
        console.error('Erro ao persistir gostei localmente:', storageError);
      }

      setToast({
        message: 'Obrigado por gostar deste artigo!',
        type: 'success',
      });
    } catch (error) {
      console.error('Erro ao registrar gostei:', error);
      // Rollback optimistic local state
      try {
        if (likeStorageKey) window.localStorage.removeItem(likeStorageKey);
      } catch (storageError) {
        console.error('Erro ao desfazer gosto salvo localmente:', storageError);
      }
      setLikedOptimistic(false);
      setToast({
        message: 'Não foi possível registrar seu gostei. Tente novamente.',
        type: 'error',
      });
    } finally {
      setIsLiking(false);
    }
  };

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

  if (loading) return null;

  if (!article) {
    return <NotFound />;
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

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-700">
          <Button
            onClick={handleLike}
            variant="outline"
            disabled={hasLiked || isLiking}
            aria-label={`Gostei, ${displayLikeCount} curtidas`}
            aria-pressed={hasLiked}
            className="gap-2"
          >
            {hasLiked ? <RiHeart3Fill size={20} /> : <RiHeart3Line size={20} />}
            <span>{hasLiked ? 'Gostei!' : 'Gostei'}</span>
            <span aria-hidden="true">{displayLikeCount}</span>
          </Button>
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
