import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";
import {
  GraduationCap,
  Folder,
  FileUser,
  ChevronRight,
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Wallet,
  CreditCard,
  Calendar as CalendarIcon,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "../../auth/auth.store";

export default function StudentDashboard() {
  const { perfil } = useAuthStore.getState();
  const navigate = useNavigate();
  // 🟢 Obtenemos los datos que nos pasó el Layout padre
  const { dataStudent, dataClassroomId } = useOutletContext<any>();

  const currentAulaName =
    dataStudent?.classrooms_students.find(
      (c: any) => String(c.id) === dataClassroomId,
    )?.classroom.name || "Sin Aula";

  // Botones principales del Bento Grid (Mismos iconos y colores que pusiste)
  const dashboardItems = [
    {
      label: "Asistencia",
      path: "asistencia",
      icon: <UserCheck size={28} />,
      color: "text-blue-500",
    },
    {
      label: "Notas",
      path: "notas",
      icon: <BookOpen size={28} />,
      color: "text-green-500",
    },
    {
      label: "Evaluaciones",
      path: "evaluaciones",
      icon: <ClipboardCheck size={28} />,
      color: "text-amber-500",
    },
    {
      label: "Pagos",
      path: "pagos",
      icon: <Wallet size={28} />,
      color: "text-yellow-500",
    },
    {
      label: "Deudas",
      path: "deudas",
      icon: <CreditCard size={28} />,
      color: "text-red-500",
    },
    {
      label: "Calendario",
      path: "calendario",
      icon: <CalendarIcon size={28} />,
      color: "text-purple-500",
    },
    {
      label: "Observaciones",
      path: "observaciones",
      icon: <ClipboardList size={28} />,
      color: "text-slate-400",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner Institucional */}
      <Card className="bg-slate-900 border-none rounded-[3rem] shadow-2xl relative overflow-hidden">
        <CardBody className="p-8 md:p-12 text-white relative z-10">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            <GraduationCap size={150} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3 uppercase italic tracking-tighter">
            ¡Hola, {perfil?.name}!
          </h2>
          <p className="text-slate-400 text-sm md:text-base italic max-w-lg leading-relaxed font-medium">
            "Disciplina y Valores: Revisa tu progreso académico en el aula{" "}
            {currentAulaName}."
          </p>
        </CardBody>
      </Card>

      {/* Malla de Accesos (Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {dashboardItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center gap-4 group"
          >
            <div
              className={`p-4 bg-slate-50 rounded-2xl ${item.color} group-hover:bg-slate-900 group-hover:text-white transition-all duration-300`}
            >
              {item.icon}
            </div>
            <span className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900">
              {item.label}
            </span>
          </button>
        ))}

        {/* Accesos a Archivos (Anchos) */}
        <button
          onClick={() => navigate("archivos")}
          className="col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl text-yellow-500 shadow-lg">
              <Folder />
            </div>
            <div className="text-left leading-none">
              <h4 className="font-black text-sm uppercase text-slate-900">
                Material Educativo
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase underline decoration-yellow-500 mt-2">
                Recursos para estudiar
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:translate-x-2 group-hover:text-slate-900 transition-all"
          />
        </button>

        <button
          onClick={() => navigate("mis-archivos")}
          className="col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="bg-slate-100 p-4 rounded-2xl text-slate-400 group-hover:text-slate-900 transition-colors">
              <FileUser />
            </div>
            <div className="text-left leading-none">
              <h4 className="font-black text-sm uppercase text-slate-900">
                Mis Archivos
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                Mi Nube Personal
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:translate-x-2 group-hover:text-slate-900 transition-all"
          />
        </button>
      </div>
    </div>
  );
}
