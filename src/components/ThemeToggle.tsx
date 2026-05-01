import { motion } from "framer-motion";
import React from "react";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="relative flex h-7 w-12 cursor-pointer rounded-full bg-zinc-200 transition-colors duration-200 ease-in-out dark:bg-zinc-700"
      aria-pressed={darkMode}
      aria-label="Alternar tema"
    >
      <span className="sr-only">Alternar tema</span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-zinc-900"
        initial={false}
        animate={{ translateX: darkMode ? "1.2rem" : "0.1rem" }}
        transition={{ duration: 0.2 }}
      >
        <span className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity">
          {darkMode ? (
            <RiMoonClearFill
              size={16}
              className="text-zinc-400 dark:text-teal-500 stroke-[0.5]"
            />
          ) : (
            <RiSunFill size={16} className="text-zinc-500" />
          )}
        </span>
      </motion.span>
    </button>
  );
};
