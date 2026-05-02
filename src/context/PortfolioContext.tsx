import { onAuthStateChanged, User } from 'firebase/auth';
import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../data/firebase';
import {
  createInitialProfileDocument,
  deleteSubCollectionItem,
  getProfileAndUidBySlug,
  getProfileByUid,
  getSubCollectionItems,
  saveSubCollectionItem,
  TCollection,
  updateProfileDocument,
} from '../data/firebase.service';
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
}): JSX.Element => {
  const { pathname } = useLocation();
  const slug = pathname.startsWith('/u/') ? pathname.split('/')[2] : undefined;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [certifications, setCertifications] = useState<ICertifications[]>([]);
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

  useEffect(() => {
    const loadPortfolioData = async (): Promise<void> => {
      setLoading(true);
      setProfile(null);
      setExperiences([]);
      setProjects([]);
      setCertifications([]);

      if (slug) {
        await fetchDataBySlug(slug);
      } else if (user) {
        await fetchDataByUid(user.uid);
      } else {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [slug, user]);

  const fetchDataBySlug = async (userSlug: string): Promise<void> => {
    try {
      const result = await getProfileAndUidBySlug(userSlug);
      if (result) {
        await fetchDataByUid(result.uid);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao buscar slug:', error);
      setLoading(false);
    }
  };

  const fetchDataByUid = async (uid: string): Promise<void> => {
    try {
      let currentProfile = await getProfileByUid(uid);

      if (!currentProfile && user && user.uid === uid) {
        currentProfile = await createInitialProfileDocument(user);
      }

      setProfile(currentProfile);

      if (currentProfile) {
        const [expData, projData, certData] = await Promise.all([
          getSubCollectionItems<IExperience>(uid, 'experiences'),
          getSubCollectionItems<IProject>(uid, 'projects'),
          getSubCollectionItems<ICertifications>(uid, 'certifications'),
        ]);

        setExperiences(expData);
        setProjects(projData);
        setCertifications(certData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    updatedData: Partial<IProfile>,
  ): Promise<void> => {
    if (!user || !profile)
      throw new Error('Usuário não autenticado ou perfil não carregado.');

    try {
      await updateProfileDocument(user.uid, updatedData);
      setProfile((prev) =>
        prev ? ({ ...prev, ...updatedData } as IProfile) : prev,
      );
    } catch (error: any) {
      throw new Error('Erro ao salvar perfil');
    }
  };

  const saveSubItem = async <T,>(
    collectionName: TCollection,
    data: T,
  ): Promise<void> => {
    if (!user || !profile)
      throw new Error('Usuário não autenticado ou perfil não carregado.');
    try {
      await saveSubCollectionItem<T>(user.uid, collectionName, data);
      await fetchDataByUid(user.uid);
    } catch (error: any) {
      throw new Error(`Erro ao salvar em ${collectionName}:`);
    }
  };

  const deleteSubItem = async (
    collectionName: TCollection,
    id: string | number,
  ): Promise<void> => {
    if (!user || !profile)
      throw new Error('Usuário não autenticado ou perfil não carregado.');
    try {
      await deleteSubCollectionItem(user.uid, collectionName, id);
      await fetchDataByUid(user.uid);
    } catch (error: any) {
      throw new Error('Erro ao remover item');
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        user,
        profile,
        experiences,
        projects,
        certifications,
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

export const usePortfolio = (): IPortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context)
    throw new Error(
      'usePortfolio deve ser usado dentro de um PortfolioProvider',
    );
  return context;
};
