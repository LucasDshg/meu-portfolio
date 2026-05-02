import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 font-sans transition-colors duration-500">
      {pathname !== "/login" && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="relative bg-white px-4 pt-16 pb-16 sm:px-8 lg:px-12 dark:bg-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-300/20 shadow-2xl min-h-screen flex flex-col">
          <div className="mx-auto max-w-2xl lg:max-w-5xl flex-1 w-full">
            {children}
          </div>
          {pathname !== "/login" && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
