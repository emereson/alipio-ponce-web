import { SERVERIMG } from "../../../../../utils/api";

export default function TopUserPanel({
  perfil,
  levelData,
  progressData,
  progressPercentage,
  currentRankInfo,
}: any) {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-10 bg-slate-900/80 p-6 rounded-2xl border border-slate-700 shadow-inner relative z-10">
      {/* USER INFO */}
      <div className="flex items-center gap-4 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-700 pb-6 lg:pb-0 lg:pr-6">
        <div className="w-20 h-20 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 p-0.5 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <img
            src={
              perfil?.studentImg
                ? perfil?.studentImg.startsWith("http")
                  ? perfil?.studentImg
                  : `${SERVERIMG}/${perfil?.studentImg}`
                : "/avatar-default.png"
            }
            alt="Avatar"
            className="w-full h-full rounded-xl bg-[#171c2b]"
          />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase italic">
            {perfil?.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-slate-800 text-cyan-400 text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase border border-cyan-500/30">
              Lv. {levelData.level}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Player TIER
            </span>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full lg:w-2/3">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-2xl font-black text-white italic tracking-wider">
              RANGO ACTUAL
            </h3>
          </div>
          <div className="text-right flex items-baseline gap-1">
            <span
              className={`text-2xl font-black ${currentRankInfo.color} ${currentRankInfo.glow}`}
            >
              {levelData.total_points.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-bold tracking-widest">
              EXP
            </span>
            {levelData.total_points < 3001 && (
              <span className="text-sm text-slate-500 font-bold ml-2">
                / {progressData.nextPts.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="h-5 w-full bg-slate-950 rounded border border-slate-800 relative shadow-inner overflow-hidden skew-x-[-10deg]">
          <div
            className={`h-full bg-linear-to-r ${currentRankInfo.barGradient} relative transition-all duration-1000`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        <p
          className={`text-right text-[11px] mt-2 font-black uppercase tracking-widest ${currentRankInfo.color}`}
        >
          {levelData.total_points >= 3001
            ? "¡ESTÁS EN LA CIMA!"
            : `PRÓXIMO RANGO: ${progressData.nextName}`}
        </p>
      </div>
    </div>
  );
}
