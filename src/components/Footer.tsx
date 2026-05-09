import React from 'react';
import logoIcon from '../assets/logo-icon.svg';
import { usePortfolio } from '../context/PortfolioContext';
import { logInteraction } from '../data/analytics.service';
import { Image } from '../Lib/Image';
import { Text } from '../Lib/Text';
import { TextLink } from '../Lib/TextLink';
import { useNavigationMenu } from '../utils/navigation.utils';

const Footer: React.FC = () => {
  const { profile, user } = usePortfolio();
  const { menus } = useNavigationMenu(profile!);

  return (
    <footer className="mt-32 flex-none">
      <div className="border-t border-zinc-100 pt-10 dark:border-zinc-700/40">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-6">
            <Image src={logoIcon} alt="Logo" className="h-10 w-10" />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {menus.map((menu) => {
                return (
                  <TextLink
                    key={menu.id}
                    href={menu.href}
                    onClick={() =>
                      logInteraction(`footer_${menu.id}_nav`, 'menu_item')
                    }
                    color="text-zinc-600 dark:text-zinc-400 hover:text-teal-600"
                  >
                    {menu.name}
                  </TextLink>
                );
              })}
              <TextLink
                href={user ? '/admin' : '/login'}
                onClick={() =>
                  logInteraction(
                    user ? 'footer_admin_click' : 'footer_login_click',
                    'link',
                  )
                }
                color="text-zinc-600 hover:text-teal-600 dark:text-zinc-400"
              >
                {user ? 'Editar meu portfólio' : 'Criar meu portfólio'}
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
