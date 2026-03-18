export default function VehicleRow({vehicle, isSelected, onSelect, onDeleteClick, onEditClick,}) {
    if (!vehicle) return null;

return (
    <tr>
    <td>
        <input type="checkbox" checked={isSelected}onChange={onSelect} className="form-check-input"
        />
    </td>

    <td>{vehicle.placa}</td>
    <td>{vehicle.serie}</td>
    <td>{vehicle.cedis}</td>

    <td>
        <span className="badge rounded-pill text-dark bg-light border">{vehicle.region}</span>
    </td>

    <td className="text-start">
    <button type="button" className="btn btn-link text-secondary p-0 me-3" data-bs-toggle="modal" data-bs-target="#editVehicleModal"
        onClick={onEditClick}><i className="bi bi-pencil-square"></i></button>

        <button type="button" className="btn btn-link text-danger p-0" data-bs-toggle="modal" data-bs-target="#deleteVehicleModal"
            onClick={onDeleteClick}><i className="bi bi-trash"></i></button>
    </td>
    </tr>);
}