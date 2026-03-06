export interface ProductoType {
  id: number;
  nombre: string;
  stock: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  descripcion: string;
  codUnidad: string;
  conStock: string;
  productoId: number;
  centroCostoId: number;
}

export interface CentroCostoType {
  id: number;
  cod_sub_centro_costo: string;
  glosa_sub_centro_costo: string;
}
