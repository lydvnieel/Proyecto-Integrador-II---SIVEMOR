package mx.edu.utez.sivemorapp.modules.verificaciones.dtos.utils;

import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.VerificacionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class VerificacionMapper {

    public static VerificacionResponseDTO toDto(Verificacion v) {
        return VerificacionResponseDTO.builder()
                .id(v.getId())
                .folioVerificacion(v.getFolioVerificacion())
                .idNota(v.getNota() != null ? v.getNota().getId() : null)
                .idVehiculo(v.getVehiculo() != null ? v.getVehiculo().getId() : null)
                .materia(v.getMateria() != null ? v.getMateria().name() : null)
                .precio(v.getPrecio())
                .multa(v.getMulta())
                .fechaVerificacion(v.getFechaVerificacion())
                .fechaPedido(v.getFechaPedido())
                .dictamen(v.getDictamen() != null ? v.getDictamen().name() : null)
                .activo(v.getActivo())
                .pagado(v.getPagado())


                .numeroNota(
                        v.getNota() != null ? v.getNota().getFolioNota() : null
                )
                .tipoPago(
                        v.getNota() != null && v.getNota().getTipoPago() != null
                                ? v.getNota().getTipoPago().name()
                                : null
                )
                .verificentro(
                        v.getNota() != null &&
                                v.getNota().getVerificentro() != null
                                ? v.getNota().getVerificentro().getNombre()
                                : null
                )
                .placa(
                        v.getVehiculo() != null ? v.getVehiculo().getPlaca() : null
                )
                .serie(
                        v.getVehiculo() != null ? v.getVehiculo().getSerie() : null
                )
                .razonSocial(
                        v.getVehiculo() != null &&
                                v.getVehiculo().getCliente() != null
                                ? v.getVehiculo().getCliente().getRazonSocial()
                                : null
                )
                .gestor(
                        v.getVehiculo() != null &&
                                v.getVehiculo().getCliente() != null
                                ? v.getVehiculo().getCliente().getGestor()
                                : null
                )
                .build();
    }

    public static List<VerificacionResponseDTO> toDtoList(List<Verificacion> list) {
        return list.stream().map(VerificacionMapper::toDto).collect(Collectors.toList());
    }
}