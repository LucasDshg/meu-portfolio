import { ISocials } from "../../../interface/portfolio.interface";
import { Collapsible } from "../../../Lib/Collapsible";
import { Input } from "../../../Lib/Input";

export const SocialSection = ({ socials }: { socials?: ISocials[] }) => (
  <Collapsible title="Social">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {socials
        ?.sort((a, b) => a.order - b.order)
        .map((social) => (
          <Input
            key={social.id}
            label={social.name}
            name={`social-${social.id}`}
            defaultValue={social.link || ""}
            placeholder={`Link do ${social.name}`}
          />
        ))}
    </div>
  </Collapsible>
);
