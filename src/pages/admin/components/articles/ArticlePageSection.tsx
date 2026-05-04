import React from 'react';
import { Card } from '../../../../Lib/Card';
import { Input } from '../../../../Lib/Input';
import { Switch } from '../../../../Lib/Switch';
import { Textarea } from '../../../../Lib/Textarea';

interface IArticlePageSectionProps {
  data?: {
    title: string;
    description: string;
    show: boolean;
  };
}

export const ArticlePageSection: React.FC<IArticlePageSectionProps> = ({
  data,
}) => {
  return (
    <div className="p-4 space-y-6">
      <Card variant="outline" className="space-y-6">
        <div className="pb-4 border-b border-zinc-100 dark:border-zinc-700/40">
          <Switch
            label="Mostrar página no menu de navegação"
            name="show-articles"
            defaultChecked={data?.show}
          />
        </div>

        <Input
          name="articles-title"
          label="Título"
          required
          defaultValue={data?.title}
          placeholder="Título da página de artigos"
        />
        <Textarea
          name="articles-description"
          label="Descrição"
          required
          defaultValue={data?.description}
          placeholder="Resumo dos artigos"
        />
      </Card>
    </div>
  );
};
