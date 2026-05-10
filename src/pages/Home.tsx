import React from 'react';
import NotFound from '../components/NotFound';
import { usePortfolio } from '../context/PortfolioContext';
import { ArticlesSection } from './home/componentes/ArticlesSection';
import ExperienceSection from './home/componentes/ExperienceSection';
import HeroSection from './home/componentes/HeroSection';
import ProjectsSection from './home/componentes/ProjectsSection';

const Home: React.FC = () => {
  const { profile, experiences, projects, articles, loading } = usePortfolio();

  if (loading) return null;
  if (!profile) return <NotFound />;

  const homePage = profile.pages?.home;

  return (
    <main>
      <HeroSection
        name={profile.name}
        title={homePage?.title || ''}
        description={homePage?.description || ''}
        imageUrl={profile.imageUrl}
        email={profile.email}
        socials={profile.socials}
        phone={profile.phone}
      />
      {profile.pages?.project?.show && <ProjectsSection projects={projects} />}
      {profile.pages?.articles?.show && <ArticlesSection articles={articles} />}
      {profile.pages?.experience?.show && (
        <ExperienceSection experiences={experiences} />
      )}
    </main>
  );
};

export default Home;
