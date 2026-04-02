import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ChevronLeft, BarChart3, BookOpen, Award } from "lucide-react";
import { toast } from "sonner";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import Loading from "../../../components/Loading";
import { useNavigate, useOutletContext } from "react-router-dom";

// Interfaces para tipado robusto
interface CourseNote {
  id: number;
  name: string;
  note: string | number;
}

interface ExamWeek {
  id: number;
  name: string;
  courses: CourseNote[];
}

interface SummaryItem {
  name: string;
  averageNote: number;
}

const Notes = () => {
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();
  const navigate = useNavigate();

  const [exams, setExams] = useState<ExamWeek[]>([]);
  const [viewDataWeek, setViewDataWeek] = useState(false);
  const [viewSummary, setViewSummary] = useState(false);
  const [weekData, setWeekData] = useState<ExamWeek | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataClassroomId) return;
    setLoading(true);
    axios
      .get(`${API}/accessStudent/exams/${dataClassroomId}`, config)
      .then((res) => setExams(res.data.exams))
      .catch(() => toast.error("Error al cargar las calificaciones"))
      .finally(() => setLoading(false));
  }, [dataClassroomId]);

  // Cálculo de promedio por semana
  const calculateAverage = useCallback(() => {
    if (weekData?.courses && weekData.courses.length > 0) {
      const total = weekData.courses.reduce(
        (acc, course) => acc + parseFloat(course.note as string),
        0,
      );
      return (total / weekData.courses.length).toFixed(2);
    }
    return "0.00";
  }, [weekData]);

  // Generar datos para el gráfico de resumen
  const generateSummary = () => {
    const lastFive = exams.slice(-5);
    const summary = lastFive.map((exam) => {
      const total = exam.courses.reduce(
        (acc, c) => acc + parseFloat(c.note as string),
        0,
      );
      return {
        name: exam.name.replace("SEMANA", "SEM"),
        averageNote: total / exam.courses.length,
      };
    });
    setSummaryData(summary);
    setViewSummary(true);
  };

  // Función para convertir nota a Letra
  const getLiteralNote = (note: string | number) => {
    const n = Number(note);
    if (n >= 18) return { label: "A", color: "success" as const };
    if (n >= 11) return { label: "B", color: "warning" as const };
    return { label: "C", color: "danger" as const };
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {loading && <Loading />}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/reporte-estudiante")}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h3 className="text-slate-900 font-black text-xl uppercase tracking-tighter">
              Reporte de <span className="text-red-600">Notas</span>
            </h3>
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
              Seguimiento Académico
            </p>
          </div>
        </div>
        <Button
          onPress={generateSummary}
          className="bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20"
          startContent={<BarChart3 size={18} className="text-yellow-500" />}
        >
          VER ESTADÍSTICAS
        </Button>
      </div>

      {/* GRID DE SEMANAS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {exams.map((week) => (
          <Card
            key={week.id}
            isPressable
            onPress={() => {
              setWeekData(week);
              setViewDataWeek(true);
            }}
            className="border-none bg-white hover:bg-slate-50 transition-all shadow-md rounded-3xl"
          >
            <CardBody className="flex flex-col items-center py-6 gap-3">
              <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                <BookOpen size={24} />
              </div>
              <p className="font-black text-slate-800 text-[11px] uppercase tracking-wider">
                {week.name}
              </p>
            </CardBody>
          </Card>
        ))}
      </section>

      {/* MODAL HEROUI: DETALLE DE SEMANA */}
      <Modal
        isOpen={viewDataWeek}
        onOpenChange={setViewDataWeek}
        size="2xl"
        scrollBehavior="inside" // 🟢 Esto habilita el scroll interno en el ModalBody
        backdrop="blur"
        classNames={{
          base: "bg-white min-h-[90vh] max-h-[90vh] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col",
          header: "bg-slate-900 p-6 rounded-t-[1rem]",
          body: "p-0", // Quitamos el padding para que la tabla llegue a los bordes
          footer: "bg-slate-50 rounded-b-[1rem] p-8",
          closeButton:
            "text-slate-400 hover:text-white transition-colors top-5 right-5 text-lg",
        }}
        placement="center"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Award className="text-yellow-500" size={24} />
                  <h4 className="text-white font-black uppercase text-sm">
                    {weekData?.name}
                  </h4>
                </div>
              </ModalHeader>
              <ModalBody>
                <Table
                  aria-label="Notas de la semana"
                  removeWrapper // 🟢 Remueve el fondo y sombra default de la tabla de HeroUI
                  classNames={{
                    th: "bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest py-4 sticky top-0 z-10", // Sticky asegura que el header de la tabla no se mueva al hacer scroll
                    td: "py-3",
                  }}
                >
                  <TableHeader>
                    <TableColumn>CURSO / MATERIA</TableColumn>
                    <TableColumn className="text-center">
                      CALIFICACIÓN
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {(weekData?.courses || []).map((course) => {
                      const noteStyle = getLiteralNote(course.note);
                      return (
                        <TableRow
                          key={course.id}
                          className="border-b border-slate-50"
                        >
                          <TableCell className="font-bold text-slate-700 uppercase text-xs">
                            {course.name}
                          </TableCell>
                          <TableCell className="text-center">
                            <Chip
                              color={noteStyle.color}
                              variant="flat"
                              className="font-black px-4"
                            >
                              {noteStyle.label}{" "}
                              <span className="text-[10px] opacity-60 ml-1">
                                ({course.note})
                              </span>
                            </Chip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter className="flex justify-between items-center w-full">
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">
                  Promedio Semanal:
                </span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  {calculateAverage()}
                </span>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL HEROUI: ESTADÍSTICAS (GRÁFICO) */}
      <Modal
        isOpen={viewSummary}
        onOpenChange={setViewSummary}
        size="4xl"
        backdrop="blur"
        classNames={{
          base: "bg-white rounded-[3rem] shadow-2xl p-4",
          closeButton:
            "bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all top-8 right-8 text-xl z-50",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h4 className="text-2xl font-black text-slate-900 uppercase mt-4">
                  Rendimiento <span className="text-red-600">Reciente</span>
                </h4>
              </ModalHeader>
              <ModalBody className="pb-10 pt-6 overflow-x-auto">
                <div className="h-80 min-w-125 flex items-end justify-around gap-4 border-b-2 border-slate-100 pb-2 relative">
                  {/* Líneas de referencia */}
                  {[20, 15, 10, 5, 0].map((line) => (
                    <div
                      key={line}
                      className="absolute w-full border-t border-slate-50 text-[10px] text-slate-300 font-bold pr-2 flex justify-end pointer-events-none"
                      style={{ bottom: `${(line / 20) * 100}%` }}
                    >
                      {line}
                    </div>
                  ))}

                  {summaryData.map((data) => (
                    <div
                      key={data.name}
                      className="flex flex-col items-center gap-4 z-10 w-full max-w-20"
                    >
                      <div className="relative w-full flex flex-col items-center group">
                        <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.averageNote.toFixed(2)}
                        </div>
                        <div
                          className="w-full bg-linear-to-t from-red-600 to-red-400 rounded-t-xl shadow-lg transition-all duration-1000 ease-out"
                          style={{
                            height: `${(data.averageNote / 20) * 280}px`,
                          }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter -rotate-45 md:rotate-0 mt-2">
                        {data.name}
                      </p>
                    </div>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Notes;
