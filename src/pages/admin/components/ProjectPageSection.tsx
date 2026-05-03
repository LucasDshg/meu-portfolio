import { IProfile } from '../../../interface/portfolio.interface';
import { Input } from '../../../Lib/Input';
import { Switch } from '../../../Lib/Switch';
import { Textarea } from '../../../Lib/Textarea';

export const ProjectPageSection = ({
  data,
}: {
  data?: IProfile['pages']['project'];
}) => (
  <div className="p-6 space-y-6">
    <div className="pb-4 border-b border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-project"
        defaultChecked={data?.show}
      />
    </div>

    <Input
      name="project-title"
      label="Título"
      required
      defaultValue={data?.title}
      placeholder="Título da página de Projetos"
    />
    <Textarea
      name="project-description"
      label="Descrição"
      required
      defaultValue={data?.description}
      placeholder="Resumo dos projetos"
    />
  </div>
);
