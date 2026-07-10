import { useEffect, useState } from "react";
import { MessageCircle, Megaphone, CalendarDays, Clock } from "lucide-react";
import type { EncuestaType, ForosType } from "../../../../../types/foro.type";
import { API, SERVERIMG } from "../../../../../utils/api";
import ReaccionesForo, { type TipoReaccion } from "./ReaccionesForo";
import EncuestaForo from "./EncuestaForo";
import ComentariosForo, { type ComentarioType } from "./ComentariosForo";
import axios from "axios";
import config from "../../../../../auth/auth.config";
import { handleAxiosError } from "../../../../../utils/errorHandler";
import { toast } from "sonner";
import { useAuthStore } from "../../../../../auth/auth.store";
import { Divider } from "@heroui/react";

interface CardProps {
  foro: ForosType;
}

interface ReaccionForoGlobal {
  id: number;
  estudiante_id: number;
  tipo_reaccion: TipoReaccion;
}

export default function CardForoEstudiante({ foro }: CardProps) {
  const { perfil } = useAuthStore.getState();

  const [encuestas, setEncuestas] = useState<EncuestaType[]>([]);
  const [votoInicial, setVotoInicial] = useState<number | null>(null);
  const [loadingVoto, setLoadingVoto] = useState(true);

  const [todasLasReacciones, setTodasLasReacciones] = useState<
    ReaccionForoGlobal[]
  >([]);
  const [loadingReaccion, setLoadingReaccion] = useState(true);

  const [showComentarios, setShowComentarios] = useState(false);
  const [comentarios, setComentarios] = useState<ComentarioType[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  const getEncuestas = () => {
    axios
      .get(`${API}/encuesta/${foro.id}`, config)
      .then((res) => setEncuestas(res.data.encuestas))
      .catch((err) => handleAxiosError(err));
  };

  const getReaccionesForo = () => {
    setLoadingReaccion(true);
    axios
      .get(`${API}/reaccion-foro/${foro.id}`, config)
      .then((res) => {
        const data = res.data.reaccionForos;
        setTodasLasReacciones(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.response?.status !== 404) handleAxiosError(err);
      })
      .finally(() => setLoadingReaccion(false));
  };

  const getComentarios = () => {
    setLoadingComentarios(true);
    axios
      .get(`${API}/foro-comentarios/${foro.id}`, config)
      .then((res) => setComentarios(res.data.comentarios || []))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoadingComentarios(false));
  };

  useEffect(() => {
    getReaccionesForo();
    getComentarios();

    if (foro.tipo_foro === "encuesta") {
      setLoadingVoto(true);
      axios
        .get(`${API}/respuesta-encuesta/${foro.id}`, config)
        .then((res) =>
          setVotoInicial(
            res.data.respuestaEncuesta?.opcion_encuesta_id || null,
          ),
        )
        .catch((err) => {
          if (err.response?.status !== 404) handleAxiosError(err);
        })
        .finally(() => setLoadingVoto(false));
      getEncuestas();
    }
  }, [foro.id, foro.tipo_foro]);

  const enviarReaccionBackend = async (tipo: TipoReaccion | null) => {
    try {
      await axios.post(
        `${API}/reaccion-foro/${foro.id}`,
        { tipo_reaccion: tipo },
        config,
      );
      getReaccionesForo();
    } catch (error) {
      handleAxiosError(error);
      toast.error("Error al registrar tu reacción.");
    }
  };

  const enviarVotoBackend = async (opcionId: number) => {
    // 🛡️ Bloqueo lógico: Evita que se envíe el voto si la encuesta está inactiva
    if (foro.status === "INACTIVO") {
      toast.warning("Esta encuesta ya se encuentra finalizada.");
      return;
    }

    try {
      await axios.post(`${API}/respuesta-encuesta/${opcionId}`, {}, config);
      getEncuestas();
    } catch (error) {
      handleAxiosError(error);
      toast.error("Error al registrar tu voto.");
    }
  };

  const handleToggleComentarios = () => {
    if (!showComentarios && comentarios.length === 0) getComentarios();
    setShowComentarios(!showComentarios);
  };

  const enviarComentarioBackend = async (texto: string) => {
    try {
      await axios.post(
        `${API}/foro-comentarios/${foro.id}`,
        { comentario: texto },
        config,
      );
      toast.success("Comentario publicado");
      getComentarios();
    } catch (error) {
      handleAxiosError(error);
      toast.error("Error al publicar el comentario.");
    }
  };

  const miReaccion =
    todasLasReacciones.find((r) => r.estudiante_id === perfil?.id)
      ?.tipo_reaccion || null;

  return (
    <div className=" bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-500 overflow-hidden mb-10 w-full max-w-2xl mx-auto flex flex-col">
      {/* 1. ENCABEZADO SAAS */}
      <div className="p-3 flex items-center justify-between bg-linear-to-b from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 via-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md shadow-indigo-600/30 ring-4 ring-white transform group-hover:scale-105 transition-transform duration-300">
              AP
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-extrabold text-slate-900 text-[16px] tracking-tight hover:text-indigo-600 transition-colors cursor-pointer">
              Colegio Alipio Ponce
            </h4>

            {/* Contenedor de Fechas y Etiquetas */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-[12px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Megaphone size={11} className="text-indigo-500" />
                {foro.tipo_foro === "encuesta" ? "Encuesta" : "Aviso"}
              </span>

              {/* Fecha Disponible */}
              <span className="text-[12px] font-medium tracking-wide flex items-center gap-1 text-slate-500">
                <CalendarDays size={12} className="text-emerald-500" />
                {foro.fecha_disponible
                  ? new Date(foro.fecha_disponible).toLocaleDateString(
                      undefined,
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : "Reciente"}
              </span>

              {/* Fecha Límite */}
              {foro.fecha_limite && (
                <span className="text-[12px] font-medium tracking-wide flex items-center gap-1 text-slate-500">
                  <Clock size={12} className="text-red-500" />
                  Límite:{" "}
                  {new Date(foro.fecha_limite).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENIDO TEXTUAL */}
      <div className="px-4 pb-3 pt-2">
        {foro.titulo_foro && (
          <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight tracking-tight">
            {foro.titulo_foro}
          </h3>
        )}
        <Divider className="my-2" />
        <p className="text-slate-700 mt-1 text-[14px] whitespace-pre-wrap leading-relaxed ">
          {foro.texto_foro}
        </p>
      </div>

      {/* 3. IMAGEN CON ZOOM EFFECT */}
      {foro.img_foro && (
        <div className="w-full bg-slate-100 overflow-hidden">
          <img
            src={`${SERVERIMG}/${foro.img_foro}`}
            alt={foro.titulo_foro || "Imagen adjunta"}
            className="w-full max-h-125 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      {/* 4. ENCUESTAS */}
      {foro.tipo_foro === "encuesta" && encuestas && encuestas.length > 0 && (
        <div className="bg-slate-50 border-y border-slate-100 relative">
          {loadingVoto ? (
            <div className="px-3 py-4 flex items-center justify-center">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : (
            <div
              className={`px-4 pt-3 pb-4 relative ${foro.status === "INACTIVO" ? "pointer-events-none opacity-60 grayscale-20" : ""}`}
            >
              {/* Etiqueta de Encuesta Cerrada */}
              {foro.status === "INACTIVO" && (
                <div className="absolute top-2 right-4 bg-red-100 text-red-600 text-[11px] font-bold px-2 py-1 rounded-md z-10 border border-red-200">
                  Encuesta Finalizada
                </div>
              )}

              <EncuestaForo
                opciones={encuestas}
                votoInicialId={votoInicial}
                onVoteChange={enviarVotoBackend}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. 🟢 BARRA DE RESUMEN E INTERACCIÓN */}
      <div className="w-full px-4 py-2 flex flex-row items-center justify-between gap-4 border-t border-slate-100 bg-white">
        {loadingReaccion ? (
          <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-lg"></div>
        ) : (
          <div className="w-fit ">
            <ReaccionesForo
              todasLasReacciones={todasLasReacciones}
              reaccionInicial={miReaccion}
              onReactChange={enviarReaccionBackend}
            />
          </div>
        )}

        <button
          onClick={handleToggleComentarios}
          className={`flex items-center cursor-pointer justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all duration-300 active:scale-95
            ${
              showComentarios
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }
          `}
        >
          <MessageCircle
            size={18}
            className={showComentarios ? "stroke-white" : ""}
          />
          <span>
            {comentarios.length > 0
              ? `${comentarios.length} Comentarios`
              : "Comentar"}
          </span>
        </button>
      </div>

      {/* 6. COMENTARIOS CON ANIMACIÓN FLUIDA */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${showComentarios ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden bg-slate-50/80 backdrop-blur-sm">
          <ComentariosForo
            comentarios={comentarios}
            loading={loadingComentarios}
            onEnviar={enviarComentarioBackend}
          />
        </div>
      </div>
    </div>
  );
}
