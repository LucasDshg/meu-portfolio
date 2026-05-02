import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { Heading } from "./Heading";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden border border-zinc-100 dark:border-zinc-700/40 shadow-sm shadow-zinc-800/5 rounded-2xl ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors "
      >
        <Heading className="!text-lg">{title}</Heading>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <RiArrowUpSLine size={24} />
          ) : (
            <RiArrowDownSLine size={24} />
          )}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-6 space-y-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
