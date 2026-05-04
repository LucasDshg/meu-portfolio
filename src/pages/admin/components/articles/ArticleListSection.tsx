import React from 'react';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileTextLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { IArticle } from '../../../../interface/article.interface';
import { Button } from '../../../../Lib/Button';
import { Card } from '../../../../Lib/Card';
import { Subheading } from '../../../../Lib/Subheading';
import { Text } from '../../../../Lib/Text';

export const ArticleListSection: React.FC<{ articles?: IArticle[] }> = ({
  articles,
}) => {
  const { deleteSubItem } = usePortfolio();
  const navigate = useNavigate();

  const handleEdit = (article: IArticle) => {
    navigate(`/admin/articles/edit/${article.id}`);
  };

  const handleAdd = () => {
    navigate('/admin/articles/new');
  };

  return (
    <div className="p-4 ">
      <Card variant="outline" className="space-y-6 ">
        <div className="flex items-center justify-between">
          <Subheading className="flex items-center gap-3">
            <RiFileTextLine className="h-5 w-5 text-zinc-400" />
            Meus Artigos
          </Subheading>
          <Button
            onClick={handleAdd}
            variant="secondary"
            type="button"
            className="gap-2"
          >
            <RiAddLine size={18} />
            Novo Artigo
          </Button>
        </div>

        <div className="space-y-4">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/50 dark:bg-zinc-800/50"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <Text className="font-medium !text-zinc-950 dark:!text-white truncate">
                    {article.title}
                  </Text>
                  <Text className="text-xs">
                    {article.date} — /{article.slug}
                  </Text>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="p-2 text-zinc-400 hover:text-teal-500 transition-colors"
                    type="button"
                  >
                    <RiEditLine size={20} />
                  </button>
                  <button
                    onClick={() =>
                      confirm('Excluir artigo?') &&
                      deleteSubItem('articles', article.id)
                    }
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <RiDeleteBinLine size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <Text>Nenhum artigo cadastrado.</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
