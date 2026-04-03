package mx.edu.utez.sivemorapp.modules.verificaciones.utils;

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
                .dictamen(v.getDictamen() != null ? v.getDictamen().name() : null)
                .activo(v.getActivo())
                .build();
    }

    public static List<VerificacionResponseDTO> toDtoList(List<Verificacion> list) {
        return list.stream().map(VerificacionMapper::toDto).collect(Collectors.toList());
    }
}
