import {
  ChevronLeft,
  MessageSquareQuote,
  Info,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { StudentData } from "../StudentReportLayout";

// Interfaces para TypeScript

const Observation = () => {
  const { dataStudent } = useOutletContext<{ dataStudent: StudentData }>();
  const navigate = useNavigate();

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
          <MessageSquareQuote size={20} className="text-red-600" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-tight">
            Panel de <span className="text-red-600">Observaciones</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LISTADO DE OBSERVACIONES */}
        <section className="space-y-4">
          {dataStudent.observations && dataStudent.observations.length > 0 ? (
            dataStudent?.observations.map((observation) => (
              <article
                key={observation.id}
                className="bg-white p-6 rounded-4xl shadow-md border-l-8 border-l-yellow-500 border border-slate-100 transition-all hover:shadow-lg hover:translate-x-1"
              >
                <div className="flex flex-col gap-2">
                  <h4 className="text-slate-900 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                    {observation.name}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                    "{observation.description}"
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <ClipboardList size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium italic">
                No se registran observaciones conductuales.
              </p>
            </div>
          )}
        </section>

        {/* PANEL INFORMATIVO LATERAL */}
        <section className="hidden md:block space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-4">
              <div className="bg-yellow-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <Info className="text-slate-900" size={24} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight">
                Nota para el Apoderado
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Las observaciones aquí registradas son parte del seguimiento
                diario realizado por los docentes y auxiliares.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                  Importancia del Seguimiento
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mantener una comunicación constante ayuda a fortalecer la
                  disciplina y los valores del estudiante.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-2xl text-red-600">
              <MessageSquareQuote size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
              Consulte con el tutor si tiene dudas sobre alguna observación.
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER DE SECCIÓN */}
      <footer className="mt-12 text-center">
        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.4em]">
          I.E. Alipio Ponce - Satipo | Formación Integral
        </p>
      </footer>
    </div>
  );
};

export default Observation;
