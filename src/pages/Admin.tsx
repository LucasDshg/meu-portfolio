import React from "react";
import { RiSaveLine } from "react-icons/ri";
import { Button } from "../Lib/Button";
import { Collapsible } from "../Lib/Collapsible";
import { Heading } from "../Lib/Heading";
import { Input } from "../Lib/Input";
import { Switch } from "../Lib/Switch";
import { Text } from "../Lib/Text";
import { Textarea } from "../Lib/Textarea";
import { usePortfolio } from "../context/PortfolioContext";
import { IProfile, ISocials } from "../interface/portfolio.interface";

const PersonalInfoSection = ({ profile }: { profile: IProfile | null }) => (
  <Collapsible title="Informações Pessoais" defaultOpen>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Nome Exibido"
        defaultValue={profile?.name}
        placeholder="Seu nome"
        required
      />
      <Input
        label="Slug da URL"
        defaultValue={profile?.slug}
        placeholder="ex: lucas-gomes"
        required
      />
      <Input
        label="E-mail"
        defaultValue={profile?.email}
        placeholder="seu@email.com"
        required
      />
      <Input
        label="Link da Foto (URL)"
        defaultValue={profile?.imageUrl}
        placeholder="https://..."
      />
    </div>
  </Collapsible>
);

const SocialSection = ({ socials }: { socials?: ISocials[] }) => (
  <Collapsible title="Social">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {socials
        ?.sort((a, b) => a.order - b.order)
        .map((social) => (
          <Input
            key={social.id}
            label={social.name}
            defaultValue={social.link || ""}
            placeholder={`Link do ${social.name}`}
          />
        ))}
    </div>
  </Collapsible>
);

const HomePageSection = ({ data }: { data?: IProfile["pages"]["home"] }) => (
  <Collapsible title="Home" defaultOpen>
    <Input
      label="Título (Hero)"
      defaultValue={data?.title}
      placeholder="Título principal da Home"
    />
    <Textarea
      label="Descrição (Hero)"
      defaultValue={data?.description}
      placeholder="O que você faz?"
    />
  </Collapsible>
);

const AboutPageSection = ({ data }: { data?: IProfile["pages"]["about"] }) => (
  <Collapsible title="Sobre">
    <Input
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página Sobre"
    />
    {data?.description.map((text, index) => (
      <Textarea
        label={`Descrição (Parágrafo ${index + 1})`}
        key={`about-description-${index} `}
        rows={6}
        defaultValue={text}
        placeholder="Escreva sobre sua jornada..."
      />
    ))}

    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-about"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);

const ExperiencePageSection = ({
  data,
}: {
  data?: IProfile["pages"]["experience"];
}) => (
  <Collapsible title="Experiência">
    <Input
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página de Experiência"
    />
    <Textarea
      label="Descrição"
      defaultValue={data?.description}
      placeholder="Resumo da carreira"
    />
    <Textarea
      label="Texto de Disponibilidade"
      defaultValue={data?.disponibleText}
      placeholder="Ex: Disponível para novos desafios"
    />

    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-experience"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);

const ProjectPageSection = ({
  data,
}: {
  data?: IProfile["pages"]["project"];
}) => (
  <Collapsible title="Projeto">
    <Input
      label="Título"
      defaultValue={data?.title}
      placeholder="Título da página de Projetos"
    />
    <Textarea
      label="Descrição"
      defaultValue={data?.description}
      placeholder="Resumo dos projetos"
    />
    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
      <Switch
        label="Mostrar página no menu de navegação"
        name="show-project"
        defaultChecked={data?.show}
      />
    </div>
  </Collapsible>
);

const Admin: React.FC = () => {
  const { profile } = usePortfolio();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Dados salvos com sucesso!");
  };

  return (
    <form className="mt-32 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <Heading className="text-4xl">Meu Portfólio</Heading>
          <Text className="mt-2">
            Configure sua identidade visual e informações técnicas.
          </Text>
        </div>
        <Button type="button" className="gap-2" onClick={handleSave}>
          <RiSaveLine size={20} />
          Salvar Alterações
        </Button>
      </div>

      <div className="space-y-6">
        <PersonalInfoSection profile={profile} />
        <SocialSection socials={profile?.socials} />
        <Heading className="mt-16">Páginas</Heading>

        <HomePageSection data={profile?.pages.home} />
        <AboutPageSection data={profile?.pages.about} />
        <ExperiencePageSection data={profile?.pages.experience} />
        <ProjectPageSection data={profile?.pages.project} />
      </div>
    </form>
  );
};

export default Admin;
