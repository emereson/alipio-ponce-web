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
  ChevronLeft,
  ChevronRight,
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { toast } from "sonner";

import config from "../../auth/auth.config";
import { useAuthStore } from "../../auth/auth.store";
import { API, SERVERIMG } from "../../utils/api";

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
                Alipio Ponce
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

      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-20 bg-slate-900 lg:bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* ... (Contenido del Topbar igual) ... */}
          <button
            className="lg:hidden p-2 text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={30} />
          </button>

          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
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

            <Dropdown placement="bottom-end" backdrop="blur">
              <DropdownTrigger>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-1 rounded-2xl transition-all">
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

          {/* MODAL CORREGIDO */}
          <Modal
            isOpen={showNotifications}
            onOpenChange={setShowNotifications}
            backdrop="blur"
            size="4xl"
            classNames={{
              base: "bg-white h-[85vh] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col",
              header:
                "bg-slate-900 p-5 flex justify-between items-center z-10 shrink-0",
              body: "p-0 relative bg-slate-50 flex-1 flex flex-col min-h-0", // min-h-0 es clave para el scroll en flex
              closeButton:
                "text-white bg-red-500/40 text-xl font-black hover:text-white p-2 rounded-full transition-colors z-20 top-4 right-4",
            }}
            placement="center"
          >
            <ModalContent>
              {() => (
                <>
                  <ModalHeader>
                    <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                      <Bell size={18} className="text-yellow-500" /> Avisos
                      Importantes
                    </h3>
                  </ModalHeader>

                  <ModalBody>
                    {notifications.length > 0 ? (
                      <div className="flex flex-col w-full h-full animate-in fade-in duration-500 relative">
                        {/* Título - Fijo arriba */}
                        <div className="p-4 shrink-0 z-10 bg-slate-50">
                          <h4 className="text-center font-black text-slate-800 text-lg sm:text-xl leading-tight line-clamp-3">
                            {notifications[currentSlide].title}
                          </h4>
                        </div>

                        {/* Contenedor de la Imagen con Scroll */}
                        <div className="flex-1 overflow-y-auto px-12 sm:px-16 pb-4 flex justify-center items-start">
                          <img
                            src={`${SERVERIMG}/${notifications[currentSlide].notificationImg}`}
                            className="w-full max-w-3xl h-auto rounded-lg shadow-sm border border-slate-200"
                            alt="Notificación"
                          />
                        </div>

                        {/* Controles (Flechas) - Absolutos al ModalBody para que no hagan scroll */}
                        {notifications.length > 1 && (
                          <>
                            <button
                              onClick={prevSlide}
                              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-110 transition-all z-20"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button
                              onClick={nextSlide}
                              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-110 transition-all z-20"
                            >
                              <ChevronRight size={24} />
                            </button>
                          </>
                        )}

                        {/* Indicadores (Dots) - Fijos abajo */}
                        {notifications.length > 1 && (
                          <div className="shrink-0 py-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-2">
                            {notifications.map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  currentSlide === idx
                                    ? "w-6 bg-yellow-500"
                                    : "w-2 bg-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center h-full">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm border border-slate-100 mb-4">
                          <Bell size={40} />
                        </div>
                        <h4 className="text-slate-800 font-bold text-lg">
                          No hay avisos
                        </h4>
                        <p className="text-slate-500 font-medium text-sm">
                          Estás al día con todas las notificaciones.
                        </p>
                      </div>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
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
