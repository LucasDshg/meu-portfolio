// components/HeroSection.tsx
import { motion } from "framer-motion";
import React from "react";
import { RiGithubLine, RiLinkedinLine, RiMailLine } from "react-icons/ri";
import { Button } from "../Lib/Button";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";
import { IHeroSectionProps } from "../interface/hero.interface";

const HeroSection: React.FC<IHeroSectionProps> = ({
  title,
  description,
  profileImageUrl,
  cvLink,
  socials,
}) => {
  return (
    <section id="hero" className="mt-9">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-[2fr_1fr] lg:gap-y-12 mt-32 items-center">
        <div className="lg:pl-20">
          <div className="max-w-xs px-4 mx-auto lg:mx-0">
            <motion.img
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.5 }}
              src={profileImageUrl}
              alt="Foto de perfil"
              className="aspect-square rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 shadow-lg"
            />
          </div>
        </div>
        <div className="lg:order-first">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Text>{description}</Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex gap-6"
          >
            {socials.github && (
              <TextLink
                variant="icon"
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siga no GitHub"
              >
                <RiGithubLine className="h-6 w-6" />
              </TextLink>
            )}
            {socials.linkedin && (
              <TextLink
                variant="icon"
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siga no LinkedIn"
              >
                <RiLinkedinLine className="h-6 w-6" />
              </TextLink>
            )}
            {socials.email && (
              <TextLink
                variant="icon"
                href={`mailto:${socials.email}`}
                aria-label="Enviar e-mail"
              >
                <RiMailLine className="h-7 w-7" />
              </TextLink>
            )}
          </motion.div>

          {cvLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button href={cvLink} download variant="primary">
                Download CV
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
