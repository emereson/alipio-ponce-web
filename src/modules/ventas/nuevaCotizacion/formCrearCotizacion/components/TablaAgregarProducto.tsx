import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import type {
  CentroCostoType,
  ProductoType,
} from "../../../../../types/producto.type";
import config from "../../../../../auth/auth.config";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProductoCotizacion from "./ModalEditarProductoCotizacion";
import { API } from "../../../../../utils/api";
import { formatCurrency } from "../../../../../utils/onInputs";

interface Props {
  productos: ProductoType[];
  setProductos: React.Dispatch<React.SetStateAction<ProductoType[]>>;
  tipoOperacion?: string;
  monto?: number;
  tipo_productos?: string;
  isMerma?: boolean;
}

// Utilidad para formatear moneda

const TablaAgregarProducto = ({
  productos,
  setProductos,
  tipoOperacion,
  monto = 0,
  tipo_productos,
  isMerma,
}: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalMode, setModalMode] = useState<"agregar" | "editar" | null>(null);
  const [selectProduct, setSelectProduct] = useState<ProductoType | null>(null);
  const [centroCostos, setCentroCostos] = useState<CentroCostoType[]>([]);

  const eliminarProducto = useCallback(
    (id: number) => {
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.id !== id),
      );
    },
    [setProductos],
  );

  const saveEditedProduct = useCallback(
    (updatedProducto: ProductoType) => {
      setProductos((prev) =>
        prev.map((prod) =>
          prod.id === updatedProducto.id ? updatedProducto : prod,
        ),
      );
    },
    [setProductos],
  );

  // Calcular totales
  const total = useMemo(
    () =>
      productos?.reduce((acc, producto) => acc + Number(producto.total), 0) ||
      0,
    [productos],
  );

  const opGravadas = useMemo(() => total / 1.18, [total]);
  const igv = useMemo(() => opGravadas * 0.18, [opGravadas]);

  const handleFindCentroCostos = useCallback(async () => {
    try {
      const url = `${API}/ajustes/centro-costos`;
      const response = await axios.get(url, config);
      setCentroCostos(response.data.centroCostos || []);
    } catch (error) {
      console.error("Error al obtener centros de costos:", error);
      setCentroCostos([]);
    }
  }, []);

  useEffect(() => {
    handleFindCentroCostos();
  }, [handleFindCentroCostos]);

  // Definir columnas
  const columns = useMemo(
    () => [
      { key: "index", label: "#" },
      { key: "nombre", label: "NOMBRE" },
      ...(tipo_productos === "Costos y gastos"
        ? [{ key: "descripcion", label: "DESCRIPCIÓN" }]
        : []),
      ...(tipo_productos !== "Costos y gastos"
        ? [{ key: "stock", label: "STOCK DISPONIBLE" }]
        : []),
      { key: "cantidad", label: "CANTIDAD" },
      { key: "precioUnitario", label: "P. UNITARIO" },
      { key: "subtotal", label: "SUBTOTAL" },
      { key: "acciones", label: "ACCIONES" },
    ],
    [tipo_productos],
  );

  // Función para renderizar celdas (Optimización de HeroUI)
  const renderCell = useCallback(
    (producto: ProductoType, columnKey: React.Key, index: number) => {
      const cellValue = producto[columnKey as keyof ProductoType];

      switch (columnKey) {
        case "index":
          return <span className="text-xs font-semibold">{index + 1}</span>;
        case "nombre":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-xs capitalize">{producto.nombre}</p>
            </div>
          );
        case "stock":
          return <span className="text-xs">{producto.stock}</span>;
        case "cantidad":
          return <span className="text-xs">{producto.cantidad}</span>;
        case "precioUnitario":
          return (
            <span className="text-xs">
              {formatCurrency(producto.precioUnitario)}
            </span>
          );
        case "subtotal":
          return (
            <span className="text-xs font-semibold">
              {formatCurrency(producto.total)}
            </span>
          );
        case "acciones":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Editar producto">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-blue-500"
                  onClick={() => {
                    setModalMode("editar");
                    setSelectProduct(producto);
                    onOpen();
                  }}
                >
                  <FaEdit />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Eliminar producto">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50 hover:text-red-700"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  <FaTrashAlt />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return <span className="text-xs">{cellValue}</span>;
      }
    },
    [eliminarProducto, onOpen],
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Renderizado Condicional de Modales */}
      {modalMode === "agregar" && (
        <ModalAgregarProducto
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          setProductos={setProductos}
          tipo_productos={tipo_productos || "Comercialización y servicios"}
          centroCostos={centroCostos}
        />
      )}

      {modalMode === "editar" && selectProduct && (
        <ModalEditarProductoCotizacion
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectProduct={selectProduct}
          centroCostos={centroCostos}
          tipo_productos={tipo_productos}
          onSave={saveEditedProduct}
        />
      )}

      <Button
        className="ml-2 w-fit h-9 font-semibold bg-slate-900"
        color="primary"
        size="sm"
        startContent={<span className="text-lg">+</span>}
        onPress={() => {
          setModalMode("agregar");
          onOpen();
        }}
      >
        Agregar Producto
      </Button>

      <Table
        aria-label="Tabla de productos agregados"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full overflow-hidden p-2",
          table: "min-h-[100px]",
          th: "bg-black text-white text-xs",
        }}
        radius="sm"
        isCompact
        isHeaderSticky
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "acciones" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={productos}
          emptyContent={"No hay productos agregados."}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, productos.indexOf(item))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Sección de Totales */}
      <div className="w-full flex flex-col items-end pr-4 pt-2 gap-1 border-t border-gray-200 mt-2">
        {tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN" && (
          <div className="flex text-sm gap-4 justify-end">
            <p className="text-gray-600">M. DETRACCIÓN:</p>
            <span className="font-medium min-w-24 text-right">
              {formatCurrency(monto)}
            </span>
          </div>
        )}

        {!isMerma && (
          <>
            <div className="flex text-sm gap-4 justify-end">
              <p className="text-gray-600">OP. GRAVADAS:</p>
              <span className="font-medium min-w-24 text-right">
                {formatCurrency(opGravadas)}
              </span>
            </div>
            <div className="flex text-sm gap-4 justify-end">
              <p className="text-gray-600">IGV (18%):</p>
              <span className="font-medium min-w-24 text-right">
                {formatCurrency(igv)}
              </span>
            </div>
          </>
        )}

        <div className="text-base flex gap-4 justify-end font-bold text-gray-800 mt-1">
          <p>TOTAL A PAGAR:</p>
          <span className="min-w-24 text-right">{formatCurrency(total)}</span>
        </div>

        {tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN" && (
          <div className="text-sm flex gap-4 justify-end text-blue-600 font-semibold">
            <p>M. PENDIENTE:</p>
            <span className="min-w-24 text-right">
              {formatCurrency(total - monto)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaAgregarProducto;
