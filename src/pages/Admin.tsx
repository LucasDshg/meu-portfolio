import React from "react";
import { RiSaveLine } from "react-icons/ri";
import { Button } from "../Lib/Button";
import { Collapsible } from "../Lib/Collapsible";
import { Heading } from "../Lib/Heading";
import { Input } from "../Lib/Input";
import { Text } from "../Lib/Text";
import { Textarea } from "../Lib/Textarea";
import { usePortfolio } from "../context/PortfolioContext";

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
          </div>
          <Input
            label="Link da Foto (URL)"
            defaultValue={profile?.profileImageUrl}
            placeholder="https://..."
          />
          <Textarea
            label="Biografia (Sobre)"
            rows={12}
            defaultValue={profile?.aboutBio?.join("\n")}
            placeholder="Escreva sobre sua jornada..."
            required
          />
        </Collapsible>

        <Collapsible title="Presença Digital">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="LinkedIn"
              defaultValue={profile?.socials?.linkedin}
              placeholder="Link do perfil"
            />
            <Input
              label="GitHub"
              defaultValue={profile?.socials?.github}
              placeholder="Link do perfil"
            />
            <Input
              label="E-mail de Contato"
              defaultValue={profile?.socials?.email}
              placeholder="seu@email.com"
            />
            <Input
              label="Currículo (Link PDF)"
              defaultValue={profile?.cvLink}
              placeholder="Link do arquivo"
            />
          </div>
        </Collapsible>

        <Collapsible title="Chamadas de Texto">
          <Textarea
            label="Título Hero (Home)"
            defaultValue={profile?.description}
            placeholder="O que você faz?"
          />
          <Textarea
            label="Bio Seção Experiência"
            defaultValue={profile?.experience}
            placeholder="Resumo da carreira"
          />
          <Textarea
            label="Bio Seção Projetos"
            defaultValue={profile?.project}
            placeholder="Resumo dos projetos"
          />
        </Collapsible>
      </div>
    </form>
  );
};

export default Admin;
