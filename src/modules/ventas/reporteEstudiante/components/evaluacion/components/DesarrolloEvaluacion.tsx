import { useState, useEffect, memo, useCallback } from "react";
import { Clock, Send, AlertCircle } from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Image,
  Divider,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { SERVERIMG } from "../../../../../../utils/api";

// ================= 1. COMPONENTE CRONÓMETRO AISLADO =================
// Al estar aislado, sus actualizaciones por segundo no afectan al resto del formulario
const CronometroFlotante = memo(
  ({ finEvaluacion, onTimeUp, isSubmitting }: any) => {
    const [timeLeft, setTimeLeft] = useState<string>("00:00");

    useEffect(() => {
      const end = new Date(finEvaluacion).getTime();

      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = end - now;

        if (distance <= 0) {
          setTimeLeft("00:00");
          onTimeUp();
        } else {
          const m = Math.floor(distance / (1000 * 60));
          const s = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${m}:${s < 10 ? "0" : ""}${s}`);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [finEvaluacion, onTimeUp]);

    return (
      <div className="sticky top-2 md:top-4 z-50 bg-slate-900 text-white p-3 md:p-4 flex items-center justify-between rounded-2xl shadow-2xl mb-6 border border-slate-700 mx-2 md:mx-0">
        <div className="flex items-center gap-2 md:gap-3">
          <Clock
            className={`w-5 h-5 md:w-6 md:h-6 ${
              timeLeft.startsWith("00:")
                ? "text-red-500 animate-pulse"
                : "text-amber-500"
            }`}
          />
          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              Tiempo Restante
            </p>
            <p
              className={`text-lg md:text-2xl font-black font-mono leading-none ${
                timeLeft.startsWith("00:") ? "text-red-500" : "text-white"
              }`}
            >
              {timeLeft}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          color="warning"
          size="sm"
          className="font-black uppercase tracking-widest px-4 md:px-8 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105"
          endContent={<Send size={14} className="hidden sm:block" />}
          isLoading={isSubmitting}
        >
          Enviar <span className="hidden sm:inline ml-1">Examen</span>
        </Button>
      </div>
    );
  },
);

// ================= 2. COMPONENTE PREGUNTA MEMOIZADO =================
// React.memo evita que la pregunta se renderice de nuevo a menos que sus props cambien
const ItemPregunta = memo(
  ({ pregunta, index, control, erroresPregunta }: any) => {
    const tieneError = !!erroresPregunta;

    return (
      <Card
        className={`mb-4 md:mb-6 shadow-sm border transition-all duration-300 rounded-4xl ${
          tieneError ? "border-red-400 bg-red-50/30" : "border-slate-200"
        }`}
      >
        <CardBody className="p-6 md:p-8 overflow-visible">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-start">
              {pregunta.imagen_pregunta && (
                <div className="shrink-0">
                  <Image
                    src={`${SERVERIMG}/${pregunta.imagen_pregunta}`}
                    alt="Apoyo visual"
                    className="rounded-xl object-cover w-20 h-20 md:w-28 md:h-28 border-2 border-slate-50 shadow-sm"
                    isZoomed
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <span
                    className={`text-[10px] font-black tracking-widest uppercase ${
                      tieneError ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    Pregunta {index + 1}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {pregunta.titulo_pregunta}
                </h4>

                {pregunta.descripcion_pregunta && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed italic whitespace-pre-wrap">
                    {pregunta.descripcion_pregunta}
                  </p>
                )}
              </div>
            </div>

            <Divider className="opacity-50" />

            {/* CONTENIDO ESPECÍFICO */}
            <div className="mt-2 md:ml-13">
              {pregunta.tipo_pregunta === "ALTERNATIVAS" && (
                <Controller
                  name={String(pregunta.id)}
                  control={control}
                  rules={{ required: "Selecciona una alternativa" }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      {pregunta.respuestas.map((r: any, idx: number) => {
                        const letra = String.fromCharCode(65 + idx);
                        const isSelected = field.value === String(r.id);

                        return (
                          <div
                            key={r.id}
                            onClick={() => field.onChange(String(r.id))}
                            className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm ring-1 ring-amber-400"
                                : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-black text-[10px] mt-0.5 shadow-sm transition-colors ${
                                isSelected
                                  ? "bg-amber-500 text-white border-transparent"
                                  : "bg-white text-slate-400 border border-slate-300"
                              }`}
                            >
                              {letra}
                            </div>
                            <span className="text-xs wrap-break-word leading-snug flex-1 select-none">
                              {r.texto}
                            </span>
                          </div>
                        );
                      })}
                      {tieneError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-semibold">
                          <AlertCircle size={14} />{" "}
                          {(erroresPregunta?.message as string) || "Requerido"}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {/* COMPLETAR */}
              {pregunta.tipo_pregunta === "COMPLETAR" && (
                <div
                  className={`p-5 rounded-2xl border-l-4 ${
                    tieneError
                      ? "bg-red-950/20 border-red-500"
                      : "bg-slate-50 border-amber-500"
                  }`}
                >
                  <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap flex flex-wrap items-center gap-y-2">
                    {pregunta.respuestas.texto_base
                      .split(/(\[hueco_\d+\])/g)
                      .map((part: string, i: number) => {
                        if (part.startsWith("[hueco_")) {
                          const huecoKey = part
                            .replace("[", "")
                            .replace("]", "");
                          const huecoError = erroresPregunta?.[huecoKey];

                          return (
                            <Controller
                              key={i}
                              name={`${pregunta.id}.${huecoKey}`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <span className="inline-flex align-middle mx-1.5 w-24 md:w-32">
                                  <Input
                                    {...field}
                                    size="sm"
                                    variant="faded"
                                    color={huecoError ? "danger" : "default"}
                                    placeholder="..."
                                    classNames={{
                                      input:
                                        "text-center font-bold text-slate-900 text-xs md:text-sm",
                                      inputWrapper:
                                        "bg-white/90 data-[hover=true]:bg-white h-7 min-h-7",
                                    }}
                                  />
                                </span>
                              )}
                            />
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                  </p>
                  {tieneError && (
                    <p className="text-red-400 text-xs mt-4 pt-3 border-t border-white/10 flex items-center gap-1 font-semibold">
                      <AlertCircle size={14} /> Completa todos los espacios
                      vacíos.
                    </p>
                  )}
                </div>
              )}

              {/* POR RELACIONAR */}
              {pregunta.tipo_pregunta === "POR RELACIONAR" && (
                <div className="space-y-3">
                  {pregunta.respuestas.parejas.map((p: any) => {
                    const parejaError = erroresPregunta?.[p.id];

                    return (
                      <div
                        key={p.id}
                        className={`flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0 rounded-xl border transition-colors overflow-hidden ${
                          parejaError
                            ? "border-red-300 bg-red-50/30"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex-1 p-3 md:p-4 font-semibold text-sm md:text-sm text-slate-700 wrap-break-word md:border-r border-slate-200">
                          {p.premisa}
                        </div>

                        <Controller
                          name={`${pregunta.id}.${p.id}`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div className="w-full md:w-70 p-2 bg-white flex items-center">
                              <Select
                                {...field}
                                aria-label="Seleccionar respuesta"
                                placeholder="Seleccionar..."
                                size="sm"
                                variant="flat"
                                color={parejaError ? "danger" : "primary"}
                                isInvalid={!!parejaError}
                                selectedKeys={
                                  field.value
                                    ? new Set([field.value])
                                    : new Set([])
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                                classNames={{
                                  trigger:
                                    "bg-white data-[hover=true]:bg-slate-200 border-1",
                                }}
                              >
                                {pregunta.respuestas.distractores?.map(
                                  (d: string) => (
                                    <SelectItem key={d} textValue={d}>
                                      <span className="text-xs md:text-sm whitespace-normal">
                                        {d}
                                      </span>
                                    </SelectItem>
                                  ),
                                )}
                              </Select>
                            </div>
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
    // Evitamos re-renderizados comparando si los errores de esta pregunta han cambiado
  },
  (prevProps, nextProps) => {
    return (
      prevProps.erroresPregunta === nextProps.erroresPregunta &&
      prevProps.pregunta.id === nextProps.pregunta.id
    );
  },
);

// ================= 3. COMPONENTE PRINCIPAL =================
interface Props {
  evaluacion: any;
  resultadoEvaluacion: any;
  onSubmit: (respuestas: any) => void;
}

const DesarrolloEvaluacion = ({
  evaluacion,
  resultadoEvaluacion,
  onSubmit,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  // Envío forzado cuando se acaba el tiempo usando useCallback para no recrear la función
  const handleTimeUp = useCallback(() => {
    setIsSubmitting(true);
    onSubmit(getValues());
  }, [getValues, onSubmit]);

  const onValidSubmit = (data: any) => {
    setIsSubmitting(true);
    onSubmit(data);
  };

  const onInvalidSubmit = () => {
    toast.error("¡Examen incompleto!", {
      description:
        "Por favor, responde todas las preguntas marcadas en rojo antes de enviar.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      className="w-full relative pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <CronometroFlotante
        finEvaluacion={resultadoEvaluacion.fin_evaluacion}
        onTimeUp={handleTimeUp}
        isSubmitting={isSubmitting}
      />

      <div className="space-y-4 md:space-y-6 px-1 md:px-0">
        {evaluacion.preguntas_evaluacion.map((pregunta: any, index: number) => (
          <ItemPregunta
            key={pregunta.id}
            pregunta={pregunta}
            index={index}
            control={control}
            erroresPregunta={errors[pregunta.id]}
          />
        ))}
      </div>
    </form>
  );
};

export default DesarrolloEvaluacion;
