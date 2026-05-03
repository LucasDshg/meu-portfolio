import { motion } from 'framer-motion';
import React from 'react';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Text } from '../Lib/Text';
import { TextLink } from '../Lib/TextLink';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface'; // Importando a interface IArticle

const Articles: React.FC = () => {
  const { articles = [] } = usePortfolio() as unknown as {
    articles: IArticle[];
  };

  return (
    <div className="mt-32">
      <div className="max-w-2xl">
        <Heading className="text-4xl sm:text-5xl">
          Escrita técnica e pensamentos sobre desenvolvimento.
        </Heading>
        <Text className="mt-6">
          Espaço dedicado a compartilhar conhecimentos, tutoriais e reflexões
          sobre tecnologia e engenharia de software.
        </Text>
      </div>

      <div className="mt-16 sm:mt-20">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col gap-16">
            {articles.length > 0 ? (
              articles.map((article: IArticle) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            ) : (
              <Text>Nenhum artigo publicado ainda.</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: IArticle }> = ({ article }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="md:grid md:grid-cols-4 md:items-baseline"
    >
      <Card className="md:col-span-3">
        <time
          dateTime={article.date}
          className="md:hidden relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5"
        >
          <span
            className="absolute inset-y-0 left-0 flex items-center"
            aria-hidden="true"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
          </span>
          {article.date}
        </time>

        <Heading className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          <TextLink href={`/articles/${article.slug}`}>
            {article.title}
          </TextLink>
        </Heading>

        <Text className="relative z-10 mt-2 text-sm">
          {article.description}
        </Text>

        <div
          aria-hidden="true"
          className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
        >
          Ler artigo
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="ml-1 h-4 w-4 stroke-current"
          >
            <path
              d="M6.75 5.75 9.25 8l-2.5 2.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
      <time className="mt-1 hidden md:block relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500">
        {article.date}
      </time>
    </motion.article>
  );
};

export default Articles;
