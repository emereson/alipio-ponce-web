import { Select, SelectItem, Input, Tooltip, Button } from "@heroui/react";
import { useEffect, useState, type ChangeEvent } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "axios";
import config from "../../../../../auth/auth.config";
import type { PagosType } from "../../../../../types/cotizacion.type";
import type {
  CuentaBancariaType,
  MetodoPagoType,
} from "../../../../../types/pago.type";
import { onInputPrice } from "../../../../../utils/onInputs";
import { handleAxiosError } from "../../../../../utils/errorHandler";
import { API } from "../../../../../utils/api";
import { newDate } from "../../../../../utils/formatDate";

interface Props {
  arrayPagos: PagosType[];
  setArrayPagos: (value: PagosType[]) => void;
}

const CamposMetodosDePago = ({ arrayPagos, setArrayPagos }: Props) => {
  const [metodosPagos, setMetodosPagos] = useState<MetodoPagoType[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<
    CuentaBancariaType[]
  >([]);

  useEffect(() => {
    const url = `${API}/ajustes/metodos-pago`;
    axios
      .get<{ metodosPago: MetodoPagoType[] }>(url, config)
      .then((res) => setMetodosPagos(res.data.metodosPago))
      .catch((err) => handleAxiosError(err));
  }, []);

  useEffect(() => {
    const url = `${API}/ajustes/cuentas-banco`;
    axios
      .get<{ cuentasBancarias: CuentaBancariaType[] }>(url, config)
      .then((res) => setCuentasBancarias(res.data.cuentasBancarias))
      .catch((err) => handleAxiosError(err));
  }, []);

  const handleAddPago = () => {
    const nuevoPago: PagosType = {
      id: Date.now(),
      metodoPago: "",
      banco: "",
      operacion: "",
      monto: "",
      fecha: newDate,
    };
    setArrayPagos([...arrayPagos, nuevoPago]);
  };

  const handleInputChange = (
    index: number,
    field: keyof PagosType,
    value: string,
  ) => {
    const updatedPagos = arrayPagos.map((pago, i) =>
      i === index ? { ...pago, [field]: value } : pago,
    );
    setArrayPagos(updatedPagos);
  };

  const handleDeletePago = (index: number) => {
    const updatedPagos = arrayPagos.filter((_, i) => i !== index);
    setArrayPagos(updatedPagos);
  };

  // Definimos las clases comunes para mantener consistencia
  const inputStyles = {
    inputWrapper:
      "border-1 border-slate-600 bg-white data-[hover=true]:border-emerald-500 group-data-[focus=true]:border-emerald-600",
    input: "text-slate-700 text-[11px] font-medium",
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Contenedor tipo Tabla */}
      <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header - Usamos el color Slate-900 del menú */}
        <div className="w-full bg-slate-900 grid grid-cols-12 gap-2 px-4 py-3 items-center  text-white font-bold  text-[11px] uppercase ">
          <div className="col-span-2 tracking-wide">Método de pago</div>
          <div className="col-span-3 tracking-wide">Banco</div>
          <div className="col-span-2 tracking-wide">Operación</div>
          <div className="col-span-2 tracking-wide">Monto</div>
          <div className="col-span-2 tracking-wide">Fecha</div>
          <div className="col-span-1 text-center tracking-wide">Acción</div>
        </div>

        {/* Body - Filas */}
        <div className="flex flex-col bg-white">
          {arrayPagos?.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm italic border-b border-slate-100">
              No hay pagos registrados. Haz clic en "Agregar Pago".
            </div>
          )}

          {arrayPagos?.map((newPago, index) => (
            <div
              key={newPago.id || index}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-100 items-start hover:bg-slate-50 transition-colors"
            >
              {/* Método de Pago */}
              <div className="col-span-2">
                <Select
                  aria-label="Método de pago"
                  selectedKeys={
                    newPago.metodoPago ? [String(newPago.metodoPago)] : []
                  }
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(index, "metodoPago", e.target.value)
                  }
                  placeholder="Seleccione"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  classNames={{
                    trigger: inputStyles.inputWrapper,
                    value: inputStyles.input,
                  }}
                >
                  {metodosPagos.map((metodoPago) => (
                    <SelectItem
                      key={metodoPago.id}
                      textValue={metodoPago.descripcion}
                    >
                      {metodoPago.descripcion}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Banco */}
              <div className="col-span-3">
                <Select
                  aria-label="Banco"
                  selectedKeys={newPago.banco ? [String(newPago.banco)] : []}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(index, "banco", e.target.value)
                  }
                  placeholder="Seleccione Banco"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  classNames={{
                    trigger: inputStyles.inputWrapper,
                    value: inputStyles.input,
                  }}
                >
                  {cuentasBancarias.map((cuentaBancaria) => (
                    <SelectItem
                      key={cuentaBancaria.id}
                      textValue={`${cuentaBancaria.descripcion} - ${cuentaBancaria.numero}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-[11px]">
                          {cuentaBancaria.descripcion}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {cuentaBancaria.numero}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Operación */}
              <div className="col-span-2">
                <Input
                  aria-label="Operación"
                  value={String(newPago.operacion)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "operacion", e.target.value)
                  }
                  placeholder="N° Op."
                  type="text"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  classNames={inputStyles}
                />
              </div>

              {/* Monto */}
              <div className="col-span-2">
                <Input
                  aria-label="Monto"
                  value={String(newPago.monto)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "monto", e.target.value)
                  }
                  startContent={
                    <span className="text-slate-400 text-xs">S/</span>
                  }
                  placeholder="0.00"
                  type="text"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  onInput={onInputPrice}
                  classNames={inputStyles}
                />
              </div>

              {/* Fecha */}
              <div className="col-span-2">
                <Input
                  aria-label="Fecha"
                  value={newPago.fecha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, "fecha", e.target.value)
                  }
                  type="date"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  classNames={inputStyles}
                />
              </div>

              {/* Eliminar */}
              <div className="col-span-1 flex justify-center items-center h-full">
                <Tooltip content="Eliminar pago" color="danger" size="sm">
                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                    onClick={() => handleDeletePago(index)}
                  >
                    <FaTrashAlt className="text-sm text-red-500" />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón Agregar (Estilo Fluxor - Verde Esmeralda) */}
      <div className="flex justify-end">
        <Button
          onPress={handleAddPago}
          className="bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-200"
          radius="sm"
          startContent={<FaPlus />}
          size="sm"
        >
          Agregar Pago
        </Button>
      </div>
    </div>
  );
};

export default CamposMetodosDePago;
