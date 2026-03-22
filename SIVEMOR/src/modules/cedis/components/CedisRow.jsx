export default function CedisRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-file-earmark-text text-primary"></i>
          <span>{item.nombre}</span>
        </div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-geo-alt text-secondary"></i>
          <span>{item.direccion}</span>
        </div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person text-secondary"></i>
          <span>{item.encargado}</span>
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
            <i className="bi bi-telephone text-secondary"></i>
            &nbsp;{item.telefonoPrincipal}
          </span>

          {item.telefonoAlternativo && (
            <span className="text-muted">
              <i className="bi bi-telephone text-secondary"></i>
              &nbsp;{item.telefonoAlternativo}
            </span>
          )}
        </div>
      </td>

      <td>
        <button
          className="icon-btn"
          onClick={onEdit}
          type="button"
        >
          <i className="bi bi-pencil-square"></i>
        </button>

        <button
          className="icon-btn text-danger"
          onClick={onDelete}
          type="button"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}