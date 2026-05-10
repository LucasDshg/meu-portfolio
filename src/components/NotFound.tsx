import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Text } from '../Lib/Text';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <Card variant="outline" className="space-y-6 p-12">
          <div className="space-y-2">
            <Heading className="text-7xl font-extrabold text-teal-500 dark:text-teal-400">
              404
            </Heading>
            <Heading className="text-2xl tracking-tight">
              Página não encontrada
            </Heading>
          </div>

          <Text>
            O link que você acessou pode estar quebrado, a página pode ter sido
            removida ou o portfólio não existe.
          </Text>

          <Button onClick={() => navigate('/login')} className="w-full py-3">
            Ir para o Início
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
