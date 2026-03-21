export default function ClientRow({
  client,
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

      <td>{client.nombre}</td>
      <td>{client.rfc}</td>
      <td>{client.telefono}</td>
      <td>{client.correo}</td>
      <td>{client.direccion}</td>

      <td>
        <button className="icon-btn" onClick={onEdit} type="button">
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