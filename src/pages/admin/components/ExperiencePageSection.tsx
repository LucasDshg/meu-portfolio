import { IProfile } from "../../../interface/portfolio.interface";
import { Input } from "../../../Lib/Input";
import { Switch } from "../../../Lib/Switch";
import { Textarea } from "../../../Lib/Textarea";

export const ExperiencePageSection = ({
  data,
}: {
  data?: IProfile["pages"]["experience"];
}) => (
  <div className="p-6 space-y-6">
    <div className="pb-4 border-b border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-experience"
        defaultChecked={data?.show}
      />
    </div>

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
    <Textarea
      name="experience-disponibleText"
      label="Texto de Disponibilidade"
      defaultValue={data?.disponibleText}
      placeholder="Ex: Disponível para novos desafios"
    />
  </div>
);
