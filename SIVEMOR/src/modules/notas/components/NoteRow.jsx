export default function NoteRow({ note, isSelected, onSelect, onEdit }) {
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
      <td>
        <em>{note.comentario}</em>
      </td>
      <td>
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editNoteModal"
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