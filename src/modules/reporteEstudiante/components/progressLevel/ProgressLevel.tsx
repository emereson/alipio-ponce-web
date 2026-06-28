import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  Trophy,
  Brain,
  Target,
  ChevronsUp,
  Loader2,
} from "lucide-react";

import TopUserPanel from "./components/TopUserPanel";
import CombatStats from "./components/CombatStats";
import AchievementsList from "./components/AchievementsList";
import LeaderboardTable from "./components/LeaderboardTable";
import RankPath from "./components/RankPath";
import { API } from "../../../../utils/api";
import { useAuthStore } from "../../../../auth/auth.store";
import config from "../../../../auth/auth.config";
import { RANK_SYSTEM } from "./components/rankConfig";

export default function ProgressLevel() {
  const navigate = useNavigate();
  const { perfil } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const getStudentLevel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/nivel-estudiante`, config);
      setLevelData(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getRanking = async () => {
    try {
      const response = await axios.get(
        `${API}/nivel-estudiante/ranking/top`,
        config,
      );
      setLeaderboard(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (perfil?.id) {
      getStudentLevel();
      getRanking();
    }
  }, [perfil]);

  const achievements = useMemo(() => {
    if (!levelData) return [];
    const achievementsArray = [];

    if (levelData.total_points >= 500) {
      achievementsArray.push({
        id: 1,
        title: "Alumno Destacado",
        description: "Alcanzaste 500+ Puntos Totales de EXP.",
        icon: <Brain size={28} />,
        colors:
          "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] text-blue-400 bg-blue-500/10",
      });
    }
    if (levelData.level >= 5) {
      achievementsArray.push({
        id: 2,
        title: "Líder Académico",
        description: "Otorgado por subir al Nivel 5 o superior.",
        icon: <ChevronsUp size={28} />,
        colors:
          "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] text-yellow-400 bg-yellow-500/10",
      });
    }
    if (["DIAMANTE", "HEROICO", "GRAN MAESTRO"].includes(levelData.rank)) {
      achievementsArray.push({
        id: 3,
        title: "Élite Académica",
        description: "Llegaste a las grandes ligas (Rango Diamante+).",
        icon: <Trophy size={28} />,
        colors:
          "border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6)] text-fuchsia-400 bg-fuchsia-500/10",
      });
    }
    if (achievementsArray.length === 0) {
      achievementsArray.push({
        id: 0,
        title: "Recluta",
        description: "Sigue acumulando puntos para desbloquear medallas.",
        icon: <Target size={28} />,
        colors: "border-slate-600 text-slate-400 bg-slate-800/50",
      });
    }
    return achievementsArray;
  }, [levelData]);

  const progressData = useMemo(() => {
    if (!levelData) return { nextPts: 221, nextName: "PLATA" };
    const current =
      RANK_SYSTEM.find(
        (r) =>
          levelData.total_points >= r.min && levelData.total_points < r.next,
      ) || RANK_SYSTEM[RANK_SYSTEM.length - 1];
    return {
      nextPts: current.next,
      nextName:
        current.id === "GRAN MAESTRO"
          ? "RANGO MÁXIMO"
          : RANK_SYSTEM.find((r) => r.min === current.next)?.id,
    };
  }, [levelData]);

  const progressPercentage = levelData
    ? levelData.total_points >= 3001
      ? 100
      : (levelData.total_points / progressData.nextPts) * 100
    : 0;

  const currentRankInfo = useMemo(() => {
    if (!levelData) return RANK_SYSTEM[0];
    return (
      RANK_SYSTEM.find((r) => r.id === levelData.rank?.toUpperCase()) ||
      RANK_SYSTEM[0]
    );
  }, [levelData]);

  const miPuesto = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0 || !perfil?.id) return "-";
    const index = leaderboard.findIndex(
      (user: any) => user.student_id === perfil.id,
    );
    return index !== -1 ? `#${index + 1}` : "+99";
  }, [leaderboard, perfil]);

  if (loading || !levelData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-cyan-500" size={50} />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 font-sans">
      <div className="flex items-center justify-between mb-6 bg-[#131722] p-4 rounded-xl shadow-lg border border-slate-800">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Base
        </button>
        <div className="flex items-center gap-2 text-white">
          <Trophy size={20} className="text-yellow-500" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-widest italic">
            Zona de <span className="text-cyan-500">Combate</span>
          </h3>
        </div>
      </div>

      <div className="bg-[#171c2b] rounded-2xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute -top-25 -right-25 w-125 h-125 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <TopUserPanel
          perfil={perfil}
          levelData={levelData}
          progressData={progressData}
          progressPercentage={progressPercentage}
          currentRankInfo={currentRankInfo}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 mb-10">
          <CombatStats
            levelData={levelData}
            currentRankInfo={currentRankInfo}
            miPuesto={miPuesto}
          />
          <AchievementsList achievements={achievements} />
          {perfil && (
            <LeaderboardTable leaderboard={leaderboard} perfilId={perfil?.id} />
          )}
        </div>

        <RankPath levelData={levelData} />
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
