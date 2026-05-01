import React from "react";
import ExperienceSection from "../components/ExperienceSection";
import HeroSection from "../components/HeroSection";
import ProjectsSection from "../components/ProjectsSection";
import {
  experiencesData,
  profileData,
  projectsData,
  socialsData,
} from "../data/data";

const Home: React.FC = () => {
  return (
    <main>
      <HeroSection
        {...profileData}
        socials={socialsData}
        cvLink={profileData.cvLink}
      />
      <ExperienceSection experiences={experiencesData} />
      <ProjectsSection projects={projectsData} />
    </main>
  );
};

export default Home;
