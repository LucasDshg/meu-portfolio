// components/ProjectsSection.tsx
import { motion } from 'framer-motion';
import React from 'react';
import { FaGithub } from 'react-icons/fa6';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Avatar } from '../../../Lib/Avatar';
import { Badge } from '../../../Lib/Badge';
import { Button } from '../../../Lib/Button';
import { Card } from '../../../Lib/Card';
import { Heading } from '../../../Lib/Heading';
import { Subheading } from '../../../Lib/Subheading';
import { Text } from '../../../Lib/Text';
import { IProjectsSectionProps } from '../../../interface/project.interface';
import { usePathName } from '../../../utils/navigation.utils';

const ProjectsSection: React.FC<IProjectsSectionProps> = ({ projects }) => {
  const path = usePathName();
  const href = `/u/${path.slug}/project`;

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="mt-24 md:mt-24">
      <Heading className="mb-8">Projetos</Heading>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-2">
        {projects.slice(0, 2).map((project) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group relative flex flex-col items-start"
          >
            <Card variant="outline" height="h-full">
              <div className="flex gap-4">
                <Avatar size="size-16" src={project.image} />
                <Subheading
                  className="mt-6"
                  color="text-zinc-950 dark:text-white"
                >
                  {project.name}
                </Subheading>
              </div>
              <Text className="relative z-10 mt-2 text-sm flex-grow text-justify">
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
                  <Button
                    href={project.githubLink}
                    variant="outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="h-4 w-4 flex-none mr-1" />
                    GitHub
                  </Button>
                )}
                {project.liveLink && (
                  <Button
                    href={project.liveLink}
                    variant="outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <RiExternalLinkLine className="h-5 w-5 flex-none mr-1 stroke-[0.5]" />
                    Ver Projeto
                  </Button>
                )}
              </div>
            </Card>
          </motion.li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button href={href} variant="outline">
          Ver todaos os projetos
        </Button>
      </div>
    </section>
  );
};

export default ProjectsSection;
