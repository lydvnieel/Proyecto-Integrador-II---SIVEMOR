import Admin from  "../../components/Admin"
import CreateVehicleModal from "../vehiculos/components/CreateVehicleModal"
import VehicleRow from "../vehiculos/components/VehicleRow";
import vehicles from "../../../public/data/vehicles.json"

function Vehiculos() {
  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Vehículos</h2>
          <p className="page-title">Administración y control de parque vehicular</p>
        </div>

        <button className="primary-btn" data-bs-toggle = "modal" data-bs-target = "#createVehicleModal">
          <i className="bi bi-plus-lg"></i>
          &nbsp;Nuevo Vehículo
        </button>

      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por placa o serie..." />
          </div>

          <button className="outline-btn">
            <i className="bi bi-funnel"></i>
            Filtros
          </button>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell"><input type="checkbox" /></th>
                <th scope="col">PLACA</th>
                <th scope="col">SERIE</th>
                <th scope="col">CEDIS</th>
                <th scope="col">REGIÓN</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
            <VehicleRow key={index} vehicle={vehicle}index={index}
            />
          ))}
              <VehicleRow />
            </tbody>
          </table>
        </div>
      </div>
      {/*Modales*/}
      <CreateVehicleModal />

    </Admin>
    
  );


}

export default Vehiculos;