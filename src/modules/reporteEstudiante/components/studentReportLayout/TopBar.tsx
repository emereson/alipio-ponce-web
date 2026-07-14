import { ChevronDown, LogOut, MegaphoneIcon, Menu, School } from "lucide-react";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
} from "@heroui/react";
import type { Notification, StudentData } from "../../StudentReportLayout";
import { useAuthStore } from "../../../../auth/auth.store";
import { SERVERIMG } from "../../../../utils/api";
import { toast } from "sonner";
import ModalAnuncions from "./ModalAnuncions";

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
      <ModalAnuncions
        dataStudent={dataStudent}
        dataClassroomId={dataClassroomId}
        classroomId={classroomId}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        currentSlide={currentSlide}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        notifications={notifications}
      />
    </div>
  );
};

export default TopBar;
