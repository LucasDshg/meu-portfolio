import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
} from 'react-icons/ri';

interface IToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<IToastProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-teal-500 text-white',
    error: 'bg-red-500 text-white',
  };

  const Icon = type === 'success' ? RiCheckboxCircleLine : RiErrorWarningLine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg shadow-zinc-800/10 ${styles[type]}`}
    >
      <Icon className="size-5 flex-none" />
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
      >
        <RiCloseLine className="size-5" />
      </button>
    </motion.div>
  );
};
