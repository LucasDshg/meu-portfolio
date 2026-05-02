import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../data/firebase";
import { ICertifications } from "../interface/certifications.interface";
import { IExperience } from "../interface/experience.interface";
import { IProfile } from "../interface/portfolio.interface";
import { IProject } from "../interface/project.interface";

interface PortfolioContextType {
  user: User | null;
  profile: IProfile | null;
  experiences: IExperience[];
  projects: IProject[];
  certifications: ICertifications[];
  loading: boolean;
  updateProfile: (updatedData: Partial<IProfile>) => Promise<void>;
  saveSubItem: (
    collectionName: "experiences" | "projects" | "certifications",
    data: any,
  ) => Promise<void>;
  deleteSubItem: (
    collectionName: "experiences" | "projects" | "certifications",
    id: string | number,
  ) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation();
  const slug = pathname.startsWith("/u/") ? pathname.split("/")[2] : undefined;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [certifications, setCertifications] = useState<ICertifications[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPortfolioData = async () => {
      setLoading(true);

      if (slug) {
        await fetchDataBySlug(slug);
      } else if (user) {
        await fetchDataByUid(user.uid);
      }

      setLoading(false);
    };

    loadPortfolioData();
  }, [slug, user]);

  const fetchDataBySlug = async (userSlug: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("slug", "==", userSlug));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await fetchDataByUid(userDoc.id);
      }
    } catch (error) {
      console.error("Erro ao buscar slug:", error);
    }
  };

  const fetchDataByUid = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const profileSnap = await getDoc(userDocRef);

      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as IProfile);
      }

      const expSnap = await getDocs(
        query(collection(userDocRef, "experiences"), orderBy("id", "asc")),
      );
      setExperiences(expSnap.docs.map((doc) => doc.data() as IExperience));

      const projSnap = await getDocs(
        query(collection(userDocRef, "projects"), orderBy("id", "asc")),
      );
      setProjects(projSnap.docs.map((doc) => doc.data() as IProject));

      const certSnap = await getDocs(
        query(collection(userDocRef, "certifications"), orderBy("id", "asc")),
      );

      setCertifications(
        certSnap.docs.map((doc) => doc.data() as ICertifications),
      );
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSubItem = async (
    collectionName: "experiences" | "projects" | "certifications",
    data: any,
  ) => {
    if (!user) throw new Error("Usuário não autenticado");
    try {
      const userDocRef = doc(db, "users", user.uid);
      const subColRef = collection(userDocRef, collectionName);

      const docId = String(data.id || Date.now());
      const docRef = doc(subColRef, docId);

      await setDoc(docRef, { ...data, id: data.id || Number(docId) });
      await fetchDataByUid(user.uid);
    } catch (error) {
      console.error(`Erro ao salvar em ${collectionName}:`, error);
      throw error;
    }
  };

  const deleteSubItem = async (
    collectionName: "experiences" | "projects" | "certifications",
    id: string | number,
  ) => {
    if (!user) throw new Error("Usuário não autenticado");
    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(doc(userDocRef, collectionName, String(id)));
      await fetchDataByUid(user.uid);
    } catch (error) {
      console.error(`Erro ao deletar de ${collectionName}:`, error);
      throw error;
    }
  };

  const updateProfile = async (updatedData: Partial<IProfile>) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedData as any);

      setProfile((prev) =>
        prev ? ({ ...prev, ...updatedData } as IProfile) : null,
      );
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      throw error;
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

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context)
    throw new Error(
      "usePortfolio deve ser usado dentro de um PortfolioProvider",
    );
  return context;
};
