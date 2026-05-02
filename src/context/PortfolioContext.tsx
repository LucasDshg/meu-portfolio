import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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

  return (
    <PortfolioContext.Provider
      value={{ user, profile, experiences, projects, certifications, loading }}
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
