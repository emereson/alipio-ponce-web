import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

import type { ComprobanteType } from "../../types/comprobante.type";
import type { CuentaBancariaType } from "../../types/pago.type";
import { formatDate } from "../formatDate";
import { formatNumber, formatWithLeadingZeros } from "../formats";
import { codigosBienes } from "../../data/codigosBienes";
import { mediosDePago } from "../../data/mediosPago";

// Interfaz extendida para que TypeScript reconozca lastAutoTable
interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const plantillaComprobantePdf = async (
  comprobanteElectronico: ComprobanteType,
  cuentasBancarias: CuentaBancariaType[],
): Promise<void> => {
  // Crear un nuevo documento PDF casteado con la interfaz extendida
  const doc = new jsPDF() as jsPDFWithPlugin;

  doc.setFont("helvetica");

  if (!comprobanteElectronico || !comprobanteElectronico.cliente) {
    return;
  }

  doc.setFontSize(8);

  const logoUrl = import.meta.env.VITE_LOGO as string | undefined;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", 5, 5, 28, 23);
  }

  doc.setFontSize(8);
  const nombre = ((import.meta.env.VITE_NOMBRE as string) || "").replace(
    /\n/g,
    " ",
  );
  doc.text(nombre, 40, 9);

  doc.setFontSize(7);
  const ruc = ((import.meta.env.VITE_RUC as string) || "").replace(/\n/g, " ");
  doc.text(ruc, 40, 13);

  const direccion = ((import.meta.env.VITE_DIRRECION as string) || "").replace(
    /\n/g,
    " ",
  );
  doc.text(direccion, 40, 17);

  const telefono = `Central telefónica: ${((import.meta.env.VITE_TELEFONO as string) || "").replace(/\n/g, " ")}`;
  doc.text(telefono, 40, 21);

  const correo = `Email: ${((import.meta.env.VITE_CORREO as string) || "").replace(/\n/g, " ")}`;
  doc.text(correo, 40, 25);

  const web = `Web: ${((import.meta.env.VITE_WEB as string) || "").replace(/\n/g, " ")}`;
  doc.text(web, 40, 29);

  // Caja de cotización / comprobante
  doc.setFillColor("WHITE");
  doc.rect(145, 5, 55, 25, "FD");

  doc.setTextColor("BLACK");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const cotizacionText = comprobanteElectronico.tipoComprobante || "";
  const cotizacionWidth = doc.getTextWidth(cotizacionText);
  const cotizacionX = 153 + (40 - cotizacionWidth) / 2;
  doc.text(cotizacionText, cotizacionX, 15);

  doc.setFontSize(10);
  const cotizacionCodeText = `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}`;
  const cotizacionCodeWidth = doc.getTextWidth(cotizacionCodeText);
  const cotizacionCodeX = 153 + (40 - cotizacionCodeWidth) / 2;
  doc.text(cotizacionCodeText, cotizacionCodeX, 20);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  doc.text("CLIENTE:", 10, 35);
  doc.setFont("helvetica", "normal");
  doc.text(
    comprobanteElectronico.cliente?.nombreComercial ||
      comprobanteElectronico.cliente?.nombreApellidos ||
      " ",
    35,
    35,
  );

  doc.setFont("helvetica", "bold");
  doc.text(
    `${comprobanteElectronico.cliente?.tipoDocIdentidad || ""}:`,
    10,
    40,
  );
  doc.setFont("helvetica", "normal");
  doc.text(` ${comprobanteElectronico.cliente?.numeroDoc || " "}`, 35, 40);

  doc.setFont("helvetica", "bold");
  doc.text("DIRECCIÓN:", 10, 45);
  doc.setFont("helvetica", "normal");

  const direccionCliente = comprobanteElectronico.cliente?.direccion || "";
  const provCliente =
    comprobanteElectronico.cliente?.provincia?.provincia || "";
  const distCliente = comprobanteElectronico.cliente?.distrito?.distrito || "";
  const depCliente =
    comprobanteElectronico.cliente?.departamento?.departamento || "";

  doc.text(
    `${direccionCliente} - ${provCliente} - ${distCliente} - ${depCliente}`,
    35,
    45,
  );

  doc.setFont("helvetica", "bold");
  doc.text("VENDEDOR:", 10, 50);
  doc.setFont("helvetica", "normal");
  doc.text(comprobanteElectronico.vendedor || " ", 35, 50);

  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES:", 10, 55);
  doc.setFont("helvetica", "normal");
  doc.text(comprobanteElectronico.observacion || " ", 50, 55);

  if (comprobanteElectronico?.cotizacion) {
    doc.setFont("helvetica", "bold");
    doc.text("COTIZACION:", 10, 60);
    doc.setFont("helvetica", "normal");
    doc.text(
      `COT-${formatWithLeadingZeros(Number(comprobanteElectronico.cotizacion.id), 6)}`,
      35,
      60,
    );
  }

  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE EMISIÓN :", 145, 38);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(comprobanteElectronico.fechaEmision) || " ", 185, 38);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE VENCIMIENTO:", 145, 42);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(comprobanteElectronico.fechaVencimiento) || " ", 185, 42);

  const productsColumns = [
    "CANT",
    "UNIDAD",
    "DESCRIPCIÓN",
    "V.UNIT",
    "SUB TOTAL",
  ];

  // Aseguramos que data sea array de strings o numbers para autotable
  const productsData = (comprobanteElectronico.productos || []).map(
    (producto) => {
      const precioUnitario =
        typeof producto.precioUnitario === "number"
          ? producto.precioUnitario
          : parseFloat(String(producto.precioUnitario)) || 0;
      const total =
        typeof producto.total === "number"
          ? producto.total
          : parseFloat(String(producto.total)) || 0;

      return [
        String(producto.cantidad || 0),
        producto.producto?.codUnidad || "",
        producto.producto?.nombre || " ",
        precioUnitario.toFixed(2),
        String(formatNumber(total)),
      ];
    },
  );

  autoTable(doc, {
    startY: 65,
    head: [productsColumns],
    body: productsData,
    margin: { top: 10, left: 10, right: 5 },
    styles: {
      fontSize: 8,
      font: "helvetica",
    },
    bodyStyles: { fillColor: [235, 235, 235] },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  const opGravadas =
    typeof comprobanteElectronico.total_valor_venta === "number"
      ? comprobanteElectronico.total_valor_venta
      : 0;
  const igv =
    typeof comprobanteElectronico.total_igv === "number"
      ? comprobanteElectronico.total_igv
      : 0;
  const totalPagar =
    typeof comprobanteElectronico.total_venta === "number"
      ? comprobanteElectronico.total_venta
      : 0;

  doc.text(`OP. GRAVADAS:`, 165, doc.lastAutoTable.finalY + 5, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(`S/ ${formatNumber(opGravadas)}`, 171, doc.lastAutoTable.finalY + 5);

  doc.setFont("helvetica", "bold");
  doc.text(`IGV:`, 165, doc.lastAutoTable.finalY + 10, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(`S/ ${formatNumber(igv)}`, 171, doc.lastAutoTable.finalY + 10);

  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL A PAGAR:`, 165, doc.lastAutoTable.finalY + 15, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${formatNumber(totalPagar)}`,
    171,
    doc.lastAutoTable.finalY + 15,
  );

  const totalEnLetras = comprobanteElectronico.legend || "";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`SON: ${totalEnLetras}`, 10, doc.lastAutoTable.finalY + 23);

  const paymentColumns = [
    "MÉTODO DE PAGO",
    "BANCO",
    "OPERACIÓN",
    "MONTO",
    "FECHA",
  ];

  const paymentData = (comprobanteElectronico.pagos || []).map((pago) => [
    pago.metodoPago?.descripcion || " ",
    pago.banco?.descripcion || " ",
    pago.operacion || " ",
    `S/${formatNumber(Number(pago?.monto) || 0)}`,
    formatDate(pago.fecha) || " ",
  ]);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  if (comprobanteElectronico.detraccion) {
    doc.text(
      `Información de la detracción :`,
      10,
      doc.lastAutoTable.finalY + 28,
    );

    doc.setFontSize(9);
    doc.text(`Bien o Servicio:`, 10, doc.lastAutoTable.finalY + 32);

    const codBien = comprobanteElectronico.detraccion.codBienDetraccion;
    const bienEncontrado = codigosBienes.find((c) => c.codigo === codBien);

    doc.setFont("helvetica", "normal");
    doc.text(
      `${bienEncontrado?.codigo || ""} - ${bienEncontrado?.descripcion || ""}`,
      60,
      doc.lastAutoTable.finalY + 32,
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Medio de pago:`, 10, doc.lastAutoTable.finalY + 36);

    const codMedio = comprobanteElectronico.detraccion.codMedioPago;
    const medioPagoEncontrado = mediosDePago.find((p) => p.codigo === codMedio);

    doc.setFont("helvetica", "normal");
    doc.text(
      `${medioPagoEncontrado?.codigo || ""} - ${medioPagoEncontrado?.descripcion || ""}`,
      60,
      doc.lastAutoTable.finalY + 36,
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `Nro. Cta. Banco de la Nación:`,
      10,
      doc.lastAutoTable.finalY + 40,
    );
    doc.setFont("helvetica", "normal");

    const detraccionText = `${comprobanteElectronico.detraccion.ctaBancaria || ""}      Porcentaje de detracción:     ${comprobanteElectronico.detraccion.porcentaje || ""}      Monto detracción:    ${comprobanteElectronico.detraccion.montoDetraccion || ""} `;

    doc.text(detraccionText, 60, doc.lastAutoTable.finalY + 40);

    doc.setFont("helvetica", "bold");
    doc.text(`PAGOS :`, 10, doc.lastAutoTable.finalY + 47);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 49,
      head: [paymentColumns],
      margin: { top: 10, left: 10, right: 5 },
      body: paymentData,
      styles: {
        fontSize: 8,
        font: "helvetica",
      },
      bodyStyles: { fillColor: [235, 235, 235] },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });
  } else {
    doc.text(`PAGOS :`, 10, doc.lastAutoTable.finalY + 30);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 33,
      head: [paymentColumns],
      body: paymentData,
      margin: { top: 10, left: 10, right: 5 },
      styles: {
        fontSize: 8,
        font: "helvetica",
      },
      bodyStyles: { fillColor: [235, 235, 235] },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });
  }

  doc.setFontSize(8);

  if (comprobanteElectronico.qrContent && comprobanteElectronico.digestValue) {
    try {
      const qrContent = String(comprobanteElectronico.qrContent);
      const qrDataUrl = await QRCode.toDataURL(qrContent);

      doc.addImage(qrDataUrl, "PNG", 160, doc.lastAutoTable.finalY, 35, 35);
      doc.text("Código Hash:", 133, doc.lastAutoTable.finalY + 37);
      doc.text(
        String(comprobanteElectronico.digestValue),
        150,
        doc.lastAutoTable.finalY + 37,
      );
    } catch (error) {
      console.error("Error generando QR", error);
    }
  }

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

  const bancosBody = (cuentasBancarias || []).map((cuentaBancaria) => [
    cuentaBancaria.descripcion || "",
    "Soles",
    cuentaBancaria.cci || "",
    cuentaBancaria.numero || "",
  ]);

  autoTable(doc, {
    startY: bancosStartY + 10,
    head: [bancosColumns],
    margin: { top: 10, left: 10, right: 5, bottom: 5 },
    body: bancosBody,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228],
      textColor: [0, 0, 0],
      fontStyle: "normal", // 'fontWeight: 400' no es válido en autoTable, usar 'fontStyle: normal'
    },
  });

  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.title = `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}`;
    newWindow.document.write(`
      <html>
        <head>
          <title>${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}</title>
        </head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(
    `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}.pdf`,
  );
};

export default plantillaComprobantePdf;
