import React from "react";
import logoIcon from "../assets/logo-icon.svg";
import { usePortfolio } from "../context/PortfolioContext";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";
import { useNavigationMenu } from "../utils/navigation.utils";

const Footer: React.FC = () => {
  const { profile, user } = usePortfolio();
  const { menus, slug } = useNavigationMenu(profile!);

  return (
    <footer className="mt-32 flex-none">
      <div className="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-6">
            <img src={logoIcon} alt="Logo" className="h-14 w-14" />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {menus.map((menu) => {
                return (
                  <TextLink key={menu.id} href={menu.href}>
                    {menu.name}
                  </TextLink>
                );
              })}
              <TextLink
                href={user ? "/admin" : "/login"}
                className="text-teal-500 hover:text-teal-600 dark:text-teal-400"
              >
                {user ? "Editar meu portfólio" : "Criar meu portfólio"}
              </TextLink>
            </div>
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
