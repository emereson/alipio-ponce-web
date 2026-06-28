import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, Rss, Sparkles } from "lucide-react";
import { API } from "../../../../utils/api";
import config from "../../../../auth/auth.config";
import Loading from "../../../../components/Loading";
import { useNavigate } from "react-router-dom";
import type { ForosType } from "../../../../types/foro.type";
import { handleAxiosError } from "../../../../utils/errorHandler";
import CardForoEstudiante from "./components/CardForoEstudiante";

const ForoEstudiantil = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<ForosType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/foro-estudiantil`, config)
      .then((res) => {
        setForos(res.data.foros);
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 sm:pb-24">
      {loading && <Loading />}

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm mb-4 sm:mb-8 transition-all">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 w-full">
            <button
              onClick={() => navigate("/reporte-estudiante")}
              className="p-1 sm:p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all text-slate-500 shrink-0 group"
            >
              <ChevronLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="p-2 sm:p-2.5 bg-linear-to-tr from-indigo-600 to-violet-500 text-white rounded-lg sm:rounded-xl shadow-md shadow-indigo-200 shrink-0">
                <Rss size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                  Muro{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">
                    Estudiantil
                  </span>
                </h3>
                <p className="text-slate-500 text-[9px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 line-clamp-1">
                  Avisos y Encuestas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="px-1 sm:px-1 max-w-3xl mx-auto">
        {!loading && foros.length === 0 ? (
          <div className="w-full py-16 sm:py-24 flex flex-col items-center justify-center bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 shadow-sm text-center px-4 sm:px-6 mx-2 sm:mx-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-50 rounded-full blur-xl opacity-70"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner mb-4 sm:mb-6 transform -rotate-3">
                <Sparkles size={28} className="text-indigo-400 sm:w-8 sm:h-8" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
              Todo está tranquilo
            </h3>
            <p className="text-slate-500 w-full max-w-xs text-[14px] sm:text-[15px] leading-relaxed">
              La institución aún no ha publicado ningún aviso. Vuelve más tarde.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {foros.map((foro) => (
              <CardForoEstudiante key={foro.id} foro={foro} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ForoEstudiantil;
