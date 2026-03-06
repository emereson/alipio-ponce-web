export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Mes de 0-11, por eso sumamos 1
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDate2 = () => {
  const today = new Date(); // Obtenemos la fecha actual
  const year = today.getFullYear();
  const month = today.getMonth(); // No sumamos 1, ya que queremos el primer día del mes actual

  const firstDayOfMonth = new Date(year, month, 1); // Creamos una fecha con el primer día del mes
  const formattedYear = firstDayOfMonth.getFullYear();
  const formattedMonth = (firstDayOfMonth.getMonth() + 1)
    .toString()
    .padStart(2, "0"); // Agregamos el +1 para el formato correcto
  const formattedDay = firstDayOfMonth.getDate().toString().padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};
