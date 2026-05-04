import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Avatar } from '../Lib/Avatar';
import { TextLink } from '../Lib/TextLink';
import { useNavigationMenu } from '../utils/navigation.utils';
import { ThemeToggle } from './ThemeToggle';

interface IHeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Header: React.FC<IHeaderProps> = ({ darkMode, setDarkMode }) => {
  const { profile } = usePortfolio();
  const { menus, pathname, basePath } = useNavigationMenu(profile!);
  const isVisible = pathname !== basePath && pathname !== '/';

  return (
    <header className="pointer-events-none sticky top-0 z-50 flex h-0 flex-col items-center overflow-visible max-w-[1220px] mx-auto">
      <div className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 py-3 px-4 md:px-12 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="flex flex-1">
          <AnimatePresence>
            {isVisible && (
              <motion.div
                className="sm:pl-24"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <Link
                  to={basePath}
                  aria-label="Home"
                  className="block h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10"
                >
                  <Avatar src={profile?.imageUrl} className="size-9" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!pathname.includes('/admin') && profile && (
          <nav className="pointer-events-auto block">
            <ul className="flex rounded-full bg-white/90 sm:px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
              {menus.map((menu) => {
                const isActive = pathname === menu.href;

                return (
                  <li key={menu.id}>
                    <TextLink
                      href={menu.href}
                      className="relative block px-3 py-2 transition"
                      color={isActive ? 'text-teal-500 dark:text-teal-400' : ''}
                    >
                      {menu.name}
                    </TextLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <div className="flex flex-1 justify-end hidden sm:flex">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </header>
  );
};

export default Header;
