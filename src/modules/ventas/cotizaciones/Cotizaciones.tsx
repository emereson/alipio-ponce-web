import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { HiDocumentText } from "react-icons/hi";
import type { CotizacionType } from "../../../types/cotizacion.type";
import { getTodayDate, getTodayDate2 } from "../../../utils/getTodayDate";
import axios from "axios";
import config from "../../../auth/auth.config";
import { handleAxiosError } from "../../../utils/errorHandler";
import FiltrarCotizaciones from "./components/FiltrarCotizaciones";
import TablaCotizaciones from "./components/TablaCotizaciones";
import ModalGenerarComprobante from "./components/modalGenerarComprobante/ModalGenerarComprobante";
import { API } from "../../../utils/api";
import ModalPdfCotizacion from "./components/ModalPdfCotizacion";

const Cotizaciones = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectCotizacion, setSelectCotizacion] =
    useState<CotizacionType | null>(null);
  const [selectModal, setSelectModal] = useState<string>("");
  const [cotizaciones, setCotizaciones] = useState<CotizacionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectFiltro, setSelectFiltro] = useState<string>("fechaEmision");
  const [dataFiltro, setDataFiltro] = useState<string>("");
  const [estadoCotizacion, setEstadoCotizacion] = useState<string>("todos");
  const [inicioFecha, setInicioFecha] = useState(getTodayDate2());
  const [finalFecha, setFinalFecha] = useState(getTodayDate());

  const handleFindCotizaciones = () => {
    const url = `${
      API
    }/ventas/cotizaciones?tipoFiltro=${selectFiltro}&dataFiltro=${dataFiltro}&fechaInicial=${inicioFecha}&fechaFinal=${finalFecha}&estado=${estadoCotizacion}`;

    axios
      .get(url, config)
      .then((res) => {
        setCotizaciones(res.data.cotizaciones);
      })
      .catch((err) => handleAxiosError(err))
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
    handleFindCotizaciones();
  }, []);

  return (
    <main className="w-full  z-10  flex flex-col  px-4 pt-4 py-3 gap-3">
      <section className="flex items-end gap-1">
        <HiDocumentText className="text-3xl text-slate-900" />
        <h1 className="text-xl font-bold text-slate-800">Cotizaciones</h1>
      </section>
      <FiltrarCotizaciones
        selectFiltro={selectFiltro}
        setSelectFiltro={setSelectFiltro}
        dataFiltro={dataFiltro}
        setDataFiltro={setDataFiltro}
        inicioFecha={inicioFecha}
        setInicioFecha={setInicioFecha}
        finalFecha={finalFecha}
        setFinalFecha={setFinalFecha}
        setEstadoCotizacion={setEstadoCotizacion}
        estadoCotizacion={estadoCotizacion}
        handleFindCotizaciones={handleFindCotizaciones}
      />
      <TablaCotizaciones
        cotizaciones={cotizaciones}
        loading={loading}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectCotizacion={setSelectCotizacion}
      />
      {selectModal === "comprobante" && selectCotizacion && (
        <ModalGenerarComprobante
          key={selectCotizacion.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectCotizacion={selectCotizacion}
          handleFindCotizaciones={handleFindCotizaciones}
        />
      )}
      {/* {selectModal === "verComprobante" && (
        <ModalPdfComprobanteElectronico
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idComprobante={selectCotizacion.comprobanteElectronicoId}
        />
      )} */}

      {selectModal === "pdf" && selectCotizacion && (
        <ModalPdfCotizacion
          key={selectCotizacion.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          idCotizacion={selectCotizacion.id}
        />
      )}
      {/* {selectModal === "anular" && (
        <ModalAnularCotizacion
          key={selectCotizacion.id}
          userData={userData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectCotizacion={selectCotizacion}
          handleFindCotizaciones={handleFindCotizaciones}
          setLoading={setLoading}
        />
      )} */}
    </main>
  );
};

export default Cotizaciones;
