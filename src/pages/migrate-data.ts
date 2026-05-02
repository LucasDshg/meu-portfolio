import { doc, updateDoc } from "firebase/firestore";
import { db } from "../data/firebase";
import { IProfile } from "../interface/portfolio.interface";

export const migrateUserData = async (uid: string, oldData: any) => {
  const userRef = doc(db, "users", uid);

  const newData: IProfile = {
    name: oldData.name || "",
    imageUrl: oldData.profileImageUrl || "",
    cvLink: oldData.cvLink || "",
    slug: oldData.slug || "",
    // Converte menu de objeto para array
    menu: oldData.menu
      ? Object.entries(oldData.menu).map(([id, val]: any) => ({ id, ...val }))
      : [],
    // Converte socials de objeto para array
    socials: oldData.socials
      ? Object.entries(oldData.socials).map(([name, link]: any, index) => ({
          id: name,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          link,
          order: index,
        }))
      : [],
    pages: {
      home: {
        title: `Olá, eu sou ${oldData.name}`,
        description: oldData.description || "",
      },
      about: {
        title: `Sou ${oldData.name}`,
        description: oldData.aboutBio || [],
      },
      experience: {
        title: "Minha trajetória profissional",
        description: oldData.experience || "",
        disponibleText: "Estou sempre aberto a novos desafios.",
      },
      project: {
        title: "Meus Projetos",
        description: oldData.project || "",
      },
    },
  };

  await updateDoc(userRef, newData as any);
  console.log("Migração concluída para o usuário:", uid);
};
