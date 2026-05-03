import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
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
    <div className="p-4 space-y-6">
      <Card variant="outline" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Exibido"
            name="name"
            defaultValue={profile?.name}
            placeholder="Seu nome"
            required
          />
          <Input
            label="Slug da URL"
            name="slug"
            defaultValue={profile?.slug}
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
