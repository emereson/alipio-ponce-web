import { Button, Input, Select, SelectItem } from "@heroui/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../utils/classNames";

interface FiltrarCotizacionesProps {
  selectFiltro: string;
  setSelectFiltro: (value: string) => void;
  dataFiltro: string;
  setDataFiltro: (value: string) => void;
  handleFindComprobantes: () => void;
  inicioFecha: string;
  setInicioFecha: (value: string) => void;
  finalFecha: string;
  setFinalFecha: (value: string) => void;
}

const FiltrarCotizaciones = ({
  selectFiltro,
  setSelectFiltro,
  dataFiltro,
  setDataFiltro,
  handleFindComprobantes,
  inicioFecha,
  setInicioFecha,
  finalFecha,
  setFinalFecha,
}: FiltrarCotizacionesProps) => {
  const handleSelectFiltro = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectFiltro(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFindComprobantes();
  };

  return (
    <form onSubmit={handleSubmit} className=" flex gap-2 px-2 items-end">
      <Select
        className="w-60"
        label="Filtrar por: "
        labelPlacement="outside"
        variant="bordered"
        selectedKeys={[selectFiltro]}
        radius="sm"
        size="sm"
        onChange={handleSelectFiltro}
        classNames={selectClassNames}
      >
        <SelectItem key="cliente" textValue="Cliente">
          Cliente
        </SelectItem>
        <SelectItem key="fechaEmision" textValue="Fecha de Emisión">
          Fecha de Emisión
        </SelectItem>
        <SelectItem key="fechaVencimiento" textValue="Fecha de Vencimiento">
          Fecha de Vencimiento
        </SelectItem>
        <SelectItem key="vendedor" textValue="Vendedor">
          Vendedor
        </SelectItem>
      </Select>

      {(selectFiltro === "fechaEmision" ||
        selectFiltro === "fechaVencimiento") && (
        <Input
          className="w-36"
          classNames={inputClassNames}
          value={inicioFecha}
          onChange={(e) => setInicioFecha(e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha inicial"
          radius="sm"
          size="sm"
        />
      )}

      {selectFiltro === "fechaEmision" ||
      selectFiltro === "fechaVencimiento" ? (
        <Input
          className="w-36"
          classNames={inputClassNames}
          value={finalFecha}
          onChange={(e) => setFinalFecha(e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha Final"
          radius="sm"
          size="sm"
        />
      ) : (
        <Input
          className="w-36"
          classNames={inputClassNames}
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Datos"
          radius="sm"
          size="sm"
        />
      )}

      <Button className="bg-slate-900" color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarCotizaciones;
