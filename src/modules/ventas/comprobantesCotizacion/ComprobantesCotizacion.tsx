import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import { PiFileXlsFill } from "react-icons/pi";
import { getTodayDate, getTodayDate2 } from "../../../utils/getTodayDate";
import config from "../../../auth/auth.config";
import { API } from "../../../utils/api";
import ExcelComprobantesCotizacion from "../../../utils/plantillaExel/excelComprobantesCotizacion";
import { HiDocumentText } from "react-icons/hi";
import FiltrarCotizaciones from "./components/FiltrarCotizaciones";
import TablaComprobantesCotizacion from "./components/TablaComprobantesCotizacion";
import type { ComprobanteType } from "../../../types/comprobante.type";
import ModalPdfComprobanteElectronico from "./components/ModalPdfComprobanteElectronico";

const ComprobantesCotizacion = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectComprobante, setSelectComprobante] = useState<ComprobanteType>();
  const [selectModal, setSelectModal] = useState<string>();
  const [comprobantes, setComprobantes] = useState<ComprobanteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectFiltro, setSelectFiltro] = useState<string>("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState<string>("");
  const [inicioFecha, setInicioFecha] = useState<string>(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState<string>(getTodayDate());
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleFindComprobantes = () => {
    setLoading(true);
    const url = `${
      API
    }/comprobantes/comprobante-electronico/cotizaciones?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}`;

    axios
      .get(url, config)
      .then((res) => {
        setComprobantes(res.data.comprobantes);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega"
      ? setFinalFecha(getTodayDate())
      : setDataFiltro("");
    selectFiltro === "fechaEmision" || selectFiltro === "fechaEntrega"
      ? setInicioFecha(getTodayDate2())
      : setInicioFecha("");
  }, [selectFiltro]);

  useEffect(() => {
    handleFindComprobantes();
  }, []);

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      await ExcelComprobantesCotizacion.exportToExcel(
        comprobantes,
        inicioFecha,
        finalFecha,
      );
      ("Excel exportado exitosamente");
    } catch (error) {
      // Aquí puedes agregar una notificación de error
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <main className="w-full  z-10  flex flex-col  px-4 pt-4 py-3 gap-3">
      <section className="flex items-end gap-1">
        <HiDocumentText className="text-3xl text-slate-900" />
        <h1 className="text-xl font-bold text-slate-800">
          Facturas y Boletas Emitidas
        </h1>
      </section>
      <div className="flex items-end justify-between gap-4 px-4">
        <FiltrarCotizaciones
          selectFiltro={selectFiltro}
          setSelectFiltro={setSelectFiltro}
          dataFiltro={dataFiltro}
          setDataFiltro={setDataFiltro}
          inicioFecha={inicioFecha}
          setInicioFecha={setInicioFecha}
          finalFecha={finalFecha}
          setFinalFecha={setFinalFecha}
          handleFindComprobantes={handleFindComprobantes}
        />
        <Button
          className=" text-white "
          color="success"
          variant="solid"
          radius="sm"
          startContent={<PiFileXlsFill className=" text-2xl" />}
          onPress={handleExportExcel}
          isLoading={exportingExcel}
          isDisabled={loading || !comprobantes?.length}
        >
          {exportingExcel ? "Exportando..." : "Exportar"}
        </Button>
      </div>

      <TablaComprobantesCotizacion
        comprobantes={comprobantes}
        loading={loading}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectComprobante={setSelectComprobante}
      />

      {selectModal === "verComprobante" && selectComprobante && (
        <ModalPdfComprobanteElectronico
          key={selectComprobante.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idComprobante={selectComprobante.id}
        />
      )}
    </main>
  );
};

export default ComprobantesCotizacion;
