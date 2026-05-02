import { IProfile } from "../../../interface/portfolio.interface";
import { Input } from "../../../Lib/Input";
import { Textarea } from "../../../Lib/Textarea";

export const HomePageSection = ({
  data,
}: {
  data?: IProfile["pages"]["home"];
}) => (
  <div className="p-6 space-y-6">
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
  </div>
);
