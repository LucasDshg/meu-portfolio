import { IProfile } from "../../../interface/portfolio.interface";
import { Collapsible } from "../../../Lib/Collapsible";
import { Input } from "../../../Lib/Input";
import { Switch } from "../../../Lib/Switch";
import { Textarea } from "../../../Lib/Textarea";

export const AboutPageSection = ({
  data,
}: {
  data?: IProfile["pages"]["about"];
}) => (
  <Collapsible title="Sobre">
    <Input
      name="about-title"
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página Sobre"
    />
    <Textarea
      name="about-description"
      label="Descrição (Um parágrafo por linha)"
      rows={10}
      defaultValue={data?.description.join("\n")}
      placeholder="Escreva sobre sua jornada..."
    />
    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-about"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);
