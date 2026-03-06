import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  Bell,
  LayoutDashboard,
  Calendar as CalendarIcon,
  ClipboardList,
  CreditCard,
  BookOpen,
  UserCheck,
  Wallet,
  Menu,
  ChevronDown,
  School,
  ClipboardCheck,
  X,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { toast } from "sonner";

import config from "../../../auth/auth.config";
import { useAuthStore } from "../../../auth/auth.store";
import { API } from "../../../utils/api";

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

interface Notification {
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
  const { perfil } = useAuthStore.getState();
  const navigate = useNavigate();
  const location = useLocation();

  const [dataStudent, setDataStudent] = useState<StudentData | null>(null);

  const [dataClassroomId, setDataClassroomId] = useState<string>("");
  const [classroomId, setClassroomId] = useState<number | string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Estados para UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Carga inicial
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentRes, notifyRes] = await Promise.all([
          axios.get(`${API}/accessStudent`, config),
          axios.get(`${API}/accessStudent/notifications`, config),
        ]);

        const student = studentRes.data.student;
        setDataStudent(student);
        setNotifications(notifyRes.data.notifications);

        const lastClassroom = student.classrooms_students.at(-1);
        if (lastClassroom) setDataClassroomId(String(lastClassroom.id));
      } catch (error) {
        toast.error("Error al sincronizar datos académicos");
      }
    };
    fetchInitialData();
  }, []);

  // Sincronizar Classroom ID
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

  const menuItems = [
    {
      label: "Inicio",
      path: "/reporte-estudiante",
      icon: <LayoutDashboard size={28} />,
      color: "text-slate-400",
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

  const currentAulaName =
    dataStudent?.classrooms_students.find(
      (c) => String(c.id) === dataClassroomId,
    )?.classroom.name || "Sin Aula";

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR NAVEGACIÓN */}
      <aside
        className={`fixed h-screen inset-y-0 top-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl flex flex-col`}
      >
        {/* 🟢 MODIFICADO: Contenedor del Logo y Aula en el Sidebar */}
        <div className="p-6 flex flex-col gap-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.png" className="w-12 h-12" alt="Logo Colegio" />
            <div className="leading-tight">
              <h1 className="font-black text-sm tracking-tighter uppercase italic text-white">
                Alipio Ponce
              </h1>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">
                Intranet
              </span>
            </div>
          </Link>

          {/* Tarjeta del Aula Actual */}
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

      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-20 bg-slate-900 lg:bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            className="lg:hidden p-2 text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={30} />
          </button>

          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
            {/* Notificaciones */}
            <Badge
              content={notifications.length}
              color="danger"
              shape="circle"
              isInvisible={notifications.length === 0}
            >
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => setShowNotifications(true)}
              >
                <Bell size={22} className="text-slate-200 lg:text-slate-400" />
              </Button>
            </Badge>

            {/* PERFIL UNIFICADO CON CAMBIO DE AULA */}
            <Dropdown placement="bottom-end" backdrop="blur">
              <DropdownTrigger>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-1 rounded-2xl transition-all">
                  {/* 🟢 MODIFICADO: Ahora el flex se muestra en celulares también */}
                  <div className="flex flex-col items-end leading-none text-white lg:text-slate-900">
                    <span className="text-[10px] font-black uppercase max-w-20 sm:max-w-37.5 truncate text-right">
                      {perfil?.name}
                    </span>
                    <span className="text-[9px] font-bold text-yellow-500 lg:text-yellow-600 uppercase tracking-widest mt-0.5 max-w-20 sm:max-w-37.5 truncate text-right">
                      {currentAulaName}
                    </span>
                  </div>

                  <Avatar
                    isBordered
                    color="warning"
                    src={perfil?.studentImg || ""}
                    className="w-9 h-9 sm:w-10 sm:h-10 shadow-sm"
                  />
                  <ChevronDown
                    size={14}
                    className="text-slate-400 hidden sm:block"
                  />
                </div>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Opciones"
                variant="flat"
                disabledKeys={["info"]}
                onAction={(key) => {
                  if (key === "logout") handleLogout();
                  if (String(key).startsWith("aula-")) {
                    setDataClassroomId(String(key).replace("aula-", ""));
                    toast.success("Aula actualizada correctamente");
                  }
                }}
              >
                <DropdownSection showDivider>
                  <DropdownItem
                    key="info"
                    isReadOnly
                    className="h-14 opacity-100"
                    textValue="Usuario"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Estudiante
                    </p>
                    <p className="font-black text-slate-900 text-sm uppercase">
                      {perfil?.name} {perfil?.lastName}
                    </p>
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection title="Seleccionar Aula / Periodo" showDivider>
                  {(dataStudent?.classrooms_students || []).map((c) => (
                    <DropdownItem
                      key={`aula-${c.id}`}
                      textValue={c.classroom.name}
                      startContent={
                        <School size={16} className="text-amber-500" />
                      }
                      className={`rounded-xl ${String(c.id) === dataClassroomId ? "bg-yellow-50" : ""}`}
                      endContent={
                        String(c.id) === dataClassroomId && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )
                      }
                    >
                      <span
                        className={`text-xs font-bold ${String(c.id) === dataClassroomId ? "text-yellow-700" : "text-slate-700"}`}
                      >
                        {c.classroom.name}
                      </span>
                    </DropdownItem>
                  ))}
                </DropdownSection>

                <DropdownSection title="Acciones">
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger rounded-xl"
                    startContent={<LogOut size={16} />}
                  >
                    Cerrar Sesión
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        <main className="p-4 overflow-y-auto w-full flex-1 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ dataStudent, dataClassroomId, classroomId }} />
          </div>

          {/* Modal de Alertas (Notificaciones) */}
          {showNotifications && (
            <div
              className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            >
              <div
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-900 p-6 flex justify-between items-center">
                  <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                    <Bell size={18} className="text-yellow-500" /> Alertas
                    Recientes
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 hover:border-yellow-200 transition-all"
                      >
                        <img
                          src={n.notificationImg}
                          className="w-16 h-16 rounded-xl object-cover shadow-md"
                          alt="aviso"
                        />
                        <p className="font-bold text-slate-700 text-sm leading-tight">
                          {n.title}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <Bell size={32} />
                      </div>
                      <p className="text-slate-400 font-medium italic">
                        Sin alertas nuevas en este momento
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
