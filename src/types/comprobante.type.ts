import type { ClienteType } from "./cliente.type";
import type {
  CotizacionType,
  PagosCotizacionType,
  ProductoCotizacionType,
} from "./cotizacion.type";

export interface ComprobanteType {
  id: number;
  tipoComprobante: string;
  fechaEmision: string;
  vendedor: string;
  cliente: ClienteType;
  serie: string;
  numeroSerie: string;
  total_valor_venta: number;
  total_igv: number;
  total_venta: number;
  cotizacion: CotizacionType;
  urlXml: string;
  cdr: string;
  fechaVencimiento: string;
  productos: ProductoCotizacionType[];
  legend: string;
  pagos: PagosCotizacionType[];
  observacion: string;
  qrContent: string;
  digestValue: string;
  detraccion: {
    codBienDetraccion: string;
    ctaBancaria: string;
    codMedioPago: string;
    porcentaje: string;
    montoDetraccion: number;
  };
}
