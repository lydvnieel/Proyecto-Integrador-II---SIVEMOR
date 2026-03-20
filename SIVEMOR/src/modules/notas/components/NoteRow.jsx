export default function NoteRow({
  note,
  isSelected,
  onSelect,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>
      <td>{note.nota}</td>
      <td>{note.cliente}</td>
      <td>{note.verificaciones}</td>
      <td>{note.verificentro}</td>
      <td>{note.metodo}</td>
      <td>{note.anticipo}</td>
      <td>
        <span className={`status-pill ${note.pagadoClass}`}>
          {note.pagado}
        </span>
      </td>
      <td>{note.reviso}</td>
      <td>{note.atendio}</td>
      <td>{note.comentario}</td>
      <td>
        <button
          type="button"
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editNoteModal"
          onClick={onEditClick}
        >
          <i className="bi bi-pencil-square"></i>
        </button>

        <button
          type="button"
          className="icon-btn text-danger"
          data-bs-toggle="modal"
          data-bs-target="#deleteNotesModal"
          onClick={onDeleteClick}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}