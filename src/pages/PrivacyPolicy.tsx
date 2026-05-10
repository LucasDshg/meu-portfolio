import { motion } from 'framer-motion';
import React from 'react';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Subheading } from '../Lib/Subheading';
import { Text } from '../Lib/Text';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl mt-24 px-4"
    >
      <Card variant="outline" className="space-y-8 p-8 md:p-12">
        <header>
          <Heading className="text-4xl">Política de Privacidade</Heading>
          <Text className="mt-2 text-zinc-500">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </header>

        <section className="space-y-4">
          <Subheading>1. Coleta de Informações</Subheading>
          <Text>
            Coletamos informações que você fornece diretamente ao criar seu
            perfil, como nome, e-mail, links de redes sociais e dados
            profissionais. Esses dados são armazenados de forma segura
            utilizando a infraestrutura do <strong>Google Firebase</strong>.
          </Text>
        </section>

        <section className="space-y-4">
          <Subheading>2. Uso de Cookies e Google Analytics/Ads</Subheading>
          <Text>
            Utilizamos o <strong>Google Analytics</strong> para entender como os
            visitantes interagem com o site e o<strong> Google AdSense</strong>{' '}
            para exibição de anúncios. Essas ferramentas utilizam cookies para
            coletar dados anônimos, como tempo de permanência e páginas
            visitadas. Você pode desativar os cookies nas configurações do seu
            navegador.
          </Text>
        </section>

        <section className="space-y-4">
          <Subheading>3. Processamento de Pagamentos (Stripe)</Subheading>
          <Text>
            Os pagamentos do Plano Pro são processados pelo{' '}
            <strong>Stripe</strong>. Não armazenamos dados de cartão de crédito
            em nossos servidores. O Stripe utiliza suas próprias políticas de
            segurança e privacidade para garantir a integridade da transação.
          </Text>
        </section>

        <section className="space-y-4">
          <Subheading>4. Compartilhamento de Dados</Subheading>
          <Text>
            Nós <strong>não vendemos ou compartilhamos</strong> seus dados
            pessoais com terceiros para fins comerciais. O acesso aos dados é
            restrito às ferramentas necessárias para o funcionamento da
            plataforma (Firebase, Stripe e Google).
          </Text>
        </section>

        <section className="space-y-4">
          <Subheading>5. Seus Direitos</Subheading>
          <Text>
            De acordo com a LGPD, você tem o direito de acessar, corrigir ou
            excluir seus dados pessoais a qualquer momento através do painel
            administrativo ou entrando em contato via e-mail.
          </Text>
        </section>

        <section className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <Subheading>Termos de Uso</Subheading>
          <Text>
            Ao utilizar esta plataforma, você concorda em fornecer informações
            verídicas. O uso indevido do sistema para spam ou conteúdos ilícitos
            resultará na suspensão imediata da conta.
          </Text>
        </section>

        <footer className="pt-8 text-center border-t border-zinc-100 dark:border-zinc-800">
          <Text className="text-sm">
            Dúvidas sobre sua privacidade? Entre em contato pelo e-mail do
            desenvolvedor.
          </Text>
        </footer>
      </Card>
    </motion.div>
  );
};

export default PrivacyPolicy;
