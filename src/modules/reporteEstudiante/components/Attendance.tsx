import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { ChevronLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { useOutletContext, useNavigate } from "react-router-dom"; // 🟢 Importamos useNavigate

// Interfaces para TypeScript
interface AttendanceItem {
  id: number;
  date: string;
  status: "Puntual" | "Tarde" | "Falta" | string;
}

const Attendance = () => {
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataClassroomId) return;

    setLoading(true);
    const url = `${API}/accessStudent/attendance/${dataClassroomId}`;

    axios
      .get(url, config)
      .then((res) => {
        setAttendance(res.data.attendances);
        if (res.data.attendances.length > 0) {
          setSelectedDate(
            new Date(
              res.data.attendances[res.data.attendances.length - 1].date,
            ),
          );
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("No se pudo cargar el registro de asistencia");
      })
      .finally(() => setLoading(false));
  }, [dataClassroomId]);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayData = attendance.find((item) => item.date === formatDate(date));

      if (dayData) {
        const statusColors: Record<string, string> = {
          Puntual: "bg-green-500",
          Tarde: "bg-yellow-500",
          Falta: "bg-red-500",
          Justificado: "bg-blue-400",
        };

        return (
          <div className="flex justify-center mt-1">
            <div
              className={`h-1.5 w-1.5 rounded-full ${statusColors[dayData.status] || "bg-slate-300"} shadow-sm animate-pulse`}
            ></div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayData = attendance.find((item) => item.date === formatDate(date));
      if (dayData) return "has-attendance";
    }
    return "";
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Volver
        </button>
        <div className="flex flex-col items-end">
          <h3 className="text-slate-900 font-black text-sm md:text-base uppercase tracking-tight leading-none">
            Control de <span className="text-red-600">Asistencia</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            I.E. Alipio Ponce
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CALENDARIO */}
        <section className="lg:col-span-2 bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          )}

          <Calendar
            locale="es-PE"
            className="custom-attendance-calendar w-full border-none font-sans"
            tileContent={tileContent}
            tileClassName={tileClassName}
            value={selectedDate}
            onChange={(val) => setSelectedDate(val as Date)}
          />
        </section>

        {/* LEYENDA Y RESUMEN */}
        <section className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-yellow-500" />
              <h4 className="font-bold text-xs uppercase tracking-[0.2em]">
                Leyenda de Estados
              </h4>
            </div>

            <ul className="space-y-4">
              {[
                {
                  label: "Puntual",
                  color: "bg-green-500",
                  desc: "Ingresó a la hora",
                },
                {
                  label: "Tarde",
                  color: "bg-yellow-500",
                  desc: "Ingreso con retraso",
                },
                {
                  label: "Falta",
                  color: "bg-red-500",
                  desc: "Inasistencia injustificada",
                },
                {
                  label: "Justificado",
                  color: "bg-blue-400",
                  desc: "Permiso o descanso médico",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}
                  ></div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4">
              Resumen del Mes
            </h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 leading-none">
                {attendance.filter((a) => a.status === "Puntual").length}
              </span>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-bold uppercase leading-tight">
                  Días con
                </span>
                <span className="text-green-600 text-[10px] font-bold uppercase leading-tight">
                  Puntualidad
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .custom-attendance-calendar { width: 100% !important; background: transparent; border: none !important; }
        .react-calendar__navigation button { color: #0f172a; font-weight: 900 !important; text-transform: uppercase; font-size: 0.75rem; }
        .react-calendar__month-view__weekdays__weekday { color: #94a3b8; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; text-decoration: none !important; }
        .react-calendar__tile { 
          padding: 1.5em 0.5em !important; 
          font-weight: 700 !important; 
          font-size: 0.85rem !important;
          border-radius: 1rem;
          transition: all 0.2s ease;
          color: #1e293b;
        }
        .react-calendar__tile--now { background: #fefce8 !important; color: #a16207 !important; }
        .react-calendar__tile--active { background: #0f172a !important; color: white !important; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3); }
        .react-calendar__tile:hover { background: #f8fafc !important; }
        .has-attendance { font-weight: 900 !important; }
      `}</style>
    </div>
  );
};

export default Attendance;
