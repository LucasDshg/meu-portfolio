import { motion } from "framer-motion";
import React from "react";
import { RiGithubLine, RiLinkedinLine, RiMailLine } from "react-icons/ri";
import { Heading } from "../Lib/Heading";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";
import { profileData, socialsData } from "../data/data";

const About: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12 mt-32">
      <div className="lg:pl-20">
        <div className="max-w-xs px-2.5 lg:max-w-none">
          <motion.img
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 0.5 }}
            src={profileData.profileImageUrl}
            alt="Foto de perfil"
            className="aspect-square rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 shadow-lg"
          />
        </div>
      </div>

      <div className="lg:order-first lg:row-span-2">
        <Heading className="text-4xl sm:text-5xl">
          Sou {profileData.name}. Moro em Vila Velha - ES
        </Heading>
        <div className="mt-6 space-y-7">
          {profileData.aboutBio?.map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Text>{paragraph}</Text>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:pl-20">
        <ul role="list" className="space-y-4">
          <li className="flex gap-4 items-center">
            <TextLink
              href={socialsData.linkedin}
              className="flex gap-2 items-center text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              <RiLinkedinLine className="size-6" />
              Siga no LinkedIn
            </TextLink>
          </li>

          <li className="flex ">
            <TextLink
              href={socialsData.github}
              className="flex gap-2 items-center text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              <RiGithubLine className="size-6" />
              Siga no GitHub
            </TextLink>
          </li>
          <li className="border-t border-zinc-100 mb-8 mt-8 dark:border-zinc-700/40"></li>
          <li className="flex gap-4 items-center">
            <TextLink
              href={`mailto:${socialsData.email}`}
              className="flex gap-2 items-center text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              <RiMailLine className="size-6" />
              {socialsData.email}
            </TextLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
