import type { ClienteType } from "./cliente.type";
import type { ComprobanteType } from "./comprobante.type";
import type { CuentaBancariaType, MetodoPagoType } from "./pago.type";
import type { ProductoType } from "./producto.type";

export interface CotizacionType {
  id: number;
  saldoInicial: number;
  clienteId: number;
  cliente: ClienteType;
  direccionEnvio: string;
  vendedor: string;
  observacion: string;
  fechaEntrega: string;
  fechaEmision: string;
  productos: ProductoCotizacionType[];
  pagos: PagosCotizacionType[];
  comprobanteElectronicoId: number;
  ComprobanteElectronico?: ComprobanteType;
  estadoPago: string;
  saldo: number;
  status: string;
}

export interface ProductoCotizacionType {
  id: number;
  cantidad: number;
  producto: ProductoType;
  precioUnitario: number;
  total: number;
}

export interface PagosCotizacionType {
  id: number;
  metodoPago: MetodoPagoType;
  banco: CuentaBancariaType;
  operacion: string;
  monto: string;
  fecha: string;
}

export interface PagosType {
  id: number;
  metodoPago: string;
  banco: string;
  operacion: string;
  monto: string;
  fecha: string;
}
