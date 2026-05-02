// components/ExperienceSection.tsx
import { motion } from "framer-motion";
import React from "react";
import { IExperienceSectionProps } from "../interface/experience.interface";
import { Badge } from "../Lib/Badge";
import { Button } from "../Lib/Button";
import { Heading } from "../Lib/Heading";
import { Subheading } from "../Lib/Subheading";
import { Text } from "../Lib/Text";
import { pathName } from "../utils/navigation.utils";

const ExperienceSection: React.FC<IExperienceSectionProps> = ({
  experiences,
}) => {
  const path = pathName();
  const href = `/u/${path.slug}/experience`;

  return (
    <section id="experience" className="mt-24 md:mt-28">
      <Heading className="mb-8">Experiência</Heading>
      <div className="mt-12 space-y-16 border-l border-zinc-100 dark:border-zinc-700/40 ml-2">
        {experiences.slice(0, 2).map((exp, index) => (
          <motion.article
            key={`${exp.id}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-8 group"
          >
            <div className="absolute left-[-5px] top-2 h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-500 group-hover:bg-teal-500 transition-colors" />
            <Text className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {exp.duration}
            </Text>
            <Subheading className="mt-2 text-lg">{exp.role}</Subheading>
            <Text className="mt-4 text-justify">{exp.description}</Text>
            <div className="mt-4 flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <Badge key={tech} color="zinc">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button href={href} variant="outline">
          Ver todas as experiências
        </Button>
      </div>
    </section>
  );
};

export default ExperienceSection;
