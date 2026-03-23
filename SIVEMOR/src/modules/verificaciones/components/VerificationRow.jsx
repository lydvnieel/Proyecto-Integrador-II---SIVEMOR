export default function VerificationRow({
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
        <button
          className="icon-btn"
          data-bs-toggle="modal"
          data-bs-target="#editVerificationModal"
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