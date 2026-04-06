import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/login/Login.jsx";
import Dashboard from "../modules/dashboard/Dashboard.jsx";
import Vehiculos from "../modules/vehiculos/Vehiculos.jsx";
import Verificaciones from "../modules/verificaciones/Verificaciones.jsx";
import Notas from "../modules/notas/Notas.jsx";
import Verificentros from "../modules/verificentros/Verificentros.jsx";
import Usuarios from "../modules/usuarios/Usuarios.jsx";
import Clientes from "../modules/clientes/Clientes.jsx";
import Reportes from "../modules/reportes/Reportes.jsx";
import Cedis from "../modules/cedis/Cedis.jsx";
import Costos from "../modules/costos/Costos.jsx"
import Transacciones from "../modules/transacciones/Transacciones.jsx";
import Pedidos from "../modules/pedidos/Pedidos.jsx";
import EvaluacionDetalle from "../modules/evaluaciones/EvaluacionDetalle.jsx";
import EvaluacionEditar from "../modules/evaluaciones/EvaluacionEditar.jsx";
import EvaluacionesHistorial from "../modules/evaluaciones/EvaluacionesHistorial.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/costos" element={<Costos />} />
        <Route path="/evaluaciones/:evaluationId" element={<EvaluacionDetalle />} />
        <Route path="/evaluaciones/:evaluationId/editar" element={<EvaluacionEditar />} />
        <Route path="/evaluaciones/vehiculo/:vehicleId" element={<EvaluacionesHistorial />} />
        <Route path="/verificaciones" element={<Verificaciones />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/verificentros" element={<Verificentros />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/cedis" element={<Cedis />} />
        <Route path="/transacciones" element={<Transacciones />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;