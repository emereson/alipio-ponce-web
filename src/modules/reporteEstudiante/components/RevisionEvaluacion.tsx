import { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardBody,
  Spinner,
  Chip,
  Image,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRightLeft,
  ZoomIn, // 🟢 Agregamos el icono de lupa
} from "lucide-react";
import { API, SERVERIMG } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { handleAxiosError } from "../../../utils/errorHandler";

// =========================================================================
// COMPONENTE OPTIMIZADO (MEMOIZADO) PARA RENDERIZAR CADA PREGUNTA
// Evita re-renderizados innecesarios y mejora el rendimiento general
// =========================================================================
const PreguntaRevisionCard = memo(
  ({ pregunta, index, respuestaAlumno }: any) => {
    const acertada = pregunta.acertada;

    // 🟢 Estado para controlar qué imagen se está viendo en el modal
    const [modalImage, setModalImage] = useState<string | null>(null);

    // Prevención de seguridad por si las respuestas vienen como string
    let respuestasData = pregunta.respuestas;
    if (typeof respuestasData === "string") {
      try {
        respuestasData = JSON.parse(respuestasData);
      } catch (e) {
        respuestasData = [];
      }
    }

    const renderContenidoPregunta = () => {
      switch (pregunta.tipo_pregunta) {
        // 1. ALTERNATIVAS (En Columna con Soporte de Imagen)
        case "ALTERNATIVAS":
          return (
            <div className="flex flex-col gap-3 mt-4 md:ml-13">
              {Array.isArray(respuestasData) &&
                respuestasData.map((r: any, idx: number) => {
                  const esSeleccionada =
                    String(r.id) === String(respuestaAlumno);
                  const esCorrecta = r.esCorrecta;
                  const letra = String.fromCharCode(65 + idx); // A, B, C...

                  let bgClass =
                    "bg-slate-50/50 border-slate-200 text-slate-600";
                  let circleClass = "bg-white text-slate-400 border-slate-300";

                  if (esSeleccionada && esCorrecta) {
                    bgClass =
                      "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm";
                    circleClass =
                      "bg-emerald-500 text-white border-transparent";
                  } else if (esSeleccionada && !esCorrecta) {
                    bgClass =
                      "bg-red-50 border-red-400 text-red-900 font-bold shadow-sm";
                    circleClass = "bg-red-500 text-white border-transparent";
                  } else if (esCorrecta) {
                    // Muestra la respuesta correcta si el alumno falló
                    bgClass =
                      "bg-emerald-50/50 border-emerald-300 border-dashed text-emerald-700";
                    circleClass =
                      "bg-emerald-100 text-emerald-600 border-emerald-300";
                  }

                  return (
                    <div
                      key={r.id}
                      className={`flex items-center gap-4 p-3 sm:px-5 rounded-2xl border transition-all ${bgClass}`}
                    >
                      {/* Círculo de Letra */}
                      <div
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-xs shadow-sm ${circleClass}`}
                      >
                        {letra}
                      </div>

                      {/* Contenedor Flexible: Texto a la Izquierda, Imagen a la Derecha */}
                      <div className="flex flex-row items-center justify-between gap-4 flex-1 min-w-0">
                        {r.texto && (
                          <span className="text-sm wrap-break-word leading-snug flex-1">
                            {r.texto}
                          </span>
                        )}

                        {/* 📸 Imagen de la alternativa con ampliación en Modal */}
                        {r.imagen && (
                          <div
                            className="shrink-0 cursor-pointer group relative rounded-xl overflow-hidden z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalImage(`${SERVERIMG}/${r.imagen}`);
                            }}
                          >
                            <Image
                              src={`${SERVERIMG}/${r.imagen}`}
                              alt={`Opción ${letra}`}
                              className={`w-20 h-20 md:w-24 md:h-24 object-cover border transition-transform duration-300 group-hover:scale-110 ${
                                esSeleccionada || esCorrecta
                                  ? "border-current/30"
                                  : "border-slate-200"
                              } shadow-sm bg-white`}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                              <ZoomIn className="text-white" size={20} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Iconos de Validación Finales */}
                      {esSeleccionada && esCorrecta && (
                        <CheckCircle2
                          size={22}
                          className="text-emerald-500 shrink-0"
                        />
                      )}
                      {esSeleccionada && !esCorrecta && (
                        <XCircle size={22} className="text-red-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
            </div>
          );

        // 2. COMPLETAR (Caja Oscura tipo terminal)
        case "COMPLETAR":
          return (
            <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-amber-500 md:ml-13 mt-4">
              <p className="text-sm text-slate-900 leading-relaxed mb-6 whitespace-pre-wrap">
                {respuestasData.texto_base
                  ?.split(/(\[hueco_\d+\])/g)
                  .map((part: string, i: number) => {
                    if (part.startsWith("[hueco_")) {
                      const huecoKey = part.replace("[", "").replace("]", "");
                      const respAlumnoStr = respuestaAlumno?.[huecoKey] || "";
                      const respCorrectaStr =
                        respuestasData.respuestas_correctas?.[huecoKey];

                      const esCorrectoIndividual = respCorrectaStr
                        ? respAlumnoStr.trim().toLowerCase() ===
                          respCorrectaStr.trim().toLowerCase()
                        : pregunta.acertada;

                      return (
                        <span
                          key={i}
                          className={`mx-1 px-2 py-0.5 rounded font-bold border text-xs inline-flex items-center gap-1 ${
                            esCorrectoIndividual
                              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                              : "bg-red-500/20 text-red-500 border-red-500/30 line-through decoration-red-500/50"
                          }`}
                        >
                          {respAlumnoStr || "vacío"}
                          {!esCorrectoIndividual && respCorrectaStr && (
                            <span className="text-emerald-500 font-bold ml-1 no-underline text-[10px] uppercase">
                              ({respCorrectaStr})
                            </span>
                          )}
                        </span>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
              </p>
            </div>
          );

        // 3. POR RELACIONAR
        case "POR RELACIONAR":
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 md:ml-13">
              {respuestasData.parejas?.map((p: any) => {
                const respAlumnoStr = respuestaAlumno?.[p.id] || "";
                const respCorrectaStr = p.respuesta_correcta;

                const esCorrectoIndividual = respCorrectaStr
                  ? respAlumnoStr === respCorrectaStr
                  : pregunta.acertada;

                return (
                  <div key={p.id} className="flex items-stretch text-xs">
                    <div
                      className={`flex-1 p-2 rounded-l-xl border-y border-l wrap-break-word font-bold ${
                        esCorrectoIndividual
                          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                          : "bg-red-50 border-red-100 text-red-800"
                      }`}
                    >
                      {p.premisa}
                    </div>

                    <div
                      className={`px-2 flex items-center justify-center text-white ${
                        esCorrectoIndividual ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      <ArrowRightLeft size={12} strokeWidth={3} />
                    </div>

                    <div
                      className={`flex-1 p-2 rounded-r-xl border-y border-r font-black wrap-break-word flex justify-between items-center ${
                        esCorrectoIndividual
                          ? "bg-emerald-100 border-emerald-200 text-emerald-900"
                          : "bg-red-100 border-red-200 text-red-900"
                      }`}
                    >
                      <span>
                        {respAlumnoStr || (
                          <span className="italic font-normal opacity-50">
                            Sin respuesta
                          </span>
                        )}
                      </span>
                      {esCorrectoIndividual ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-emerald-600"
                        />
                      ) : (
                        <XCircle size={14} className="shrink-0 text-red-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <div
          className={`relative bg-white rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow ${
            acertada ? "border-emerald-200" : "border-red-200"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-start">
              {/* 📸 IMAGEN DE LA PREGUNTA PRINCIPAL CON MODAL */}
              {pregunta.imagen_pregunta && (
                <div
                  className="shrink-0 cursor-pointer group relative rounded-xl overflow-hidden border-2 border-slate-50 shadow-sm z-10"
                  onClick={() =>
                    setModalImage(`${SERVERIMG}/${pregunta.imagen_pregunta}`)
                  }
                >
                  <Image
                    src={`${SERVERIMG}/${pregunta.imagen_pregunta}`}
                    alt="Apoyo visual"
                    className="object-cover w-20 h-20 md:w-28 md:h-28 transition-transform duration-300 group-hover:scale-110 bg-white"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <ZoomIn className="text-white" size={24} />
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <span className="text-[10px] font-black text-amber-600 tracking-widest uppercase">
                    Pregunta {index + 1}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={acertada ? "success" : "danger"}
                    className="font-bold uppercase tracking-widest text-[9px] shrink-0 border border-current/20"
                  >
                    {acertada ? "Correcto" : "Incorrecto"}
                  </Chip>
                </div>

                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {pregunta.titulo_pregunta}
                </h4>

                {pregunta.descripcion_pregunta && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed italic whitespace-pre-wrap">
                    {pregunta.descripcion_pregunta}
                  </p>
                )}
              </div>
            </div>

            <Divider className="opacity-50" />

            {/* CONTENIDO ESPECÍFICO DE LA PREGUNTA */}
            {renderContenidoPregunta()}

            {/* ALERTA DE PREGUNTA NO RESPONDIDA */}
            {!respuestaAlumno && (
              <div className="mt-4 md:ml-13 flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={16} /> No respondiste esta pregunta.
              </div>
            )}
          </div>
        </div>

        {/* 🟢 MODAL DE IMAGEN AMPLIADA */}
        <Modal
          isOpen={!!modalImage}
          onOpenChange={() => setModalImage(null)}
          size="3xl"
          backdrop="blur"
          placement="center"
          classNames={{
            base: "bg-transparent shadow-none",
            closeButton:
              "text-white bg-black/50 hover:bg-black/80 z-50 rounded-full m-2",
          }}
        >
          <ModalContent>
            <ModalBody className="p-0 flex items-center justify-center relative">
              {modalImage && (
                <img
                  src={modalImage}
                  alt="Vista ampliada"
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

// =========================================================================
// COMPONENTE PRINCIPAL DE LA VISTA
// =========================================================================
const RevisionEvaluacion = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [revisionData, setRevisionData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`${API}/resultado-evaluacion/revision/${id}`, config)
      .then((res) => setRevisionData(res.data))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner color="warning" label="Cargando revisión..." />
      </div>
    );
  }

  if (!revisionData) {
    return (
      <div className="w-full text-center p-10 text-slate-500 font-medium">
        No se encontró información de la revisión.
      </div>
    );
  }

  const { evaluacion, resultado } = revisionData;
  const respuestasAlumno = resultado.respuestas_enviadas || {};

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* HEADER DE LA VISTA */}
      <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={20} /> Volver
        </button>
        <h3 className="font-black text-slate-900 uppercase tracking-tight">
          Revisión de Examen
        </h3>
      </header>

      {/* TARJETA DE RESULTADO FINAL */}
      <Card className="mb-8 border-none bg-slate-900 text-white shadow-lg rounded-4xl">
        <CardBody className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider mb-1">
              {evaluacion.nombre_evaluacion}
            </h2>
            <p className="text-slate-400 text-sm">
              Estado:{" "}
              <span className="text-slate-200 font-bold">
                {resultado.estado}
              </span>
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 w-full md:w-auto min-w-37.5 flex flex-col items-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              Puntaje Final
            </span>
            <span className="text-3xl font-black text-white">
              {resultado.nota_final ?? resultado.puntaje_obtenido}
              <span className="text-lg text-slate-500 font-bold ml-1">
                / {evaluacion.puntos}
              </span>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* LISTADO DE PREGUNTAS OPTIMIZADO */}
      <div className="space-y-6">
        {evaluacion.preguntas_evaluacion.map((pregunta: any, index: number) => (
          <PreguntaRevisionCard
            key={pregunta.id}
            pregunta={pregunta}
            index={index}
            respuestaAlumno={respuestasAlumno[pregunta.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default RevisionEvaluacion;
