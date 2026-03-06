export const formatNumber = (num: number) =>
  Number(num)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatWithLeadingZeros = (number: number, length: number) => {
  return number?.toString().padStart(length, "0");
};

export const formatNumberSinDecimales = (num: number) =>
  Number(num)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
