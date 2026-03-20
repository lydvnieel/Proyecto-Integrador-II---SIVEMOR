export default function OrderRow({ item, isSelected, onSelect, onEdit }) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>{item.nota}</td>
      <td>{item.fechaEnvio}</td>
      <td>{item.numeroGuia}</td>
      <td>{item.recibio}</td>

      <td>
        {item.foto !== "Sin foto" ? (
          <a href="#">{item.foto}</a>
        ) : (
          <span className="text-muted">Sin foto</span>
        )}
      </td>

      <td>
        <span className={`status-pill ${item.estatusClass}`}>
          {item.estatusEnvio}
        </span>
      </td>

      <td>{item.comentario}</td>

      <td>
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editOrderModal"
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