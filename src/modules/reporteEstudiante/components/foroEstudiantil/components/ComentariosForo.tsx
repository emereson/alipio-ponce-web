import { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { REACCIONES, type TipoReaccion } from "./ReaccionesForo";
import axios from "axios";
import { API } from "../../../../../utils/api";
import config from "../../../../../auth/auth.config";
import { handleAxiosError } from "../../../../../utils/errorHandler";
import { toast } from "sonner";
import { useAuthStore } from "../../../../../auth/auth.store";

export interface ComentarioType {
  id: number;
  comentario: string;
  createdAt: string;
  estudiante?: {
    name: string;
    lastName: string;
  };
}

export interface ReaccionComentarioType {
  id: number;
  estudiante_id: number;
  tipo_reaccion: TipoReaccion;
}

interface ComentariosForoProps {
  comentarios: ComentarioType[];
  loading: boolean;
  onEnviar: (comentario: string) => Promise<void>;
}

export default function ComentariosForo({
  comentarios,
  loading,
  onEnviar,
}: ComentariosForoProps) {
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enviarReaccionComentario = async (
    comentarioId: number,
    tipo: TipoReaccion | null,
  ) => {
    try {
      await axios.post(
        `${API}/reaccion-comentario-foro/${comentarioId}`,
        { tipo_reaccion: tipo },
        config,
      );
    } catch (error) {
      handleAxiosError(error);
      toast.error("Error al reaccionar al comentario.");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    setIsSubmitting(true);
    await onEnviar(nuevoTexto);
    setNuevoTexto("");
    setIsSubmitting(false);
  };

  return (
    <div className="px-3 py-4 border-t border-slate-200 flex flex-col gap-5">
      {/* 🟢 LISTA DE COMENTARIOS */}
      {loading ? (
        <div className="text-center text-sm font-medium text-slate-400 py-4 animate-pulse">
          Cargando conversación...
        </div>
      ) : comentarios.length === 0 ? (
        <div className="text-center text-sm font-medium text-slate-500 py-4 bg-white rounded-xl border border-slate-200 border-dashed">
          Sé el primero en iniciar la conversación.
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {comentarios.map((c) => (
            <ComentarioItem
              key={c.id}
              comentario={c}
              onReact={enviarReaccionComentario}
            />
          ))}
        </div>
      )}

      {/* 🟢 INPUT MODERNO PARA NUEVO COMENTARIO */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center mt-2">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shrink-0 text-sm shadow-md">
          Tú
        </div>
        <div className="relative flex-1 group">
          <textarea
            rows={1}
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            placeholder="Escribe una respuesta brillante..."
            className="w-full bg-white border border-slate-300 text-slate-800 text-[15px] font-medium rounded-2xl pl-5 pr-14 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 placeholder:text-slate-400 resize-none overflow-hidden"
            disabled={isSubmitting}
            onInput={(e) => {
              // Auto-resize del textarea
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button
            type="submit"
            disabled={!nuevoTexto.trim() || isSubmitting}
            className="absolute right-2 bottom-1.5 p-2 bg-indigo-600 text-white rounded-xl transition-all duration-300 disabled:opacity-0 disabled:scale-75 hover:bg-indigo-700 active:scale-90 shadow-md shadow-indigo-600/30"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

// =========================================================
// 🟢 SUBCOMPONENTE: Comentario Individual
// =========================================================
function ComentarioItem({
  comentario,
  onReact,
}: {
  comentario: ComentarioType;
  onReact: (id: number, tipo: TipoReaccion | null) => Promise<void>;
}) {
  const { perfil } = useAuthStore.getState();
  const [reaccionesGlobales, setReaccionesGlobales] = useState<
    ReaccionComentarioType[]
  >([]);
  const [loadingReaccion, setLoadingReaccion] = useState(true);

  const getReaccionesComentario = () => {
    setLoadingReaccion(true);
    axios
      .get(`${API}/reaccion-comentario-foro/${comentario.id}`, config)
      .then((res) => {
        setReaccionesGlobales(res.data.reacciones || []);
      })
      .catch((err) => {
        if (err.response?.status !== 404) handleAxiosError(err);
      })
      .finally(() => setLoadingReaccion(false));
  };

  useEffect(() => {
    getReaccionesComentario();
  }, [comentario.id]);

  const miReaccionObjeto = reaccionesGlobales.find(
    (r) => r.estudiante_id === perfil?.id,
  );
  const reaccionActual = miReaccionObjeto
    ? miReaccionObjeto.tipo_reaccion
    : null;
  const reaccionConfig = reaccionActual ? REACCIONES[reaccionActual] : null;

  const emojisUnicosUsados = Array.from(
    new Set(reaccionesGlobales.map((r) => REACCIONES[r.tipo_reaccion]?.emoji)),
  ).filter(Boolean);

  const handleReaccion = async (tipo: TipoReaccion) => {
    const nuevaReaccion = reaccionActual === tipo ? null : tipo;
    try {
      await onReact(comentario.id, nuevaReaccion);
      getReaccionesComentario();
    } catch (error) {
      console.error("Fallo al actualizar reacción local");
    }
  };

  return (
    <div className="flex  gap-3 text-sm group/item">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 text-sm border-2 border-white shadow-sm mt-1">
        {comentario.estudiante?.name?.charAt(0) || "U"}
      </div>

      <div className="flex flex-col w-full max-w-[85%]">
        {/* Burbuja del comentario Premium */}
        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm w-fit flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
          <span className="font-extrabold text-slate-900 text-[12px] mr-2">
            {comentario.estudiante
              ? `${comentario.estudiante.name} ${comentario.estudiante.lastName}`
              : "Estudiante"}
          </span>
          <span className="text-slate-700 text-[12px] whitespace-pre-wrap leading-relaxed mt-1 font-medium">
            {comentario.comentario}
          </span>

          {/* Contador Flotante */}
          {reaccionesGlobales.length > 0 && !loadingReaccion && (
            <div className="absolute -bottom-2 -right-3 bg-white shadow-md border border-slate-100 rounded-full px-1.5 py-0.5 flex items-center justify-center gap-1 text-[12px] font-bold text-slate-700 z-10 hover:scale-110 transition-transform cursor-default">
              <div className="flex -space-x-1">
                {emojisUnicosUsados.slice(0, 3).map((emoji, idx) => (
                  <span
                    key={idx}
                    className="z-10 bg-white rounded-full leading-none text-[12px] drop-shadow-sm border border-white"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              {reaccionesGlobales.length > 1 && (
                <span>{reaccionesGlobales.length}</span>
              )}
            </div>
          )}
        </div>

        {/* Acciones debajo del comentario */}
        <div className="flex items-center gap-4 ml-2 mt-2">
          <div className="relative group/react">
            {/* 🟢 POPOVER CORREGIDO (Opacidad + pb-3) */}
            <div className="absolute bottom-full left-0 pb-3 opacity-0 invisible group-hover/react:opacity-100 group-hover/react:visible transition-all duration-300 z-50">
              <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-full px-2 py-1.5 translate-y-2 group-hover/react:translate-y-0 transition-transform duration-300">
                {(Object.keys(REACCIONES) as TipoReaccion[]).map((key) => {
                  const { emoji, label } = REACCIONES[key];
                  const isSelected = reaccionActual === key;
                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaccion(key);
                      }}
                      className={`hover:scale-125 hover:-translate-y-2 transition-all origin-bottom cursor-pointer text-2xl px-1
                        ${isSelected ? "scale-125 -translate-y-2 opacity-100" : "opacity-80"}
                      `}
                      title={label}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleReaccion(reaccionActual || "me_gusta")}
              className={`text-[12px] font-black hover:underline transition-colors
                ${reaccionConfig ? reaccionConfig.color : "text-slate-500 hover:text-slate-800"}
              `}
            >
              {reaccionConfig ? reaccionConfig.label : "Me gusta"}
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {new Date(comentario.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
