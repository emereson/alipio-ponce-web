export interface ProveedorType {
  id: string;
  codigo_documento_identidad: number;
  tipo_documento_identidad: string;
  numero_doc: string;
  nombre_proveedor: string;
  apellidos_proveedor: string;
  razon_social: string;
  telefono_proveedor: string;
  corre_proveedor: string;
  nacimiento_proveedor: string;
  direccion: string;

  // Ubicación
  pais_id: number;
  indicativo_pais: string;
  pais_proveedor: string;
  departamento_id: number;
  departamento_proveedor: string;
  muncipio_id: number; // Nota: está escrito como 'muncipio' en tu modelo
  muncipio_proveedor: string;

  // Información Tributaria
  clasificacion_tributaria?: string | null; // Es el único que tiene allowNull: true en tu modelo
  autorretiene_renta: boolean;
  autorretiene_iva: boolean;
  autorretiene_ica: boolean;
  gran_contribuyente: boolean;
  regimen_simple: boolean;
  exento_gmf: boolean;

  // Estado
  estado: "ACTIVO" | "DESACTIVADO";

  bancos_proveedor: CuentaBancariaProveedor[];
}

export interface CuentaBancariaProveedor {
  id: number;
  proveedor_id: number;
  banco_cruenta_bancaria: string;
  nro_cruenta_bancaria: string;
  tipo_cuenta_bancaria: string;
  codigo_cuenta_bancaria: string;
  puc_cuenta_bancaria?: string | null;
  cuenta_principal: boolean;
  link_archivo_adjunto?: string | null;
  estado_cuenta: "ACTIVO" | "DESACTIVADO";
}
