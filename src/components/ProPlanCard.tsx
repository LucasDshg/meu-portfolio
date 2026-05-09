import React from 'react';
import { RiAdvertisementLine, RiVipCrownLine } from 'react-icons/ri';
import { logInteraction } from '../data/analytics.service';
import { IProfile } from '../interface/portfolio.interface';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Text } from '../Lib/Text';

interface IProPlanCardProps {
  profile: IProfile | null | undefined;
  showAdminControls?: boolean;
}

const STRIPE_PAYMENT_URL = 'https://buy.stripe.com/14A5kE2yKcZbfHs5LD77O00';

export const ProPlanCard: React.FC<IProPlanCardProps> = ({ profile }) => {
  const getAdFreeDate = (date: any) => {
    if (!date) return null;
    if (typeof date?.toDate === 'function') return date.toDate();
    return new Date(date);
  };

  const now = new Date().getTime();
  const adFreeDate = getAdFreeDate(profile?.adFreeUntil);
  const isAdFree = adFreeDate ? adFreeDate.getTime() > now : false;

  return (
    <>
      <Card variant="primary">
        <div className="flex items-center gap-3 mb-4">
          <RiAdvertisementLine className="h-5 w-5 text-teal-500" />
          <Heading className="text-xl">Plano Pro</Heading>
        </div>
        {isAdFree ? (
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
            <RiVipCrownLine size={20} />
            <span>
              Sua assinatura está ativa até{' '}
              {adFreeDate?.toLocaleDateString('pt-BR')}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <Text>
              Remova todos os anúncios do seu portfólio e blog por apenas R$
              25,00/ano.
            </Text>
            <Button
              href={STRIPE_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              type="button"
              variant="primary"
              onClick={() => {
                logInteraction('upgrade_pro_click', 'button');
              }}
            >
              Ativar Plano Pro
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};
