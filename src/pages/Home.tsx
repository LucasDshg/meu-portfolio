import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import ExperienceSection from './home/componentes/ExperienceSection';
import HeroSection from './home/componentes/HeroSection';
import ProjectsSection from './home/componentes/ProjectsSection';

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
        email={profile.email}
        socials={profile.socials}
        phone={profile.phone}
      />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
    </main>
  );
};

export default Home;
