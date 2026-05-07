import { onAuthStateChanged, User } from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { logAppError } from '../data/analytics.service';
import { auth } from '../data/firebase';
import {
  createInitialProfileDocument,
  deleteSubCollectionItem,
  ECollection,
  getProfileAndUidBySlug,
  getProfileByUid,
  getSubCollectionItems,
  saveSubCollectionItem,
  TCollection,
  updateProfileDocument,
} from '../data/firebase.service';
import { IArticle } from '../interface/article.interface';
import { ICertifications } from '../interface/certifications.interface';
import { IExperience } from '../interface/experience.interface';
import { IProfile } from '../interface/portfolio.interface';
import { IProject } from '../interface/project.interface';

interface IPortfolioContextType {
  user: User | null;
  profile: IProfile | null;
  experiences: IExperience[];
  projects: IProject[];
  certifications: ICertifications[];
  articles: IArticle[];
  loading: boolean;
  updateProfile: (updatedData: Partial<IProfile>) => Promise<void>;
  saveSubItem: <T>(collectionName: TCollection, data: T) => Promise<void>;
  deleteSubItem: (
    collectionName: TCollection,
    id: string | number,
  ) => Promise<void>;
}

const PortfolioContext = createContext<IPortfolioContextType | undefined>(
  undefined,
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation();
  const slug = pathname.startsWith('/u/') ? pathname.split('/')[2] : undefined;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [certifications, setCertifications] = useState<ICertifications[]>([]);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser): Promise<void> => {
        setUser(currentUser);
      },
    );

    return () => unsubscribe();
  }, []);

  const fetchDataByUid = useCallback(
    async (uid: string): Promise<void> => {
      try {
        let currentProfile = await getProfileByUid(uid);

        if (!currentProfile && user && user.uid === uid) {
          currentProfile = await createInitialProfileDocument(user);
        }

        setProfile(currentProfile);

        if (currentProfile) {
          const [expData, projData, certData, articlesData] = await Promise.all(
            [
              getSubCollectionItems<IExperience>(uid, ECollection.EXPERIENCES),
              getSubCollectionItems<IProject>(uid, ECollection.PROJECTS),
              getSubCollectionItems<ICertifications>(
                uid,
                ECollection.CERTIFICATIONS,
              ),
              getSubCollectionItems<IArticle>(uid, ECollection.ARTICLES),
            ],
          );

          setExperiences(
            expData.sort(
              (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0),
            ),
          );
          setProjects(projData.sort((a, b) => a.order - b.order));
          setCertifications(certData.sort((a, b) => b.year - a.year));
          setArticles(
            articlesData.sort(
              (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0),
            ),
          );
        }
      } catch (error) {
        logAppError('fetchDataByUid', error);
        console.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const fetchDataBySlug = useCallback(
    async (userSlug: string): Promise<void> => {
      try {
        const result = await getProfileAndUidBySlug(userSlug);
        if (result) {
          await fetchDataByUid(result.uid);
        } else {
          setLoading(false);
        }
      } catch (error) {
        logAppError('fetchDataBySlug', error);
        console.error('Erro ao buscar slug:');
        setLoading(false);
      }
    },
    [fetchDataByUid],
  );

  useEffect(() => {
    const loadPortfolioData = async (): Promise<void> => {
      setLoading(true);
      setProfile(null);
      setExperiences([]);
      setProjects([]);
      setCertifications([]);
      setArticles([]);

      if (slug) {
        await fetchDataBySlug(slug);
      } else if (user) {
        await fetchDataByUid(user.uid);
      } else {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [slug, user, fetchDataBySlug, fetchDataByUid]);

  const updateProfile = useCallback(
    async (updatedData: Partial<IProfile>): Promise<void> => {
      if (!user || !profile)
        throw new Error('Usuário não autenticado ou perfil não carregado.');

      try {
        await updateProfileDocument(user.uid, updatedData);
        setProfile((prev) =>
          prev ? ({ ...prev, ...updatedData } as IProfile) : prev,
        );
      } catch (error: any) {
        logAppError('updateProfile', error);
        throw new Error('Erro ao salvar perfil');
      }
    },
    [user, profile],
  );

  const saveSubItem = useCallback(
    async <T,>(collectionName: TCollection, data: T): Promise<void> => {
      if (!user || !profile)
        throw new Error('Usuário não autenticado ou perfil não carregado.');
      try {
        await saveSubCollectionItem<T>(user.uid, collectionName, data);
        await fetchDataByUid(user.uid);
      } catch (error: any) {
        logAppError('saveSubItem', error);
        throw new Error(`Erro ao salvar em ${collectionName}:`);
      }
    },
    [user, profile, fetchDataByUid],
  );

  const deleteSubItem = useCallback(
    async (collectionName: TCollection, id: string | number): Promise<void> => {
      if (!user || !profile)
        throw new Error('Usuário não autenticado ou perfil não carregado.');
      try {
        await deleteSubCollectionItem(user.uid, collectionName, id);
        await fetchDataByUid(user.uid);
      } catch (error: any) {
        logAppError('deleteSubItem', error);
        throw new Error('Erro ao remover item');
      }
    },
    [user, profile, fetchDataByUid],
  );

  return (
    <PortfolioContext.Provider
      value={{
        user,
        profile,
        experiences,
        projects,
        certifications,
        articles,
        loading,
        updateProfile,
        saveSubItem,
        deleteSubItem,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolio = (): IPortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context)
    throw new Error(
      'usePortfolio deve ser usado dentro de um PortfolioProvider',
    );
  return context;
};
