import { IProfile } from "../../../interface/portfolio.interface";
import { Collapsible } from "../../../Lib/Collapsible";
import { Input } from "../../../Lib/Input";
import { Switch } from "../../../Lib/Switch";
import { Textarea } from "../../../Lib/Textarea";

export const ProjectPageSection = ({
  data,
}: {
  data?: IProfile["pages"]["project"];
}) => (
  <Collapsible title="Projeto">
    <Input
      name="project-title"
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página de Projetos"
    />
    <Textarea
      name="project-description"
      label="Descrição"
      defaultValue={data?.description}
      placeholder="Resumo dos projetos"
    />
    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-project"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);
