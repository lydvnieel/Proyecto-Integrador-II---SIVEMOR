import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import VerificentroRow from "./components/VerificentroRow";
import CreateVerificentroModal from "./components/CreateVerificentroModal";
import EditVerificentroModal from "./components/EditVerificentroModal";
import DeleteVerificentroModal from "./components/DeleteVerificentroModal";
import DeleteAllVerificentrosModal from "./components/DeleteAllVerificentrosModal";
import CreateSuccessModal from "./components/CreateSuccessModal";
import DeleteSuccessModal from "./components/DeleteSuccessModal";
import EditSuccessModal from "./components/EditSuccessModal";
import { getVerificentros, createVerificentro, updateVerificentro, deleteVerificentro,} from "../verificentros/services/verificentroServices";
import { api } from "../../../server/api";

export default function Verificentros() {
  const [verificentros, setVerificentros] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [verificentrosData, regionesRes] = await Promise.all([
        getVerificentros(),
        api.get("/regiones"),
      ]);

      const regionesData = Array.isArray(regionesRes?.data?.data)
        ? regionesRes.data.data
        : Array.isArray(regionesRes?.data)
        ? regionesRes.data
        : [];

      setVerificentros(verificentrosData);
      setRegiones(regionesData);
    } catch (error) {
      console.error("Error cargando verificentros:", error);
    } finally {
      setLoading(false);
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

  const showDeleteSuccessModal = (message, sourceId) => {
    setDeleteMessage(message);

    const source = document.getElementById(sourceId);
    const success = document.getElementById("deleteVerificentroSuccessModal");

    if (!source || !success) return;

    const sourceInstance = Modal.getOrCreateInstance(source);
    const successInstance = Modal.getOrCreateInstance(success);

    source.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successInstance.show();
      },
      { once: true }
    );

    sourceInstance.hide();
  };

  const showEditSuccessModal = (message, sourceId) => {
    setEditMessage(message);

    const source = document.getElementById(sourceId);
    const success = document.getElementById("editVerificentroSuccessModal");

    if (!source || !success) return;

    const sourceInstance = Modal.getOrCreateInstance(source);
    const successInstance = Modal.getOrCreateInstance(success);

    source.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successInstance.show();
      },
      { once: true }
    );

    sourceInstance.hide();
  };

  const filteredVerificentros = useMemo(() => {
    return verificentros.filter((item) => {
      const matchesName = (item.nombre || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesRegion = regionFilter
        ? String(item.idRegion) === String(regionFilter)
        : true;

      return matchesName && matchesRegion;
    });
  }, [verificentros, searchTerm, regionFilter]);

  const handleSelectAll = () => {
    const allSelected =
      filteredVerificentros.length > 0 &&
      filteredVerificentros.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };

    filteredVerificentros.forEach((item) => {
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
    setCurrentItem(item);
    setCurrentId(item.id);
  };

  const handleOpenDeleteOne = (item) => {
    setCurrentItem(item);
    setCurrentId(item.id);
  };

  const handleCreate = async (newItem) => {
    try {
      const createdItem = await createVerificentro(newItem);
      setVerificentros((prev) => [...prev, createdItem]);
      setCreateMessage(`Se creó con éxito el verificentro ${createdItem.nombre}.`);
      return createdItem;
    } catch (error) {
      console.error("Error creando verificentro:", error);
      throw error;
    }
  };

  const handleSaveEdit = async (updatedItem) => {
    if (currentId === null) return;

    try {
      const updated = await updateVerificentro(currentId, updatedItem);

      setVerificentros((prev) =>
        prev.map((item) => (item.id === currentId ? updated : item))
      );

      setCurrentItem(updated);

      showEditSuccessModal(
        "Se actualizó el verificentro correctamente.",
        "editVerificentroModal"
      );
    } catch (error) {
      console.error("Error actualizando verificentro:", error);
      alert(error.message || "No se pudo actualizar el verificentro.");
    }
  };

  const handleDeleteOne = async () => {
    if (currentId === null) return;

    try {
      const deletedName = currentItem?.nombre || "el verificentro";

      await deleteVerificentro(currentId);

      setVerificentros((prev) => prev.filter((item) => item.id !== currentId));

      setSelectedRows((prev) => {
        const updated = { ...prev };
        delete updated[currentId];
        return updated;
      });

      setCurrentItem(null);
      setCurrentId(null);

      showDeleteSuccessModal(
        `Se eliminó con éxito ${deletedName}.`,
        "deleteVerificentroModal"
      );
    } catch (error) {
      console.error("Error eliminando verificentro:", error);
      alert(error.message || "No se pudo eliminar el verificentro.");
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    try {
      await Promise.all(idsToDelete.map((id) => deleteVerificentro(id)));

      const count = idsToDelete.length;

      setVerificentros((prev) =>
        prev.filter((item) => !idsToDelete.includes(item.id))
      );

      setSelectedRows({});
      setCurrentItem(null);
      setCurrentId(null);

      showDeleteSuccessModal(
        count === 1
          ? "Se eliminó con éxito 1 verificentro."
          : `Se eliminaron con éxito ${count} verificentros.`,
        "deleteVerificentroModal"
      );
    } catch (error) {
      console.error("Error eliminando múltiples verificentros:", error);
      alert(error.message || "No se pudieron eliminar los verificentros.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const ids = verificentros.map((v) => v.id);

      await Promise.all(ids.map((id) => deleteVerificentro(id)));

      const total = verificentros.length;

      setVerificentros([]);
      setSelectedRows({});
      setCurrentItem(null);
      setCurrentId(null);

      showDeleteSuccessModal(
        total === 1
          ? "Se eliminó con éxito 1 verificentro."
          : `Se eliminaron con éxito ${total} verificentros.`,
        "deleteAllVerificentroModal"
      );
    } catch (error) {
      console.error("Error eliminando todos los verificentros:", error);
      alert(error.message || "No se pudieron eliminar todos los verificentros.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRegionFilter("");
  };

  const isAllSelected =
    filteredVerificentros.length > 0 &&
    filteredVerificentros.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Verificentros</h2>
          <p className="page-title">
            Administración y control de verificentros
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createVerificentroModal"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Verificentro
            </button>
          ) : (
            <>
              {isAllSelected && filteredVerificentros.length > 0 && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              {selectedCount === verificentros.length ? (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteAllVerificentroModal"
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteVerificentroModal"
                  type="button"
                  onClick={() => {
                    setCurrentItem(null);
                    setCurrentId(null);
                  }}
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
            <input
              type="text"
              placeholder="Buscar verificentro por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ maxWidth: "220px" }}
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="">Todas las regiones</option>
            {regiones.map((region) => (
              <option
                key={region.id ?? region.idRegion}
                value={region.id ?? region.idRegion}
              >
                {region.nombre ?? region.region ?? region.nombreRegion}
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
                <th>NOMBRE</th>
                <th>CLAVE</th>
                <th>DIRECCIÓN</th>
                <th>REGIÓN</th>
                <th>RESPONSABLE</th>
                <th>CORREO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Cargando verificentros...
                  </td>
                </tr>
              ) : filteredVerificentros.length > 0 ? (
                filteredVerificentros.map((item) => (
                  <VerificentroRow
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
                  <td colSpan="8" className="text-center py-4">
                    No se encontraron verificentros con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>
            Mostrando {filteredVerificentros.length} de {verificentros.length} registros
          </small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateVerificentroModal onCreate={handleCreate} regiones={regiones} />
      <EditVerificentroModal item={currentItem} onSave={handleSaveEdit} regiones={regiones} />

      <DeleteVerificentroModal
        item={currentItem}
        selectedCount={selectedCount}
        totalCount={verificentros.length}
        onDelete={currentItem ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllVerificentrosModal
        totalCount={verificentros.length}
        onConfirmDelete={handleDeleteAll}
      />

      <CreateSuccessModal message={createMessage} />
      <DeleteSuccessModal message={deleteMessage} />
      <EditSuccessModal message={editMessage} />
    </Admin>
  );
}