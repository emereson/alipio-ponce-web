import {
  ChevronLeft,
  ReceiptText,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { StudentData } from "../StudentReportLayout";

// Interfaces para TypeScript

const Debts = () => {
  const { dataStudent } = useOutletContext<{
    dataStudent: StudentData;
  }>();
  const navigate = useNavigate(); // 🟢 Hook para navegar

  // Cálculo del total de deuda
  const totalDebt =
    dataStudent?.debts?.reduce((acc, curr) => acc + Number(curr.amount), 0) ||
    0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate("/reporte-estudiante")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={20} /> Atrás
        </button>
        <div className="flex items-center gap-2 text-slate-900">
          <ReceiptText size={20} className="text-red-600" />
          <h3 className="font-black text-sm md:text-base uppercase tracking-tight">
            Estado de <span className="text-red-600">Deudas</span>
          </h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* TABLA DE DEUDAS */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-500" /> Detalle de
                Pagos Pendientes
              </h4>
            </div>

            <div className="p-2 md:p-6">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-4 py-2">Concepto de Pago</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStudent?.debts && dataStudent?.debts?.length > 0 ? (
                    dataStudent?.debts?.map((pay) => (
                      <tr
                        key={pay.id}
                        className="group transition-all hover:translate-x-1"
                      >
                        <td className="bg-slate-50 rounded-l-xl px-4 py-4 text-slate-700 font-bold text-sm uppercase">
                          {pay.name}
                        </td>
                        <td className="bg-slate-50 rounded-r-xl px-4 py-4 text-right">
                          <span className="text-red-600 font-black text-base">
                            S/ {Number(pay.amount).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-12 text-center text-slate-400 font-medium italic bg-slate-50 rounded-2xl"
                      >
                        No registra deudas pendientes. ¡Excelente!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RESUMEN DE PAGO */}
        <section className="space-y-6">
          <div className="bg-linear-to-br from-red-600 to-red-700 text-white p-8 rounded-[2.5rem] shadow-xl shadow-red-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard size={120} />
            </div>

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                Total Acumulado
              </p>
              <h2 className="text-5xl font-black tracking-tighter mb-6">
                S/ {totalDebt.toFixed(2)}
              </h2>

              <div className="pt-6 border-t border-white/20">
                <p className="text-[10px] font-medium leading-relaxed opacity-90">
                  Recuerde realizar sus pagos puntualmente para evitar moras y
                  asegurar la continuidad del servicio educativo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex items-center gap-4">
            <div className="bg-yellow-500/10 p-3 rounded-2xl">
              <InfoIcon className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase">
                ¿Dónde pagar?
              </p>
              <p className="text-[10px] text-slate-500">
                Banco de la Nación / Tesorería I.E.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Componente de icono interno para evitar errores si no se importa
const InfoIcon = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default Debts;
