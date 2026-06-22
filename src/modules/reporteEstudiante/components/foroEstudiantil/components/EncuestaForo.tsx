import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import type { EncuestaType } from "../../../../../types/foro.type";

interface EncuestaForoProps {
  opciones: EncuestaType[];
  votoInicialId?: number | null;
  onVoteChange?: (opcionId: number) => void;
}

export default function EncuestaForo({
  opciones,
  votoInicialId = null,
  onVoteChange,
}: EncuestaForoProps) {
  const [opcionVotada, setOpcionVotada] = useState<number | null>(
    votoInicialId,
  );

  useEffect(() => {
    setOpcionVotada(votoInicialId);
  }, [votoInicialId]);

  const handleVotar = (opcionId: number) => {
    const nuevoVoto = opcionVotada === opcionId ? null : opcionId;
    setOpcionVotada(nuevoVoto);

    if (onVoteChange) {
      onVoteChange(opcionId);
    }
  };

  // 🟢 CORRECCIÓN 1: Se agregó el '0' después del '||' y leemos el .length del arreglo
  const totalVotos = opciones.reduce(
    (acc, curr) => acc + (curr.votos?.length || 0),
    0,
  );

  return (
    <div className="px-4 py-4 flex flex-col gap-3 border-b border-slate-100">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-slate-800">
          Pregunta de Encuesta
        </span>
        <span className="text-xs text-slate-500">{totalVotos} votos</span>
      </div>

      {opciones.map((opcion) => {
        const isSelected = opcionVotada === opcion.id;

        // 🟢 CORRECCIÓN 2: Leemos la longitud del arreglo (opcion.votos?.length)
        const votos = opcion.votos?.length || 0;
        const porcentaje =
          totalVotos === 0 ? 0 : Math.round((votos / totalVotos) * 100);

        return (
          <button
            key={opcion.id}
            onClick={() => handleVotar(opcion.id)}
            className={`relative w-full h-10 border rounded-md overflow-hidden flex items-center px-3 transition-colors text-left group
              ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-300 hover:bg-slate-50"}
            `}
          >
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out 
                ${isSelected ? "bg-blue-100/80" : "bg-slate-200/60"}
              `}
              style={{ width: `${porcentaje}%` }}
            />

            <div className="relative z-10 flex justify-between items-center w-full">
              <span
                className={`text-[15px] font-medium flex items-center gap-2 ${isSelected ? "text-blue-900" : "text-slate-800"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                  ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-400 group-hover:border-slate-600"}
                `}
                >
                  <CheckCircle2
                    size={12}
                    className={
                      isSelected
                        ? "text-white"
                        : "text-transparent group-hover:text-slate-300"
                    }
                  />
                </div>
                {opcion.opcion_encuesta}
              </span>

              {totalVotos > 0 && (
                <span
                  className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-600"}`}
                >
                  {porcentaje}%
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
