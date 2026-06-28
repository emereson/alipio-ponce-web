import { ListPlus } from "lucide-react";
import { getSmallRankIcon, RANK_SYSTEM } from "./rankConfig";

export default function RankPath({ levelData }: { levelData: any }) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <ListPlus size={18} className="text-cyan-500" />
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">
          Camino de Rangos
        </h4>
      </div>

      <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-slate-900">
        <div className="flex items-center min-w-max gap-2 px-2">
          {RANK_SYSTEM.map((r, idx) => {
            const isAchieved = levelData.total_points >= r.min;
            const isCurrent = levelData.rank === r.id;

            return (
              <div key={r.id} className="flex items-center">
                <div
                  className={`
                  flex flex-col items-center justify-center w-28 h-28 rounded-xl border-2 transition-all
                  ${
                    isCurrent
                      ? `border-cyan-400 bg-slate-800 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-110 z-10`
                      : isAchieved
                        ? `border-slate-600 bg-slate-800/80`
                        : `border-slate-800 bg-slate-900/50 opacity-50 grayscale`
                  }
                `}
                >
                  <div className={`mb-2 ${isCurrent ? "animate-bounce" : ""}`}>
                    {getSmallRankIcon(r.id, "w-10 h-10")}
                  </div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-wider ${isAchieved ? "text-white" : "text-slate-500"}`}
                  >
                    {r.id}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold mt-1">
                    {r.min} EXP
                  </p>
                </div>

                {idx < RANK_SYSTEM.length - 1 && (
                  <div
                    className={`h-1 w-8 mx-1 rounded-full ${levelData.total_points >= RANK_SYSTEM[idx + 1].min ? `bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]` : "bg-slate-800"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
