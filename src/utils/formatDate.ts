// utils/formatDate.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// utils/formatDate.ts
export function formatDateHoure(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // opcional, puedes quitarlo si no quieres segundos
    hour12: false, // usa formato 24h
    timeZone: "America/Lima", // ajusta según tu zona
  }).format(date);
}

export const getRemainingDays = (endDateUser: string) => {
  const now = new Date();
  const endDate = new Date(endDateUser);

  const diffInDays = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffInDays > 0 ? diffInDays : 0;
};

export const newDate = new Date().toISOString().split("T")[0];
