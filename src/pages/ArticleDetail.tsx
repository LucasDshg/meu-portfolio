import { motion } from 'framer-motion';
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Card } from '../Lib/Card';
import { Text } from '../Lib/Text';

const ArticleDetail: React.FC = () => {
  const { articleSlug } = useParams();
  const { articles = [] } = usePortfolio() as { articles: IArticle[] };

  const article = articles.find((a: IArticle) => a.slug === articleSlug);

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
      className="mt-24 max-w-3xl mx-auto pb-20"
    >
      <Card variant="outline">
        {article.image && (
          <img
            src={article.image}
            alt=""
            className="mt-8 aspect-video rounded-2xl object-cover shadow-md"
          />
        )}

        <div className="mt-12">
          <div
            className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg text-justify"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <footer className="flex flex-col">
          <time
            dateTime={article.date}
            className="order-first flex items-center text-sm text-zinc-400 dark:text-zinc-500"
          >
            <span className="ml-3">Publicado em {article.date}</span>
          </time>
        </footer>
      </Card>
    </motion.div>
  );
};

export default ArticleDetail;
