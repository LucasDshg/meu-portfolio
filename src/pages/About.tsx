import { motion } from "framer-motion";
import React from "react";
import { Card } from "../Lib/Card";
import { Heading } from "../Lib/Heading";
import { Subheading } from "../Lib/Subheading";
import { Text } from "../Lib/Text";
import { TextLink } from "../Lib/TextLink";
import { usePortfolio } from "../context/PortfolioContext";
import { getSocialHref, getSocialIcon } from "../utils/navigation.utils";

const About: React.FC = () => {
  const { profile, certifications } = usePortfolio();

  const activeSocials =
    profile?.socials
      ?.filter((s) => s.link !== null)
      .sort((a, b) => a.order - b.order) || [];

  return (
    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12 mt-32">
      <div className="lg:pl-20">
        <div className="max-w-xs px-2.5 lg:max-w-none">
          <motion.img
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 0.5 }}
            src={profile?.imageUrl}
            alt="Foto de perfil"
            className="aspect-square rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 shadow-lg"
          />
        </div>
      </div>

      <div className="lg:order-first lg:row-span-2">
        <Heading className="text-4xl sm:text-5xl">
          {profile!.pages.about.title}
        </Heading>
        <div className="mt-6 space-y-7">
          {profile!.pages.about.description.map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Text className="text-justify">{paragraph}</Text>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:pl-20 space-y-10">
        <Card variant="outline">
          <Subheading className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Redes Sociais
          </Subheading>
          <ul role="list" className="space-y-4">
            {activeSocials.map((social) => {
              const Icon = getSocialIcon(social.name);
              return (
                <li key={social.id} className="flex">
                  <TextLink
                    href={getSocialHref(social.name, social.link!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center text-sm font-medium text-zinc-950 dark:text-white z-10"
                  >
                    {Icon && <Icon className="size-6" />}
                    {social.name}
                  </TextLink>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card variant="outline">
          <Subheading className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Certificações
          </Subheading>
          <ul role="list" className="space-y-6">
            {certifications?.map((cert) => (
              <li key={cert.id} className="flex flex-col">
                <Text className="text-sm font-medium !text-zinc-950 dark:!text-white">
                  {cert.name}
                </Text>
                <Text className="text-xs mt-1">
                  {cert.institution} — {cert.year}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default About;
