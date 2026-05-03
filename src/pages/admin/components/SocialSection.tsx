import { RiShareLine } from 'react-icons/ri'; // Importando o ícone
import { ISocials } from '../../../interface/portfolio.interface';
import { Card } from '../../../Lib/Card';
import { Input } from '../../../Lib/Input';
import { Subheading } from '../../../Lib/Subheading';

export const SocialSection = ({ socials }: { socials?: ISocials[] }) => (
  <div className="p-4 space-y-6">
    <Card variant="outline" className="space-y-6">
      <Subheading className="flex items-center gap-3">
        <RiShareLine className="h-5 w-5 text-zinc-400" />
        Social
      </Subheading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socials
          ?.sort((a, b) => a.order - b.order)
          .map((social) => (
            <Input
              key={social.id}
              label={social.name}
              name={`social-${social.id}`}
              defaultValue={social.link || ''}
              placeholder={`Link do ${social.name}`}
            />
          ))}
      </div>
    </Card>
  </div>
);
