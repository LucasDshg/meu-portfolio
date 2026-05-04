import React from 'react';
import { ArticleCard } from '../../../components/ArticleCard';
import { IArticle } from '../../../interface/article.interface';
import { Button } from '../../../Lib/Button';
import { Heading } from '../../../Lib/Heading';
import { usePathName } from '../../../utils/navigation.utils';

export const ArticlesSection: React.FC<{ articles: IArticle[] }> = ({
  articles,
}) => {
  const path = usePathName();
  const href = `/u/${path.slug}/articles`;

  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="mt-24 md:mt-24">
      <Heading className="mb-8">Artigos Recentes</Heading>

      <div className="space-y-6">
        {articles.slice(0, 2).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button href={href} variant="outline">
          Ver todos os artigos
        </Button>
      </div>
    </section>
  );
};
