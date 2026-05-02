import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { RiExternalLinkLine } from "react-icons/ri";
import { Badge } from "../Lib/Badge";
import { Button } from "../Lib/Button";
import { Card } from "../Lib/Card";
import { Heading } from "../Lib/Heading";
import { Subheading } from "../Lib/Subheading";
import { Text } from "../Lib/Text";
import { usePortfolio } from "../context/PortfolioContext";

const ProjectCarousel = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <AnimatePresence mode="wait">
        <motion.img
          key={`bg-${currentIndex}`}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 rounded-md"
          aria-hidden="true"
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Capa do projeto ${name} - imagem ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain z-10 p-2 rounded-md"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-4 bg-teal-500" : "w-1.5 bg-white/50"
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
    <div className="mt-32">
      <div className="max-w-2xl">
        <Heading className="text-4xl sm:text-5xl">
          Alguns dos projetos que participei ou desenvolvi.
        </Heading>
        <Text className="mt-6">{profile!.project}</Text>
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
                className="overflow-hidden !p-0 !flex-row"
              >
                <div className="relative w-48 sm:w-64 md:w-96 overflow-hidden flex-none border-r border-zinc-100 dark:border-zinc-700/40">
                  <ProjectCarousel
                    images={project.images!}
                    name={project.name}
                  />
                </div>

                <div className="flex flex-col p-6 flex-1">
                  <Subheading>{project.name}</Subheading>
                  <Text className="mt-2 text-sm flex-grow">
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
                        variant="primary"
                        className="flex-1"
                      >
                        <RiExternalLinkLine className="mr-2 h-4 w-4" />
                        Live
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
