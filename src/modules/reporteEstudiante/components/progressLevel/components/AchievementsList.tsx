import { Star } from "lucide-react";

export default function AchievementsList({
  achievements,
}: {
  achievements: any[];
}) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1 px-1">
        <Star size={16} className="text-yellow-500" />
        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">
          Tus Medallas
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-l-4 bg-slate-800/60 backdrop-blur-sm border-y border-r border-y-slate-700 border-r-slate-700 hover:bg-slate-700/60 transition-all ${ach.colors}`}
          >
            <div className="shrink-0 drop-shadow-lg">{ach.icon}</div>
            <div>
              <p className="text-sm font-black text-white uppercase italic tracking-wide">
                {ach.title}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">
                {ach.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
