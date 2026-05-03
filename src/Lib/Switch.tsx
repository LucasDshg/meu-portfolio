import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ISwitchProps {
  label: string;
  name?: string;
  defaultChecked?: boolean;
  className?: string;
}

export const Switch: React.FC<ISwitchProps> = ({
  label,
  name,
  defaultChecked = false,
  className = '',
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label
      className={`flex items-center justify-between cursor-pointer group py-2 ${className}`}
    >
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? 'bg-teal-500' : 'bg-zinc-200 dark:bg-zinc-700'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-zinc-900`}
        />
        <motion.div
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </label>
  );
};
