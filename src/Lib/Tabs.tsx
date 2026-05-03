import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ITab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ITabsProps {
  tabs: ITab[];
  className?: string;
}

export const Tabs: React.FC<ITabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap p-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl mb-8 gap-1 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-1 px-3 sm:px-6 py-2.5 text-base font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap rounded-xl
                ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}
              `}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-teal-50 dark:bg-teal-400/10 rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="space-y-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
