import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";
import { useNavigationMenu } from "../utils/navigation.utils";

const Footer: React.FC = () => {
  const { profile } = usePortfolio();
  const { menus, slug } = useNavigationMenu(profile!);

  return (
    <footer className="mt-32 flex-none">
      <div className="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {menus.map((menu) => {
              const href = `/u/${slug}/${menu.id}`;
              return <TextLink href={href}>{menu.name}</TextLink>;
            })}
          </div>
          <Text className="text-sm">
            &copy; {new Date().getFullYear()} Lucas Gomes Software. Todos os
            direitos reservados.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
