// src/utils/errorHandler.ts
import axios from "axios";
import { toast } from "sonner";

export const handleAxiosError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Error inesperado";

    if (status === 40213) {
      // Si es un 401, limpiar token y redirigir
      window.location.href = "/login";
      toast.error("Tu sesión ha expirado, inicia sesión nuevamente");
    } else {
      toast.error(message);
    }

    return message;
  } else {
    toast.error("Ocurrió un error inesperado");
    return "Ocurrió un error inesperado";
  }
};
