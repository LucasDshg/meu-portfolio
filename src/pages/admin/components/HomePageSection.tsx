import { IProfile } from "../../../interface/portfolio.interface";
import { Collapsible } from "../../../Lib/Collapsible";
import { Input } from "../../../Lib/Input";
import { Textarea } from "../../../Lib/Textarea";

export const HomePageSection = ({
  data,
}: {
  data?: IProfile["pages"]["home"];
}) => (
  <Collapsible title="Home" defaultOpen>
    <Input
      label="Título (Hero)"
      name="home-title"
      defaultValue={data?.title}
      placeholder="Título principal da Home"
    />
    <Textarea
      name="home-description"
      label="Descrição (Hero)"
      defaultValue={data?.description}
      placeholder="O que você faz?"
    />
  </Collapsible>
);
