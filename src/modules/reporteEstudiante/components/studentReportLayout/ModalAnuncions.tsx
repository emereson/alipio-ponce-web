import { useState } from "react";
import { Bell, ChevronLeft, ChevronRight, MegaphoneIcon } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { SERVERIMG } from "../../../../utils/api";
import { Outlet } from "react-router-dom";
import type { Notification, StudentData } from "../../StudentReportLayout";

interface ModalAnuncionsProps {
  dataStudent: StudentData | null;
  dataClassroomId: string;
  classroomId: number | string;
  showNotifications: boolean;
  setShowNotifications: (e: boolean) => void;
  currentSlide: number;
  prevSlide: () => void;
  nextSlide: () => void;
  notifications: Notification[];
}

const ModalAnuncions = ({
  dataStudent,
  dataClassroomId,
  classroomId,
  showNotifications,
  setShowNotifications,
  currentSlide,
  prevSlide,
  nextSlide,
  notifications,
}: ModalAnuncionsProps) => {
  // --- Lógica de deslizamiento (Swipe & Drag) ---
  const [startX, setStartX] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;
    const distance = startX - e.clientX;
    processSwipe(distance);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const distance = startX - e.changedTouches[0].clientX;
    processSwipe(distance);
  };

  const processSwipe = (distance: number) => {
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setStartX(null);
  };
  // ---------------------------------------------

  return (
    <main className="p-2 px-4 overflow-y-auto w-full flex-1 relative">
      <div className="max-w-6xl mx-auto">
        <Outlet context={{ dataStudent, dataClassroomId, classroomId }} />
      </div>

      <Modal
        isOpen={showNotifications}
        onOpenChange={setShowNotifications}
        backdrop="blur"
        size="4xl"
        classNames={{
          base: "bg-white h-[85vh] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col",
          header:
            "bg-slate-900 p-5 flex justify-between items-center z-10 shrink-0",
          body: "p-0 relative bg-slate-50 flex-1 flex flex-col min-h-0",
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
                  <MegaphoneIcon size={18} className="text-yellow-500" />{" "}
                  Anuncios Importantes
                </h3>
              </ModalHeader>

              <ModalBody>
                {notifications.length > 0 ? (
                  <div
                    // Quitamos overflow-hidden de aquí para evitar que se coman los indicadores
                    className="flex flex-col w-full h-full animate-in fade-in duration-500 relative cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* --- WRAPPER DEL CARRUSEL (AQUÍ VA EL OVERFLOW-HIDDEN Y MIN-H-0) --- */}
                    <div className="flex-1 overflow-hidden relative min-h-0">
                      <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{
                          transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                      >
                        {notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="w-full shrink-0 flex flex-col h-full min-h-0"
                          >
                            <div className="p-4 shrink-0 z-10 bg-slate-50">
                              <h4 className="text-center font-black text-slate-800 text-lg leading-tight line-clamp-3 select-none">
                                {notification.title}
                              </h4>
                            </div>

                            <div className="flex-1  px-8 pb-4 flex justify-center items-start min-h-0">
                              <img
                                src={`${SERVERIMG}/${notification.notificationImg}`}
                                className="w-full max-w-xl h-auto rounded-lg shadow-sm border border-slate-200 select-none"
                                alt={`Notificación ${index + 1}`}
                                draggable={false}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* --------------------------- */}

                    {/* Botones de navegación */}
                    {notifications.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                          }}
                          className="absolute left-1 max-sm:left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-110 transition-all z-20"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                          }}
                          className="absolute right-1 max-sm:right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 hover:scale-110 transition-all z-20"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    {/* Indicadores Numéricos y Dots */}
                    {notifications.length > 1 && (
                      <div className="shrink-0 py-3 bg-slate-50 border-t border-slate-200 flex flex-col justify-center items-center gap-3 z-10 relative">
                        {/* Dots */}
                        <div className="flex justify-center gap-2">
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
                        {/* Texto: X de Y */}
                        <span className="text-xs font-bold text-slate-400 tracking-wider select-none">
                          {currentSlide + 1} de {notifications.length}
                        </span>
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
  );
};

export default ModalAnuncions;
