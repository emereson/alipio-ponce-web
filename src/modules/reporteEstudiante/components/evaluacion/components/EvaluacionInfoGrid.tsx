import { Clock, HelpCircle, Award, CalendarDays } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import { formatDate } from "../../../../../utils/formatDate";

interface Props {
  evaluacion: any;
}

const EvaluacionInfoGrid = ({ evaluacion }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="shadow-sm border border-slate-100">
        <CardBody className="p-5 flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tiempo Límite
            </p>
            <p className="text-lg font-black text-slate-800">
              {evaluacion.limite_tiempo} Min
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm border border-slate-100">
        <CardBody className="p-5 flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Preguntas
            </p>
            <p className="text-lg font-black text-slate-800">
              {evaluacion.preguntas_disponibles}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm border border-slate-100">
        <CardBody className="p-5 flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Puntaje Total
            </p>
            <p className="text-lg font-black text-slate-800">
              {evaluacion.puntos} Pts
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm border border-slate-100">
        <CardBody className="p-5 flex flex-col items-center justify-center text-center gap-2">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Vence
            </p>
            <p className="text-xs font-black text-slate-800 mt-1">
              {formatDate(evaluacion.fecha_entrega)}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EvaluacionInfoGrid;
