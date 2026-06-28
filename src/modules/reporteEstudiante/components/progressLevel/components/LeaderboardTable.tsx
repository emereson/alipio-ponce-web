import { Zap } from "lucide-react";
import { getSmallRankIcon } from "./rankConfig";

export default function LeaderboardTable({
  leaderboard,
  perfilId,
}: {
  leaderboard: any[];
  perfilId: number;
}) {
  return (
    <div className="lg:col-span-4 max-h-140 bg-[#0f131f] rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">
          Top Jugadores
        </h4>
        <Zap size={14} className="text-yellow-400" />
      </div>
      <div className="p-2 flex-1 overflow-y-auto max-h-75 lg:max-h-full scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left border-collapse">
          <tbody>
            {leaderboard.map((user: any, index: number) => (
              <tr
                key={index}
                className={`text-sm ${
                  user.student_id === perfilId
                    ? "bg-cyan-900/30 border-l-2 border-cyan-400"
                    : "hover:bg-slate-800/50 border-l-2 border-transparent"
                } transition-colors`}
              >
                <td className="py-3 px-3">
                  <span
                    className={`font-black w-5 inline-block text-center ${index < 3 ? "text-yellow-500" : "text-slate-500"}`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-2 font-bold text-slate-200 truncate max-w-25 uppercase text-xs">
                  {user.student
                    ? `${user.student.name} ${user.student.lastName}`
                    : "Player"}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {getSmallRankIcon(user.rank)}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-black text-cyan-400 text-xs">
                  {user.total_points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
