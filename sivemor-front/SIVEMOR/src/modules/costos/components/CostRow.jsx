export default function CostRow({ item, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>{item.cliente}</td>
      <td>{item.materia}</td>
      <td>${item.costo}</td>
      <td>{item.encargado}</td>
      <td>{item.atiendeCobra}</td>

      <td>
        <div className="d-flex gap-2 align-items-center">
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
        </div>
      </td>
    </tr>
  );
}