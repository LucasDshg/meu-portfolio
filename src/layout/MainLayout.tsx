import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LoadingPage } from '../components/LoadingPage';
import { usePortfolio } from '../context/PortfolioContext';
import { logPageView } from '../data/analytics.service';
import { AdUnit } from './AdUnit';

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

  const now = new Date().getTime();
  const isAdFree = (() => {
    if (!profile?.adFreeUntil) return false;
    const adFreeUntil = profile.adFreeUntil as any;
    const date =
      typeof adFreeUntil.toDate === 'function'
        ? adFreeUntil.toDate()
        : new Date(adFreeUntil);
    return date.getTime() > now;
  })();

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

  const hideMenuAndFooter = ['/login', '/'];

  const showMenuAndFooter = () => {
    return !hideMenuAndFooter.includes(pathname);
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 font-sans transition-colors duration-500">
      {showMenuAndFooter() && profile && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <div className="mx-auto max-w-7xl lg:px-8 relative">
        <div className="relative bg-white px-4 pt-16 pb-16 sm:px-8 lg:px-12 dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-300/20 shadow-2xl min-h-screen flex flex-col">
          <div className="mx-auto max-w-4xl lg:max-w-5xl flex-1 w-full">
            {children}
          </div>
          {showMenuAndFooter() && profile && (
            <div className={`${!isAdFree && 'xl:mb-0 mb-24'}`}>
              <Footer />
            </div>
          )}
        </div>

        {!isAdFree && (
          <>
            <div className="pointer-events-none fixed right-0 top-50 -z-10 w-[200px] opacity-0 transition-opacity duration-200 xl:pointer-events-auto xl:z-40 xl:opacity-100">
              <AdUnit
                slot="9596875335"
                format="vertical"
                className="max-w-[200px]"
              />
            </div>
            <div className="pointer-events-none fixed left-0 top-50 -z-10 w-[200px] opacity-0 transition-opacity duration-200 xl:pointer-events-auto xl:z-40 xl:opacity-100">
              <AdUnit
                slot="9596875335"
                format="vertical"
                className="max-w-[200px]"
              />
            </div>
          </>
        )}
      </div>
      {!isAdFree && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 p-2 border-t border-zinc-100 transition-opacity duration-200 dark:border-zinc-700/40 xl:pointer-events-none xl:-z-10 xl:opacity-0">
          <AdUnit
            slot="7924701015"
            format="horizontal"
            responsive="true"
            className="w-[100%] h-[100px]"
          />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
