import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { RiExternalLinkLine } from 'react-icons/ri';
import { usePortfolio } from '../context/PortfolioContext';
import { Avatar } from '../Lib/Avatar';
import { Badge } from '../Lib/Badge';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Subheading } from '../Lib/Subheading';
import { Text } from '../Lib/Text';

interface IProjectCarouselProps {
  images: string[];
  name: string;
}

const ProjectCarousel: React.FC<IProjectCarouselProps> = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect((): void | (() => void) => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev: number): number => (prev + 1) % images.length);
    }, 4000);
    return (): void => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-full aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Capa do projeto ${name} - imagem ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover z-10 rounded-md"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-4 bg-teal-500' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Projects: React.FC = () => {
  const { projects, profile } = usePortfolio();

  return (
    <div className="mt-24">
      <div className="max-w-2xl">
        <Heading className="text-4xl sm:text-5xl">
          {profile?.pages.project.title}
        </Heading>
        <Text className="mt-6 text-justify">
          {profile?.pages.project.description}
        </Text>
      </div>

      <div className="mt-16 sm:mt-20">
        <ul role="list" className="flex flex-col gap-y-12">
          {projects?.map((project) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card
                variant="outline"
                className="overflow-hidden !p-0 flex-col md:flex-row"
              >
                <div className="relative w-full sm:w-full md:w-96 aspect-square overflow-hidden flex-none border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-700/40">
                  <ProjectCarousel
                    images={project.images!}
                    name={project.name}
                  />
                </div>

                <div className="flex flex-col p-6 flex-1">
                  <div className="flex gap-3 items-center">
                    <Avatar size="size-12" src={project.image} />
                    <Subheading color="text-zinc-950 dark:text-white">
                      {project.name}
                    </Subheading>
                  </div>

                  <Text className="mt-2 text-sm flex-grow text-justify">
                    {project.description}
                  </Text>

                  <div className="mt-4 flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} color="zinc">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    {project.githubLink && (
                      <Button
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        className="flex-1"
                      >
                        <FaGithub className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    )}
                    {project.liveLink && (
                      <Button
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        className="flex-1"
                      >
                        <RiExternalLinkLine className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
