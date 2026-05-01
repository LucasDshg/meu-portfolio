import React from "react";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";

const Footer: React.FC = () => {
  return (
    <footer className="mt-32 flex-none">
      <div className="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            <TextLink href="/about">Sobre</TextLink>
            <TextLink href="/projects">Projetos</TextLink>
            <TextLink href="/experience">Experiência</TextLink>
          </div>
          <Text className="text-sm">
            &copy; {new Date().getFullYear()} Locas. Todos os direitos
            reservados.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
