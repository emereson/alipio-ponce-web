import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ClipboardCheck,
  Timer,
  Award,
  PlayCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button, Card, CardBody, Chip, Divider, Spinner } from "@heroui/react";

import { useNavigate, useOutletContext } from "react-router-dom";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { handleAxiosError } from "../../../utils/errorHandler";

// 1. Interfaces para tipar correctamente los datos
interface ResultadoEvaluacion {
  id: number;
  estado: "EN PROCESO" | "CULMINADO" | "EXEDIO LIMITE DE TIEMPO";
  nota_final: number | null;
  puntaje_obtenido: number;
}

interface Exam {
  id: number;
  nombre_evaluacion: string;
  limite_tiempo: number;
  puntos: number;
  status: string;
  fecha_entrega: string;
  resultados_evaluacion?: ResultadoEvaluacion | null;
}

interface Week {
  id: number;
  nombre_semana: string;
  year: string;
  evaluaciones: Exam[];
}

const ExamsList = () => {
  const { classroomId } = useOutletContext<{ classroomId: string }>();
  const navigate = useNavigate();

  const [semanas, setSemanas] = useState<Week[]>([]);
  const [loading, setLoading] = useState(false);

  // Carga de datos al montar el componente
  useEffect(() => {
    if (!classroomId) return;
    setLoading(true);

    axios
      .get(`${API}/resultado-evaluacion/${classroomId}`, config)
      .then((res) => setSemanas(res.data.semanas))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  }, [classroomId]);

  // 2. Función para renderizar la acción según el estado
  const renderAccionEvaluacion = (examen: Exam) => {
    const resultado = examen.resultados_evaluacion;

    // CASO A: No ha iniciado el examen
    if (!resultado) {
      return (
        <Button
          fullWidth
          className="bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl h-12 mt-4 hover:scale-[1.02] transition-transform shadow-md"
          startContent={<PlayCircle size={18} />}
          onPress={() =>
            navigate(`/reporte-estudiante/evaluacion/${examen.id}`)
          }
        >
          Rendir Examen
        </Button>
      );
    }

    // CASO B: Lo inició pero no lo ha terminado
    if (resultado.estado === "EN PROCESO") {
      return (
        <Button
          fullWidth
          color="warning"
          className="font-black text-slate-900 uppercase tracking-widest rounded-xl h-12 mt-4 shadow-md hover:scale-[1.02] transition-transform"
          startContent={<Timer size={18} />}
          onPress={() =>
            navigate(`/reporte-estudiante/evaluacion/${examen.id}`)
          }
        >
          Continuar Examen
        </Button>
      );
    }

    // CASO C: Ya finalizó (Culminado o Excedió el tiempo)
    const isTimeout = resultado.estado === "EXEDIO LIMITE DE TIEMPO";
    const nota = resultado.nota_final ?? resultado.puntaje_obtenido;

    return (
      <button
        onClick={() => navigate(`/reporte-estudiante/evaluacion/${examen.id}`)}
        className={`mt-4 w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group ${
          isTimeout
            ? "bg-red-50/50 border-red-200 hover:bg-red-50"
            : "bg-green-50/50 border-green-200 hover:bg-green-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {isTimeout ? (
            <Clock
              size={20}
              className="text-red-500 group-hover:scale-110 transition-transform"
            />
          ) : (
            <CheckCircle2
              size={20}
              className="text-green-500 group-hover:scale-110 transition-transform"
            />
          )}
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                isTimeout ? "text-red-600" : "text-green-700"
              }`}
            >
              {isTimeout ? "Tiempo Agotado" : "Completado"}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
              Ver detalle del examen
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end border-l pl-4 border-slate-200">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
            Nota
          </span>
          <span
            className={`text-xl font-black leading-none ${
              isTimeout ? "text-red-600" : "text-green-600"
            }`}
          >
            {nota}{" "}
            <span className="text-xs text-slate-400 font-bold">
              / {examen.puntos}
            </span>
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Volver
        </button>
        <div className="flex flex-col items-end">
          <h3 className="text-slate-900 font-black text-sm md:text-base uppercase tracking-tight leading-none flex items-center gap-2">
            <ClipboardCheck size={18} className="text-amber-500" /> Mis{" "}
            <span className="text-amber-500">Evaluaciones</span>
          </h3>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner color="warning" label="Buscando exámenes..." />
        </div>
      ) : (
        <div className="space-y-12 pb-10">
          {semanas.map((semana) => (
            <div key={semana.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {semana.nombre_semana}
                </span>
                <Divider className="flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {semana.evaluaciones.map((examen) => (
                  <Card
                    key={examen.id}
                    shadow="sm"
                    className="rounded-4xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <CardBody className="p-6 md:p-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-slate-800 uppercase text-base leading-tight pr-4">
                          {examen.nombre_evaluacion}
                        </h4>
                        <Chip
                          size="sm"
                          color={
                            examen.status === "ACTIVO" ? "success" : "default"
                          }
                          variant="flat"
                          className="text-[9px] font-bold uppercase tracking-widest shrink-0"
                        >
                          {examen.status}
                        </Chip>
                      </div>

                      <div className="flex gap-5 text-slate-500 font-bold text-xs mb-4 flex-1">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Timer size={14} className="text-blue-500" />{" "}
                          {examen.limite_tiempo} min
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Award size={14} className="text-amber-500" />{" "}
                          {examen.puntos} pts
                        </div>
                      </div>

                      {/* Renderizado dinámico del botón según el estado */}
                      {renderAccionEvaluacion(examen)}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Mensaje si no hay exámenes */}
          {semanas.length === 0 && !loading && (
            <div className="text-center py-20 text-slate-400 font-medium italic">
              Aún no tienes evaluaciones asignadas.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamsList;
