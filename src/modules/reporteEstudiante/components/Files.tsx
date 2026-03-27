import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  FileDown,
  FolderOpen,
  ExternalLink,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { API, SERVERIMG } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { useNavigate, useOutletContext } from "react-router-dom";

// Interfaces para TypeScript
interface FileItem {
  id: number;
  name_archivo: string;
  archivo_url: string;
  link_archivo: string;
}

const Files = () => {
  const { classroomId } = useOutletContext<{ classroomId: string }>();
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classroomId) return;

    setLoading(true);
    const url = `${API}/accessStudent/files/${classroomId}`;

    axios
      .get(url, config)
      .then((res) => {
        setFiles(res.data.files);
      })
      .catch(() => {
        toast.error("No se pudo cargar el material educativo");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [classroomId]);

  // 🟢 Función auxiliar para asegurar que el link sea absoluto
  const formatExternalLink = (url: string) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Atrás
        </button>
        <div className="flex items-center gap-2 text-slate-900">
          <FolderOpen size={20} className="text-yellow-500" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-tight text-slate-900">
            Material <span className="text-yellow-500">Educativo</span>
          </h3>
        </div>
      </div>

      {/* GRID DE ARCHIVOS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Sincronizando biblioteca...
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {files && files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                // 🟢 Cambiamos de <a> a <div>
                className="group relative bg-white p-6 pb-4 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1.25 hover:border-yellow-500/30"
              >
                {/* Icono de archivo decorativo */}
                <div className="mb-4 relative">
                  <div className="absolute -inset-2 bg-yellow-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-slate-50 p-5 rounded-2xl group-hover:bg-yellow-50 transition-colors">
                    <FileText
                      size={40}
                      className="text-slate-400 group-hover:text-yellow-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Nombre del Archivo */}
                <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 line-clamp-2 leading-snug uppercase mb-4 h-10 flex items-center justify-center">
                  {file.name_archivo}
                </p>

                {/* 🟢 NUEVA ZONA DE BOTONES */}
                <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2 mt-auto">
                  {/* Botón original: Descargar Documento */}
                  {file.archivo_url && (
                    <a
                      href={`${SERVERIMG}/${file.archivo_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all uppercase tracking-tight"
                    >
                      <FileDown size={14} />
                      Ver Documento
                    </a>
                  )}

                  {/* Botón nuevo: Abrir Enlace */}
                  {file.link_archivo && (
                    <a
                      href={formatExternalLink(file.link_archivo)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 bg-slate-50 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-tight"
                    >
                      <ExternalLink size={14} />
                      Abrir Enlace
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <FolderOpen size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium italic">
                No se han subido archivos para este salón aún.
              </p>
            </div>
          )}
        </section>
      )}

      {/* PIE DE PÁGINA INFORMATIVO */}
      <div className="mt-12 p-6 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-xl">
            <FileDown className="text-slate-900" size={20} />
          </div>
          <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center md:text-left leading-relaxed">
            Todos los documentos son propiedad de la <br />{" "}
            <span className="text-yellow-500 italic">
              I.E. Alipio Ponce - Satipo
            </span>
          </p>
        </div>
        <div className="px-4 py-2 bg-white/10 rounded-full text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Contenido Protegido
        </div>
      </div>
    </div>
  );
};

export default Files;
