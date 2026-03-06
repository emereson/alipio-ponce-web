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
import type { ComprobanteType } from "../../../../types/comprobante.type";
import { formatCurrency } from "../../../../utils/onInputs";
import { formatDate } from "../../../../utils/formatDate";

interface TablaComprobantesCotizacionProps {
  comprobantes: ComprobanteType[];
  loading: boolean;
  onOpen: () => void;
  setSelectModal: (modal: string) => void;
  setSelectComprobante: (comprobante: any) => void;
}

const TablaComprobantesCotizacion = ({
  comprobantes,
  loading,
  onOpen,
  setSelectModal,
  setSelectComprobante,
}: TablaComprobantesCotizacionProps) => {
  const baseUrl = import.meta.env.VITE_LARAVEL_URL;

  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <div className="w-full ">
          <Table
            aria-label="Tabla de itinerarios"
            color="default"
            isStriped
            classNames={{
              base: "min-w-full  max-h-[70vh]  overflow-scroll   p-2 ",
              wrapper: "p-0",
              th: "bg-slate-900 text-white text-xs",
            }}
            radius="sm"
            isCompact={true}
          >
            <TableHeader>
              <TableColumn>#</TableColumn>

              <TableColumn>
                Fecha <br />
                Emisión
              </TableColumn>
              <TableColumn>Vendedor</TableColumn>
              <TableColumn>Cliente</TableColumn>
              <TableColumn>Serie</TableColumn>
              <TableColumn>T.Gravado</TableColumn>
              <TableColumn>T.Igv</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>saldo</TableColumn>
              <TableColumn>Archivos</TableColumn>
              {/* <TableColumn >
                Acciones
              </TableColumn> */}
            </TableHeader>
            <TableBody>
              {comprobantes?.map((comprobante, index) => (
                <TableRow key={comprobante.id}>
                  <TableCell className="min-w-10 text-xs  z-10 bg-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className=" min-w-25  text-xs   z-10 bg-white">
                    {formatDate(comprobante.fechaEmision)}
                  </TableCell>
                  <TableCell className=" min-w-37.5 text-[0.7rem]   z-10 bg-white">
                    {comprobante.vendedor}
                  </TableCell>

                  <TableCell className=" min-w-37.5 text-[0.7rem]   z-10 bg-white">
                    {comprobante.cliente.nombreApellidos ||
                      comprobante.cliente.nombreComercial}{" "}
                    <br />
                    <b>{comprobante.cliente.numeroDoc}</b>
                  </TableCell>

                  <TableCell className=" min-w-37.5  text-xs  ">
                    <b>
                      {comprobante.serie}-{comprobante.numeroSerie}
                    </b>
                    <br />
                    <span className="text-[0.6rem]">
                      {comprobante.tipoComprobante}
                    </span>
                  </TableCell>
                  <TableCell className=" min-w-27.5  text-xs  ">
                    S/. {formatCurrency(comprobante.total_valor_venta)}
                  </TableCell>
                  <TableCell className="min-w-27.5  text-xs  ">
                    S/. {formatCurrency(comprobante.total_igv)}
                  </TableCell>
                  <TableCell className={`min-w-27.5  text-xs  font-semibold `}>
                    S/. {formatCurrency(comprobante.total_venta)}
                  </TableCell>
                  <TableCell className=" min-w-20 text-xs   z-10 bg-white ">
                    S/.{comprobante?.cotizacion?.saldo}
                  </TableCell>
                  <TableCell className=" min-w-45 text-xs   z-10 bg-white">
                    <div className="w-full flex flex-wrap items-center justify-center">
                      {comprobante.urlXml !== null && (
                        <a
                          href={`${baseUrl + comprobante.urlXml}`}
                          target="_blank"
                        >
                          <Button
                            className="scale-85 text-white"
                            size="sm"
                            color="success"
                          >
                            XML
                          </Button>
                        </a>
                      )}
                      <Button
                        className="scale-85"
                        size="sm"
                        color="danger"
                        onClick={() => {
                          setSelectComprobante(comprobante);
                          setSelectModal("verComprobante");
                          onOpen();
                        }}
                      >
                        PDF
                      </Button>
                      {comprobante.cdr !== null && (
                        <a
                          href={`${baseUrl + comprobante.cdr}`}
                          target="_blank"
                        >
                          <Button
                            className="scale-85 text-white"
                            size="sm"
                            color="warning"
                          >
                            CDR
                          </Button>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  {/* <TableCell className=" min-w-[80px] text-xs   z-10 bg-white ">
                    -
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TablaComprobantesCotizacion;
