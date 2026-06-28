export const RANK_SYSTEM = [
  {
    id: "BRONCE",
    min: 0,
    next: 501,
    color: "text-orange-700",
    bg: "bg-orange-700/20",
    glow: "drop-shadow-[0_0_10px_rgba(194,65,12,0.8)]",
    barGradient: "from-orange-800 via-orange-600 to-orange-400",
    image: "/bronce.png",
  },
  {
    id: "PLATA",
    min: 501,
    next: 1001,
    color: "text-slate-300",
    bg: "bg-slate-300/20",
    glow: "drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]",
    barGradient: "from-slate-600 via-slate-400 to-slate-200",
    image: "/plata.png",
  },
  {
    id: "ORO",
    min: 1001,
    next: 1501,
    color: "text-yellow-400",
    bg: "bg-yellow-400/20",
    glow: "drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
    barGradient: "from-yellow-600 via-yellow-400 to-yellow-200",
    image: "/oro.png",
  },
  {
    id: "PLATINO",
    min: 1501,
    next: 2001,
    color: "text-teal-300",
    bg: "bg-teal-300/20",
    glow: "drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]",
    barGradient: "from-teal-600 via-teal-400 to-teal-200",
    image: "/platino.png",
  },
  {
    id: "DIAMANTE",
    min: 2001,
    next: 2501,
    color: "text-cyan-400",
    bg: "bg-cyan-400/20",
    glow: "drop-shadow-[0_0_15px_rgba(34,211,238,1)]",
    barGradient: "from-cyan-600 via-cyan-400 to-cyan-200",
    image: "/diamante.png",
  },
  {
    id: "HEROICO",
    min: 2501,
    next: 3001,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/20",
    glow: "drop-shadow-[0_0_15px_rgba(217,70,239,1)]",
    barGradient: "from-fuchsia-700 via-fuchsia-500 to-fuchsia-300",
    image: "/heroico.png",
  },
  {
    id: "GRAN MAESTRO",
    min: 3001,
    next: 9999,
    color: "text-red-500",
    bg: "bg-red-500/20",
    glow: "drop-shadow-[0_0_20px_rgba(239,68,68,1)]",
    barGradient: "from-red-700 via-red-500 to-red-400",
    image: "/gran_maestro.png",
  },
];

export const getSmallRankIcon = (rankId: string, sizeClass = "w-6 h-6") => {
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

export const renderBigRankBadge = (rankId: string) => {
  const rankInfo =
    RANK_SYSTEM.find((r) => r.id === rankId?.toUpperCase()) || RANK_SYSTEM[0];

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute inset-0 ${rankInfo.bg} blur-[30px] rounded-full`}
      ></div>
      <img
        src={rankInfo.image}
        alt={`Rango ${rankInfo.id}`}
        className={`w-32 h-32 md:w-40 md:h-40 object-contain z-10 transition-transform hover:scale-110 duration-300 ${rankInfo.glow}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${rankInfo.id.charAt(0)}&background=random&color=fff&size=128`;
        }}
      />
    </div>
  );
};
