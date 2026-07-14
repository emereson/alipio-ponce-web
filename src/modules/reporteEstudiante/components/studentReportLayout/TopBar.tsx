import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MegaphoneIcon,
  Menu,
  School,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import type { Notification, StudentData } from "../../StudentReportLayout";
import { useAuthStore } from "../../../../auth/auth.store";
import { SERVERIMG } from "../../../../utils/api";
import { toast } from "sonner";
import { Outlet } from "react-router-dom";

interface TopBarProps {
  setIsSidebarOpen: (e: boolean) => void;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (e: boolean) => void;
  handleLogout: () => void;
  currentAulaName: string;
  setDataClassroomId: (e: string) => void;
  dataStudent: StudentData | null;
  dataClassroomId: string;
  currentSlide: number;
  classroomId: number | string;
  prevSlide: () => void;
  nextSlide: () => void;
}

const TopBar = ({
  setIsSidebarOpen,
  notifications,
  showNotifications,
  setShowNotifications,
  handleLogout,
  currentAulaName,
  setDataClassroomId,
  dataStudent,
  dataClassroomId,
  currentSlide,
  classroomId,
  prevSlide,
  nextSlide,
}: TopBarProps) => {
  const { perfil } = useAuthStore.getState();

  return (
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
              <MegaphoneIcon
                size={22}
                className="text-slate-300 lg:text-slate-400"
              />
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
                  src={`${SERVERIMG}/${perfil?.studentImg}` || ""}
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

      <main className="p-2 px-4 overflow-y-auto w-full flex-1 relative">
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
  );
};

export default TopBar;
