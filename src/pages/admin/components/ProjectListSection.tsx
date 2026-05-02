import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
} from "react-icons/ri";
import { usePortfolio } from "../../../context/PortfolioContext";
import { storage } from "../../../data/firebase";
import { IProject } from "../../../interface/project.interface";
import { Button } from "../../../Lib/Button";
import { FileUpload } from "../../../Lib/FileUpload";
import { Heading } from "../../../Lib/Heading";
import { Input } from "../../../Lib/Input";
import { Textarea } from "../../../Lib/Textarea";
import { Toast } from "../../../Lib/Toast";

export const ProjectListSection = ({ projects }: { projects: IProject[] }) => {
  const { saveSubItem, deleteSubItem, user } = usePortfolio();
  const [editingItem, setEditingItem] = useState<Partial<IProject> | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSave = async () => {
    if (!editingItem) return;

    if (!editingItem.name || !editingItem.description || !editingItem.image) {
      setToast({
        message: "Nome, descrição e imagem são obrigatórios.",
        type: "error",
      });
      return;
    }

    try {
      const itemToSave = {
        ...editingItem,
        technologies: Array.isArray(editingItem.technologies)
          ? editingItem.technologies
          : (editingItem.technologies as unknown as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
        images: (editingItem.images || []).filter(Boolean),
      };

      await saveSubItem<Partial<IProject>>("projects", itemToSave);
      setEditingItem(null);
      setToast({ message: "Projeto salvo com sucesso!", type: "success" });
    } catch (error) {
      setToast({ message: "Erro ao salvar projeto.", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubItem("projects", id);
      setToast({ message: "Projeto removido com sucesso!", type: "success" });
    } catch (error) {
      setToast({ message: "Erro ao remover projeto.", type: "error" });
    }
  };

  const handleUpload = async (file: File, fileName: string) => {
    if (!user) throw new Error("Usuário não autenticado");

    const projectId = editingItem?.id || Date.now();
    const extension = file.name.split(".").pop();
    const path = `${user.uid}/projects/${projectId}/${fileName}.${extension}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div className="p-6 space-y-6">
      <Heading className="mb-8">Gerenciar Projetos</Heading>
      {!editingItem ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() =>
              setEditingItem({
                name: "",
                description: "",
                technologies: [],
                githubLink: "",
                liveLink: "",
                images: [],
                image: null,
              })
            }
          >
            <RiAddLine size={20} /> Adicionar Projeto
          </Button>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
            {projects
              .sort((a, b) => b.id - a.id)
              .map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between py-4 group"
                >
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {project.name}
                    </h4>
                    <p className="text-sm text-zinc-500">
                      {project.technologies.slice(0, 3).join(", ")}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="!p-2"
                      onClick={() => setEditingItem(project)}
                    >
                      <RiEditLine size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-2 text-red-500"
                      onClick={() => handleDelete(project.id)}
                    >
                      <RiDeleteBinLine size={18} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome do Projeto"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              required
            />
            <Input
              label="Tecnologias (Vírgula)"
              value={editingItem.technologies?.join(", ")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  technologies: e.target.value as any,
                })
              }
            />
            <Input
              label="Link GitHub"
              value={editingItem.githubLink || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, githubLink: e.target.value })
              }
            />
            <Input
              label="Link Live Demo"
              value={editingItem.liveLink || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, liveLink: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <FileUpload
              label="Logo do Projeto"
              accept="image/*"
              initialUrl={editingItem.image || ""}
              onFileSelect={async (file) => {
                const url = await handleUpload(file, "logo");
                setEditingItem((prev) => ({ ...prev, image: url }));
                return url;
              }}
            />

            <div className="space-y-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                Imagens de Apresentação (Carrossel - até 3)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <FileUpload
                    key={i}
                    label={`Imagem ${i + 1}`}
                    accept="image/*"
                    initialUrl={editingItem.images?.[i] || ""}
                    onFileSelect={async (file) => {
                      const url = await handleUpload(file, `carousel-${i}`);
                      const newImages = [...(editingItem.images || [])];
                      newImages[i] = url;
                      setEditingItem((prev) => ({
                        ...prev,
                        images: newImages,
                      }));
                      return url;
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Textarea
            label="Descrição"
            value={editingItem.description}
            rows={8}
            onChange={(e) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-700/40">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setEditingItem(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} type="button" className="gap-2">
              <RiSaveLine size={18} /> Salvar
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
