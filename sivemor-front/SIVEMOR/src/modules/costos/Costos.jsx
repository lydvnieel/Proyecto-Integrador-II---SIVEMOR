import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import CostRow from "./components/CostRow";
import EditCostModal from "./components/EditCostModal";
import UpdateCostSuccessModal from "./components/UpdateCostSuccessModal";
import DeleteCostsModal from "./components/DeleteCostsModal";
import DeleteAllCost from "./components/DeleteAllCost";
import DeleteCostSuccessModal from "./components/DeleteCostSuccessModal";
import CreateCostModal from "./components/CreateCostModal";
import CreateCostSuccessModal from "./components/CreateCostSuccessModal";
import {getCostos,  createCosto, updateCosto,  deleteCosto} from "../costos/services/costosService"
import {getClientes} from "../clientes/services/clienteService"
import {getUsuarios} from "../usuarios/services/usuarioService"

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

export default function Costos() {
  const [costos, setCostos] = useState([]);
  const [clientesOptions, setClientesOptions] = useState([]);
  const [usuariosOptions, setUsuariosOptions] = useState([]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedCost, setSelectedCost] = useState(null);
  const [filterMateria, setFilterMateria] = useState("");
  const [search, setSearch] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
  loadInitialData();
}, []);

const loadInitialData = async () => {
  try {
    const [costosData, clientesData, usuariosData] = await Promise.all([
      getCostos(),
      getClientes(),
      getUsuarios(),
    ]);

    setCostos(costosData);
    setClientesOptions(clientesData);
    setUsuariosOptions(usuariosData);
  } catch (error) {
    console.error("Error cargando datos de costos:", error);
  }
};

  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const filteredCostos = useMemo(() => {
    const term = search.trim().toLowerCase();
    const materiaSeleccionada = filterMateria.trim().toLowerCase();

    return costos.filter((item) => {
      const cliente = String(item.cliente || "").toLowerCase();
      const materia = String(item.materia || "").toLowerCase();
      const encargado = String(item.encargado || "").toLowerCase();
      const atiendeCobra = String(item.atiendeCobra || "").toLowerCase();

      const matchesSearch =
        !term ||
        cliente.includes(term) ||
        materia.includes(term) ||
        encargado.includes(term) ||
        atiendeCobra.includes(term);

      const matchesMateria =
        !materiaSeleccionada || materia === materiaSeleccionada;

      return matchesSearch && matchesMateria;
    });
  }, [costos, search, filterMateria]);

  const handleSelectAll = () => {
    const allSelected =
      filteredCostos.length > 0 &&
      filteredCostos.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };

    filteredCostos.forEach((item) => {
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
    setSelectedCost(item);

    setTimeout(() => {
      const modalElement = document.getElementById("editCostModal");
      if (!modalElement) return;

      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }, 0);
  };

  const handleOpenDeleteOne = (item) => {
    setSelectedCost(item);

    setTimeout(() => {
      const modalElement = document.getElementById("deleteCostsModal");
      if (!modalElement) return;

      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }, 0);
  };

  const handleCreateCost = async (newCost) => {
  try {
    const created = await createCosto(newCost);
    setCostos((prev) => [...prev, created]);
  } catch (error) {
    console.error("Error creando costo:", error);
  }
};

  const handleSaveEdit = async (updatedCost) => {
  try {
    const updated = await updateCosto(selectedCost.id, updatedCost);

    setCostos((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  } catch (error) {
    console.error("Error actualizando costo:", error);
  }
};

  const handleDeleteSelected = async () => {
  const idsToDelete = Object.keys(selectedRows)
    .filter((id) => selectedRows[id])
    .map(Number);

  try {
    await Promise.all(idsToDelete.map((id) => deleteCosto(id)));

    const count = idsToDelete.length;

    setCostos((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedRows({});

    const modal = document.getElementById("deleteCostsModal");
    const success = document.getElementById("deleteCostSuccessModal");

    if (!modal || !success) return;

    const modalInstance = Modal.getOrCreateInstance(modal);
    const successInstance = Modal.getOrCreateInstance(success);

    modal.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        setDeleteMessage(
          count === 1
            ? "Se eliminó correctamente 1 costo."
            : `Se eliminaron correctamente ${count} costos.`
        );
        successInstance.show();
      },
      { once: true }
    );

    modalInstance.hide();
  } catch (error) {
    console.error("Error eliminando múltiples costos:", error);
  }
};

  const handleDeleteOne = async () => {
  if (!selectedCost) return;

  try {
    await deleteCosto(selectedCost.id);

    const deletedClient = selectedCost.cliente || "el costo";

    setCostos((prev) =>
      prev.filter((item) => item.id !== selectedCost.id)
    );

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[selectedCost.id];
      return updated;
    });

    setSelectedCost(null);

    const modal = document.getElementById("deleteCostsModal");
    const success = document.getElementById("deleteCostSuccessModal");

    if (!modal || !success) return;

    const modalInstance = Modal.getOrCreateInstance(modal);
    const successInstance = Modal.getOrCreateInstance(success);

    modal.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        setDeleteMessage(`Se eliminó correctamente el costo de ${deletedClient}.`);
        successInstance.show();
      },
      { once: true }
    );

    modalInstance.hide();
  } catch (error) {
    console.error("Error eliminando costo:", error);
  }
};

  const handleDeleteAll = async () => {
  try {
    const ids = costos.map((c) => c.id);

    await Promise.all(ids.map((id) => deleteCosto(id)));

    const total = costos.length;

    setCostos([]);
    setSelectedRows({});
    setSelectedCost(null);

    const modal = document.getElementById("deleteAllCostModal");
    const success = document.getElementById("deleteCostSuccessModal");

    if (!modal || !success) return;

    const modalInstance = Modal.getOrCreateInstance(modal);
    const successInstance = Modal.getOrCreateInstance(success);

    modal.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        setDeleteMessage(
          total === 1
            ? "Se eliminó correctamente 1 costo."
            : `Se eliminaron correctamente ${total} costos.`
        );
        successInstance.show();
      },
      { once: true }
    );

    modalInstance.hide();
  } catch (error) {
    console.error("Error eliminando todos los costos:", error);
  }
};

  const isAllSelected =
    filteredCostos.length > 0 &&
    filteredCostos.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Costos</h2>
          <p className="page-title">Control detallado de procesos y pagos</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createCostModal"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo costo
            </button>
          ) : (
            <>
              {isAllSelected && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              {selectedCount === filteredCostos.length &&
              filteredCostos.length > 0 ? (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteAllCostModal"
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteCostsModal"
                  type="button"
                  onClick={() => setSelectedCost(null)}
                >
                  <i className="bi bi-trash"></i>
                  Borrar seleccionados
                </button>
              )}

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
        <div className="toolbar-row d-flex align-items-center gap-2 flex-wrap mb-3">
          <div className="search-box flex-grow-1">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por cliente, materia, encargado o atiende y cobra..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <th>CLIENTE</th>
                <th>MATERIA</th>
                <th>COSTO</th>
                <th>ENCARGADO</th>
                <th>ATIENDE Y COBRA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredCostos.length > 0 ? (
                filteredCostos.map((item) => (
                  <CostRow
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
                  <td colSpan="7" className="text-center py-4">
                    No se encontraron costos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando {filteredCostos.length} de {costos.length} registros</span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <EditCostModal cost={selectedCost} onSave={handleSaveEdit} costos={costos} usuarios={usuariosOptions}/>
      <UpdateCostSuccessModal />
      <DeleteCostsModal
        cost={selectedCost}
        selectedCount={selectedCount}
        totalCount={filteredCostos.length}
        onDelete={selectedCost ? handleDeleteOne : handleDeleteSelected}
      />
      <DeleteAllCost
        totalCount={costos.length}
        onConfirmDelete={handleDeleteAll}
      />
      <DeleteCostSuccessModal message={deleteMessage} />
      <CreateCostModal onCreate={handleCreateCost} costos={costos} clientes={clientesOptions} usuarios={usuariosOptions}/>
      <CreateCostSuccessModal />
    </Admin>
  );
}