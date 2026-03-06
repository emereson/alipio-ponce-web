import { MdPostAdd } from "react-icons/md";
import FormNuevaCotizacion from "./formCrearCotizacion/FormNuevaCotizacion";

const NuevaCotizacion = () => {
  return (
    <main className="w-full  z-10  flex flex-col  px-4 pt-4 py-3 gap-3">
      <section className="flex items-end gap-1">
        <MdPostAdd className="text-3xl text-slate-900" />
        <h1 className="text-lg font-bold text-slate-800">Nueva Cotización</h1>
      </section>
      <FormNuevaCotizacion />
    </main>
  );
};

export default NuevaCotizacion;
