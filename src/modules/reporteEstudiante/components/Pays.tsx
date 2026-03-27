import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  CheckCircle2,
  Calendar,
  CreditCard,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "../../../utils/formatDate";
import { API } from "../../../utils/api";
import config from "../../../auth/auth.config";
import { useNavigate, useOutletContext } from "react-router-dom";

// Interfaces para TypeScript
interface PayItem {
  id: number;
  name: string;
  amount: string | number;
  date: string;
}

const Pays = () => {
  const { dataClassroomId } = useOutletContext<{ dataClassroomId: string }>();
  const navigate = useNavigate();

  const [pays, setPays] = useState<PayItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!dataClassroomId) return;

    setLoading(true);
    const url = `${API}/accessStudent/pays/${dataClassroomId}`;

    axios
      .get(url, config)
      .then((res) => {
        setPays(res.data.pays);
      })
      .catch(() => {
        toast.error("No se pudo obtener el historial de pagos");
      })
      .finally(() => setLoading(false));
  }, [dataClassroomId]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Atrás
        </button>
        <div className="flex items-center gap-2 text-slate-900">
          <CheckCircle2 size={20} className="text-green-600" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-tight">
            Historial de <span className="text-green-600">Pagos</span>
          </h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LISTADO DE TRANSACCIONES */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <Receipt size={16} className="text-yellow-500" /> Mensualidades
                Canceladas
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-3 py-1 rounded-full">
                {pays.length} Registros
              </span>
            </div>

            <div className="p-4 md:p-8">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-slate-100 border-t-green-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Cargando historial...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pays && pays.length > 0 ? (
                    pays.map((pay) => (
                      <div
                        key={pay.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-green-500/20 hover:bg-white transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                          <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase text-xs md:text-sm tracking-tight">
                              {pay.name}
                            </p>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium mt-1 uppercase">
                              <Calendar size={12} />
                              Pago realizado el: {formatDate(pay.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                            Monto Pagado
                          </p>
                          <span className="text-xl font-black text-slate-900">
                            S/ {Number(pay.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium italic">
                        No se registran pagos en este periodo escolar.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RESUMEN Y ESTADO */}
        <section className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Estado de Cuenta al día
                </p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                Total Invertido
              </h4>
              <h2 className="text-5xl font-black tracking-tighter text-white mb-2">
                S/{" "}
                {pays
                  .reduce((acc, curr) => acc + Number(curr.amount), 0)
                  .toFixed(2)}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                Año Lectivo {new Date().getFullYear()}
              </p>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] leading-relaxed text-slate-400 italic">
                  "La educación es el arma más poderosa que puedes usar para
                  cambiar el mundo."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-lg">
            <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
              Información de Boletas
            </h4>
            <p className="text-slate-500 text-[10px] leading-relaxed">
              Las boletas de venta electrónicas son enviadas al correo
              institucional registrado en el momento del pago. Si requiere un
              duplicado, acérquese a Tesorería.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pays;
