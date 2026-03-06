import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, Calendar as CalendarIcon, Download } from "lucide-react";
import { toast } from "sonner";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { useNavigate } from "react-router-dom";

// Interfaces para el tipado de TypeScript
interface CalendarEvent {
  id: number;
  name: string;
  calendarImg: string;
}

const Calendar = () => {
  const [calendars, setCalendars] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // 🟢 Hook para navegar

  useEffect(() => {
    setLoading(true);
    const url = `${API}/accessStudent/calendar`;

    axios
      .get(url, config)
      .then((res) => {
        setCalendars(res.data.calendars);
      })
      .catch((err) => {
        console.error(err);
        toast.error("No se pudo cargar el cronograma de actividades");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Volver
        </button>
        <div className="flex items-center gap-2 text-slate-900">
          <CalendarIcon size={20} className="text-red-600" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-tight">
            Calendario <span className="text-red-600">Académico</span>
          </h3>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
            Cargando el rol de actividades...
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {calendars.length > 0 ? (
            calendars.map((calendar) => (
              <article
                key={calendar.id}
                className="group bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Título del Calendario */}
                <div className="bg-slate-900 p-6 flex items-center justify-between">
                  <h3 className="text-white font-black uppercase text-sm tracking-wider italic">
                    {calendar.name}
                  </h3>
                  <a
                    href={calendar.calendarImg}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 hover:bg-yellow-500 rounded-xl text-white hover:text-slate-900 transition-all"
                    title="Descargar o ver imagen"
                  >
                    <Download size={18} />
                  </a>
                </div>

                {/* Imagen con efecto de Zoom */}
                <div className="relative overflow-hidden aspect-4/3 md:aspect-video bg-slate-50">
                  <img
                    src={calendar.calendarImg}
                    alt={calendar.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none border-12 border-white/10 ring-1 ring-black/5"></div>
                </div>

                {/* Pie de Foto Informativo */}
                <div className="p-6 bg-white border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Publicación Oficial - I.E. Alipio Ponce
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">
                No se registran eventos o calendarios por el momento.
              </p>
            </div>
          )}
        </section>
      )}

      {/* NOTA AL PIE */}
      <footer className="mt-12 text-center border-t border-slate-100 pt-6">
        <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">
          Satipo, Junín - Perú | "Disciplina y Valores"
        </p>
      </footer>
    </div>
  );
};

export default Calendar;
