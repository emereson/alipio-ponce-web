export interface ForosType {
  id: number;
  titulo_foro: string;
  texto_foro: string;
  link_foro?: string;
  tipo_foro: "publicacion" | "encuesta";
  img_foro: FileList | null;
  fecha_disponible?: string;
  fecha_limite?: string;
  status: string;
  encuestas?: EncuestaType[];
}

export interface FotoGaleriaType {
  id: number;
  galeryPhotosId: number;
  galleryImgUrl: string;
}

export interface EncuestaType {
  id: number;
  opcion_encuesta: string;
  votos?: [];
}
