import { useState } from "react";
import Admin from "../../components/Admin";
import VerificationRow from "./components/VerificationRow";
import CreateVerificationModal from "./components/CreateVerificationModal";
import EditVerificationModal from "./components/EditVerificationModal";
import CreateCostModal from "./components/CreateCostModal";
import CreateVerificationSuccessModal from "./components/CreateVerificationSuccessModal";
import UpdateVerificationSuccessModal from "./components/UpdateVerificationSuccessModal";
import DeleteVerificationsModal from "./components/DeleteVerificationsModal";
import MarkPaidVerificationsModal from "./components/MarkPaidVerificationsModal";

export default function Verificaciones() {
  const [verificaciones, setVerificaciones] = useState([
    {
      id: 1,
      gestor: "Juan Pérez",
      razonSocial: "Transportes del Norte SA de CV",
      placa: "AB-123-CD",
      serie: "XYZ987654321",
      materia: "Humo",
      verificentro: "Centro 01",
      precio: "$1,200",
      tipoPago: "Transferencia",
      numeroNota: "N-1001",
      cotizacion: "C-500",
      fechaFolio: "2026-02-15",
      folio: "V-2026-001",
      cuentaDeposito: "BBVA-1234",
      numeroFactura: "F-900",
      pagado: "Sí",
      pagadoClass: "status-success",
      pendiente: "$0",
      pendienteClass: "text-danger fw-semibold",
      fechaPedido: "2026-02-10",
      multa: "$120",
    },
    {
      id: 2,
      gestor: "María López",
      razonSocial: "Logística Express",
      placa: "XY-987-ZZ",
      serie: "ABC123456789",
      materia: "Arrastre",
      verificentro: "Centro 02",
      precio: "$1,500",
      tipoPago: "Crédito",
      numeroNota: "N-1002",
      cotizacion: "C-501",
      fechaFolio: "2026-02-16",
      folio: "V-2026-002",
      cuentaDeposito: "Santander-5678",
      numeroFactura: "F-901",
      pagado: "No",
      pagadoClass: "status-warning",
      pendiente: "$1,500",
      pendienteClass: "text-danger fw-semibold",
      fechaPedido: "2026-02-12",
      multa: "$298",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedVerification, setSelectedVerification] = useState(null);

  const handleSelectAll = () => {
    const allSelected = verificaciones.every((item) => selectedRows[item.id]);
    const newSelected = {};

    verificaciones.forEach((item) => {
      newSelected[item.id] = !allSelected;
    });

    setSelectedRows(newSelected);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCancelSelection = () => {
    setSelectedRows({});
  };

  const handleOpenEdit = (item) => {
    setSelectedVerification(item);
  };

  const handleCreateVerification = (newVerification) => {
    setVerificaciones((prev) => [
      ...prev,
      {
        ...newVerification,
        id: Date.now(),
      },
    ]);
  };

  const handleSaveEdit = (updatedVerification) => {
    setVerificaciones((prev) =>
      prev.map((item) =>
        item.id === updatedVerification.id ? updatedVerification : item
      )
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setVerificaciones((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
  };

  const handleMarkPaid = () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setVerificaciones((prev) =>
      prev.map((item) =>
        idsToUpdate.includes(item.id)
          ? {
              ...item,
              pagado: "Sí",
              pagadoClass: "status-success",
              pendiente: "$0",
            }
          : item
      )
    );

    setSelectedRows({});
  };

  const isAllSelected =
    verificaciones.length > 0 &&
    verificaciones.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Verificaciones</h2>
          <p className="page-title">
            Control detallado de procesos y pagos
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <>
              <button
                className="outline-btn"
                data-bs-toggle="modal"
                data-bs-target="#createCostModal"
              >
                Consultar costos
              </button>

              <button
                className="primary-btn"
                data-bs-toggle="modal"
                data-bs-target="#createCostModal"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nuevo costo
              </button>

              <button
                className="primary-btn"
                data-bs-toggle="modal"
                data-bs-target="#createVerificationModal"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nueva verificación
              </button>
            </>
          ) : (
            <>
              {isAllSelected && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              <button
                className="selection-paid"
                data-bs-toggle="modal"
                data-bs-target="#markPaidVerificationsModal"
              >
                <i className="bi bi-check-circle"></i>
                Marcar como Pagado
              </button>

              <button
                className="selection-delete"
                data-bs-toggle="modal"
                data-bs-target="#deleteVerificationsModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === verificaciones.length
                  ? "¡BORRAR TODO!"
                  : "Borrar Seleccionadas"}
              </button>

              <button
                className="selection-cancel"
                onClick={handleCancelSelection}
              >
                <i className="bi bi-x-lg"></i>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por cliente, placa, folio..."
            />
          </div>

          <button className="outline-btn">
            <i className="bi bi-funnel"></i> Filtros Avanzados
          </button>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>GESTOR</th>
                <th>RAZÓN SOCIAL</th>
                <th>PLACA</th>
                <th>SERIE</th>
                <th>MATERIA</th>
                <th>VERIFICENTRO</th>
                <th>PRECIO</th>
                <th>TIPO PAGO</th>
                <th>NÚMERO NOTA</th>
                <th>COTIZACIÓN</th>
                <th>FECHA FOLIO</th>
                <th>FOLIO</th>
                <th>CUENTA DEPÓSITO</th>
                <th>NÚMERO FACTURA</th>
                <th>PAGADO</th>
                <th>PENDIENTE</th>
                <th>FECHA PEDIDO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {verificaciones.map((item) => (
                <VerificationRow
                  key={item.id}
                  item={item}
                  isSelected={!!selectedRows[item.id]}
                  onSelect={() => handleSelectRow(item.id)}
                  onEdit={() => handleOpenEdit(item)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando {verificaciones.length} registros</span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <CreateVerificationModal onCreate={handleCreateVerification} />
      <EditVerificationModal
        verification={selectedVerification}
        onSave={handleSaveEdit}
      />
      <CreateCostModal />
      <CreateVerificationSuccessModal />
      <UpdateVerificationSuccessModal />
      <DeleteVerificationsModal
        selectedCount={selectedCount}
        totalCount={verificaciones.length}
        onDelete={handleDeleteSelected}
      />
      <MarkPaidVerificationsModal
        selectedCount={selectedCount}
        onConfirm={handleMarkPaid}
      />
    </Admin>
  );
}