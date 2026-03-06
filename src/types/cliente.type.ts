export interface ClienteType {
  id: number;
  nombreApellidos: string;
  nombreComercial: string;
  numeroDoc: string;
  tipoDocIdentidad: string;
  provincia: { provincia: string };
  distrito: { distrito: string };
  departamento: { departamento: string };
  direccion: string;
}
