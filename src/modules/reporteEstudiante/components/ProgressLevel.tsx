import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ChevronLeft,
  Trophy,
  Zap,
  Brain,
  Star,
  Loader2,
  ListPlus,
  Target,
  ChevronsUp,
} from "lucide-react";

import { useAuthStore } from "../../../auth/auth.store";
import config from "../../../auth/auth.config";
import { API, SERVERIMG } from "../../../utils/api";

// Configuración global de rangos: AHORA CON GRADIENTES PARA LA BARRA
const RANK_SYSTEM = [
  {
    id: "BRONCE",
    min: 0,
    next: 221,
    color: "text-orange-700",
    bg: "bg-orange-700/20",
    glow: "drop-shadow-[0_0_10px_rgba(194,65,12,0.8)]",
    barGradient: "from-orange-800 via-orange-600 to-orange-400",
    image: "/bronce.png",
  },
  {
    id: "PLATA",
    min: 221,
    next: 441,
    color: "text-slate-300",
    bg: "bg-slate-300/20",
    glow: "drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]",
    barGradient: "from-slate-600 via-slate-400 to-slate-200",
    image: "/plata.png",
  },
  {
    id: "ORO",
    min: 441,
    next: 661,
    color: "text-yellow-400",
    bg: "bg-yellow-400/20",
    glow: "drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
    barGradient: "from-yellow-600 via-yellow-400 to-yellow-200",
    image: "/oro.png",
  },
  {
    id: "PLATINO",
    min: 661,
    next: 881,
    color: "text-teal-300",
    bg: "bg-teal-300/20",
    glow: "drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]",
    barGradient: "from-teal-600 via-teal-400 to-teal-200",
    image: "/platino.png",
  },
  {
    id: "DIAMANTE",
    min: 881,
    next: 1101,
    color: "text-cyan-400",
    bg: "bg-cyan-400/20",
    glow: "drop-shadow-[0_0_15px_rgba(34,211,238,1)]",
    barGradient: "from-cyan-600 via-cyan-400 to-cyan-200",
    image: "/diamante.png",
  },
  {
    id: "HEROICO",
    min: 1101,
    next: 1321,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/20",
    glow: "drop-shadow-[0_0_15px_rgba(217,70,239,1)]",
    barGradient: "from-fuchsia-700 via-fuchsia-500 to-fuchsia-300",
    image: "/heroico.png",
  },
  {
    id: "GRAN MAESTRO",
    min: 1321,
    next: 9999,
    color: "text-red-500",
    bg: "bg-red-500/20",
    glow: "drop-shadow-[0_0_20px_rgba(239,68,68,1)]",
    barGradient: "from-red-700 via-red-500 to-red-400",
    image: "/gran_maestro.png",
  },
];

export default function ProgressLevel() {
  const navigate = useNavigate();

  const { perfil } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // =========================================================
  // CARGAR NIVEL ESTUDIANTE
  // =========================================================
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

  // =========================================================
  // CARGAR RANKING
  // =========================================================
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

  // =========================================================
  // LOGROS DINÁMICOS CON DESCRIPCIONES (EXPLICATIVOS)
  // =========================================================
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

    if (
      levelData.rank === "DIAMANTE" ||
      levelData.rank === "HEROICO" ||
      levelData.rank === "GRAN MAESTRO"
    ) {
      achievementsArray.push({
        id: 3,
        title: "Élite Académica",
        description: "Llegaste a las grandes ligas (Rango Diamante+).",
        icon: <Trophy size={28} />,
        colors:
          "border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6)] text-fuchsia-400 bg-fuchsia-500/10",
      });
    }

    // Logro por defecto si aún no tiene nada
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

  // =========================================================
  // LÓGICA DE RANGOS Y COLORES
  // =========================================================
  const getProgressData = (points: number) => {
    const current =
      RANK_SYSTEM.find((r) => points >= r.min && points < r.next) ||
      RANK_SYSTEM[RANK_SYSTEM.length - 1];
    return {
      nextPts: current.next,
      nextName:
        current.id === "GRAN MAESTRO"
          ? "RANGO MÁXIMO"
          : RANK_SYSTEM.find((r) => r.min === current.next)?.id,
    };
  };

  const progressData = useMemo(() => {
    return levelData
      ? getProgressData(levelData.total_points)
      : { nextPts: 221, nextName: "PLATA" };
  }, [levelData]);

  const progressPercentage = levelData
    ? levelData.total_points >= 1321
      ? 100
      : (levelData.total_points / progressData.nextPts) * 100
    : 0;

  // Extraemos la información del rango actual para los colores de la barra
  const currentRankInfo = useMemo(() => {
    if (!levelData) return RANK_SYSTEM[0];
    return (
      RANK_SYSTEM.find((r) => r.id === levelData.rank?.toUpperCase()) ||
      RANK_SYSTEM[0]
    );
  }, [levelData]);

  // =========================================================
  // INSIGNIAS "GAMER" RENDERIZADAS DESDE IMAGEN
  // =========================================================

  // Insignia grande para la tarjeta principal
  const renderBigRankBadge = (rankId: string) => {
    const rankInfo =
      RANK_SYSTEM.find((r) => r.id === rankId?.toUpperCase()) || RANK_SYSTEM[0];

    return (
      <div className="relative flex items-center justify-center">
        {/* Resplandor de fondo dinámico basado en el color del rango */}
        <div
          className={`absolute inset-0 ${rankInfo.bg} blur-[30px] rounded-full`}
        ></div>

        {/* Imagen de la insignia */}
        <img
          src={rankInfo.image}
          alt={`Rango ${rankInfo.id}`}
          className={`w-32 h-32 md:w-40 md:h-40 object-contain z-10 transition-transform hover:scale-110 duration-300 ${rankInfo.glow}`}
          onError={(e) => {
            // Fallback en caso de que la imagen no exista aún
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${rankInfo.id.charAt(0)}&background=random&color=fff&size=128`;
          }}
        />
      </div>
    );
  };

  // Mini icono para la tabla de líderes y el camino de rangos
  const getSmallRankIcon = (rankId: string, sizeClass = "w-6 h-6") => {
    const rankInfo =
      RANK_SYSTEM.find((r) => r.id === rankId?.toUpperCase()) || RANK_SYSTEM[0];

    return (
      <img
        src={rankInfo.image}
        alt={rankInfo.id}
        className={`${sizeClass} object-contain ${rankInfo.glow}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${rankInfo.id.charAt(0)}&background=random&color=fff&size=32`;
        }}
      />
    );
  };

  if (loading || !levelData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-cyan-500" size={50} />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 font-sans">
      {/* HEADER */}
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

      {/* MAIN CONTAINER */}
      <div className="bg-[#171c2b] rounded-2xl p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Fondo decorativo gamer */}
        <div className="absolute -top-25 -right-25 w-125 h-125 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        {/* TOP PANEL */}
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
                {levelData.total_points < 1321 && (
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
                {/* Brillo interno tipo láser */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>

            <p
              className={`text-right text-[11px] mt-2 font-black uppercase tracking-widest ${currentRankInfo.color}`}
            >
              {levelData.total_points >= 1321
                ? "¡ESTÁS EN LA CIMA!"
                : `PRÓXIMO RANGO: ${progressData.nextName}`}
            </p>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 mb-10">
          {/* TARJETA DE RANGO Y PUNTOS */}
          <div className="lg:col-span-4 flex flex-col items-center p-8 bg-linear-to-b from-slate-800/80 to-slate-900 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
            {/* Destello al hacer hover */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
                  +{levelData.breakdown?.attendancePoints}{" "}
                  <span className="text-[9px] text-slate-500">EXP</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-slate-300 font-bold uppercase text-xs">
                    Rendimiento
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Daño Crítico (Notas)
                  </p>
                </div>
                <span className="text-cyan-400 font-black text-right tracking-widest text-xs">
                  +{levelData.breakdown?.gradePoints}{" "}
                  <span className="text-[9px] text-slate-500">EXP</span>
                </span>
              </div>
            </div>
          </div>

          {/* LOGROS / MEDALLAS */}
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

          {/* RANKING (LEADERBOARD) */}
          <div className="lg:col-span-4 bg-[#0f131f] rounded-2xl border border-slate-700 overflow-hidden flex flex-col shadow-xl">
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
                        user.student_id === perfil?.id
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
                      {/* 🟢 CORRECCIÓN AQUÍ: Mostrar Nombre y Apellido */}
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
        </div>

        {/* CAMINO DE RANGOS (NUEVA SECCIÓN) */}
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
                    {/* Tarjeta de Rango */}
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
                      <div
                        className={`mb-2 ${isCurrent ? "animate-bounce" : ""}`}
                      >
                        {/* Se usa la función que trae tu imagen */}
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

                    {/* Conector */}
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
      </div>

      {/* Definición de Keyframes para animaciones custom */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
