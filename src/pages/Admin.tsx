import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { RiSaveLine } from "react-icons/ri";
import { usePortfolio } from "../context/PortfolioContext";
import { IProfile } from "../interface/portfolio.interface";
import { Button } from "../Lib/Button";
import { Heading } from "../Lib/Heading";
import { Tabs } from "../Lib/Tabs";
import { Text } from "../Lib/Text";
import { Toast } from "../Lib/Toast";
import { AboutPageSection } from "./admin/components/AboutPageSection";
import { ExperienceListSection } from "./admin/components/ExperienceListSection";
import { ExperiencePageSection } from "./admin/components/ExperiencePageSection";
import { HomePageSection } from "./admin/components/HomePageSection";
import { PersonalInfoSection } from "./admin/components/PersonalInfoSection";
import { ProjectPageSection } from "./admin/components/ProjectPageSection";
import { SocialSection } from "./admin/components/SocialSection";

const Admin: React.FC = () => {
  const { profile, updateProfile, experiences, projects, certifications } =
    usePortfolio();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const formData = new FormData(e.currentTarget);

      const updatedProfile: Partial<IProfile> = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        email: formData.get("email") as string,
        imageUrl: formData.get("imageUrl") as string,
        cvLink: formData.get("cvLink") as string,
        socials: profile.socials.map((s) => ({
          ...s,
          link: (formData.get(`social-${s.id}`) as string) || null,
        })),
        pages: {
          ...profile.pages,
          home: {
            ...profile.pages.home,
            title: formData.get("home-title") as string,
            description: formData.get("home-description") as string,
          },
          about: {
            ...profile.pages.about,
            title: formData.get("about-title") as string,
            description: (formData.get("about-description") as string)
              .split("\n")
              .filter((p) => p.trim() !== ""),
            show: formData.get("show-about") === "on",
          },
          experience: {
            ...profile.pages.experience,
            title: formData.get("experience-title") as string,
            description: formData.get("experience-description") as string,
            disponibleText: formData.get("experience-disponibleText") as string,
            show: formData.get("show-experience") === "on",
          },
          project: {
            ...profile.pages.project,
            title: formData.get("project-title") as string,
            description: formData.get("project-description") as string,
            show: formData.get("show-project") === "on",
          },
        },
      };

      await updateProfile(updatedProfile);

      setToast({
        message: "Configurações salvas com sucesso!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Erro ao salvar as configurações.",
        type: "error",
      });
    }
  };

  const adminTabs = [
    {
      id: "general",
      label: "Geral",
      content: (
        <div className="space-y-6">
          <PersonalInfoSection profile={profile} />
          <SocialSection socials={profile?.socials} />
        </div>
      ),
    },
    {
      id: "home",
      label: "Home",
      content: <HomePageSection data={profile?.pages.home} />,
    },
    {
      id: "about",
      label: "Sobre",
      content: (
        <div className="space-y-6">
          <AboutPageSection data={profile?.pages.about} />
          {/* CertificationListSection aqui no futuro */}
        </div>
      ),
    },
    {
      id: "experience",
      label: "Experiência",
      content: (
        <div className="space-y-6">
          <ExperiencePageSection data={profile?.pages.experience} />
          <ExperienceListSection experiences={experiences} />
        </div>
      ),
    },
    {
      id: "projects",
      label: "Projetos",
      content: (
        <div className="space-y-6">
          <ProjectPageSection data={profile?.pages.project} />
          {/* ProjectListSection aqui no futuro */}
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSave} className="mt-32 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <Heading className="text-4xl">Meu Portfólio</Heading>
          <Text className="mt-2">
            Configure sua identidade visual e informações técnicas.
          </Text>
        </div>
        <Button type="submit" className="gap-2">
          <RiSaveLine size={20} />
          Salvar Alterações
        </Button>
      </div>

      <Tabs tabs={adminTabs} />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </form>
  );
};

export default Admin;
