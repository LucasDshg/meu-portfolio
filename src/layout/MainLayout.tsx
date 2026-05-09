import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LoadingPage } from '../components/LoadingPage';
import { usePortfolio } from '../context/PortfolioContext';
import { logPageView } from '../data/analytics.service';

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { loading, profile } = usePortfolio();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin')) {
      logPageView(pathname);
    }
  }, [pathname]);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 font-sans transition-colors duration-500">
      {pathname !== '/login' && profile && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="relative bg-white px-4 pt-16 pb-16 sm:px-8 lg:px-12 dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-300/20 shadow-2xl min-h-screen flex flex-col">
          <div className="mx-auto max-w-4xl lg:max-w-5xl flex-1 w-full">
            {children}
          </div>
          {pathname !== '/login' && profile && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
