import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  useDisclosure,
  Card,
  CardBody,
  Tooltip,
  Spinner,
} from "@heroui/react";
import {
  ChevronLeft,
  Plus,
  FileText,
  FileUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import ModalAddFile from "./components/ModalAddFile";
import { API, SERVERIMG } from "../../../../utils/api";
import config from "../../../../auth/auth.config";
import { useNavigate, useOutletContext } from "react-router-dom";

// Interfaces para TypeScript
interface StudentFile {
  id: number;
  file_url: string;
  name_student_file: string;
}

const MyFiles = () => {
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState<string | null>(null);
  const [files, setFiles] = useState<StudentFile[]>([]);
  const [loading, setLoading] = useState(false);

  const findFiles = () => {
    if (!dataClassroomId) return;
    setLoading(true);

    const url = `${API}/accessStudent/student-files/${dataClassroomId}`;

    axios
      .get(url, config)
      .then((res) => {
        setFiles(res.data.files || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findFiles();
  }, [dataClassroomId]);

  const handleOpenAddFile = () => {
    setSelectModal("add_file");
    onOpen();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* CABECERA DE NAVEGACIÓN */}
      <header className="w-full bg-slate-900 text-white p-4 shadow-xl flex items-center justify-between border-b-4 border-yellow-500">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 hover:text-yellow-500 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Atrás
        </button>
        <h3 className="font-black text-sm md:text-base uppercase tracking-tighter">
          Gestor de <span className="text-yellow-500">Mis Archivos</span>
        </h3>
        <div className="w-20 hidden md:block"></div>{" "}
        {/* Espaciador para centrar el título */}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 overflow-y-auto">
        {/* BARRA DE ACCIONES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
              <FileUp className="text-white" size={24} />
            </div>
            <div>
              <h4 className="text-slate-900 font-black text-lg uppercase leading-none">
                Documentos Cargados
              </h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Archivos personales del estudiante
              </p>
            </div>
          </div>

          <Button
            className="bg-slate-900 text-white font-bold rounded-2xl px-8 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
            onPress={handleOpenAddFile}
            startContent={<Plus size={20} className="text-yellow-500" />}
          >
            NUEVO ARCHIVO
          </Button>
        </div>

        {/* ÁREA DE ARCHIVOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner color="warning" size="lg" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
              Accediendo a tu nube...
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files && files.length > 0 ? (
              files.map((file) => (
                <Card
                  key={file.id}
                  className="group bg-white border-none shadow-md hover:shadow-2xl transition-all rounded-2xl overflow-hidden"
                >
                  <CardBody className="p-0">
                    <a
                      href={`${SERVERIMG}/${file.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center p-8 gap-4"
                    >
                      <div className="relative">
                        <div className="bg-slate-50 p-6 rounded-2xl group-hover:bg-red-50 transition-colors">
                          <FileText
                            size={48}
                            className="text-slate-300 group-hover:text-red-600 transition-colors"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 p-2 rounded-xl shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
                          <ExternalLink size={14} />
                        </div>
                      </div>

                      <Tooltip
                        content={file.name_student_file}
                        placement="bottom"
                      >
                        <p className="text-sm font-black text-slate-700 uppercase tracking-tighter text-center line-clamp-2 min-h-10 flex items-center leading-tight px-2">
                          {file.name_student_file}
                        </p>
                      </Tooltip>

                      <div className="mt-2 text-[9px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        Archivo Guardado
                      </div>
                    </a>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <ShieldCheck size={64} className="text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-center">
                  Aún no has subido archivos personales <br />
                  <span className="text-[10px] font-medium normal-case italic">
                    Usa el botón "Nuevo Archivo" para empezar.
                  </span>
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* MODAL PARA AGREGAR ARCHIVO */}
      {selectModal === "add_file" && (
        <ModalAddFile
          dataClassroomId={dataClassroomId}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findFiles={findFiles}
        />
      )}

      {/* FOOTER DE ESTADO */}
      <footer className="p-4 bg-slate-100 text-center">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
          I.E. Alipio Ponce - Satipo | Espacio Seguro de Almacenamiento
        </p>
      </footer>
    </div>
  );
};

export default MyFiles;
