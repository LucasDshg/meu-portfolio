import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { storage } from '../../../data/firebase';
import { IProfile } from '../../../interface/portfolio.interface';
import { Card } from '../../../Lib/Card';
import { FileUpload } from '../../../Lib/FileUpload';
import { Input } from '../../../Lib/Input';

interface IPersonalInfoSectionProps {
  profile: IProfile | null;
}

export const PersonalInfoSection: React.FC<IPersonalInfoSectionProps> = ({
  profile,
}) => {
  const { user } = usePortfolio();
  const [slug, setSlug] = useState(profile?.slug || '');
  const [prevProfileSlug, setPrevProfileSlug] = useState<string | undefined>(
    undefined,
  );

  if (profile?.slug !== prevProfileSlug) {
    setPrevProfileSlug(profile?.slug);
    setSlug(profile?.slug || '');
  }

  const slugify = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const generatedSlug = `${slugify(e.target.value)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSlug(generatedSlug);
    }
  };
  const handleUpload = async (
    file: File,
    fieldName: string,
  ): Promise<string> => {
    if (!user) throw new Error('Usuário não autenticado');

    const extension = file.name.split('.').pop();
    const path = `${user.uid}/${fieldName}.${extension}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div className="space-y-6">
      <Card variant="outline" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Exibido"
            name="name"
            defaultValue={profile?.name}
            placeholder="Seu nome"
            required
            onBlur={handleNameBlur}
          />
          <Input
            label="Slug da URL"
            name="slug"
            value={slug}
            defaultValue={profile?.slug}
            readOnly
            placeholder="ex: lucas-gomes"
            required
          />
          <Input
            label="E-mail"
            name="email"
            defaultValue={profile?.email}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Telefone / WhatsApp"
            name="phone"
            defaultValue={profile?.phone}
            placeholder="ex: 5511999999999"
          />
          <FileUpload
            label="Foto de Perfil"
            name="imageUrl"
            accept="image/*"
            initialUrl={profile?.imageUrl}
            onFileSelect={(file) => handleUpload(file, 'profile-image')}
          />
          <FileUpload
            label="Currículo (PDF)"
            name="cvLink"
            accept=".pdf"
            initialUrl={profile?.cvLink}
            onFileSelect={(file) => handleUpload(file, 'cv')}
          />
        </div>
      </Card>
    </div>
  );
};
