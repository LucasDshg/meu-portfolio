import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { logAppError } from '../../../data/analytics.service';
import { Button } from '../../../Lib/Button';
import { Card } from '../../../Lib/Card';
import { Heading } from '../../../Lib/Heading';
import { Text } from '../../../Lib/Text';
import { Toast } from '../../../Lib/Toast';

export const DangerZoneSection: React.FC = () => {
  const { deleteAccount } = usePortfolio();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'TEM CERTEZA? Esta ação apagará permanentemente seu perfil, projetos, experiências e artigos. Não há como desfazer.',
    );

    if (confirmed) {
      try {
        await deleteAccount();
      } catch (error: any) {
        logAppError('Admin_Delete_Account', error);
        setToast({
          message: error.message || 'Erro ao excluir conta.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card variant="outline">
        <Heading color="text-red-600 dark:text-red-400">Zona de Perigo</Heading>
        <Text className="mt-2 mb-6 text-sm">
          Ao excluir sua conta, todos os seus dados serão removidos
          permanentemente de nossos servidores.
        </Text>
        <Button type="button" variant="danger" onClick={handleDeleteAccount}>
          Excluir permanentemente todos os meus dados
        </Button>
      </Card>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
