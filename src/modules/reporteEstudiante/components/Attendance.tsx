import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import {
  ChevronLeft,
  Info,
  Clock,
  LogOut,
  School,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { useOutletContext, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

// Interfaces para TypeScript
interface AttendanceItem {
  id: number;
  date: string;
  status: "Puntual" | "Tarde" | "Falta" | string;
  hora_ingreso: string | null;
  hora_salida: string | null;
}

// Extraemos los colores para reutilizarlos en el calendario y en el modal
const statusColors: Record<string, string> = {
  Puntual: "bg-green-500",
  Tarde: "bg-yellow-500",
  Falta: "bg-red-500",
  Justificado: "bg-blue-400",
};

const Attendance = () => {
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceItem | null>(null);

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

  const formatDateCom = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  // Función que se ejecuta al hacer clic en un día del calendario
  const handleDayClick = (value: Date) => {
    setSelectedDate(value);
    const formattedDate = formatDateCom(value);
    const dayData = attendance.find((item) => item.date === formattedDate);

    if (dayData) {
      setSelectedAttendance(dayData);
      setIsModalOpen(true);
    }
  };

  // 🟢 FUNCIÓN ACTUALIZADA: Muestra íconos debajo de la fecha en el calendario
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayData = attendance.find(
        (item) => item.date === formatDateCom(date),
      );

      if (dayData) {
        // 1. Lógica si NO hay hora de ingreso (Falta)
        if (!dayData.hora_ingreso) {
          return (
            <div className="flex justify-center mt-1.5">
              <AlertTriangle
                size={14}
                className="text-red-500"
                strokeWidth={3}
              />
            </div>
          );
        }

        // 2. Lógica si hay ingreso PERO NO hay salida (En la escuela)
        if (dayData.hora_ingreso && !dayData.hora_salida) {
          return (
            <div className="flex justify-center mt-1.5">
              <School
                size={14}
                className="text-emerald-500 animate-pulse"
                strokeWidth={2.5}
              />
            </div>
          );
        }

        // 3. Lógica si el día está completado (Tiene entrada y salida)
        return (
          <div className="flex justify-center mt-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${statusColors[dayData.status] || "bg-slate-300"} shadow-sm`}
            ></div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayData = attendance.find(
        (item) => item.date === formatDateCom(date),
      );
      if (dayData) return "has-attendance";
    }
    return "";
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
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
            onClickDay={handleDayClick}
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

      {/* MODAL DE DETALLES DE ASISTENCIA */}
      {selectedAttendance && (
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          backdrop="blur"
          placement="center"
          size="sm"
          classNames={{
            base: "overflow-hidden rounded-2xl",
            closeButton:
              "text-white/70 hover:text-white hover:bg-black/20 z-50",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader
                  className={`flex flex-col gap-1 text-white p-6 ${statusColors[selectedAttendance.status] || "bg-slate-800"}`}
                >
                  <h3 className="text-2xl font-black uppercase tracking-widest drop-shadow-md">
                    {selectedAttendance.status}
                  </h3>
                  <p className="text-sm font-medium opacity-90 l">
                    Fecha: {formatDate(selectedAttendance.date)}
                  </p>
                </ModalHeader>

                <ModalBody className="p-6 space-y-2">
                  {/* LÓGICA DE INGRESO: Si no hay ingreso, mostramos alerta roja */}
                  {!selectedAttendance.hora_ingreso ? (
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <span className="text-red-800 font-black block">
                          FALTA REGISTRADA
                        </span>
                        <span className="text-red-500 font-medium text-xs">
                          No se registró ingreso
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                          <Clock size={20} />
                        </div>
                        <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">
                          Hora Ingreso
                        </span>
                      </div>
                      <span className="text-slate-900 font-black text-lg">
                        {selectedAttendance.hora_ingreso}
                      </span>
                    </div>
                  )}

                  {/* LÓGICA DE SALIDA: Si hay ingreso pero no salida, mostramos escuela */}
                  {selectedAttendance.hora_ingreso &&
                  !selectedAttendance.hora_salida ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl animate-pulse">
                        <School size={20} />
                      </div>
                      <div>
                        <span className="text-emerald-800 font-black block">
                          EN CLASES
                        </span>
                        <span className="text-emerald-600 font-medium text-xs">
                          El alumno sigue en la institución
                        </span>
                      </div>
                    </div>
                  ) : selectedAttendance.hora_salida ? (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                          <LogOut size={20} />
                        </div>
                        <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">
                          Hora Salida
                        </span>
                      </div>
                      <span className="text-slate-900 font-black text-lg">
                        {selectedAttendance.hora_salida}
                      </span>
                    </div>
                  ) : null}
                </ModalBody>

                <ModalFooter className="p-6 pt-2">
                  <Button
                    className="w-full bg-slate-900 text-white font-bold py-6 rounded-xl"
                    onPress={onClose}
                  >
                    Cerrar Detalles
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

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
        .has-attendance { font-weight: 900 !important; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Attendance;
