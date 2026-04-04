package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos.utils;

import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.EvidenciaEvaluacion;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos.EvidenciaEvaluacionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class EvidenciaEvaluacionMapper {

    public static EvidenciaEvaluacionResponseDTO toDto(EvidenciaEvaluacion e) {
        return EvidenciaEvaluacionResponseDTO.builder()
                .id(e.getId())
                .idEvaluacion(e.getEvaluacion() != null ? e.getEvaluacion().getId() : null)
                .idVerificacion(
                        e.getEvaluacion() != null && e.getEvaluacion().getVerificacion() != null
                                ? e.getEvaluacion().getVerificacion().getId()
                                : null
                )
                .numeroEvidencia(e.getNumeroEvidencia())
                .tieneImagen(e.getImagen() != null && e.getImagen().length > 0)
                .mimeType(e.getMimeType())
                .nombreArchivo(e.getNombreArchivo())
                .tamanoBytes(e.getTamanoBytes())
                .comentario(e.getComentario())
                .activo(e.getActivo())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    public static List<EvidenciaEvaluacionResponseDTO> toDtoList(List<EvidenciaEvaluacion> list) {
        return list.stream().map(EvidenciaEvaluacionMapper::toDto).collect(Collectors.toList());
    }
}