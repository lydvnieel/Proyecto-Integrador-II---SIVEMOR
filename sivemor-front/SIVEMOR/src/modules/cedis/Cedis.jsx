import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import CedisRow from "./components/CedisRow";
import CreateCedisModal from "./components/CreateCedisModal";
import EditCedisModal from "./components/EditCedisModal";
import CreateCedisSuccessModal from "./components/CreateCedisSuccessModal";
import UpdateCedisSuccessModal from "./components/UpdateCedisSuccessModal";
import DeleteCedisModal from "./components/DeleteCedisModal";
import DeleteCedisSuccessModal from "./components/DeleteCedisSuccessModal.jsx";
import DeleteAllCedis from "./components/DeleteAllCedis";
import CreateRegionModal from "./components/CreateRegionModal";
import { getClientes, getCedis, getRegiones, createCedis, updateCedis, deleteCedis, createRegion} from "../cedis/services/cedisService.js";



export default function Cedis() {
  const [cedisList, setCedisList] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedCedis, setSelectedCedis] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [searchRegion, setSearchRegion] = useState("");

  useEffect(() => {
  fetchCedis();
  fetchClientes();
  fetchRegiones();
}, []);

const fetchRegiones = async () => {
  try {
    const data = await getRegiones();
    setRegiones(data);
  } catch (error) {
    console.error("Error al cargar regiones:", error);
    setRegiones([]);
  }
};

const fetchClientes = async () => {
  try {
    const data = await getClientes();
    setClientes(data);
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    setClientes([]);
  }
};


const fetchCedis = async () => {
  try {
    const data = await getCedis();
    setCedisList(data);
  } catch (error) {
    console.error("Error cargando cedis:", error);
    setCedisList([]);
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

  const openModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    cleanupModalArtifacts();
    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const hideModal = (modalId, callback) => {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        if (callback) callback();
      },
      { once: true }
    );

    modalInstance.hide();
  };

  const showCreateSuccessModal = (message) => {
    setCreateMessage(message);
    hideModal("createCedisModal", () => {
      openModal("createCedisSuccessModal");
    });
  };

  const showUpdateSuccessModal = (message) => {
    setUpdateMessage(message);
    hideModal("editCedisModal", () => {
      openModal("updateCedisSuccessModal");
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);
    hideModal(sourceModalId, () => {
      openModal("deleteCedisSuccessModal");
    });
  };

  const handleSelectAll = () => {
    const allSelected =
      filteredCedis.length > 0 &&
      filteredCedis.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };
    filteredCedis.forEach((item) => {
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

  const handleOpenEdit = (cedis) => {
    setSelectedCedis(cedis);
    setSelectedId(cedis.id);

    setTimeout(() => {
      openModal("editCedisModal");
    }, 0);
  };

  const handleOpenDeleteOne = (cedis) => {
    setSelectedRows({});
    setSelectedCedis(cedis);
    setSelectedId(cedis.id);

    setTimeout(() => {
      openModal("deleteCedisModal");
    }, 0);
  };

  const handleOpenDeleteSelected = () => {
    setSelectedCedis(null);
    setSelectedId(null);
    openModal("deleteCedisModal");
  };

  const handleOpenDeleteAll = () => {
    setSelectedCedis(null);
    setSelectedId(null);
    openModal("deleteAllCedisModal");
  };

  const handleCreateRegion = async (newRegion) => {
  try {
    await createRegion(newRegion);
    await fetchRegiones();
  } catch (error) {
    console.error("Error al crear región:", error);
    throw error;
  }
};

  const handleCreate = async (newCedis) => {
  try {
    await createCedis(newCedis);
    await fetchCedis();

    showCreateSuccessModal(
      `Se creó con éxito el CEDIS ${newCedis.nombre}.`
    );
  } catch (error) {
    console.error("Error al crear CEDIS:", error);
  }
};

  const handleSaveEdit = async (updatedCedis) => {
  try {
    await updateCedis(selectedId, updatedCedis);
    await fetchCedis();

    showUpdateSuccessModal(
      "Se actualizó correctamente la información del CEDIS."
    );
  } catch (error) {
    console.error("Error al actualizar:", error);
    console.error("Respuesta backend:", error?.response?.data);
    throw error;
  }
};

  const handleDeleteOne = async () => {
  try {
    await deleteCedis(selectedId);
    await fetchCedis();

    showDeleteSuccessModal(
      "Se eliminó correctamente.",
      "deleteCedisModal"
    );
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setCedisList((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
    setSelectedCedis(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 CEDIS."
        : `Se eliminaron con éxito ${count} CEDIS.`,
      "deleteCedisModal"
    );
  };

  const handleDeleteAll = () => {
    const total = cedisList.length;

    setCedisList([]);
    setSelectedRows({});
    setSelectedCedis(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 CEDIS."
        : `Se eliminaron con éxito ${total} CEDIS.`,
      "deleteAllCedisModal"
    );
  };

 const filteredCedis = useMemo(() => {
  const term = search.trim().toLowerCase();

  return cedisList.filter((item) => {
    const nombre = String(item.nombre || "").toLowerCase();
    const cliente = String(item.cliente || "").toLowerCase();
    const region = String(item.region || "").toLowerCase();
    const direccion = String(item.direccion || "").toLowerCase();
    const encargado = String(item.encargado || "").toLowerCase();
    const correo = String(item.correo || "").toLowerCase();
    const telefonoPrincipal = String(item.telefonoPrincipal || "").toLowerCase();
    const telefonoAlternativo = String(item.telefonoAlternativo || "").toLowerCase();

    return (
      !term ||
      nombre.includes(term) ||
      cliente.includes(term) ||
      region.includes(term) ||
      direccion.includes(term) ||
      encargado.includes(term) ||
      correo.includes(term) ||
      telefonoPrincipal.includes(term) ||
      telefonoAlternativo.includes(term)
    );
  });
}, [cedisList, search]);

  const isAllSelected =
    filteredCedis.length > 0 &&
    filteredCedis.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const hasActiveFilters =
    searchCliente.trim() !== "" || searchRegion.trim() !== "";

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de CEDIS</h2>
          <p className="page-title">Administración y control de CEDIS</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
          <>
            <button className="primary-btn" onClick={() => openModal("createRegionModal")}type="button">
              <i className="bi bi-geo-alt"></i>&nbsp;Nueva región</button>

            <button className="primary-btn" onClick={() => openModal("createCedisModal")} type="button">
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo CEDIS</button>
          </>
        ) : (
            <>
              {isAllSelected && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              {selectedCount === filteredCedis.length && filteredCedis.length > 0 ? (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteAll}
                  type="button"
                >
                  <i className="bi bi-trash"></i> ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteSelected}
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  {selectedCount === 1
                    ? " Borrar seleccionado"
                    : ` Borrar (${selectedCount})`}
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
          <div className="toolbar-row flex-wrap gap-2">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Buscar por nombre, cliente, región, encargado, correo o teléfono..." value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                <th>NOMBRE</th>
                <th>DIRECCIÓN</th>
                <th>ENCARGADO</th>
                <th>CORREO</th>
                <th>TELÉFONOS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredCedis.length > 0 ? (
                filteredCedis.map((item) => (
                  <CedisRow
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
                    No se encontraron CEDIS con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>
            Mostrando {filteredCedis.length} de {cedisList.length} registros
          </small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>
              
      <CreateCedisModal onCreate={handleCreate} clientes={clientes} regiones={regiones} />
      <EditCedisModal cedis={selectedCedis} onSave={handleSaveEdit} clientes={clientes} regiones={regiones} />

      <DeleteCedisModal
        cedis={selectedCedis}
        selectedCount={selectedCount}
        onConfirmDelete={selectedCedis ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllCedis
        totalCount={cedisList.length}
        onConfirmDelete={handleDeleteAll}
      />

      <CreateCedisSuccessModal message={createMessage} />
      <CreateRegionModal onCreate={handleCreateRegion} />
      <UpdateCedisSuccessModal message={updateMessage} />
      <DeleteCedisSuccessModal message={deleteMessage} />
    </Admin>
  );
}