import { motion } from 'framer-motion';
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Subheading } from '../Lib/Subheading';
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
      className="mx-auto max-w-2xl lg:max-w-5xl flex-1 w-full mt-24"
    >
      <Card variant="outline">
        <Heading className="text-4xl sm:text-5xl">{article.title}</Heading>
        <Subheading className="mb-4 text-sm mt-4 tracking-widest text-zinc-400 dark:text-zinc-500">
          Publicado em {article.date}
        </Subheading>
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
      </Card>
    </motion.div>
  );
};

export default ArticleDetail;
