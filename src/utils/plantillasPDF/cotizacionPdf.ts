import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CotizacionType } from "../../types/cotizacion.type";

import { formatNumber, formatWithLeadingZeros } from "../formats";
import { formatDate } from "../formatDate";
import { numeroALetras } from "../numeroLetras";

const plantillaCotizacionPdf = (
  selectCotizacion: CotizacionType,
  cuentasBancarias: any[],
) => {
  const doc = new jsPDF();

  // Validación inicial
  if (!selectCotizacion || !selectCotizacion.cliente) {
    console.error("No se proporcionaron datos válidos para la cotización.");
    return;
  }

  // --- Estilos Generales ---
  doc.setFontSize(8);

  // Logo
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", 10, 12, 28, 23);
  }

  // --- Información de la Empresa ---
  doc.setFontSize(10);
  doc.text(import.meta.env.VITE_NOMBRE || "", 45, 15);
  doc.setFontSize(8);
  doc.text(import.meta.env.VITE_RUC || "", 45, 19);
  doc.text(import.meta.env.VITE_DIRRECION || "", 45, 23);
  doc.text(
    `Central telefónica: ${import.meta.env.VITE_TELEFONO || ""}`,
    45,
    27,
  );
  doc.text(`Email: ${import.meta.env.VITE_CORREO || ""}`, 45, 32);
  doc.text(`Web: ${import.meta.env.VITE_WEB || ""}`, 45, 37);

  // --- Caja de Cotización ---
  doc.setFillColor("WHITE");
  doc.rect(160, 10, 40, 25, "FD");

  doc.setTextColor("BLACK");

  // Título Cotización
  doc.setFontSize(9);
  const cotizacionText = "COTIZACIÓN";
  const cotizacionWidth = doc.getTextWidth(cotizacionText);
  const cotizacionX = 160 + (40 - cotizacionWidth) / 2;
  doc.text(cotizacionText, cotizacionX, 20);

  // Código Cotización
  doc.setFontSize(12);
  const cotizacionCodeText = `COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}`;
  const cotizacionCodeWidth = doc.getTextWidth(cotizacionCodeText);
  const cotizacionCodeX = 160 + (40 - cotizacionCodeWidth) / 2;
  doc.text(cotizacionCodeText, cotizacionCodeX, 25);

  // --- Información del Cliente ---
  doc.setFontSize(9);
  doc.text("Cliente:", 10, 50);
  doc.text(
    selectCotizacion.cliente?.nombreComercial ||
      selectCotizacion.cliente?.nombreApellidos ||
      "N/A",
    35,
    50,
  );

  doc.text(`${selectCotizacion.cliente?.tipoDocIdentidad || "DOC"}:`, 10, 55);
  doc.text(` ${selectCotizacion.cliente?.numeroDoc || "N/A"}`, 35, 55);

  doc.text("Dirección:", 10, 60);
  doc.text(selectCotizacion.direccionEnvio || "N/A", 35, 60);

  doc.text("Vendedor:", 10, 65);
  doc.text(selectCotizacion.vendedor || "N/A", 35, 65);

  doc.text("Observación:", 10, 70);
  // Aquí podrías agregar el texto de la observación si lo tienes en el objeto:
  // doc.text(selectCotizacion.observacion || "", 35, 70);

  // --- Fechas ---
  doc.text("Fecha de emisión:", 150, 50);
  doc.text(
    selectCotizacion.fechaEmision
      ? formatDate(selectCotizacion.fechaEmision)
      : "N/A",
    180,
    50,
  );

  doc.text("Tiempo de Entrega:", 150, 55);
  doc.text(
    selectCotizacion.fechaEntrega
      ? formatDate(selectCotizacion.fechaEntrega)
      : "N/A",
    180,
    55,
  );

  // --- Tabla de Productos ---
  const productsColumns = [
    "CANT",
    "UNIDAD",
    "DESCRIPCIÓN",
    "V.UNIT",
    "SUB TOTAL",
  ];

  // Preparación de datos (con ordenamiento)
  const productsData = (selectCotizacion?.productos || [])
    .slice()
    .sort((a, b) => {
      const nombreA = a.producto?.nombre?.toLowerCase() || "";
      const nombreB = b.producto?.nombre?.toLowerCase() || "";
      if (nombreA.includes("cajas") && !nombreB.includes("cajas")) return 1;
      if (!nombreA.includes("cajas") && nombreB.includes("cajas")) return -1;
      return 0;
    })
    .map((producto) => {
      const precioUnitario =
        typeof producto.precioUnitario === "number"
          ? producto.precioUnitario
          : parseFloat(producto.precioUnitario as string) || 0;

      const total =
        typeof producto.total === "number"
          ? producto.total
          : parseFloat(producto.total as string) || 0;

      return [
        producto.cantidad || 0,
        producto.producto?.codUnidad || "NIU",
        producto.producto?.nombre || "N/A",
        precioUnitario.toFixed(2),
        formatNumber(total),
      ];
    });

  autoTable(doc, {
    startY: 76,
    head: [productsColumns],
    body: productsData,
    margin: { top: 10, left: 10, right: 5 } as any, // 'right' estaba mal escrito en tu original ('rigth')
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228],
      textColor: [0, 0, 0],
      fontStyle: "normal", // fontWeight 400 es normal
    },
    didDrawCell: (data) => {
      // Dibujado manual de bordes para replicar el diseño exacto
      const { cell } = data;

      if (data.section === "head") {
        // Línea Superior
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);

        // Línea Inferior (más gruesa según tu diseño original)
        doc.setLineWidth(0.8);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }

      if (data.section === "body") {
        // Línea Inferior del cuerpo
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }
    },
  });

  // --- Totales ---
  // Casting a 'any' para acceder a lastAutoTable que no existe en el tipo por defecto de jsPDF
  const finalY = (doc as any).lastAutoTable.finalY || 150;

  const saldoInicialNum = Number(selectCotizacion.saldoInicial || 0);
  const opGravadas = saldoInicialNum / 1.18;

  doc.setFont("helvetica", "bold");

  // Op. Gravadas
  doc.text(`OP. GRAVADAS:`, 165, finalY + 5, { maxWidth: 30, align: "right" });
  doc.text(`S/ ${formatNumber(opGravadas)}`, 171, finalY + 5);

  // IGV
  doc.text(`IGV:`, 165, finalY + 10, { maxWidth: 30, align: "right" });
  doc.text(`S/ ${formatNumber(opGravadas * 0.18)}`, 171, finalY + 10);

  // Total
  doc.text(`TOTAL A PAGAR:`, 165, finalY + 15, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(`S/ ${formatNumber(saldoInicialNum)}`, 171, finalY + 15);

  // Letras
  const totalEnLetras = numeroALetras(saldoInicialNum);

  doc.setFontSize(8);
  doc.text(`SON: ${totalEnLetras}`, 10, finalY + 23);

  // --- Pagos ---
  const paymentColumns = [
    "Método de pago",
    "Banco",
    "Operación",
    "Monto",
    "Fecha",
  ];

  const paymentData = (selectCotizacion.pagos || []).map((pago) => [
    pago.metodoPago?.descripcion || "N/A",
    pago.banco?.descripcion || "N/A",
    pago.operacion || "N/A",
    `S/${formatNumber(Number(pago.monto))}` || "N/A",
    pago.fecha ? formatDate(pago.fecha) : "N/A",
  ]);

  doc.setFontSize(10);
  doc.text(`PAGOS :`, 10, finalY + 35);

  autoTable(doc, {
    startY: finalY + 40,
    head: [paymentColumns],
    body: paymentData,
    margin: { top: 10, left: 10, right: 5 } as any,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228],
      textColor: [0, 0, 0],
      fontStyle: "normal",
    },
    didDrawCell: (data) => {
      const { cell } = data;
      // Replicando tu lógica de bordes manuales
      if (data.section === "head") {
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);

        doc.setLineWidth(0.8);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }
      if (data.section === "body") {
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }
    },
  });

  // --- Saldo ---
  const finalYPagos = (doc as any).lastAutoTable.finalY || finalY + 50;

  const totalPagos = (selectCotizacion.pagos || []).reduce(
    (acc, pago) => acc + Number(pago.monto),
    0,
  );

  doc.setFontSize(10);
  doc.text(
    `SALDO: S/ ${formatNumber(saldoInicialNum - totalPagos)}`,
    10,
    finalYPagos + 10,
  );

  // --- Cuentas Bancarias (Pie de página) ---
  const pageHeight = doc.internal.pageSize.height;
  const bancosStartY = pageHeight - 45;

  doc.setFontSize(8);
  doc.text("CUENTAS BANCARIAS:", 10, bancosStartY + 5);

  const bancosColumns = [
    "Banco",
    "Moneda",
    "Código de Cuenta Interbancaria",
    "Código de Cuenta",
  ];

  const bancosBody = cuentasBancarias.map((cuentaBancaria) => [
    cuentaBancaria.descripcion,
    "Soles",
    cuentaBancaria.cci,
    cuentaBancaria.numero,
  ]);

  autoTable(doc, {
    startY: bancosStartY + 10,
    head: [bancosColumns],
    margin: { top: 10, left: 10, right: 5, bottom: 5 } as any,
    body: bancosBody,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228],
      textColor: [0, 0, 0],
      fontStyle: "normal",
    },
  });

  // --- Output ---
  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open();

  if (newWindow) {
    const title = `COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}`;
    newWindow.document.title = title;
    newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>body { margin: 0; display: flex; justify-content: center; height: 100vh; background: #525659; } embed { width: 100%; height: 100%; }</style>
        </head>
        <body>
          <embed src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  // Descarga directa
  doc.save(`COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}.pdf`);
};

export default plantillaCotizacionPdf;
