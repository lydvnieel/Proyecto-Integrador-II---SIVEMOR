export default function TransactionRow({ item, isSelected, onSelect, onEdit }) {
  return (
    <tr>
      <td className="checkbox-cell">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>

      <td>{item.nota}</td>

      <td>
        <span className="status-pill status-neutral">{item.tipoPago}</span>
      </td>

      <td>{item.monto}</td>
      <td>{item.cuentaDeposito}</td>
      <td>{item.factura}</td>

      <td>
        <span className={`status-pill ${item.pagadoClass}`}>
          {item.pagado}
        </span>
      </td>

      <td>{item.fechaPedido}</td>
      <td>{item.cotizacion}</td>
      <td>{item.reviso}</td>
      <td>{item.atendio}</td>

      <td>
        <span className={`status-pill ${item.pendienteClass}`}>
          {item.pendiente}
        </span>
      </td>

      <td>{item.comentario}</td>

      <td>
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editTransactionModal"
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