import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import type { ClienteType } from "../../../../../types/cliente.type";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../utils/classNames";
import type { EncargadoType } from "../../../../../types/encargado.type";
import config from "../../../../../auth/auth.config";
import { API } from "../../../../../utils/api";
import { newDate } from "../../../../../utils/formatDate";

interface Props {
  setSelectModal: (value: string) => void;
  register: any;
  clientes: ClienteType[];
  findClients: () => void;
  selectCliente: string;
  setSelectCliente: (value: string) => void;
  onOpen: () => void;
}

const CamposDatosCliente = ({
  setSelectModal,
  register,
  clientes,
  findClients,
  selectCliente,
  setSelectCliente,
  onOpen,
}: Props) => {
  const [vendedores, setVendedores] = useState<EncargadoType[]>([]);

  const findvendedores = () => {
    const url = `${API}/ajustes/encargado?cargo=Vendedor`;

    axios.get(url, config).then((res) => setVendedores(res.data.encargados));
  };

  useEffect(() => {
    findClients();
    findvendedores();
  }, []);

  const onSelectionChange = (value: any) => {
    setSelectCliente(value);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="relative w-full">
          <Button
            className="absolute -top-3 right-0 scale-85 bg-slate-900"
            size="sm"
            color="primary"
            onPress={() => {
              onOpen();
              setSelectModal("cliente");
            }}
          >
            <FaPlus />
            Cliente
          </Button>
          <Autocomplete
            isRequired
            className="w-full "
            inputProps={{
              classNames: {
                input: "text-xs",
                inputWrapper:
                  "min-h-9 border-1.5 border-neutral-400 bg-[#ffff] data-[hover=true]:bg-[#ffff]  ",
                label: "text-xs text-neutral-800 font-semibold",
              },
            }}
            labelPlacement="outside"
            label="Cliente"
            placeholder="Ingrese el nombre o dni del cliente"
            variant="bordered"
            {...register("cliente")}
            radius="sm"
            size="sm"
            value={selectCliente}
            onSelectionChange={onSelectionChange}
          >
            {clientes.map((cliente) => (
              <AutocompleteItem
                key={cliente.id}
                textValue={`${
                  cliente.nombreApellidos || cliente.nombreComercial
                } -  ${cliente.numeroDoc}`}
              >
                <p className="text-xs">
                  {cliente.nombreApellidos || cliente.nombreComercial} -{" "}
                  {cliente.numeroDoc}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <Select
          isRequired
          className="min-w-52 max-w-52"
          labelPlacement="outside"
          label="Tip. Envío"
          {...register("tipoEnvio")}
          variant="bordered"
          radius="sm"
          classNames={selectClassNames}
          defaultSelectedKeys={["Aéreo"]}
          size="sm"
        >
          <SelectItem key="Aéreo" textValue="Aéreo">
            Aéreo
          </SelectItem>
          <SelectItem key="Terrestre" textValue="Terrestre">
            Terrestre
          </SelectItem>{" "}
          <SelectItem key="Almacen" textValue="Almacen">
            Almacen
          </SelectItem>
        </Select>

        <Input
          isRequired
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          {...register("fecEmision")}
          radius="sm"
          size="sm"
          defaultValue={newDate}
        />
        <Input
          isRequired
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Entrega"
          {...register("fecEntrega")}
          radius="sm"
          size="sm"
          defaultValue={newDate}
        />
      </div>
      <div className="flex gap-2">
        <Input
          isRequired
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Dirección de envío"
          placeholder="..."
          {...register("direccionEnvio")}
          radius="sm"
          size="sm"
        />
        <Select
          isRequired
          className="min-w-60 max-w-75"
          classNames={selectClassNames}
          label="Tipo de Cotización "
          placeholder="..."
          labelPlacement="outside"
          {...register("tipoCotizacion")}
          variant="bordered"
          radius="sm"
          defaultSelectedKeys={["Mercadería"]}
          size="sm"
        >
          <SelectItem key="Mercadería" textValue="Mercadería">
            Mercadería
          </SelectItem>
          <SelectItem key="Servicios" textValue="Servicios">
            Servicios
          </SelectItem>
          <SelectItem key="Alquileres" textValue="Alquileres">
            Alquileres
          </SelectItem>
          <SelectItem key="Suministros" textValue="Suministros">
            Suministros
          </SelectItem>
          <SelectItem key="Otros" textValue="Otros">
            Otros
          </SelectItem>
        </Select>

        <Select
          isRequired
          className="min-w-60 max-w-75"
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Vendedor"
          {...register("vendedor")}
          variant="bordered"
          radius="sm"
          size="sm"
        >
          {vendedores.map((vendedor) => (
            <SelectItem key={vendedor.nombre} textValue={vendedor.nombre}>
              {vendedor.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CamposDatosCliente;
