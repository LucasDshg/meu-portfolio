import React, { useState } from 'react';
import { RiAdvertisementLine, RiVipCrownLine } from 'react-icons/ri';
import { usePortfolio } from '../context/PortfolioContext';
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

const PlanActivatedCard: React.FC<{ adFreeDate: Date }> = ({ adFreeDate }) => {
  return (
    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
      <RiVipCrownLine size={20} />
      <span>
        Sua assinatura está ativa até {adFreeDate.toLocaleDateString('pt-BR')}
      </span>
    </div>
  );
};

const PlanActiveCard: React.FC<{
  paymentUrlWithId: string;
}> = ({ paymentUrlWithId }) => {
  const [planClick, setPlanClick] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { fetchData } = usePortfolio();

  const handlePlanClick = () => {
    setPlanClick(true);
    logInteraction('upgrade_pro_click', 'button');
  };

  const handleData = async () => {
    setIsValidating(true);
    await fetchData();
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
      {planClick ? (
        <>
          <Text className="text-teal-900 dark:text-teal-100 font-medium">
            Pagamento realizado?
          </Text>
          <Text className="text-sm text-teal-700/80 dark:text-teal-400/80 mt-1">
            Clique abaixo para atualizar seu perfil e ativar os benefícios Pro.
          </Text>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleData}
              disabled={isValidating}
            >
              {isValidating ? 'Validando...' : 'Validar Pagamento'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPlanClick(false)}
            >
              Voltar
            </Button>
          </div>
        </>
      ) : (
        <>
          <Text>
            Remova todos os anúncios do seu portfólio e blog por apenas R$
            25,00/ano.
          </Text>
          <Button
            href={paymentUrlWithId}
            target="_blank"
            rel="noopener noreferrer"
            type="button"
            variant="primary"
            onClick={handlePlanClick}
          >
            Ativar Plano Pro
          </Button>
        </>
      )}
    </div>
  );
};

export const ProPlanCard: React.FC<IProPlanCardProps> = ({ profile }) => {
  const getAdFreeDate = (date: any) => {
    if (!date) return null;
    if (typeof date?.toDate === 'function') return date.toDate();
    return new Date(date);
  };

  const now = new Date().getTime();
  const adFreeDate = getAdFreeDate(profile?.adFreeUntil);
  const isAdFree = adFreeDate ? adFreeDate.getTime() > now : false;
  const paymentUrlWithId = `${STRIPE_PAYMENT_URL}?client_reference_id=${profile?.slug}`;
  return (
    <Card variant="primary">
      <div className="flex items-center gap-3 mb-4">
        <RiAdvertisementLine className="h-5 w-5 text-teal-500" />
        <Heading className="text-xl">Plano Pro</Heading>
      </div>
      {isAdFree ? (
        <PlanActivatedCard adFreeDate={adFreeDate}></PlanActivatedCard>
      ) : (
        <PlanActiveCard paymentUrlWithId={paymentUrlWithId}></PlanActiveCard>
      )}
    </Card>
  );
};
