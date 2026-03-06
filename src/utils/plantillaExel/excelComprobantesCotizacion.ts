import * as XLSX from "xlsx-js-style";
import { formatDate } from "../formatDate";
import type { ComprobanteType } from "../../types/comprobante.type";
// Asumiendo que formatCurrency devuelve string, lo usaremos solo si es visual,
// pero para excel preferimos el valor crudo.

interface ExcelColumn {
  header: string;
  key: keyof ExcelRowData;
  width: number;
}

interface ExcelRowData {
  numero: number;
  fechaEmision: string;
  vendedor: string;
  cliente: string;
  numeroDoc: string;
  serie: string;
  tipoComprobante: string;
  totalGravado: number;
  totalIgv: number;
  total: number;
  saldo: number;
  xml: string;
  cdr: string;
}

const ExcelComprobantesCotizacion = {
  createColumnDefinitions(): ExcelColumn[] {
    return [
      { header: "#", key: "numero", width: 5 },
      { header: "Fecha Emisión", key: "fechaEmision", width: 15 },
      { header: "Vendedor", key: "vendedor", width: 20 },
      { header: "Cliente", key: "cliente", width: 35 },
      { header: "Número Documento", key: "numeroDoc", width: 15 },
      { header: "Serie", key: "serie", width: 15 },
      { header: "Tipo Comprobante", key: "tipoComprobante", width: 18 },
      { header: "T.Gravado", key: "totalGravado", width: 15 },
      { header: "T.IGV", key: "totalIgv", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Saldo", key: "saldo", width: 15 },
      { header: "XML", key: "xml", width: 10 },
      { header: "CDR", key: "cdr", width: 10 },
    ];
  },

  transformData(comprobantes: ComprobanteType[]): ExcelRowData[] {
    return comprobantes.map((comprobante, index) => ({
      numero: index + 1,
      fechaEmision: formatDate(comprobante.fechaEmision) || "",
      vendedor: comprobante.vendedor || "",
      cliente:
        comprobante.cliente?.nombreApellidos ||
        comprobante.cliente?.nombreComercial ||
        "",
      numeroDoc: comprobante.cliente?.numeroDoc || "",
      serie: `${comprobante.serie}-${comprobante.numeroSerie}`,
      tipoComprobante: comprobante.tipoComprobante || "",
      // IMPORTANTE: Devolvemos number, no string formateado, para que Excel pueda sumar
      totalGravado: Number(comprobante.total_valor_venta) || 0,
      totalIgv: Number(comprobante.total_igv) || 0,
      total: Number(comprobante.total_venta) || 0,
      saldo: Number(comprobante.cotizacion?.saldo) || 0,
      xml: comprobante.urlXml ? "Sí" : "No",
      cdr: comprobante.cdr ? "Sí" : "No",
    }));
  },

  configureWorksheet(
    worksheet: XLSX.WorkSheet,
    columns: ExcelColumn[],
    fechaInicio: string,
    fechaFinal: string,
  ) {
    // Título del reporte
    const titleRow = [
      [`REPORTE DE COMPROBANTES DE COTIZACIÓN ${fechaInicio} a ${fechaFinal}`],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: "A1" });

    // Configurar ancho de columnas
    const colWidths = columns.map((col) => ({ width: col.width }));
    worksheet["!cols"] = colWidths;

    // Estilo del título (A1)
    if (worksheet["A1"]) {
      // Usamos cast 'any' porque la propiedad 's' es específica de xlsx-js-style
      (worksheet["A1"] as any).s = {
        font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "1f2937" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Merge del título
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ];
  },

  styleHeaders(worksheet: XLSX.WorkSheet, columns: ExcelColumn[]) {
    // Aplicar estilo a los headers (fila 2, índice 1)
    columns.forEach((_, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
      if (worksheet[cellAddress]) {
        (worksheet[cellAddress] as any).s = {
          font: { bold: true, color: { rgb: "1f2937" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: { fgColor: { rgb: "f3f4f6" } },
          border: {
            top: { style: "thin", color: { rgb: "d1d5db" } },
            bottom: { style: "thin", color: { rgb: "d1d5db" } },
            left: { style: "thin", color: { rgb: "d1d5db" } },
            right: { style: "thin", color: { rgb: "d1d5db" } },
          },
        };
      }
    });
  },

  applyCurrencyFormat(
    worksheet: XLSX.WorkSheet,
    data: ExcelRowData[],
    columns: ExcelColumn[],
  ) {
    const currencyColumns: (keyof ExcelRowData)[] = [
      "totalGravado",
      "totalIgv",
      "total",
      "saldo",
    ];

    data.forEach((_, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex + 2, // +2 porque empezamos en la fila 3 (título + headers)
          c: colIndex,
        });

        if (worksheet[cellAddress]) {
          const cell = worksheet[cellAddress] as any;

          if (currencyColumns.includes(col.key)) {
            // Estilo moneda
            cell.s = {
              numFmt: '"S/. "#,##0.00',
              alignment: { horizontal: "right", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "e5e7eb" } },
                bottom: { style: "thin", color: { rgb: "e5e7eb" } },
                left: { style: "thin", color: { rgb: "e5e7eb" } },
                right: { style: "thin", color: { rgb: "e5e7eb" } },
              },
            };
            // Asegurar tipo numérico
            cell.t = "n";
          } else {
            // Estilo texto normal
            const alignment =
              col.key === "cliente" ||
              col.key === "vendedor" ||
              col.key === "tipoComprobante"
                ? { horizontal: "left", vertical: "center" }
                : { horizontal: "center", vertical: "center" };

            cell.s = {
              alignment: alignment,
              border: {
                top: { style: "thin", color: { rgb: "e5e7eb" } },
                bottom: { style: "thin", color: { rgb: "e5e7eb" } },
                left: { style: "thin", color: { rgb: "e5e7eb" } },
                right: { style: "thin", color: { rgb: "e5e7eb" } },
              },
            };
          }
        }
      });
    });

    // Agregar fila de totales al final
    this.addTotalRow(worksheet, data, columns);
  },

  addTotalRow(
    worksheet: XLSX.WorkSheet,
    data: ExcelRowData[],
    columns: ExcelColumn[],
  ) {
    const totalRowIndex = data.length + 2; // Fila después de los datos
    const currencyColumns: (keyof ExcelRowData)[] = [
      "totalGravado",
      "totalIgv",
      "total",
      "saldo",
    ];

    columns.forEach((col, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: totalRowIndex,
        c: colIndex,
      });

      // Estilo base para el footer
      const footerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1f2937" } },
        border: {
          top: { style: "medium", color: { rgb: "000000" } },
          bottom: { style: "medium", color: { rgb: "000000" } },
          left: { style: "medium", color: { rgb: "000000" } },
          right: { style: "medium", color: { rgb: "000000" } },
        },
      };

      if (col.key === "numero") {
        // Celda "TOTAL"
        worksheet[cellAddress] = {
          v: "TOTAL",
          t: "s",
          s: {
            ...footerStyle,
            alignment: { horizontal: "center", vertical: "center" },
          },
        };
      } else if (currencyColumns.includes(col.key)) {
        // Columnas con fórmula SUM
        const startRow = 3; // Fila 3 en Excel (índice 1-based)
        const endRow = data.length + 2;
        const columnLetter = XLSX.utils.encode_col(colIndex);
        const formula = `SUM(${columnLetter}${startRow}:${columnLetter}${endRow})`;

        worksheet[cellAddress] = {
          f: formula,
          t: "n",
          s: {
            ...footerStyle,
            numFmt: '"S/. "#,##0.00',
            alignment: { horizontal: "right", vertical: "center" },
          },
        };
      } else {
        // Celdas vacías del footer
        worksheet[cellAddress] = {
          v: "",
          t: "s",
          s: {
            ...footerStyle,
            alignment: { horizontal: "center", vertical: "center" },
          },
        };
      }
    });
  },

  exportToExcel(
    comprobantes: ComprobanteType[],
    fechaInicio: string,
    fechaFinal: string,
  ): boolean {
    try {
      if (!Array.isArray(comprobantes) || comprobantes.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      const columns = this.createColumnDefinitions();

      // Crear worksheet vacío
      const worksheet = XLSX.utils.aoa_to_sheet([]);

      // 1. Configurar layout general
      this.configureWorksheet(worksheet, columns, fechaInicio, fechaFinal);

      // 2. Transformar datos
      const data = this.transformData(comprobantes);

      // 3. Crear matriz para sheet_add_aoa (Solo Headers y Datos)
      // Nota: El título ya se agregó en configureWorksheet
      const headers = columns.map((col) => col.header);
      const matrixData = data.map((item) =>
        columns.map((col) => item[col.key] ?? ""),
      );

      XLSX.utils.sheet_add_aoa(worksheet, [headers, ...matrixData], {
        origin: "A2", // Fila 2 (la 1 es el título)
      });

      // 4. Aplicar estilos
      this.styleHeaders(worksheet, columns);
      this.applyCurrencyFormat(worksheet, data, columns);

      // 5. Crear workbook y exportar
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Comprobantes");

      const fileName =
        `comprobantes_cotizacion_${fechaInicio}_a_${fechaFinal}.xlsx`
          .replace(/[\/\?<>\\:\*\|"]/g, "_")
          .replace(/\s+/g, "_");

      XLSX.writeFile(workbook, fileName);
      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    }
  },
};

export default ExcelComprobantesCotizacion;
