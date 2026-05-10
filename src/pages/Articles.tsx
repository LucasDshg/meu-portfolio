import React from 'react';
import { ArticleCard } from '../components/ArticleCard';
import NotFound from '../components/NotFound';
import { usePortfolio } from '../context/PortfolioContext';
import { IArticle } from '../interface/article.interface';
import { Heading } from '../Lib/Heading';
import { Text } from '../Lib/Text';

const Articles: React.FC = () => {
  const { articles, profile, loading } = usePortfolio();

  if (loading) return null;
  if (!profile) return <NotFound />;

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

export default Articles;
