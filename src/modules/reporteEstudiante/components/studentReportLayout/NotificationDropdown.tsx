import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Bell, FileText, CreditCard, MessageSquare } from "lucide-react";
import { MdNotifications } from "react-icons/md";
import { io } from "socket.io-client";
import { API } from "../../../../utils/api";
import config from "../../../../auth/auth.config";
import { handleAxiosError } from "../../../../utils/errorHandler";

export interface NotificacionType {
  id: number;
  estudiante_id: number;
  ruta_notificacion: string;
  titulo_notificacion: string;
  descripcion_notificacion: string;
  vista: boolean;
  tipo_notificacion: string;
}

interface NotificationProps {
  estudianteId?: number | string;
}

// Función necesaria para convertir la clave pública VAPID
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NotificationDropdown = ({ estudianteId }: NotificationProps) => {
  const [notificaciones, setNotificaciones] = useState<NotificacionType[]>([]);

  // Función para reproducir el sonido de notificación
  const playSound = () => {
    try {
      // Asegúrate de tener un archivo llamado "notification.mp3" dentro de la carpeta "public"
      const audio = new Audio("/notificacion.mp3");
      audio.play().catch((err) => {
        console.warn("El navegador bloqueó el sonido (Autoplay policy):", err);
      });
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
  };

  // 1. CONFIGURACIÓN DEL SERVICE WORKER Y PUSH API
  useEffect(() => {
    const registerPush = async () => {
      if (
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        estudianteId
      ) {
        try {
          // Registramos el archivo Service Worker
          const register =
            await navigator.serviceWorker.register("/service-worker.js");
          await navigator.serviceWorker.ready;

          // Pedimos permisos al usuario
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;

          // Obtenemos la clave pública del .env
          const publicVapidKey =
            "BHUcXVYUhkvGR_tAbmf8wJ2Nf0un9ee4hKE6P8L-5hnhoQiyDq2b-w84J4EdahfpWkbq6AkDAhp3cGBsrTw0Ag4";

          if (!publicVapidKey) {
            console.error("Falta VITE_VAPID_PUBLIC_KEY en el .env");
            return;
          }

          // Nos suscribimos
          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });

          // Guardamos la suscripción en la base de datos
          await axios.post(
            `${API}/notificaciones/suscribir`,
            {
              estudiante_id: estudianteId,
              suscripcion: subscription,
            },
            config,
          );
        } catch (error) {
          console.error("Error en Web Push / Service Worker:", error);
        }
      }
    };

    registerPush();
  }, [estudianteId]);

  // 2. OBTENER HISTORIAL DE NOTIFICACIONES DESDE LA BD
  const getNotificaciones = () => {
    axios
      .get(`${API}/notificaciones`, config)
      .then((res) => setNotificaciones(res.data.notificaciones || []))
      .catch((err) => handleAxiosError(err));
  };

  useEffect(() => {
    getNotificaciones();
  }, []);

  // 3. CONEXIÓN A SOCKET.IO PARA TIEMPO REAL EN LA APP
  useEffect(() => {
    if (!estudianteId) return;

    const SOCKET_URL = API.replace("/api/v1", "");
    const socket = io(SOCKET_URL);

    const canalSocket = `notificacion-create/estudiante:${estudianteId}`;

    socket.on(canalSocket, (nuevaNotificacion: NotificacionType) => {
      // 1. Reproducimos el sonido personalizado
      playSound();

      // 2. Actualizamos la lista de notificaciones (la campanita sumará 1)
      setNotificaciones((prev) => [nuevaNotificacion, ...prev]);

      // 3. Mostramos una alerta en pantalla dentro de la aplicación
      toast.info(nuevaNotificacion.titulo_notificacion, {
        description: nuevaNotificacion.descripcion_notificacion,
      });

      // 4. Fallback: Forzamos la notificación nativa si el SW falla o tarda
      if ("Notification" in window && Notification.permission === "granted") {
        const notifNativa = new Notification(
          nuevaNotificacion.titulo_notificacion,
          {
            body: nuevaNotificacion.descripcion_notificacion,
            icon: "/logo.png",
          },
        );

        notifNativa.onclick = () => {
          window.focus();
          if (nuevaNotificacion.ruta_notificacion) {
            window.location.href = nuevaNotificacion.ruta_notificacion;
          }
        };
      }
    });

    return () => {
      socket.off(canalSocket);
      socket.disconnect();
    };
  }, [estudianteId]);

  const unreadCount = notificaciones.filter((n) => !n.vista).length;

  const handleNotificationClick = (notif: NotificacionType) => {
    // Marcamos como leída localmente
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, vista: true } : n)),
    );

    // Redirección
    if (notif.ruta_notificacion) {
      window.location.href = `${notif.ruta_notificacion}`;
    }
  };

  const handleMarkAllAsRead = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, vista: true })));
    toast.success("Todas las notificaciones marcadas como leídas");
  };

  // Función para obtener estilos de los iconos
  const getNotificationStyle = (tipo: string) => {
    switch (tipo) {
      case "examen":
        return {
          icon: <FileText size={20} className="text-purple-600" />,
          smallIcon: <FileText size={10} />,
          bgClass: "bg-purple-100",
          badgeColor: "bg-purple-600",
          textColor: "text-purple-600",
        };
      case "pago":
        return {
          icon: <CreditCard size={20} className="text-emerald-600" />,
          smallIcon: <CreditCard size={10} />,
          bgClass: "bg-emerald-100",
          badgeColor: "bg-emerald-600",
          textColor: "text-emerald-600",
        };
      case "observaciones":
        return {
          icon: <MessageSquare size={20} className="text-orange-600" />,
          smallIcon: <MessageSquare size={10} />,
          bgClass: "bg-orange-100",
          badgeColor: "bg-orange-600",
          textColor: "text-orange-600",
        };
      default:
        return {
          icon: <Bell size={20} className="text-blue-600" />,
          smallIcon: <Bell size={10} />,
          bgClass: "bg-blue-100",
          badgeColor: "bg-blue-600",
          textColor: "text-blue-600",
        };
    }
  };

  return (
    <Dropdown
      placement="bottom-end"
      className="p-0 min-w-85 sm:min-w-95 max-w-100"
    >
      <DropdownTrigger>
        <div className="relative cursor-pointer group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <Badge
            content={unreadCount}
            color="danger"
            shape="circle"
            size="sm"
            isInvisible={unreadCount === 0}
          >
            <MdNotifications
              size={24}
              className="text-slate-400 group-hover:text-slate-600 transition-colors"
            />
          </Badge>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notificaciones"
        variant="flat"
        className="p-0 gap-0"
        closeOnSelect={false}
      >
        <DropdownSection
          className="mb-0 p-3 pb-2 border-b border-slate-100"
          showDivider={false}
        >
          <DropdownItem
            key="header-notif"
            isReadOnly
            className="p-0 bg-transparent hover:bg-transparent cursor-default opacity-100"
            textValue="Encabezado"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Marcar como leídas
                </button>
              )}
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection className="mb-0 max-h-95 overflow-y-auto divide-y divide-slate-50">
          {notificaciones.length === 0 ? (
            <DropdownItem
              key="no-notif"
              isReadOnly
              className="py-8 text-center opacity-100 cursor-default"
              textValue="Sin notificaciones"
            >
              <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                <Bell size={32} className="stroke-1 text-slate-300" />
                <p className="text-xs">No tienes notificaciones pendientes</p>
              </div>
            </DropdownItem>
          ) : (
            notificaciones.map((n) => {
              const style = getNotificationStyle(n.tipo_notificacion);

              return (
                <DropdownItem
                  key={`notif-${n.id}`}
                  textValue={n.titulo_notificacion}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 rounded-none transition-colors ${
                    !n.vista
                      ? "bg-blue-50/60 hover:bg-blue-50"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="relative shrink-0 mt-0.5">
                      <Avatar
                        size="md"
                        icon={style.icon}
                        className={`${style.bgClass}`}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 ${style.badgeColor} rounded-full text-white shadow-sm flex items-center justify-center`}
                      >
                        {style.smallIcon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <p
                        className={`text-xs ${
                          !n.vista
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                        } line-clamp-1`}
                      >
                        {n.titulo_notificacion}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {n.descripcion_notificacion}
                      </p>
                      <span
                        className={`text-[10px] font-bold mt-1 block uppercase tracking-wider ${style.textColor}`}
                      >
                        {n.tipo_notificacion}
                      </span>
                    </div>

                    {!n.vista && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 self-center" />
                    )}
                  </div>
                </DropdownItem>
              );
            })
          )}
        </DropdownSection>

        <DropdownSection className="mb-0 p-2 border-t border-slate-100">
          <DropdownItem
            key="footer-ver-todas"
            className="text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
            textValue="Ver todas"
          >
            Ver todas las notificaciones
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
