import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import config from "../../../../auth/auth.config";
import { API } from "../../../../utils/api";
import axios from "axios";
import type { ComprobanteType } from "../../../../types/comprobante.type";
import { formatNumber } from "../../../../utils/formats";
import { formatDate } from "../../../../utils/formatDate";
import type { CuentaBancariaType } from "../../../../types/pago.type";
import plantillaComprobantePdf from "../../../../utils/plantillasPDF/comprobantePdf";

interface ModalPdfComprobanteElectronicoProps {
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  idComprobante: number;
}

const ModalPdfComprobanteElectronico = ({
  onOpenChange,
  isOpen,
  idComprobante,
}: ModalPdfComprobanteElectronicoProps) => {
  const [comprobanteElectronico, setComprobanteElectronico] =
    useState<ComprobanteType | null>(null);
  const [cuentasBancarias, setCuentasBancarias] = useState<
    CuentaBancariaType[]
  >([]);

  const handleFindCuentasBancarias = () => {
    const url = `${API}/ajustes/cuentas-banco`;

    axios
      .get(url, config)
      .then((res) => setCuentasBancarias(res.data.cuentasBancarias));
  };

  useEffect(() => {
    handleFindCuentasBancarias();
  }, []);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/${idComprobante}`;

    axios.get(url, config).then((res) => {
      setComprobanteElectronico(res.data.comprobanteElectronico);
    });
  }, [idComprobante]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-sm font-semibold text-zinc-600">
              Previsualización del PDF
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col gap-4 p-4">
                <div className="w-full flex gap-4 justify-between items-center">
                  <img
                    className="w-20 h-18"
                    src={import.meta.env.VITE_LOGO}
                    alt="Logo"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-[14px]">
                      {import.meta.env.VITE_NOMBRE}{" "}
                    </h2>
                    <h3 className="text-[13px]">{import.meta.env.VITE_RUC}</h3>
                    <ul className="text-[10px]">
                      <li>{import.meta.env.VITE_DIRRECION}</li>
                      <li>
                        Central telefónica: {import.meta.env.VITE_TELEFONO}
                      </li>
                      <li>Email: {import.meta.env.VITE_CORREO}</li>
                      <li>Web: {import.meta.env.VITE_WEB}</li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center items-center border-1 border-black py-6 px-6">
                    <p className="text-[11px] ">
                      {comprobanteElectronico?.tipoComprobante}
                    </p>
                    <h3 className="text-[14px]">
                      {comprobanteElectronico?.serie}-
                      {comprobanteElectronico?.numeroSerie}
                    </h3>
                  </div>
                </div>

                {/* Información del cliente y detalles */}
                <div className="w-full flex justify-between">
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[10px]">
                      <li>CLIENTE :</li>
                      <li>
                        {comprobanteElectronico?.cliente?.tipoDocIdentidad}:
                      </li>
                      <li>DIRECCIÓN:</li>
                    </ul>
                    <ul className="flex flex-col text-[10px]">
                      <li>
                        {comprobanteElectronico?.cliente.nombreComercial ||
                          comprobanteElectronico?.cliente.nombreApellidos}
                      </li>
                      <li>{comprobanteElectronico?.cliente.numeroDoc}</li>
                      <li>
                        {comprobanteElectronico?.cliente?.direccion} -{" "}
                        {
                          comprobanteElectronico?.cliente?.departamento
                            .departamento
                        }{" "}
                        - {comprobanteElectronico?.cliente?.provincia.provincia}{" "}
                        - {comprobanteElectronico?.cliente?.distrito.distrito}
                      </li>
                    </ul>
                  </div>
                  <ul className="flex flex-col text-[10px]">
                    <li>FECHA DE EMISIÓN :</li>
                    <li>FECHA DE VENCIMIENTO :</li>
                  </ul>
                  <ul className="flex flex-col text-[10px]">
                    <li>{comprobanteElectronico?.fechaEmision}</li>
                    <li>{comprobanteElectronico?.fechaVencimiento}</li>
                  </ul>
                </div>

                {/* Tabla de productos */}
                <div className="w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-t-1 border-b-1 border-black text-[12px] bg-gray-100 h-6.75">
                        <th className="text-start">CANT</th>
                        <th className="text-start">UNIDAD</th>
                        <th className="text-start">DESCRIPCIÓN</th>
                        <th className="text-start">V.UNIT</th>
                        <th className="text-start">SUB TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprobanteElectronico?.productos.map((producto) => (
                        <tr
                          className="border-b-1 border-black text-[11px]"
                          key={producto.id}
                        >
                          <td className="px-2 py-0.75">{producto.cantidad}</td>
                          <td>{producto.producto?.codUnidad}</td>
                          <td>{producto?.producto?.nombre}</td>
                          <td>{formatNumber(producto.precioUnitario)}</td>
                          <td>{formatNumber(producto.total)}</td>
                        </tr>
                      ))}
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          OP. GRAVADAS:S/
                        </td>
                        <td className="px-2">
                          {formatNumber(
                            comprobanteElectronico?.total_valor_venta || 0,
                          )}
                        </td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          IGV: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(
                            comprobanteElectronico?.total_igv || 0,
                          )}{" "}
                        </td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          TOTAL A PAGAR: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(
                            comprobanteElectronico?.total_venta || 0,
                          )}{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px]">
                  SON: {comprobanteElectronico?.legend}
                </p>
                <div className="w-full flex flex-col gap-2">
                  <h3>Pagos:</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-t-1 border-b-1 border-black text-[12px] h-6.75">
                        <th className="text-start">Método de pago </th>
                        <th className="text-start pl-2">Banco</th>
                        <th className="text-start">Operación</th>
                        <th className="text-start">Monto</th>
                        <th className="text-start">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprobanteElectronico?.pagos.map((pago) => (
                        <tr key={pago.id} className="text-[11px]">
                          <td className="px-2 py-0.75">
                            {pago.metodoPago.descripcion}
                          </td>
                          <td>{pago.banco.descripcion}</td>
                          <td>{pago.operacion}</td>
                          <td>S/{formatNumber(Number(pago.monto) || 0)}</td>
                          <td>{formatDate(pago.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ModalBody>

            {/* Botones del modal */}
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={() =>
                  comprobanteElectronico &&
                  plantillaComprobantePdf(
                    comprobanteElectronico,
                    cuentasBancarias,
                  )
                }
              >
                Descargar PDF
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalPdfComprobanteElectronico;
