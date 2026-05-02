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
      <HeroSection {...profile} socials={profile.socials} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
    </main>
  );
};

export default Home;
