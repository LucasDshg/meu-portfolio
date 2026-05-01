// components/ProjectsSection.tsx
import { motion } from "framer-motion";
import React from "react";
import { FaGithub } from "react-icons/fa6";
import { RiExternalLinkLine } from "react-icons/ri";
import { Avatar } from "../Lib/Avatar";
import { Badge } from "../Lib/Badge";
import { Button } from "../Lib/Button";
import { Card } from "../Lib/Card";
import { Heading } from "../Lib/Heading";
import { Subheading } from "../Lib/Subheading";
import { Text } from "../Lib/Text";

interface IProject {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  githubLink: string | null;
  liveLink: string | null;
  images?: string[];
  image: string | null;
}

interface IProjectsSectionProps {
  projects: IProject[];
}

const ProjectsSection: React.FC<IProjectsSectionProps> = ({ projects }) => {
  return (
    <section id="projects" className="mt-24 md:mt-28">
      <Heading className="mb-8">Projetos</Heading>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group relative flex flex-col items-start"
          >
            <Card variant="outline">
              <Avatar className="size-10" src={project.image} />
              <Subheading className="mt-6">{project.name}</Subheading>
              <Text className="relative z-10 mt-2 text-sm flex-grow">
                {project.description}
              </Text>
              {project.technologies && project.technologies.length > 0 && (
                <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} color="zinc">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="relative z-10 mt-6 flex gap-4 text-sm font-medium">
                {project.githubLink && (
                  <Button href={project.githubLink} variant="outline">
                    <FaGithub className="h-4 w-4 flex-none mr-1" />
                    GitHub
                  </Button>
                )}
                {project.liveLink && (
                  <Button href={project.liveLink} variant="outline">
                    <RiExternalLinkLine className="h-5 w-5 flex-none mr-1 stroke-[0.5]" />
                    Ver Projeto
                  </Button>
                )}
              </div>
            </Card>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
