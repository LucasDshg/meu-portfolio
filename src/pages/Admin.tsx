import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  RiAdvertisementLine,
  RiSaveLine,
  RiVipCrownLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { logAppError, logInteraction } from '../data/analytics.service';
import { IProfile } from '../interface/portfolio.interface';
import { Button } from '../Lib/Button';
import { Card } from '../Lib/Card';
import { Heading } from '../Lib/Heading';
import { Tabs } from '../Lib/Tabs';
import { Text } from '../Lib/Text';
import { Toast } from '../Lib/Toast';
import { AboutPageSection } from './admin/components/AboutPageSection';
import { ArticleListSection } from './admin/components/articles/ArticleListSection';
import { ArticlePageSection } from './admin/components/articles/ArticlePageSection';
import { CertificationListSection } from './admin/components/certification/CertificationListSection';
import { ExperienceListSection } from './admin/components/experiences/ExperienceListSection';
import { ExperiencePageSection } from './admin/components/experiences/ExperiencePageSection';
import { HomePageSection } from './admin/components/HomePageSection';
import { PersonalInfoSection } from './admin/components/PersonalInfoSection';
import { ProjectListSection } from './admin/components/project/ProjectListSection';
import { ProjectPageSection } from './admin/components/project/ProjectPageSection';
import { SocialSection } from './admin/components/SocialSection';

const Admin: React.FC = () => {
  const {
    user,
    profile,
    updateProfile,
    experiences,
    projects,
    certifications,
    articles,
    loading,
  } = usePortfolio();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect((): void => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      const formData = new FormData(e.currentTarget);

      const updatedProfile: Partial<IProfile> = {
        name: (formData.get('name') as string) || profile?.name,
        slug: (formData.get('slug') as string) || profile?.slug,
        phone: (formData.get('phone') as string) || profile?.phone,
        email: (formData.get('email') as string) || profile?.email,
        imageUrl: (formData.get('imageUrl') as string) || profile?.imageUrl,
        cvLink: (formData.get('cvLink') as string) || profile?.cvLink,
        adFreeUntil: formData.get('adFreeUntil')
          ? new Date(formData.get('adFreeUntil') as string)
          : profile?.adFreeUntil,
        socials: profile?.socials.map((s) => ({
          ...s,
          link: (formData.get(`social-${s.id}`) as string) || null,
        })),
        pages: {
          ...profile.pages,
          home: {
            ...profile.pages.home,
            title:
              (formData.get('home-title') as string) ||
              profile.pages.home.title,
            description:
              (formData.get('home-description') as string) ||
              profile.pages.home.description,
          },
          about: {
            ...profile.pages.about,
            title:
              (formData.get('about-title') as string) ||
              profile.pages.about.title,
            description: profile.pages.about.description.map(
              (_, index) =>
                (formData.get(`about-description-${index + 1}`) as string) ||
                '',
            ),
            show: formData.get('show-about') === 'on',
          },
          experience: {
            ...profile.pages.experience,
            title: formData.get('experience-title') as string,
            description: formData.get('experience-description') as string,
            disponibleText: formData.get('experience-disponibleText') as string,
            show: formData.get('show-experience') === 'on',
          },
          project: {
            ...profile.pages.project,
            title: formData.get('project-title') as string,
            description: formData.get('project-description') as string,
            show: formData.get('show-project') === 'on',
          },
          articles: {
            ...profile.pages.articles,
            title:
              (formData.get('articles-title') as string) ||
              profile.pages.articles.title,
            description:
              (formData.get('articles-description') as string) ||
              profile.pages.articles.description,
            show: formData.get('show-articles') === 'on',
          },
        },
      };

      await updateProfile(updatedProfile);

      setToast({
        message: 'Configurações salvas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      logAppError('Admin_Global_Save', error);
      setToast({
        message: 'Erro ao salvar as configurações.',
        type: 'error',
      });
    }
  };

  const getAdFreeDate = (date: any) => {
    if (!date) return null;
    if (date.toDate) return date.toDate();
    return new Date(date);
  };

  const now = new Date().getTime();
  const adFreeDate = getAdFreeDate(profile?.adFreeUntil);
  const isAdFree = adFreeDate ? adFreeDate.getTime() > now : false;

  const STRIPE_PAYMENT_URL = 'https://buy.stripe.com/exemplo-link-pagamento';

  const adminTabs = [
    {
      id: 'general',
      label: 'Geral',
      content: (
        <div className="space-y-6 p-4">
          <PersonalInfoSection profile={profile} />
          <SocialSection socials={profile?.socials} />

          <Card variant="primary">
            <div className="flex items-center gap-3 mb-4">
              <RiAdvertisementLine className="h-5 w-5 text-teal-500" />
              <Heading className="text-xl">Plano Pro</Heading>
            </div>
            {isAdFree ? (
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
                <RiVipCrownLine size={20} />
                <span>
                  Sua assinatura está ativa até{' '}
                  {adFreeDate?.toLocaleDateString('pt-BR')}
                </span>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <Text className="mb-4">
                    Remova todos os anúncios do seu portfólio e blog por apenas
                    R$ 25,00/ano.
                  </Text>
                </div>
                <Button
                  href={STRIPE_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  onClick={() => logInteraction('upgrade_pro_click', 'button')}
                >
                  Ativar Plano Pro
                </Button>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      id: 'home',
      label: 'Home',
      content: <HomePageSection data={profile?.pages.home} />,
    },
    {
      id: 'about',
      label: 'Sobre',
      content: (
        <div className="space-y-6">
          <AboutPageSection data={profile?.pages.about} />
        </div>
      ),
    },
    {
      id: 'experience',
      label: 'Experiência',
      content: (
        <div className="space-y-6">
          <ExperiencePageSection data={profile?.pages.experience} />
          <ExperienceListSection experiences={experiences} />
        </div>
      ),
    },
    {
      id: 'certifications',
      label: 'Certificações',
      content: (
        <div className="space-y-6">
          <CertificationListSection certifications={certifications} />
        </div>
      ),
    },
    {
      id: 'projects',
      label: 'Projetos',
      content: (
        <div className="space-y-6">
          <ProjectPageSection data={profile?.pages.project} />
          <ProjectListSection projects={projects} />
        </div>
      ),
    },
    {
      id: 'articles',
      label: 'Artigos',
      content: (
        <div className="space-y-6">
          <ArticlePageSection data={profile?.pages.articles} />
          <ArticleListSection articles={articles} />
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSave} className="mt-9 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <Heading className="text-4xl">Meu Portfólio</Heading>
          <Text className="mt-2">
            Configure sua identidade visual e informações técnicas.
          </Text>
        </div>
        <Button type="submit" className="gap-2">
          <RiSaveLine size={20} />
          Salvar Alterações
        </Button>
      </div>

      <Tabs tabs={adminTabs} />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </form>
  );
};

export default Admin;
