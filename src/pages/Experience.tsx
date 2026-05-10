import { PDFDownloadLink } from '@react-pdf/renderer';
import { motion } from 'framer-motion';
import React from 'react';
import { RiBriefcaseLine, RiDownloadLine, RiMailLine } from 'react-icons/ri';
import { CVDocument } from '../components/CVDocument';
import NotFound from '../components/NotFound';
import { usePortfolio } from '../context/PortfolioContext';
import { logInteraction } from '../data/analytics.service';
import { Badge } from '../Lib/Badge';
import { Button } from '../Lib/Button';
import { Heading } from '../Lib/Heading';
import { Subheading } from '../Lib/Subheading';
import { Text } from '../Lib/Text';

const Experience: React.FC = () => {
  const { experiences, profile, certifications, loading } = usePortfolio();

  if (loading) return null;
  if (!profile) return <NotFound />;

  return (
    <div className="mt-24">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-x-12">
        <div className="lg:order-first">
          <Heading className="text-4xl sm:text-5xl">
            {profile?.pages?.experience?.title || ''}
          </Heading>
          <div className="mt-6">
            <Text className="text-justify">
              {profile?.pages?.experience?.description || ''}
            </Text>
          </div>

          <div className="mt-12 space-y-16 border-l border-zinc-100 dark:border-zinc-700/40 ml-2">
            {experiences.map((exp, index) => (
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
                <Subheading
                  className="mt-2 text-lg"
                  color="text-zinc-950 dark:text-white"
                >
                  {exp.role}
                </Subheading>
                <Text
                  className="mt-2 leading-relaxed text-sm text-justify"
                  color="text-teal-500"
                >
                  {exp.company}
                </Text>
                <Text className="mt-4 leading-relaxed text-justify">
                  {exp.description}
                </Text>
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
        </div>

        <aside className="lg:pl-10 space-y-10">
          <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <Subheading className="flex items-center gap-3">
              <RiBriefcaseLine className="h-5 w-5 text-zinc-400" />
              Disponibilidade
            </Subheading>
            <Text className="mt-4 text-sm">
              {profile?.pages?.experience?.disponibleText}
            </Text>
            {profile?.pages?.about?.show && (
              <Button href="/about" variant="secondary" className="mt-6 w-full">
                Sobre mim
              </Button>
            )}
          </div>
          <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <Subheading className="flex items-center gap-3">
              <RiMailLine className="h-5 w-5 text-zinc-400" />
              Contato
            </Subheading>
            <Button
              href={`mailto:${profile?.email}`}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full"
              onClick={() => logInteraction('contact_email_click', 'button')}
            >
              Enviar Email
            </Button>
          </div>

          <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <Subheading className="flex items-center gap-3">
              <RiDownloadLine className="h-5 w-5 text-zinc-400" />
              Currículo
            </Subheading>

            {profile && (
              <PDFDownloadLink
                document={
                  <CVDocument
                    profile={profile}
                    experiences={experiences}
                    certifications={certifications}
                  />
                }
                fileName={`curriculo-${profile.slug}.pdf`}
                className="block mt-6"
              >
                {({ loading: pdfLoading }) => (
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={pdfLoading}
                    onClick={() =>
                      logInteraction('cv_download_click', 'button')
                    }
                  >
                    {pdfLoading ? 'Gerando PDF...' : 'Baixar Currículo'}
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            {profile?.cvLink && (
              <Button
                href={profile.cvLink}
                variant="ghost"
                className="mt-2 w-full text-xs"
                onClick={() =>
                  logInteraction('cv_manual_download_click', 'button')
                }
              >
                Ou baixar versão manual
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Experience;
