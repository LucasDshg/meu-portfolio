// components/HeroSection.tsx
import { motion } from 'framer-motion';
import React from 'react';
import { RiWhatsappLine } from 'react-icons/ri';
import { IHeroSectionProps } from '../interface/hero.interface';
import { Button } from '../Lib/Button';
import { Text } from '../Lib/Text';
import { TextLink } from '../Lib/TextLink';
import { getSocialHref, getSocialIcon } from '../utils/navigation.utils';

const HeroSection: React.FC<IHeroSectionProps> = ({
  title,
  description,
  imageUrl,
  cvLink,
  socials,
  phone,
}) => {
  const activeSocials =
    socials?.filter((s) => s.link !== null).sort((a, b) => a.order - b.order) ||
    [];

  return (
    <section id="hero" className="mt-9">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-[2fr_1fr] lg:gap-y-12 mt-32 items-center">
        <div className="lg:pl-20">
          <div className="max-w-xs px-4 mx-auto lg:mx-0">
            <motion.img
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.5 }}
              src={imageUrl}
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
            <Text className="text-justify">{description}</Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex gap-6"
          >
            {activeSocials.map((social) => {
              const Icon = getSocialIcon(social.name);
              return (
                <TextLink
                  key={social.id}
                  variant="icon"
                  href={getSocialHref(social.name, social.link!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {Icon && <Icon className="size-6" />}
                </TextLink>
              );
            })}
          </motion.div>

          {(phone || cvLink) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              {phone ? (
                <Button
                  href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                  target="_blank"
                  variant="primary"
                  className="gap-2"
                >
                  <RiWhatsappLine size={20} />
                  Entre em contato
                </Button>
              ) : (
                cvLink && (
                  <Button href={cvLink} download variant="primary">
                    Download CV
                  </Button>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
