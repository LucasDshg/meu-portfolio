import { doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createInitialProfileDocument,
  getProfileAndUidBySlug,
  getProfileByUid,
  saveSubCollectionItem,
} from './firebase.service';

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('./firebase', () => ({ db: {} }));
vi.mock('./init-data', () => ({
  INITIAL_PROFILE_DATA: { bio: 'Olá!', tags: [] },
}));

describe('Firebase Service', () => {
  const mockUid = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar o perfil se o documento existir', async () => {
    const mockData = { name: 'João Silva', slug: 'joao-123' };

    (getDoc as any).mockResolvedValue({
      exists: () => true,
      data: () => mockData,
    });

    const result = await getProfileByUid(mockUid);
    expect(result).toEqual(mockData);
  });

  it('deve buscar perfil pelo slug e retornar o UID correto', async () => {
    const mockProfile = { name: 'Portfolio Exp', slug: 'meu-slug' };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [{ id: 'uid-documento', data: () => mockProfile }],
    });

    const result = await getProfileAndUidBySlug('meu-slug');

    expect(result).toEqual({
      profile: mockProfile,
      uid: 'uid-documento',
    });
  });

  it('deve gerar um perfil inicial com base no objeto User', async () => {
    const mockAuthUser = {
      uid: 'auth-uid',
      email: 'test@dev.com',
      displayName: 'Dev User',
    };

    const result = await createInitialProfileDocument(mockAuthUser as any);

    expect(setDoc).toHaveBeenCalled();
    expect(result.email).toBe('test@dev.com');
    expect(result.slug).toBe('auth-uid');
  });

  it('deve salvar um item gerando um ID baseado em data atual se não fornecido', async () => {
    const mockData = { title: 'Novo Projeto' };

    const mockDocRef = { id: 'fake-id' };
    (doc as any).mockReturnValue(mockDocRef);

    await saveSubCollectionItem(mockUid, 'projects', mockData);

    expect(doc).toHaveBeenCalled();

    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.not.objectContaining({
        id: expect.any(String),
      }),
    );
    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        title: 'Novo Projeto',
        date: expect.any(Date),
      }),
    );
  });
});
