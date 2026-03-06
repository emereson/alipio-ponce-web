import { HelpCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  evaluacion: any;
  resultadoEvaluacion: any; // Quitamos el null porque si llega aquí, ya existe
}

const EvaluacionActionCard = ({ evaluacion, resultadoEvaluacion }: Props) => {
  // Verificamos si fue por límite de tiempo
  const isTimeout = resultadoEvaluacion?.estado === "EXEDIO LIMITE DE TIEMPO";
  const navigate = useNavigate(); // 🟢 Inicializar
  return (
    <Card className="shadow-lg border-none bg-slate-900 rounded-4xl overflow-hidden relative mt-8">
      <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 pointer-events-none">
        <HelpCircle size={150} />
      </div>

      <CardBody className="p-8 md:p-12 text-center flex flex-col items-center justify-center relative z-10">
        {isTimeout ? (
          // ================= ESTADO: TIEMPO AGOTADO =================
          <>
            <div className="bg-red-500/20 p-4 rounded-full mb-6 border border-red-500/30">
              <Clock size={32} className="text-red-500" />
            </div>
            <h3 className="text-white text-xl font-black uppercase tracking-wider mb-2">
              Tiempo Agotado
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
              El límite de tiempo para esta evaluación ha concluido. Tu examen
              fue enviado automáticamente con las respuestas que lograste
              registrar.
            </p>
          </>
        ) : (
          // ================= ESTADO: CULMINADO (A TIEMPO) =================
          <>
            <div className="bg-green-500/20 p-4 rounded-full mb-6 border border-green-500/30">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-white text-xl font-black uppercase tracking-wider mb-2">
              ¡Evaluación Culminada!
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
              Has completado y enviado esta evaluación de forma exitosa. A
              continuación puedes ver tu puntaje final.
            </p>
          </>
        )}

        {/* ================= PUNTAJE FINAL (Común para ambos casos) ================= */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-8 w-full max-w-xs flex flex-col items-center shadow-inner">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            Puntaje Final
          </span>
          <span className="text-4xl font-black text-white">
            {resultadoEvaluacion.nota_final ??
              resultadoEvaluacion.puntaje_obtenido}
            <span className="text-lg text-slate-500 font-bold ml-1">
              / {evaluacion.puntos}
            </span>
          </span>
        </div>

        {/* ================= BOTÓN DE ACCIÓN ================= */}
        <Button
          size="lg"
          color={isTimeout ? "danger" : "success"}
          variant="flat"
          className="font-black uppercase tracking-widest px-10 py-6 rounded-2xl hover:scale-105 transition-transform"
          onPress={
            () =>
              navigate(
                `/reporte-estudiante/evaluacion/revision/${evaluacion.id}`,
              ) // 🟢 Navegar a la revisión
          }
        >
          Ver Resultados
        </Button>
      </CardBody>
    </Card>
  );
};

export default EvaluacionActionCard;
