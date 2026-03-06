import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
  type Key,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import type {
  CentroCostoType,
  ProductoType,
} from "../../../../../types/producto.type";
import config from "../../../../../auth/auth.config";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../utils/classNames";
import {
  onInputNumber,
  onInputPrice,
  onInputPriceCinco,
} from "../../../../../utils/onInputs";
import { API } from "../../../../../utils/api";

// Definimos la interfaz del estado interno para evitar conflictos de tipo
interface ProductState {
  id?: number;
  productoId: string | number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  stock: number;
  centroCostoId: string | number | null;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectProduct: ProductoType | null;
  onSave: (producto: ProductoType) => void;
  tipo_productos?: string;
  centroCostos: CentroCostoType[];
}

const ModalEditarProductoCotizacion = ({
  isOpen,
  onOpenChange,
  selectProduct,
  onSave,
  tipo_productos,
  centroCostos,
}: Props) => {
  const [selectProductoKey, setSelectProductoKey] = useState<Key | null>(null);
  const [findProductos, setFindProductos] = useState<ProductoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estado inicial seguro
  const [dataProducto, setDataProducto] = useState<ProductState>({
    id: undefined,
    productoId: "",
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precioUnitario: 0,
    total: 0,
    stock: 0,
    centroCostoId: null,
  });

  // Cargar datos cuando cambia el producto seleccionado
  useEffect(() => {
    if (selectProduct) {
      setSelectProductoKey(selectProduct.productoId.toString());
      setDataProducto({
        id: selectProduct.id,
        productoId: selectProduct.productoId,
        nombre: selectProduct.nombre,
        descripcion: selectProduct.descripcion || "",
        cantidad: Number(selectProduct.cantidad),
        precioUnitario: Number(selectProduct.precioUnitario),
        total: Number(selectProduct.total) || 0,
        stock: Number(selectProduct.stock) || 0,
        centroCostoId: selectProduct.centroCostoId
          ? String(selectProduct.centroCostoId)
          : null,
      });
    }
  }, [selectProduct]);

  const isCostosYGastos = useMemo(
    () => tipo_productos === "Costos y gastos",
    [tipo_productos],
  );

  const handleFindProductos = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      if (tipo_productos) {
        queryParams.append("tipo_producto", tipo_productos);
      } else {
        toast.error("Seleccione un tipo de productos");
        onOpenChange(false);
        return;
      }

      queryParams.append("status", "Activo");
      const url = `${API}/productos/mis-productos?${queryParams.toString()}`;

      const response = await axios.get(url, config);
      setFindProductos(response.data.misProductos || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setFindProductos([]);
    } finally {
      setIsLoading(false);
    }
  }, [tipo_productos, onOpenChange]);

  // Cargar lista de productos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      handleFindProductos();
    }
  }, [isOpen, handleFindProductos]);

  const calculateTotal = useCallback(
    (cantidad: number, precioUnitario: number) => {
      return parseFloat((cantidad * precioUnitario).toFixed(2));
    },
    [],
  );

  const handleDataProductoChange = useCallback(
    (field: keyof ProductState) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setDataProducto((prevData) => {
        const updatedData = { ...prevData };

        if (field === "cantidad" || field === "precioUnitario") {
          (updatedData[field] as number) = Number(value);
        } else {
          (updatedData[field] as string) = value;
        }

        // Recalcular total
        if (field === "cantidad" || field === "precioUnitario") {
          const cantidad =
            field === "cantidad" ? Number(value) : prevData.cantidad;
          const precioUnitario =
            field === "precioUnitario"
              ? Number(value)
              : prevData.precioUnitario;
          updatedData.total = calculateTotal(cantidad, precioUnitario);
        }

        return updatedData;
      });
    },
    [calculateTotal],
  );

  const onSelectionChange = useCallback(
    (key: Key | null) => {
      setSelectProductoKey(key);
      if (!key) return;

      const valueString = key.toString();
      const selectedProduct = findProductos.find(
        (product) => product.id.toString() === valueString,
      );

      if (selectedProduct) {
        const total = calculateTotal(
          dataProducto.cantidad,
          selectedProduct.precioUnitario,
        );

        setDataProducto((prevData) => ({
          ...prevData,
          stock: selectedProduct.stock || 0,
          nombre: selectedProduct.nombre || "",
          descripcion: selectedProduct.descripcion || "",
          productoId: selectedProduct.id,
          precioUnitario: selectedProduct.precioUnitario || 0,
          total,
        }));
      }
    },
    [findProductos, dataProducto.cantidad, calculateTotal],
  );

  const isFormValid = useMemo(() => {
    return (
      dataProducto.productoId !== "" &&
      dataProducto.cantidad > 0 &&
      dataProducto.precioUnitario > 0 &&
      (!isCostosYGastos || !!dataProducto.centroCostoId)
    );
  }, [dataProducto, isCostosYGastos]);

  const handleSave = () => {
    if (!isFormValid) return;
    // Casteamos al tipo correcto para guardar
    onSave(dataProducto as unknown as ProductoType);
    onOpenChange(false);
  };

  // Encontrar el producto seleccionado en la lista para saber su unidad
  const currentProductInList = useMemo(
    () =>
      findProductos.find(
        (p) => p.id.toString() === selectProductoKey?.toString(),
      ),
    [findProductos, selectProductoKey],
  );

  const cantidadInputHandler = useMemo(() => {
    return currentProductInList?.codUnidad === "KGM"
      ? onInputPrice
      : onInputNumber;
  }, [currentProductInList?.codUnidad]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar Producto
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-full relative">
                    <Autocomplete
                      className="w-full"
                      inputProps={{
                        classNames: {
                          inputWrapper: "h-10 border-1.5 border-neutral-400",
                          label:
                            "pb-1 text-[0.8rem] text-neutral-800 font-semibold",
                        },
                      }}
                      labelPlacement="outside"
                      label="Producto"
                      placeholder="Buscar producto..."
                      variant="bordered"
                      color="primary"
                      radius="sm"
                      size="sm"
                      isLoading={isLoading}
                      onSelectionChange={onSelectionChange}
                    >
                      {findProductos.map((producto) => (
                        <AutocompleteItem
                          key={String(producto.id)}
                          textValue={producto.nombre}
                        >
                          {producto.nombre}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {currentProductInList && (
                      <p className="absolute top-0 right-0 text-xs text-red-500">
                        {currentProductInList.conStock
                          ? "Con Stock"
                          : "Sin stock"}
                      </p>
                    )}
                  </div>

                  <Input
                    className="min-w-52 max-w-52 h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Cantidad"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    onInput={cantidadInputHandler}
                    value={dataProducto.cantidad.toString()}
                    onChange={handleDataProductoChange("cantidad")}
                  />
                </div>

                {isCostosYGastos && (
                  <div className="w-full flex gap-4">
                    <Input
                      className="h-10 border-neutral-400"
                      classNames={inputClassNames}
                      color="primary"
                      label="Descripción"
                      labelPlacement="outside"
                      placeholder="Descripción..."
                      type="text"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={dataProducto.descripcion}
                      onChange={handleDataProductoChange("descripcion")}
                    />

                    <Select
                      className="min-w-52 max-w-52 h-10"
                      isRequired
                      classNames={selectClassNames}
                      labelPlacement="outside"
                      label="Centro de costos"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      selectedKeys={
                        dataProducto.centroCostoId
                          ? [String(dataProducto.centroCostoId)]
                          : []
                      }
                      onChange={(e) =>
                        setDataProducto((prev) => ({
                          ...prev,
                          centroCostoId: e.target.value,
                        }))
                      }
                    >
                      {centroCostos.map((centroCosto) => (
                        <SelectItem
                          key={String(centroCosto.id)}
                          textValue={`${centroCosto.cod_sub_centro_costo}-${centroCosto.glosa_sub_centro_costo}`}
                        >
                          {centroCosto.cod_sub_centro_costo} -{" "}
                          {centroCosto.glosa_sub_centro_costo}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                <div className="flex gap-4">
                  <Input
                    isDisabled
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Stock"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.stock.toString()}
                    readOnly
                  />
                  <Input
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Precio Unitario"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    onInput={onInputPriceCinco}
                    value={dataProducto.precioUnitario.toString()}
                    onChange={handleDataProductoChange("precioUnitario")}
                  />
                  <Input
                    isDisabled
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Total"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.total.toString()}
                    readOnly
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSave}
                isDisabled={!isFormValid}
              >
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarProductoCotizacion;
