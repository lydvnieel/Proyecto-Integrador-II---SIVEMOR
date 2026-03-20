export default function ClientRow({ item, isSelected, onSelect, onEdit }) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-building text-primary"></i>
          <span>{item.razonSocial}</span>
        </div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-envelope text-secondary"></i>
          <span>{item.correo}</span>
        </div>
      </td>

      <td>
        <div className="d-flex flex-column">
          <span>
            <i className="bi bi-telephone text-secondary"></i>&nbsp;{item.telefonoPrincipal}
          </span>

          {item.telefonoAlternativo && (
            <span className="text-muted">
              <i className="bi bi-telephone text-secondary"></i>&nbsp;{item.telefonoAlternativo}
            </span>
          )}
        </div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person text-secondary"></i>
          <span>{item.gestor}</span>
        </div>
      </td>

      <td>
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editClientModal"
          onClick={onEdit}
        >
          <i className="bi bi-pencil-square"></i>
        </button>

        <button className="icon-btn text-danger">
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}