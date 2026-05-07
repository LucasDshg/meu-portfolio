import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Image } from '../Lib/Image';
import { Subheading } from '../Lib/Subheading';
import { Text } from '../Lib/Text';

const ArticleDetail: React.FC = () => {
  const { articleSlug } = useParams();
  const navigate = useNavigate();
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
            <Heading className="text-4xl sm:text-5xl">{article.title}</Heading>
            <Subheading className="mb-4 text-sm mt-4 tracking-widest">
              Publicado em {formattedDate}
            </Subheading>
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
    </motion.div>
  );
};

export default ArticleDetail;
