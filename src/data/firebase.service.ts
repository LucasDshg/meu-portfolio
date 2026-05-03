import { User } from 'firebase/auth';
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
} from 'firebase/firestore';
import { IProfile } from '../interface/portfolio.interface';
import { db } from './firebase';
import { INITIAL_PROFILE_DATA } from './init-data';

const getUserDocRef = (uid: string): any => doc(db, 'users', uid);

export type TCollection = 'experiences' | 'projects' | 'certifications';
export enum ECollection {
  EXPERIENCES = 'experiences',
  PROJECTS = 'projects',
  CERTIFICATIONS = 'certifications',
}

/**
 * Busca o perfil de um usuário pelo seu UID.
 * @param uid O UID único do usuário.
 * @returns Os dados do perfil ou null se não encontrado.
 */
export async function getProfileByUid(uid: string): Promise<IProfile | null> {
  const userDocRef = getUserDocRef(uid);
  const profileSnap = await getDoc(userDocRef);
  return profileSnap.exists() ? (profileSnap.data() as IProfile) : null;
}

/**
 * Busca o perfil de um usuário e seu UID por um slug fornecido.
 * @param slug O slug único do portfólio.
 * @returns Um objeto contendo o perfil e o UID, ou null se não encontrado.
 */
export async function getProfileAndUidBySlug(
  slug: string,
): Promise<{ profile: IProfile; uid: string } | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { profile: userDoc.data() as IProfile, uid: userDoc.id };
  }
  return null;
}

/**
 * Cria um documento de perfil inicial para um novo usuário.
 * @param user O objeto Firebase User.
 * @returns Os dados do perfil recém-criado.
 */
export async function createInitialProfileDocument(
  user: User,
): Promise<IProfile> {
  if (!user.uid) throw new Error('User UID is required to create a profile.');

  const userDocRef = getUserDocRef(user.uid);
  const newProfile: IProfile = {
    ...INITIAL_PROFILE_DATA,
    email: user.email || '',
    name: user.displayName || '',
    slug: user.uid,
  };

  await setDoc(userDocRef, newProfile);
  return newProfile;
}

/**
 * Atualiza um documento de perfil existente de um usuário.
 * @param uid O UID único do usuário.
 * @param updatedData Os dados parciais do perfil para atualizar.
 */
export async function updateProfileDocument(
  uid: string,
  updatedData: Partial<IProfile>,
): Promise<void> {
  const userDocRef = getUserDocRef(uid);
  await updateDoc(userDocRef, updatedData as any);
}

/**
 * Busca todos os itens de uma subcoleção especificada para um dado usuário.
 * @param uid O UID único do usuário.
 * @param collectionName O nome da subcoleção (ex: "experiences").
 * @returns Um array de itens da subcoleção.
 */
export async function getSubCollectionItems<T>(
  uid: string,
  collectionName: string,
): Promise<T[]> {
  const userDocRef = getUserDocRef(uid);
  const subColRef = collection(userDocRef, collectionName);
  const snapshot = await getDocs(query(subColRef, orderBy('id', 'asc')));
  return snapshot.docs.map((doc) => doc.data() as T);
}

/**
 * Salva (cria ou atualiza) um item em uma subcoleção especificada para um dado usuário.
 * @param uid O UID único do usuário.
 * @param collectionName O nome da subcoleção.
 * @param data O objeto de dados para salvar. Deve conter um 'id' ou um será gerado.
 */
export async function saveSubCollectionItem<T>(
  uid: string,
  collectionName: string,
  data: T,
): Promise<void> {
  const userDocRef = getUserDocRef(uid);
  const subColRef = collection(userDocRef, collectionName);
  const id = (data as any)['id'];
  const docId = String(id || Date.now());
  const docRef = doc(subColRef, docId);
  await setDoc(docRef, { ...data, id: id || Number(docId) });
}

/**
 * Deleta um item de uma subcoleção especificada para um dado usuário.
 * @param uid O UID único do usuário.
 * @param collectionName O nome da subcoleção.
 * @param id O ID do item a ser deletado.
 */
export async function deleteSubCollectionItem(
  uid: string,
  collectionName: string,
  id: string | number,
): Promise<void> {
  const userDocRef = getUserDocRef(uid);
  await deleteDoc(doc(userDocRef, collectionName, String(id)));
}
