import { motion } from 'framer-motion';
import React from 'react';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Image } from '../Lib/Image';
import { Text } from '../Lib/Text';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { useNavigationMenu } from '../utils/navigation.utils';

const Articles: React.FC = () => {
  const { articles, profile } = usePortfolio();

  return (
    <div className="mt-24">
      <div className="max-w-2xl">
        <Heading className="text-4xl sm:text-5xl">
          {profile?.pages.articles.title}
        </Heading>
        <Text className="mt-6">{profile?.pages.articles.description}</Text>
      </div>

      <div className="mt-16 sm:mt-20">
        <div className="md:dark:border-zinc-700/40">
          <div className="flex flex-col gap-16">
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
  const { profile } = usePortfolio();
  const { basePath } = useNavigationMenu(profile!);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="relative overflow-hidden group min-h-[220px] flex flex-col justify-end">
        {article.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105 blur-xs
"
            />
            <div className="absolute inset-0 bg-zinc-950/70 dark:bg-zinc-950/85" />
          </div>
        )}

        <div className="relative z-10">
          <Heading className="text-lg font-semibold tracking-tight !text-white">
            {article.title}
          </Heading>

          <Text className="mt-2 !text-zinc-300">{article.description}</Text>

          <Button
            href={`${basePath}/articles/${article.slug}`}
            variant="primary"
            className="mt-6 px-6"
          >
            Ler artigo
          </Button>
        </div>
      </Card>
    </motion.article>
  );
};

export default Articles;
