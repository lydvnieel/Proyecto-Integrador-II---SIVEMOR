package mx.edu.utez.sivemorapp.modules.verificentros.dtos.utils;

import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;
import mx.edu.utez.sivemorapp.modules.verificentros.dtos.VerificentroResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class VerificentroMapper {

    public static VerificentroResponseDTO toDto(Verificentro v) {
        return VerificentroResponseDTO.builder()
                .id(v.getId())
                .idRegion(v.getRegion() != null ? v.getRegion().getId() : null)
                .region(v.getRegion() != null ? v.getRegion().getNombre() : null)
                .nombre(v.getNombre())
                .claveVerificentro(v.getClaveVerificentro())
                .direccion(v.getDireccion())
                .responsable(v.getResponsable())
                .correo(v.getCorreo())
                .telefono(v.getTelefono())
                .telefonoAlternativo(v.getTelefonoAlternativo())
                .horarioGeneral(v.getHorarioGeneral())
                .activo(v.getActivo())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }

    public static List<VerificentroResponseDTO> toDtoList(List<Verificentro> list) {
        return list.stream().map(VerificentroMapper::toDto).collect(Collectors.toList());
    }
}