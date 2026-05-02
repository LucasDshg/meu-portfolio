import { ISocials } from "../../../interface/portfolio.interface";
import { Heading } from "../../../Lib/Heading";
import { Input } from "../../../Lib/Input";

export const SocialSection = ({ socials }: { socials?: ISocials[] }) => (
  <div className="p-6 space-y-6">
    <Heading className="mb-8">Social</Heading>
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
  </div>
);
