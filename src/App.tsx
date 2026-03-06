import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import Login from "./pages/login/Login";
import { PrivateGuard } from "./auth/PrivateGuard";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Niveles from "./pages/Niveles";
import GalleriaFotos from "./pages/GaleriaFotos";
import Attendance from "./modules/reporteEstudiante/components/Attendance";
import StudentReportLayout from "./modules/reporteEstudiante/StudentReportLayout";
import StudentDashboard from "./modules/reporteEstudiante/StudentDashboard";
import Notes from "./modules/reporteEstudiante/components/Notes";
import ExamsList from "./modules/reporteEstudiante/components/ExamsList";
import Pays from "./modules/reporteEstudiante/components/Pays";
import Debts from "./modules/reporteEstudiante/components/Debts";
import Calendar from "./modules/reporteEstudiante/components/Calendar";
import Observation from "./modules/reporteEstudiante/components/Observation";
import Files from "./modules/reporteEstudiante/components/Files";
import MyFiles from "./modules/reporteEstudiante/components/MyFiles/MyFiles";
import Evaluacion from "./modules/reporteEstudiante/components/evaluacion/Evaluacion";
import RevisionEvaluacion from "./modules/reporteEstudiante/components/RevisionEvaluacion";

// 1. Creamos un componente Layout para las rutas públicas
const PublicLayout = () => {
  return (
    <>
      <Navigation />
      {/* Outlet renderiza el componente de la ruta actual (Home, Login, etc.) */}
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />

      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route element={<PublicLayout />}>
          {/* <Route element={<GuestGuard />}> */}
          <Route index element={<Home />} />
          <Route path="/niveles" element={<Niveles />} />
          <Route path="/galeria-fotos" element={<GalleriaFotos />} />

          <Route path="/log-in" element={<Login />} />
          {/* </Route> */}
        </Route>

        {/* --- RUTAS PRIVADAS --- */}
        <Route element={<PrivateGuard />}>
          <Route path="reporte-estudiante" element={<StudentReportLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="asistencia" element={<Attendance />} />
            <Route path="notas" element={<Notes />} />
            <Route path="evaluaciones" element={<ExamsList />} />
            <Route path="pagos" element={<Pays />} />
            <Route path="deudas" element={<Debts />} />
            <Route path="calendario" element={<Calendar />} />
            <Route path="observacion" element={<Observation />} />
            <Route path="archivos" element={<Files />} />
            <Route path="mis-archivos" element={<MyFiles />} />
            <Route path="evaluacion/:id" element={<Evaluacion />} />
            <Route
              path="evaluacion/revision/:id"
              element={<RevisionEvaluacion />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
