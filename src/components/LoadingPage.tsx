import { motion } from 'framer-motion';
import React from 'react';
import logoIcon from '../assets/logo-icon.svg';
import { Image } from '../Lib/Image';

export const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src={logoIcon} alt="Carregando..." className="h-20 w-20" />
      </motion.div>
    </div>
  );
};
