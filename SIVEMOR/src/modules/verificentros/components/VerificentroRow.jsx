export default function VerificentroRow({
  item,
  isSelected,
  onSelect,
  onEdit,
}) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>{item.nombre}</td>
      <td>{item.clave}</td>
      <td>{item.direccion}</td>
      <td>{item.region}</td>
      <td>{item.responsable}</td>
      <td>{item.correo}</td>

      <td>
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editVerificentroModal"
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