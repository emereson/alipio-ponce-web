import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import type { CotizacionType } from "../../../../../../types/cotizacion.type";
import { formatNumber } from "../../../../../../utils/formats";

interface Props {
  selectCotizacion: CotizacionType;
}

const CamposProductosComprobante = ({ selectCotizacion }: Props) => {
  const total = selectCotizacion.productos.reduce(
    (acc, producto) => acc + Number(producto.total),
    0,
  );
  const opGravadas = total / 1.18;

  return (
    <div>
      <h3>Productos</h3>
      <Divider />

      <div>
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full  overflow-hidden  p-2 ",
            wrapper: "p-0",
          }}
          radius="sm"
          isCompact={true}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              #
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Nombre
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Cantidad
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Costo U.
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Stock
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Sub Total
            </TableColumn>
          </TableHeader>
          <TableBody>
            {selectCotizacion?.productos?.map((producto, index) => (
              <TableRow key={producto.id}>
                <TableCell className="min-w-80 text-xs sticky left-0 z-10 bg-white">
                  {index + 1}
                </TableCell>
                <TableCell className="min-w-80 text-xs sticky left-0 z-10 bg-white">
                  {producto?.producto.nombre}
                </TableCell>
                <TableCell className=" min-w-80  text-xs sticky left-20 z-10 bg-white">
                  {producto.cantidad}
                </TableCell>
                <TableCell className=" min-w-80  text-xs sticky left-20 z-10 bg-white">
                  {producto.precioUnitario}
                </TableCell>
                <TableCell className=" min-w-80 text-xs sticky left-40 z-10 bg-white">
                  {producto.producto.stock}
                </TableCell>
                <TableCell className=" min-w-80 text-xs sticky left-40 z-10 bg-white">
                  {producto.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className=" w-full flex flex-col items-end pr-6">
          <div className=" flex text-sm gap-2 justify-end font-semibold">
            <p>OP. GRAVADAS:</p>
            <span className="min-w-28">S/{formatNumber(opGravadas)}</span>
          </div>
          <div className="text-sm  flex gap-2 justify-end font-semibold">
            <p>IGV:</p>
            <span className="min-w-28">
              S/{formatNumber(opGravadas * 0.18)}
            </span>
          </div>
          <div className="text-sm  flex gap-2 justify-end font-semibold">
            <p>TOTAL :</p>
            <span className="min-w-28">S/{formatNumber(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamposProductosComprobante;
