import { Target } from "lucide-react";
import { renderBigRankBadge } from "./rankConfig";

export default function CombatStats({
  levelData,
  currentRankInfo,
  miPuesto,
}: any) {
  return (
    <div className="lg:col-span-4 flex flex-col items-center p-8 bg-linear-to-b from-slate-800/80 to-slate-900 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <p
        className={`text-2xl font-black uppercase tracking-[0.15em] italic drop-shadow-lg mb-1 ${currentRankInfo.color}`}
      >
        {miPuesto}
      </p>

      <div className="h-40 w-full flex items-center justify-center mb-4">
        {renderBigRankBadge(levelData.rank)}
      </div>

      <h3
        className={`text-3xl font-black uppercase tracking-[0.15em] italic drop-shadow-lg mb-6 ${currentRankInfo.color}`}
      >
        {levelData.rank}
      </h3>

      {/* DESGLOSE ESTILO HUD DE JUEGO */}
      <div className="w-full bg-[#0f131f] rounded-xl p-4 border border-slate-700/80 text-left shadow-inner">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
          <Target size={12} className={currentRankInfo.color} />
          Estadísticas de Combate
        </h4>

        {/* ASISTENCIA */}
        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
          <div>
            <p className="text-slate-300 font-bold uppercase text-xs">
              Asistencias
            </p>
            <p className="text-[10px] text-slate-500">
              {levelData.breakdown?.attendanceCount} rachas
            </p>
          </div>
          <span className="text-green-400 font-black text-right tracking-widest text-xs">
            +{levelData.breakdown?.attendancePoints || 0}{" "}
            <span className="text-[9px] text-slate-500">EXP</span>
          </span>
        </div>

        {/* NOTAS */}
        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
          <div>
            <p className="text-slate-300 font-bold uppercase text-xs">
              Rendimiento
            </p>
            <p className="text-[10px] text-slate-500">Daño Crítico (Notas)</p>
          </div>
          <span className="text-cyan-400 font-black text-right tracking-widest text-xs">
            +{levelData.breakdown?.gradePoints || 0}{" "}
            <span className="text-[9px] text-slate-500">EXP</span>
          </span>
        </div>

        {/* NUEVO: REACCIONES FOROS */}
        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
          <div>
            <p className="text-slate-300 font-bold uppercase text-xs">
              Foro Estudiantil
            </p>
            <p className="text-[10px] text-slate-500">1 pt x reacción</p>
          </div>
          <span className="text-fuchsia-400 font-black text-right tracking-widest text-xs">
            +
            {levelData.breakdown?.forumReactionPoints ||
              0 + levelData.breakdown?.forumPollPoints ||
              0 + levelData.breakdown?.forumCommentPoints ||
              0}{" "}
            <span className="text-[9px] text-slate-500">EXP</span>
          </span>
        </div>

        {/* NUEVO: ENCUESTAS FOROS */}
        {/* <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
          <div>
            <p className="text-slate-300 font-bold uppercase text-xs">
              Votos Encuestas
            </p>
            <p className="text-[10px] text-slate-500">1 pt x voto</p>
          </div>
          <span className="text-orange-400 font-black text-right tracking-widest text-xs">
            +{levelData.breakdown?.forumPollPoints || 0}{" "}
            <span className="text-[9px] text-slate-500">EXP</span>
          </span>
        </div> */}

        {/* NUEVO: COMENTARIOS FOROS */}
        {/* <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-slate-300 font-bold uppercase text-xs">
              Comentarios Foro
            </p>
            <p className="text-[10px] text-slate-500">3 pts x comentario</p>
          </div>
          <span className="text-yellow-400 font-black text-right tracking-widest text-xs">
            +{levelData.breakdown?.forumCommentPoints || 0}{" "}
            <span className="text-[9px] text-slate-500">EXP</span>
          </span>
        </div> */}
      </div>
    </div>
  );
}
