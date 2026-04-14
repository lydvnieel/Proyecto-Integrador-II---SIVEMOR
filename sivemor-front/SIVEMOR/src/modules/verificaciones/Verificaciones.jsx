import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import VerificationRow from "./components/VerificationRow";
import CreateVerificationModal from "./components/CreateVerificationModal";
import EditVerificationModal from "./components/EditVerificationModal";
import CreateCostModal from "./components/CreateCostModal";
import CreateVerificationSuccessModal from "./components/CreateVerificationSuccessModal";
import UpdateVerificationSuccessModal from "./components/UpdateVerificationSuccessModal";
import CreateCostSuccessModal from "./components/CreateCostSuccessModal";
import DeleteVerificationsModal from "./components/DeleteVerificationsModal";
import MarkPaidVerificationsModal from "./components/MarkPaidVerificationsModal";
import DeleteSuccessfulModal from "./components/DeleteSuccessfulModal";
import DeleteAllVerificationModal from "./components/DeleteAllVerificationModal";
import { verificacionService } from "../verificaciones/services/verificacionesService";
import { createCosto } from "../costos/services/costosService";
import { getClientes } from "../clientes/services/clienteService";
import { getUsuarios } from "../usuarios/services/usuarioService";

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

export default function Verificaciones() {
  const [verificaciones, setVerificaciones] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientesOptions, setClientesOptions] = useState([]);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [costosList, setCostosList] = useState([]);

    useEffect(() => {
    fetchVerificaciones();
    loadCostasData();
  }, []);

  const loadCostasData = async () => {
    try {
      const [clientesData, usuariosData] = await Promise.all([
        getClientes(),
        getUsuarios(),
      ]);
      setClientesOptions(clientesData);
      setUsuariosOptions(usuariosData);
    } catch (err) {
      console.error("Error cargando datos para costos:", err);
    }
  };

  const fetchVerificaciones = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await verificacionService.getAll(filters);
      setVerificaciones(data);
    } catch (err) {
      console.error("Error al cargar verificaciones:", err);
      setError("No se pudieron cargar las verificaciones.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVerificaciones = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return verificaciones.filter((item) => {
      const vehiculo = String(item.vehiculo || item.placa || "").toLowerCase();
      const nota = String(item.numeroNota || "").toLowerCase();
      const materia = String(item.materia || "").toLowerCase();
      const fechaVerificacion = String(item.fechaFolio || "").toLowerCase();
      const dictamen = String(item.dictamen || "").toLowerCase();

      const matchesSearch =
        !search ||
        vehiculo.includes(search) ||
        nota.includes(search) ||
        materia.includes(search) ||
        fechaVerificacion.includes(search) ||
        dictamen.includes(search);

      const matchesMateria = filterMateria
        ? String(item.materia || "").toUpperCase() === filterMateria
        : true;

      return matchesSearch && matchesMateria;
    });
  }, [verificaciones, searchTerm, filterMateria]);

  const handleSelectAll = () => {
    const allSelected =
      filteredVerificaciones.length > 0 &&
      filteredVerificaciones.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };

    filteredVerificaciones.forEach((item) => {
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

    setTimeout(() => {
      const modalElement = document.getElementById("editVerificationModal");
      if (!modalElement) return;
      Modal.getOrCreateInstance(modalElement).show();
    }, 0);
  };

  const handleOpenDeleteOne = (item) => {
    setSelectedVerification(item);

    setTimeout(() => {
      const modalElement = document.getElementById("deleteVerificationsModal");
      if (!modalElement) return;
      Modal.getOrCreateInstance(modalElement).show();
    }, 0);
  };

  const handleCreateVerification = async (payload) => {
  await verificacionService.create(payload);
  await fetchVerificaciones();
};

const handleCreateCost = async (newCost) => {
  try {
    const created = await createCosto(newCost);
    setCostosList((prev) => [...prev, created]);
  } catch (error) {
    console.error("Error creando costo:", error);
  }
};

  const handleSaveEdit = async (payload) => {
    const updated = await verificacionService.update(payload.id, payload);

    setVerificaciones((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    try {
      for (const id of idsToDelete) {
        await verificacionService.remove(id);
      }

      setVerificaciones((prev) =>
        prev.filter((item) => !idsToDelete.includes(item.id))
      );

      setSelectedRows({});

      const modal = document.getElementById("deleteVerificationsModal");
      const success = document.getElementById("deleteSuccessfulModal");

      if (!modal || !success) return;

      const modalInstance = Modal.getOrCreateInstance(modal);
      const successInstance = Modal.getOrCreateInstance(success);

      modal.addEventListener(
        "hidden.bs.modal",
        () => {
          document.body.classList.remove("modal-open");
          document.body.style.removeProperty("padding-right");
          document.body.style.removeProperty("overflow");
          document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());

          setDeleteMessage(
            count === 1
              ? "Se eliminó correctamente 1 verificación."
              : `Se eliminaron correctamente ${count} verificaciones.`
          );

          successInstance.show();
        },
        { once: true }
      );

      modalInstance.hide();
    } catch (err) {
      console.error("Error al eliminar verificaciones:", err);
      alert(
        err?.response?.data?.message ||
          "No se pudieron eliminar las verificaciones seleccionadas."
      );
    }
  };

  const handleDeleteOne = async () => {
    if (!selectedVerification) return;

    try {
      await verificacionService.remove(selectedVerification.id);

      const deleted = selectedVerification.placa || "la verificación";

      setVerificaciones((prev) =>
        prev.filter((item) => item.id !== selectedVerification.id)
      );

      setSelectedRows((prev) => {
        const updated = { ...prev };
        delete updated[selectedVerification.id];
        return updated;
      });

      setSelectedVerification(null);

      const modal = document.getElementById("deleteVerificationsModal");
      const success = document.getElementById("deleteSuccessfulModal");

      if (!modal || !success) return;

      const modalInstance = Modal.getOrCreateInstance(modal);
      const successInstance = Modal.getOrCreateInstance(success);

      modal.addEventListener(
        "hidden.bs.modal",
        () => {
          document.body.classList.remove("modal-open");
          document.body.style.removeProperty("padding-right");
          document.body.style.removeProperty("overflow");
          document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());

          setDeleteMessage(`Se eliminó correctamente ${deleted}.`);
          successInstance.show();
        },
        { once: true }
      );

      modalInstance.hide();
    } catch (err) {
      console.error("Error al eliminar verificación:", err);
      alert(
        err?.response?.data?.message ||
          "No se pudo eliminar la verificación."
      );
    }
  };

  const handleDeleteAll = async () => {
    const total = verificaciones.length;

    try {
      for (const item of verificaciones) {
        await verificacionService.remove(item.id);
      }

      setVerificaciones([]);
      setSelectedRows({});
      setSelectedVerification(null);

      const modalElement = document.getElementById("deleteAllVerificationModal");
      const successElement = document.getElementById("deleteSuccessfulModal");

      if (!modalElement || !successElement) return;

      const modalInstance = Modal.getOrCreateInstance(modalElement);
      const successInstance = Modal.getOrCreateInstance(successElement);

      modalElement.addEventListener(
        "hidden.bs.modal",
        () => {
          document.body.classList.remove("modal-open");
          document.body.style.removeProperty("padding-right");
          document.body.style.removeProperty("overflow");

          document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
            backdrop.remove();
          });

          setDeleteMessage(
            total === 1
              ? "Se eliminó correctamente 1 verificación."
              : `Se eliminaron correctamente ${total} verificaciones.`
          );

          successInstance.show();
        },
        { once: true }
      );

      modalInstance.hide();
    } catch (err) {
      console.error("Error al eliminar todas:", err);
      alert(
        err?.response?.data?.message ||
          "No se pudieron eliminar todas las verificaciones."
      );
    }
  };

  const handleMarkPaid = async () => {
  const idsToUpdate = Object.keys(selectedRows)
    .filter((id) => selectedRows[id])
    .map(Number);

  try {
    await verificacionService.marcarPagado(idsToUpdate);
    await fetchVerificaciones();
    setSelectedRows({});
  } catch (err) {
    console.error("Error al marcar como pagado:", err);
    alert(
      err?.response?.data?.message ||
        "No se pudieron marcar las verificaciones como pagadas."
    );
  }
};

  const isAllSelected =
    filteredVerificaciones.length > 0 &&
    filteredVerificaciones.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Verificaciones</h2>
          <p className="page-title">Control detallado de procesos y pagos</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <>
              <button
                className="primary-btn ms-2"
                data-bs-toggle="modal"
                data-bs-target="#createCostModal"
                type="button"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nuevo costo
              </button>

              <button
                className="primary-btn ms-1"
                data-bs-toggle="modal"
                data-bs-target="#createVerificationModal"
                type="button"
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
                type="button"
              >
                <i className="bi bi-check-circle"></i>
                Marcar como Pagado
              </button>

              <button
                className="selection-delete"
                data-bs-toggle="modal"
                data-bs-target="#deleteVerificationsModal"
                type="button"
                onClick={() => setSelectedVerification(null)}
              >
                <i className="bi bi-trash"></i>
                {selectedCount === filteredVerificaciones.length &&
                filteredVerificaciones.length > 0
                  ? "¡BORRAR TODO!"
                  : "Borrar Seleccionadas"}
              </button>

              <button
                className="selection-cancel"
                onClick={handleCancelSelection}
                type="button"
              >
                <i className="bi bi-x-lg"></i>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row d-flex align-items-center gap-2 flex-wrap">
          <div className="search-box flex-grow-1">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por vehículo, tipo de prueba, fecha o dictamen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ maxWidth: "220px", marginLeft: "auto" }}
            value={filterMateria}
            onChange={(e) => setFilterMateria(e.target.value)}
          >
            <option value="">Filtrar por materia</option>
            {ALLOWED_MATERIAS.map((materia) => (
              <option key={materia} value={materia}>
                {materia}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

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
              {loading ? (
                <tr>
                  <td colSpan="19" className="text-center py-4">
                    Cargando verificaciones...
                  </td>
                </tr>
              ) : filteredVerificaciones.length > 0 ? (
                filteredVerificaciones.map((item) => (
                  <VerificationRow
                    key={item.id}
                    item={item}
                    isSelected={!!selectedRows[item.id]}
                    onSelect={() => handleSelectRow(item.id)}
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => handleOpenDeleteOne(item)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="19" className="text-center py-4">
                    No se encontraron verificaciones con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Mostrando {filteredVerificaciones.length} de {verificaciones.length} registros
          </span>

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
      <CreateCostModal onCreate={handleCreateCost} costos={costosList} clientes={clientesOptions} usuarios={usuariosOptions}/>
      <CreateVerificationSuccessModal />
      <UpdateVerificationSuccessModal />
      <CreateCostSuccessModal />
      <DeleteVerificationsModal verification={selectedVerification} selectedCount={selectedCount} totalCount={filteredVerificaciones.length}
        onDelete={selectedVerification ? handleDeleteOne : handleDeleteSelected}/>
      <MarkPaidVerificationsModal selectedCount={selectedCount} onConfirm={handleMarkPaid}/>
      <DeleteAllVerificationModal totalCount={verificaciones.length} onConfirmDelete={handleDeleteAll}/>
      <DeleteSuccessfulModal message={deleteMessage} />
    </Admin>
  );
}