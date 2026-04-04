package mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.utils;

import mx.edu.utez.sivemorapp.modules.horario_verificentro.HorarioVerificentro;
import mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.HorarioResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class HorarioMapper {

    public static HorarioResponseDTO toDto(HorarioVerificentro h) {
        return HorarioResponseDTO.builder()
                .id(h.getId())
                .idVerificentro(h.getVerificentro() != null ? h.getVerificentro().getId() : null)
                .nombreVerificentro(h.getVerificentro() != null ? h.getVerificentro().getNombre() : null)
                .claveVerificentro(h.getVerificentro() != null ? h.getVerificentro().getClaveVerificentro() : null)
                .diaSemana(h.getDiaSemana())
                .horaInicio(h.getHoraInicio())
                .horaFin(h.getHoraFin())
                .activo(h.getActivo())
                .createdAt(h.getCreatedAt())
                .updatedAt(h.getUpdatedAt())
                .build();
    }

    public static List<HorarioResponseDTO> toDtoList(List<HorarioVerificentro> list) {
        return list.stream().map(HorarioMapper::toDto).collect(Collectors.toList());
    }
}