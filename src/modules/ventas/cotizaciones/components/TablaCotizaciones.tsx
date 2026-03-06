import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Link } from "react-router-dom";
import type { CotizacionType } from "../../../../types/cotizacion.type";
import { formatDate } from "../../../../utils/formatDate";
import { formatCurrency } from "../../../../utils/onInputs";
import { useAuthStore } from "../../../../auth/auth.store";

interface Props {
  cotizaciones: CotizacionType[];
  loading: boolean;
  onOpen: () => void;
  setSelectModal: (modal: string) => void;
  setSelectCotizacion: (cotizacion: any) => void;
}

const TablaCotizaciones = ({
  cotizaciones,
  loading,
  onOpen,
  setSelectModal,
  setSelectCotizacion,
}: Props) => {
  const { perfil } = useAuthStore.getState();

  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full overflow-auto  p-2",
            wrapper: "p-0",
            th: "bg-slate-900 text-white text-xs",
          }}
          radius="sm"
          isCompact={true}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>

            <TableColumn>Fecha Emisión</TableColumn>
            <TableColumn>Vendedor</TableColumn>
            <TableColumn>Cliente</TableColumn>
            <TableColumn>T.Gravado</TableColumn>
            <TableColumn>T.Igv</TableColumn>
            <TableColumn>Total</TableColumn>
            <TableColumn>Saldo</TableColumn>
            <TableColumn>Estado de Pago</TableColumn>
            <TableColumn>Tipo de Comprobante</TableColumn>
            <TableColumn>PDF</TableColumn>
            <TableColumn>Estado Cotización</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {cotizaciones?.map((cotizacion, index) => (
              <TableRow key={cotizacion.id}>
                <TableCell className="min-w-20 text-xs  ">
                  {index + 1}
                </TableCell>
                <TableCell className=" min-w-25  text-xs   ">
                  {formatDate(cotizacion.fechaEmision)}
                </TableCell>
                <TableCell className=" min-w-37.5 text-xs   ">
                  {cotizacion.vendedor}
                </TableCell>
                <TableCell className=" min-w-37.5 text-xs   ">
                  {cotizacion.cliente.nombreApellidos ||
                    cotizacion.cliente.nombreComercial}{" "}
                  <br />
                  <b>{cotizacion.cliente.numeroDoc}</b>
                </TableCell>

                <TableCell className=" min-w-27.5  text-xs  ">
                  S/. {formatCurrency(Number(cotizacion?.saldoInicial) / 1.18)}
                </TableCell>
                <TableCell className=" min-w-27.5  text-xs  ">
                  S/.{" "}
                  {formatCurrency(
                    (Number(cotizacion?.saldoInicial) / 1.18) * 0.18,
                  )}
                </TableCell>
                <TableCell className=" min-w-27.5  text-xs  ">
                  S/. {formatCurrency(cotizacion.saldoInicial)}
                </TableCell>
                <TableCell className="min-w-27.5  text-xs  ">
                  S/. {formatCurrency(cotizacion.saldo)}
                </TableCell>
                <TableCell
                  className={`${
                    cotizacion.estadoPago === "PENDIENTE"
                      ? "text-red-500"
                      : "text-blue-500"
                  }  text-xs  font-semibold `}
                >
                  {cotizacion.estadoPago}
                </TableCell>
                <TableCell className=" min-w-20 text-xs    bg-white ">
                  {cotizacion?.ComprobanteElectronico?.tipoComprobante ||
                    "sin comprobante"}
                </TableCell>
                <TableCell className=" min-w-20 text-xs   ">
                  <Button
                    className="scale-85"
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setSelectCotizacion(cotizacion);
                      setSelectModal("pdf");
                      onOpen();
                    }}
                  >
                    PDF
                  </Button>
                </TableCell>
                <TableCell
                  className={` min-w-20 text-xs font-bold   bg-white ${
                    cotizacion?.status === "Activo"
                      ? "text-green-500"
                      : "text-red-500"
                  } `}
                >
                  {cotizacion?.status}
                </TableCell>
                <TableCell className=" min-w-20 text-xs    bg-white ">
                  {(perfil?.role === "GERENTE" ||
                    perfil?.role === "CONTADOR" ||
                    perfil?.role === "PRACTICANTE CONTABLE") && (
                    <div className="flex flex-col  items-center">
                      {cotizacion.comprobanteElectronicoId ? (
                        <Button
                          className="scale-85 text-white"
                          size="sm"
                          color="warning"
                          onPress={() => {
                            setSelectCotizacion(cotizacion);
                            setSelectModal("verComprobante");
                            onOpen();
                          }}
                        >
                          Ver Comprobante
                        </Button>
                      ) : (
                        <Button
                          className="scale-85"
                          size="sm"
                          color="primary"
                          onPress={() => {
                            setSelectCotizacion(cotizacion);
                            setSelectModal("comprobante");
                            onOpen();
                          }}
                        >
                          Generar Comprobante
                        </Button>
                      )}
                      <div>
                        <Link to={`/ventas/editar-cotizacion/${cotizacion.id}`}>
                          <Button
                            className="scale-85"
                            size="sm"
                            color="primary"
                            // onClick={() => {
                            //   setSelectCotizacion(cotizacion);
                            //   setSelectModal("comprobante");
                            //   onOpen();
                            // }}
                          >
                            Editar
                          </Button>
                        </Link>
                        {!cotizacion.comprobanteElectronicoId &&
                          cotizacion.status === "Activo" && (
                            <Button
                              className="scale-85"
                              size="sm"
                              color="danger"
                              onPress={() => {
                                setSelectCotizacion(cotizacion);
                                setSelectModal("anular");
                                onOpen();
                              }}
                            >
                              Anular
                            </Button>
                          )}
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaCotizaciones;
