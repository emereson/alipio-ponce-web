import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  LayoutDashboard,
  Calendar as CalendarIcon,
  ClipboardList,
  CreditCard,
  BookOpen,
  UserCheck,
  Wallet,
  School,
  ClipboardCheck,
  FormIcon,
} from "lucide-react";
import { Button } from "@heroui/react";
import { toast } from "sonner";

import config from "../../auth/auth.config";
import { API } from "../../utils/api";
import TopBar from "./components/studentReportLayout/TopBar";

interface Classroom {
  id: number;
  classroom_id: number;
  classroom: { name: string; year: string };
}

export interface StudentData {
  id: number;
  name: string;
  lastName: string;
  studentImg: string;
  classrooms_students: Classroom[];
  debts: DebtItem[];
  observations: ObservationItem[];
}

export interface Notification {
  id: number;
  title: string;
  notificationImg: string;
}
interface DebtItem {
  id: number;
  name: string;
  amount: number | string;
}

interface ObservationItem {
  id: number;
  name: string;
  description: string;
}

const StudentReportLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataStudent, setDataStudent] = useState<StudentData | null>(null);

  const [dataClassroomId, setDataClassroomId] = useState<string>("");
  const [classroomId, setClassroomId] = useState<number | string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentRes, notifyRes] = await Promise.all([
          axios.get(`${API}/accessStudent`, config),
          axios.get(`${API}/accessStudent/notifications`, config),
        ]);

        const student = studentRes.data.student;
        const fetchedNotifications = notifyRes.data.notifications || [];

        setDataStudent(student);
        setNotifications(fetchedNotifications);

        if (fetchedNotifications.length > 0) {
          setShowNotifications(true);
        }

        const lastClassroom = student.classrooms_students.at(-1);
        if (lastClassroom) setDataClassroomId(String(lastClassroom.id));
      } catch (error) {
        toast.error("Error al sincronizar datos académicos");
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!dataStudent || !dataClassroomId) return;
    const classroom = dataStudent.classrooms_students.find(
      (c) => c.id === Number(dataClassroomId),
    );
    if (classroom) setClassroomId(classroom.classroom_id);
  }, [dataClassroomId, dataStudent]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/log-in";
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === notifications.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? notifications.length - 1 : prev - 1,
    );
  };

  const menuItems = [
    {
      label: "Inicio",
      path: "/reporte-estudiante",
      icon: <LayoutDashboard size={28} />,
      color: "text-slate-400",
    },
    {
      label: "Foro Estudiantil",
      path: "/reporte-estudiante/foro-estudiantil",
      icon: <FormIcon size={28} />,
      color: "text-pink-500",
    },
    {
      label: "Asistencia",
      path: "/reporte-estudiante/asistencia",
      icon: <UserCheck size={28} />,
      color: "text-blue-500",
    },
    {
      label: "Notas",
      path: "/reporte-estudiante/notas",
      icon: <BookOpen size={28} />,
      color: "text-green-500",
    },
    {
      label: "Evaluaciones",
      path: "/reporte-estudiante/evaluaciones",
      icon: <ClipboardCheck size={28} />,
      color: "text-amber-500",
    },
    {
      label: "Pagos",
      path: "/reporte-estudiante/pagos",
      icon: <Wallet size={28} />,
      color: "text-yellow-500",
    },
    {
      label: "Deudas",
      path: "/reporte-estudiante/deudas",
      icon: <CreditCard size={28} />,
      color: "text-red-500",
    },
    {
      label: "Calendario",
      path: "/reporte-estudiante/calendario",
      icon: <CalendarIcon size={28} />,
      color: "text-purple-500",
    },
    {
      label: "Observaciones",
      path: "/reporte-estudiante/observaciones",
      icon: <ClipboardList size={28} />,
      color: "text-slate-400",
    },
  ];

  const classroom = dataStudent?.classrooms_students.find(
    (c: any) => String(c.id) === dataClassroomId,
  );

  const currentAulaName = classroom
    ? `${classroom.classroom.name} - ${classroom.classroom.year}`
    : "Sin Aula";

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR NAVEGACIÓN */}
      <aside
        className={`fixed h-screen inset-y-0 top-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl flex flex-col`}
      >
        {/* ... (Contenido del sidebar igual) ... */}
        <div className="p-6 flex flex-col gap-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.png" className="w-12 h-12" alt="Logo Colegio" />
            <div className="leading-tight">
              <h1 className="font-black text-sm tracking-tighter uppercase italic text-white">
                ALIPIO PONCE
              </h1>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">
                Intranet
              </span>
            </div>
          </Link>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              <School size={16} className="text-amber-500" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                Aula Seleccionada
              </span>
              <span className="text-xs text-white font-black uppercase truncate">
                {currentAulaName}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${isActive ? "bg-yellow-500 text-slate-900 shadow-xl" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}
              >
                <span
                  className={`${isActive ? "text-slate-900" : item.color} transition-colors group-hover:scale-110`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button
            fullWidth
            variant="flat"
            color="danger"
            onPress={handleLogout}
            className="font-black text-xs tracking-widest uppercase rounded-2xl h-12"
            startContent={<LogOut size={18} />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <TopBar
        setIsSidebarOpen={setIsSidebarOpen}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        handleLogout={handleLogout}
        currentAulaName={currentAulaName}
        setDataClassroomId={setDataClassroomId}
        dataStudent={dataStudent}
        dataClassroomId={dataClassroomId}
        currentSlide={currentSlide}
        classroomId={classroomId}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentReportLayout;
