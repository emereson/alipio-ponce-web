import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

// Cambiamos los íconos planos por Emojis nativos, mucho más parecidos a Facebook
export const REACCIONES = {
  me_gusta: { emoji: "👍", color: "text-blue-600", label: "Me gusta" },
  no_me_gusta: { emoji: "👎", color: "text-orange-500", label: "No me gusta" },
  me_encanta: { emoji: "❤️", color: "text-rose-600", label: "Me encanta" },
  me_triste: { emoji: "😢", color: "text-yellow-500", label: "Me entristece" },
  me_enoja: { emoji: "😡", color: "text-red-500", label: "Me enoja" },
} as const;

export type TipoReaccion = keyof typeof REACCIONES;

interface ReaccionForoGlobal {
  id: number;
  estudiante_id: number;
  tipo_reaccion: TipoReaccion;
}

interface ReaccionesForoProps {
  todasLasReacciones: ReaccionForoGlobal[];
  reaccionInicial?: TipoReaccion | null;
  onReactChange?: (tipo: TipoReaccion | null) => void;
}

export default function ReaccionesForo({
  todasLasReacciones,
  reaccionInicial = null,
  onReactChange,
}: ReaccionesForoProps) {
  const [reaccionActual, setReaccionActual] = useState<TipoReaccion | null>(
    reaccionInicial,
  );

  useEffect(() => {
    setReaccionActual(reaccionInicial);
  }, [reaccionInicial]);

  const handleReaccion = (tipo: TipoReaccion) => {
    const nuevaReaccion = reaccionActual === tipo ? null : tipo;
    setReaccionActual(nuevaReaccion);

    if (onReactChange) {
      onReactChange(nuevaReaccion);
    }
  };

  const emojisUnicosForo = Array.from(
    new Set(todasLasReacciones.map((r) => REACCIONES[r.tipo_reaccion]?.emoji)),
  ).filter(Boolean);

  const totalReacciones = todasLasReacciones.length;
  const ReaccionActualConfig = reaccionActual
    ? REACCIONES[reaccionActual]
    : null;

  return (
    <div className="relative group flex items-center">
      <div className="absolute bottom-full left-0 pb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-full px-2 py-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {(Object.keys(REACCIONES) as TipoReaccion[]).map((key) => {
            const { emoji, label } = REACCIONES[key];
            const isSelected = reaccionActual === key;

            return (
              <button
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaccion(key);
                }}
                className={`relative px-1 hover:scale-125 hover:-translate-y-2 transition-all duration-200 origin-bottom cursor-pointer
                  ${isSelected ? "scale-125 -translate-y-2" : "scale-100"}
                `}
                title={label}
              >
                <span
                  className={`text-3xl block drop-shadow-md ${
                    isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {emoji}
                </span>
                {isSelected && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🟢 BOTÓN DE RESUMEN E INTERACCIÓN */}
      <button
        onClick={() => handleReaccion(reaccionActual || "me_gusta")}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md transition-colors"
      >
        {totalReacciones > 0 ? (
          <>
            <div className="flex -space-x-1 relative z-0">
              {emojisUnicosForo.slice(0, 3).map((emoji, idx) => (
                <span
                  key={idx}
                  className="z-10 bg-white rounded-full leading-none text-[15px] drop-shadow-sm border border-white"
                >
                  {emoji}
                </span>
              ))}
            </div>
            <span
              className={`text-[13px] ml-1 font-bold ${
                ReaccionActualConfig
                  ? ReaccionActualConfig.color
                  : "text-slate-500"
              }`}
            >
              {totalReacciones}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <ThumbsUp size={16} />
            <span className="text-[12px] font-medium">
              Sé el primero en reaccionar
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
