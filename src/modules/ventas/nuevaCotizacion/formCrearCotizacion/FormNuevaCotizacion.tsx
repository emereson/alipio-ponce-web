import { Button, useDisclosure } from "@heroui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
  CotizacionType,
  PagosType,
} from "../../../../types/cotizacion.type";
import { handleAxiosError } from "../../../../utils/errorHandler";
import config from "../../../../auth/auth.config";
import Loading from "../../../../components/Loading";
import type { ClienteType } from "../../../../types/cliente.type";
import CamposDatosCliente from "./components/CamposDatosCliente";
import CamposMetodosDePago from "./components/CamposMetodosDePago";
import CamposInformacionAdicional from "./components/CamposInformacionAdicional";
import type { ProductoType } from "../../../../types/producto.type";
import TablaAgregarProducto from "./components/TablaAgregarProducto";
import { API } from "../../../../utils/api";
import ModalPdfCotizacion from "../../cotizaciones/components/ModalPdfCotizacion";
import CreateCliente from "../../../clientesProveedores/clientes/components/crudClientes/CreateCliente";

const FormNuevaCotizacion = () => {
  const { register, handleSubmit, reset } = useForm<CotizacionType>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState<string>("");
  const [selectCliente, setSelectCliente] = useState("");
  const [arrayPagos, setArrayPagos] = useState<PagosType[]>([]);
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [idCotizacion, setIdCotizacion] = useState<number>(0);

  const submit = (data: CotizacionType) => {
    if (!arrayPagos || arrayPagos.length === 0) {
      toast.error("Debes agregar al menos un método de pago en la cotización.");
      return;
    }

    if (!productos || productos.length === 0) {
      toast.error("Debes agregar al menos un producto en la cotización.");
      return;
    }

    if (!selectCliente) {
      toast.error("Debes seleccionar un cliente.");
      return;
    }

    const newData = {
      ...data,
      clienteId: selectCliente,
      arrayPagos: arrayPagos,
      productos: productos,
    };
    setLoading(true);

    const url = `${API}/ventas/cotizaciones`;

    axios
      .post(url, newData, config)
      .then((res) => {
        setIdCotizacion(res.data.cotizacion.id);
        setSelectModal("pdf");
        onOpenChange();
        setArrayPagos([]);
        setProductos([]);
        toast.success("La cotizacion se registro correctamente");
        reset();
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findClients = () => {
    const url = `${API}/clientes`;
    axios.get(url, config).then((res) => setClientes(res.data.clientes));
  };

  return (
    <div className="w-full pb-6 ">
      {loading && <Loading />}
      <form
        className="w-full flex flex-col gap-4 "
        onSubmit={handleSubmit(submit)}
      >
        <CamposDatosCliente
          setSelectModal={setSelectModal}
          register={register}
          clientes={clientes}
          findClients={findClients}
          setSelectCliente={setSelectCliente}
          selectCliente={selectCliente}
          onOpen={onOpen}
        />
        <CamposMetodosDePago
          arrayPagos={arrayPagos}
          setArrayPagos={setArrayPagos}
        />
        <CamposInformacionAdicional register={register} />
        <TablaAgregarProducto
          productos={productos}
          setProductos={setProductos}
        />
        <div className="w-full flex items-center justify-end ">
          <Button
            className="bg-slate-900 font-bold"
            type="submit"
            color="primary"
          >
            Guardar
          </Button>
        </div>
      </form>
      {selectModal === "cliente" && (
        <CreateCliente
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
        />
      )}

      {idCotizacion && selectModal === "pdf" && (
        <ModalPdfCotizacion
          key={idCotizacion}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idCotizacion={idCotizacion}
        />
      )}
    </div>
  );
};

export default FormNuevaCotizacion;
