import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Vehiculos from "../pages/Vehiculos.jsx";
import Verificaciones from "../pages/Verificaciones.jsx";
import Notas from "../pages/Notas.jsx";
import Verificentros from "../pages/Verificentros.jsx";
import Usuarios from "../pages/Usuarios.jsx";
import Clientes from "../pages/Clientes.jsx";
import Reportes from "../pages/Reportes.jsx";
import Cedis from "../pages/Cedis.jsx";
import Transacciones from "../pages/Transacciones.jsx";
import Pedidos from "../pages/Pedidos.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
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