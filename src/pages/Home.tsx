import React from "react";
import ExperienceSection from "../components/ExperienceSection";
import HeroSection from "../components/HeroSection";
import ProjectsSection from "../components/ProjectsSection";
import { usePortfolio } from "../context/PortfolioContext";

const Home: React.FC = () => {
  const { profile, experiences, projects, loading } = usePortfolio();

  if (loading || !profile) return null;

  return (
    <main>
      <HeroSection
        name={profile.name}
        title={profile.pages.home.title}
        description={profile.pages.home.description}
        imageUrl={profile.imageUrl}
        cvLink={profile.cvLink}
        socials={profile.socials}
      />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
    </main>
  );
};

export default Home;
