import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import axios from "axios";
import { toast } from "sonner";

// Importación de los componentes hijos
import EvaluacionLoading from "./components/EvaluacionLoading";
import EvaluacionHeader from "./components/EvaluacionHeader";
import EvaluacionInfoGrid from "./components/EvaluacionInfoGrid";
import EvaluacionActionCard from "./components/EvaluacionActionCard";
import config from "../../../../auth/auth.config";
import { API } from "../../../../utils/api";
import { handleAxiosError } from "../../../../utils/errorHandler";
import DesarrolloEvaluacion from "./components/DesarrolloEvaluacion";
import { Info, Play } from "lucide-react";
import { Button, Card, CardBody } from "@heroui/react";

const Evaluacion = () => {
  const { id } = useParams<string>();
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();

  const [loading, setLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState<any | null>(null);
  const [resultadoEvaluacion, setResultadoEvaluacion] = useState<any | null>(
    null,
  );

  console.log(resultadoEvaluacion);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      axios.get(`${API}/resultado-evaluacion/evaluacion/${id}`, config),
      axios.get(`${API}/resultado-evaluacion/existe/${id}`, config),
    ])
      .then(([evalRes, resultRes]) => {
        setEvaluacion(evalRes.data.evaluacion);
        setResultadoEvaluacion(resultRes.data.resultadoPrevio || null);
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.status === 404 &&
          err.config.url.includes("/existe/")
        ) {
          setResultadoEvaluacion(null);
        } else {
          handleAxiosError(err);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleIniciarEvaluacion = async () => {
    try {
      axios
        .post(
          `${API}/resultado-evaluacion/${evaluacion.id}`,
          { aula_id: dataClassroomId },
          config,
        )
        .then((res) => {
          setResultadoEvaluacion(res.data.resultado);
        })
        .catch((err) => handleAxiosError(err))
        .finally(() => setLoading(false));
      toast.success("mucha suerte");
    } catch (error) {
      handleAxiosError(error);
    }
  };

  if (loading) return <EvaluacionLoading />;

  if (!evaluacion) {
    return (
      <div className="w-full text-center p-10 text-slate-500 font-medium">
        No se encontró la información de la evaluación.
      </div>
    );
  }

  const handleFinalizarExamen = async (respuestasAlumno: any) => {
    try {
      axios
        .patch(
          `${API}/resultado-evaluacion/${resultadoEvaluacion.id}`,
          { respuestasAlumno: respuestasAlumno },
          config,
        )
        .then((res) => setResultadoEvaluacion(res.data.resultado))
        .catch((err) => handleAxiosError(err))
        .finally(() => setLoading(false));
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EvaluacionHeader
        semanaNombre={evaluacion.semana_evaluacion?.nombre_semana}
        evaluacionNombre={evaluacion.nombre_evaluacion}
      />

      <EvaluacionInfoGrid evaluacion={evaluacion} />
      {resultadoEvaluacion && resultadoEvaluacion?.estado === "EN PROCESO" && (
        <DesarrolloEvaluacion
          evaluacion={evaluacion}
          resultadoEvaluacion={resultadoEvaluacion}
          onSubmit={handleFinalizarExamen}
        />
      )}
      {/* ================= ESTADO: NO INICIADO (Botón Iniciar) ================= */}
      {!resultadoEvaluacion && (
        <Card className="shadow-lg border-none bg-slate-900 rounded-4xl  mt-8 relative overflow-hidden">
          {/* Fondo decorativo (opcional, para mantener el mismo estilo) */}
          <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 pointer-events-none">
            <Info size={150} />
          </div>

          <CardBody className="p-8 md:p-12 text-center flex flex-col items-center justify-center relative z-10">
            <div className="bg-slate-800 p-4 rounded-full mb-6">
              <Info size={32} className="text-yellow-500" />
            </div>
            <h3 className="text-white text-xl font-black uppercase tracking-wider mb-2">
              ¿Todo listo para empezar?
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-8">
              Asegúrate de tener una conexión a internet estable. El cronómetro
              comenzará inmediatamente al hacer clic en el botón.
            </p>
            <Button
              size="lg"
              className="bg-yellow-500 text-slate-900 font-black uppercase tracking-widest px-10 py-6 rounded-2xl hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              startContent={<Play fill="currentColor" size={20} />}
              onPress={handleIniciarEvaluacion}
            >
              Iniciar Evaluación
            </Button>
          </CardBody>
        </Card>
      )}

      {resultadoEvaluacion && resultadoEvaluacion?.estado !== "EN PROCESO" && (
        <EvaluacionActionCard
          evaluacion={evaluacion}
          resultadoEvaluacion={resultadoEvaluacion}
        />
      )}
    </div>
  );
};

export default Evaluacion;
