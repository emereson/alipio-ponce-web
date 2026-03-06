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
  useCallback,
  useMemo,
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
  onInputNumber,
  onInputPrice,
  onInputPriceCinco,
} from "../../../../../utils/onInputs";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../utils/classNames";
import { API } from "../../../../../utils/api";

// Definimos la interfaz localmente para asegurar consistencia
interface ProductoState {
  id: number | null;
  productoId: number | string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  stock: number;
  centroCostoId: string | number | null;
}

const INITIAL_PRODUCT_STATE: ProductoState = {
  id: null,
  productoId: "",
  nombre: "",
  descripcion: "",
  cantidad: 1,
  precioUnitario: 0,
  total: 0,
  stock: 0,
  centroCostoId: null,
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setProductos: React.Dispatch<React.SetStateAction<ProductoType[]>>;
  tipo_productos?: string;
  centroCostos: CentroCostoType[];
}

const ModalAgregarProducto = ({
  onOpenChange,
  isOpen,
  setProductos,
  tipo_productos,
  centroCostos,
}: Props) => {
  // Usamos Key | null para compatibilidad con HeroUI
  const [selectProducto, setSelectProducto] = useState<Key | null>(null);
  const [findProductos, setFindProductos] = useState<ProductoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dataProducto, setDataProducto] = useState<ProductoState>(() => ({
    ...INITIAL_PRODUCT_STATE,
    id: Date.now(),
  }));

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

  const resetForm = useCallback(() => {
    setDataProducto({
      ...INITIAL_PRODUCT_STATE,
      id: Date.now(),
    });
    setSelectProducto(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      handleFindProductos();
      resetForm();
    }
  }, [isOpen, handleFindProductos, resetForm]);

  const calculateTotal = useCallback(
    (cantidad: number, precioUnitario: number) => {
      return parseFloat((cantidad * precioUnitario).toFixed(2));
    },
    [],
  );

  const handleDataProductoChange = useCallback(
    (field: keyof ProductoState) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setDataProducto((prevData) => {
        const updatedData = { ...prevData };

        if (field === "cantidad" || field === "precioUnitario") {
          (updatedData[field] as number) = Number(value);
        } else {
          (updatedData[field] as string) = value;
        }

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
      setSelectProducto(key);

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

  const pushProduct = useCallback(() => {
    if (!isFormValid) return;

    // Convertimos de ProductoState a ProductoType
    setProductos((prevProductos) => [
      ...prevProductos,
      dataProducto as unknown as ProductoType,
    ]);

    resetForm();
    onOpenChange(false);
  }, [isFormValid, dataProducto, setProductos, resetForm, onOpenChange]);

  const selectedProduct = useMemo(
    () =>
      findProductos.find(
        (product) => product.id.toString() === selectProducto?.toString(),
      ),
    [findProductos, selectProducto],
  );

  const cantidadInputHandler = useMemo(() => {
    return selectedProduct?.codUnidad === "KGM" ? onInputPrice : onInputNumber;
  }, [selectedProduct?.codUnidad]);

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
              Agregar Producto
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-full relative">
                    <Autocomplete
                      className="w-full"
                      inputProps={{
                        classNames: {
                          inputWrapper: " border-1.5 border-neutral-400 h-9",
                          label:
                            "pb-1 text-[0.8rem] text-neutral-800 font-semibold",
                        },
                      }}
                      labelPlacement="outside"
                      label="Producto"
                      placeholder="Buscar producto..."
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      isLoading={isLoading}
                      onSelectionChange={onSelectionChange}
                    >
                      {findProductos.map((producto) => (
                        <AutocompleteItem
                          // Convertimos a string para evitar errores de tipo '0n'
                          key={String(producto.id)}
                          textValue={producto.nombre}
                        >
                          {producto.nombre}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                    {selectedProduct && (
                      <p className="absolute top-0 right-0 text-xs text-red-500">
                        {selectedProduct.conStock ? "Con Stock" : "Sin stock"}
                      </p>
                    )}
                  </div>

                  <Input
                    className="min-w-52 max-w-52 "
                    classNames={inputClassNames}
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
                      classNames={inputClassNames}
                      label="Descripción"
                      labelPlacement="outside"
                      placeholder="Descripción del producto..."
                      type="text"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={dataProducto.descripcion}
                      onChange={handleDataProductoChange("descripcion")}
                    />

                    <Select
                      className="min-w-52 max-w-52 "
                      isRequired
                      classNames={selectClassNames}
                      labelPlacement="outside"
                      label="Centro de costos"
                      variant="bordered"
                      errorMessage="El centro de costos es obligatorio."
                      radius="sm"
                      size="sm"
                      // Select de HeroUI espera un array de strings en selectedKeys
                      selectedKeys={
                        dataProducto.centroCostoId
                          ? [String(dataProducto.centroCostoId)]
                          : []
                      }
                      onChange={(e) =>
                        setDataProducto((prevData) => ({
                          ...prevData,
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
                    className=" border-neutral-400"
                    classNames={inputClassNames}
                    label="Stock Disponible"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.stock?.toString() || "0"}
                    readOnly
                  />

                  <Input
                    className=" border-neutral-400"
                    classNames={inputClassNames}
                    label="Precio Unitario"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    onInput={onInputPriceCinco}
                    value={dataProducto.precioUnitario?.toString() || "0"}
                    onChange={handleDataProductoChange("precioUnitario")}
                  />

                  <Input
                    isDisabled
                    className=" border-neutral-400"
                    classNames={inputClassNames}
                    label="Total"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.total?.toString() || "0"}
                    readOnly
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button className="font-medium" color="danger" onPress={onClose}>
                Cancelar
              </Button>

              <Button
                className="bg-slate-900 font-medium"
                color="primary"
                onPress={pushProduct}
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

export default ModalAgregarProducto;
