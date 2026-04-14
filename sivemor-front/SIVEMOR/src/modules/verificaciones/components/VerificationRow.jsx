export default function VerificationRow({
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

      <td>{item.gestor}</td>
      <td>{item.razonSocial}</td>
      <td>{item.placa}</td>
      <td>{item.serie}</td>
      <td>{item.materia}</td>
      <td>{item.verificentro}</td>
      <td>{item.precio}</td>
      <td>{item.tipoPago}</td>
      <td>{item.numeroNota}</td>
      <td>{item.cotizacion}</td>
      <td>{item.fechaFolio}</td>
      <td className="fw-semibold">{item.folio}</td>
      <td>{item.cuentaDeposito}</td>
      <td>{item.numeroFactura}</td>

      <td>
        <span className={`status-pill ${item.pagadoClass}`}>
          {item.pagado}
        </span>
      </td>

      <td className={item.pendienteClass}>{item.pendiente}</td>
      <td>{item.fechaPedido}</td>

      <td>
        <div className="d-flex gap-2 align-items-center">
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
        </div>
      </td>
    </tr>
  );
}