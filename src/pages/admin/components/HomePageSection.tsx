import React from 'react';
import { IProfile } from '../../../interface/portfolio.interface';
import { Card } from '../../../Lib/Card';
import { Input } from '../../../Lib/Input';
import { Textarea } from '../../../Lib/Textarea';

interface IHomePageSectionProps {
  data?: IProfile['pages']['home'];
}

export const HomePageSection: React.FC<IHomePageSectionProps> = ({ data }) => {
  return (
    <div className="p-4 space-y-6">
      <Card variant="outline" className="space-y-6">
        <Input
          label="Título (Hero)"
          name="home-title"
          defaultValue={data?.title}
          required
          placeholder="Título principal da Home"
        />
        <Textarea
          name="home-description"
          label="Descrição (Hero)"
          required
          rows={8}
          defaultValue={data?.description}
          placeholder="O que você faz?"
        />
      </Card>
    </div>
  );
};
