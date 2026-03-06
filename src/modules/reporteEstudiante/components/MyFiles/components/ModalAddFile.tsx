import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Spinner,
} from "@heroui/react";
import { toast } from "sonner";
import { Upload, FileType, CheckCircle2 } from "lucide-react";
import { API } from "../../../../../utils/api";
import config from "../../../../../auth/auth.config";

// Interfaces para TypeScript
interface ModalAddFileProps {
  dataClassroomId: string | number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  findFiles: () => void;
}

interface FileFormData {
  name_student_file: string;
}

const ModalAddFile = ({
  dataClassroomId,
  isOpen,
  onOpenChange,
  findFiles,
}: ModalAddFileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FileFormData>();

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(
    async (data: FileFormData) => {
      if (!file) {
        toast.error("Por favor, selecciona un documento para subir.");
        return;
      }

      setLoading(true);
      const url = `${API}/accessStudent/student-files/${dataClassroomId}`;

      const formData = new FormData();
      formData.append("name_student_file", data.name_student_file);
      formData.append("file", file);

      try {
        await axios.post(url, formData, config);
        toast.success("Archivo guardado exitosamente en tu nube personal.");
        findFiles();
        handleClose();
      } catch (err) {
        console.error(err);
        toast.error("No se pudo subir el archivo. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    },
    [dataClassroomId, file, findFiles],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Formato no permitido. Solo JPG, PNG, WEBP o PDF.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFile(null);
        setFileName("");
        return;
      }

      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleClose = () => {
    reset();
    setFile(null);
    setFileName("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="xl"
      placement="center"
      classNames={{
        base: "rounded-[2.5rem] p-4",
        header: "border-b border-slate-100 pb-4",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="bg-yellow-500/10 p-2 rounded-xl">
            <Upload className="text-yellow-600" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black uppercase text-sm tracking-tight">
              Cargar Documento
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">
              Biblioteca Personal
            </span>
          </div>
        </ModalHeader>

        <ModalBody className="relative">
          {loading && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-[2.5rem]">
              <Spinner color="warning" size="lg" />
              <p className="text-slate-900 font-black text-xs uppercase tracking-widest">
                Subiendo Archivo...
              </p>
            </div>
          )}

          <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
            {/* Campo: Título */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileType size={14} /> Nombre descriptivo
              </label>
              <Input
                isRequired
                type="text"
                variant="bordered"
                placeholder="Ej: Tarea de Matemáticas - Semana 5"
                {...register("name_student_file", {
                  required: "El título es obligatorio.",
                })}
                isInvalid={!!errors.name_student_file}
                errorMessage={errors.name_student_file?.message}
                classNames={{
                  inputWrapper:
                    "border-slate-200 group-data-[focus=true]:border-yellow-500 rounded-2xl h-14",
                  input: "font-bold text-slate-700",
                }}
              />
            </div>

            {/* Selector de Archivo Personalizado */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Documento (PDF o Imagen)
              </label>
              <div
                className={`group relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer
                  ${file ? "border-green-500 bg-green-50/30" : "border-slate-200 hover:border-yellow-500 bg-slate-50/50 hover:bg-yellow-50/30"}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />

                <div
                  className={`p-4 rounded-2xl transition-colors ${file ? "bg-green-100 text-green-600" : "bg-white text-slate-400 group-hover:text-yellow-600"}`}
                >
                  {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                </div>

                <div className="text-center">
                  <p
                    className={`font-black uppercase text-xs tracking-tighter ${file ? "text-green-700" : "text-slate-600"}`}
                  >
                    {fileName || "Haz clic para seleccionar un archivo"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                    {file
                      ? "Archivo listo para subir"
                      : "Máximo 10MB (PDF, JPG, PNG)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="light"
                className="font-black text-slate-400 uppercase text-[10px] tracking-widest px-6"
                onPress={handleClose}
              >
                Cancelar
              </Button>
              <Button
                className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                type="submit"
              >
                Guardar Archivo
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddFile;
