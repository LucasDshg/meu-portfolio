import React from 'react';
import { IProfile } from '../../../interface/portfolio.interface';
import { Card } from '../../../Lib/Card';
import { Input } from '../../../Lib/Input';
import { Switch } from '../../../Lib/Switch';
import { Textarea } from '../../../Lib/Textarea';

interface IAboutPageSectionProps {
  data?: IProfile['pages']['about'];
}

export const AboutPageSection: React.FC<IAboutPageSectionProps> = ({
  data,
}) => (
  <div className="p-4 space-y-6">
    <Card variant="outline" className="space-y-6">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-700/40">
        <Switch
          label="Mostrar página no menu de navegação"
          name="show-about"
          defaultChecked={data?.show}
        />
      </div>

      <Input
        name="about-title"
        label="Título"
        required
        defaultValue={data?.title}
        placeholder="Título da página Sobre"
      />

      {data?.description.map((desc, index) => (
        <Textarea
          key={`about-desc-${index}`}
          name={`about-description-${index + 1}`}
          label={`Descrição (parágrafo ${index + 1})`}
          rows={6}
          required={index === 0}
          defaultValue={desc}
          placeholder="Escreva sobre sua jornada..."
        />
      ))}
    </Card>
  </div>
);
