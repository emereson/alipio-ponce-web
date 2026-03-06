import { TiPlus } from "react-icons/ti";
import { onInputNumber } from "../../../../../utils/onInputs";
import { inputClassNames } from "../../../../../utils/classNames";
import { Input } from "@heroui/react";

const CamposInformacionAdicional = ({ register }: any) => {
  return (
    <div className="w-full flex flex-col gap-6  pt-4 border-t-1.5 ">
      <div className="flex gap-2 items-center font-bold text-slate-900 text-sm">
        <TiPlus />
        <h2>Información Adicional</h2>
      </div>
      <div className="w-full flex gap-4">
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Consignatario"
          placeholder="..."
          {...register("consignatario")}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="N° Documento"
          placeholder="..."
          {...register("consignatarioDni")}
          minLength={8}
          maxLength={8}
          onInput={onInputNumber}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Teléfono"
          placeholder="..."
          minLength={9}
          maxLength={9}
          {...register("consignatarioTelefono")}
          onInput={onInputNumber}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Observación 1"
          placeholder="..."
          {...register("observacion")}
          radius="sm"
          size="sm"
        />
      </div>
      <div className="w-full flex gap-4">
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Consignatario 2"
          placeholder="..."
          {...register("consignatario2")}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="N° Documento 2"
          placeholder="..."
          {...register("consignatarioDni2")}
          minLength={8}
          maxLength={8}
          onInput={onInputNumber}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Teléfono 2"
          placeholder="..."
          minLength={9}
          maxLength={9}
          {...register("consignatarioTelefono2")}
          onInput={onInputNumber}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Observacion 2"
          placeholder="..."
          {...register("observacion2")}
          radius="sm"
          size="sm"
        />
      </div>
    </div>
  );
};

export default CamposInformacionAdicional;
