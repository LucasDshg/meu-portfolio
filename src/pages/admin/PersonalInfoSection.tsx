import { usePortfolio } from "@/src/context/PortfolioContext";
import { storage } from "@/src/data/firebase";
import { IProfile } from "@/src/interface/portfolio.interface";
import { Collapsible } from "@/src/Lib/Collapsible";
import { FileUpload } from "@/src/Lib/FileUpload";
import { Input } from "@/src/Lib/Input";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const PersonalInfoSection = ({
  profile,
}: {
  profile: IProfile | null;
}) => {
  const { user } = usePortfolio();

  const handleUpload = async (file: File, fieldName: string) => {
    if (!user) throw new Error("Usuário não autenticado");

    const extension = file.name.split(".").pop();
    const path = `${user.uid}/${fieldName}.${extension}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <Collapsible title="Informações Pessoais" defaultOpen>
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
        <FileUpload
          label="Foto de Perfil"
          name="imageUrl"
          accept="image/*"
          initialUrl={profile?.imageUrl}
          onFileSelect={(file) => handleUpload(file, "profile-image")}
        />
        <FileUpload
          label="Currículo (PDF)"
          name="cvLink"
          accept=".pdf"
          initialUrl={profile?.cvLink}
          onFileSelect={(file) => handleUpload(file, "cv")}
        />
      </div>
    </Collapsible>
  );
};
