import { IProfile } from "../../../interface/portfolio.interface";
import { Collapsible } from "../../../Lib/Collapsible";
import { Input } from "../../../Lib/Input";
import { Switch } from "../../../Lib/Switch";
import { Textarea } from "../../../Lib/Textarea";

export const ExperiencePageSection = ({
  data,
}: {
  data?: IProfile["pages"]["experience"];
}) => (
  <Collapsible title="Experiência">
    <Input
      name="experience-title"
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página de Experiência"
    />
    <Textarea
      name="experience-description"
      label="Descrição"
      defaultValue={data?.description}
      placeholder="Resumo da carreira"
    />
    <Input
      name="experience-disponibleText"
      label="Texto de Disponibilidade"
      defaultValue={data?.disponibleText}
      placeholder="Ex: Disponível para novos desafios"
    />
    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-experience"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);
