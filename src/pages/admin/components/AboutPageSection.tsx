import { IProfile } from "../../../interface/portfolio.interface";
import { Input } from "../../../Lib/Input";
import { Switch } from "../../../Lib/Switch";
import { Textarea } from "../../../Lib/Textarea";

export const AboutPageSection = ({
  data,
}: {
  data?: IProfile["pages"]["about"];
}) => (
  <div className="p-6 space-y-6">
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
    <Textarea
      name="about-description"
      label="Descrição (Um parágrafo por linha)"
      rows={10}
      required
      defaultValue={data?.description.join("\n")}
      placeholder="Escreva sobre sua jornada..."
    />
  </div>
);
