package mx.edu.utez.sivemorapp.modules.notas.dtos.utils;

import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.notas.dtos.NotaResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class NotaMapper {

    public static NotaResponseDTO toDto(Notas n) {
        return NotaResponseDTO.builder()
                .id(n.getId())
                .folioNota(n.getFolioNota())
                .idCliente(n.getCliente() != null ? n.getCliente().getId() : null)
                .cliente(n.getCliente() != null ? n.getCliente().getRazonSocial() : null)
                .idVerificentro(n.getVerificentro() != null ? n.getVerificentro().getId() : null)
                .verificentro(n.getVerificentro() != null ? n.getVerificentro().getNombre() : null)
                .tipoPago(n.getTipoPago())
                .anticipo(n.getAnticipo())
                .pagadoCompleto(n.getPagadoCompleto())
                .atendio(n.getAtendio() != null ? n.getAtendio().getId() : null)
                .nombreAtendio(n.getAtendio() != null ? n.getAtendio().getNombreUsuario() : null)
                .reviso(n.getReviso() != null ? n.getReviso().getId() : null)
                .nombreReviso(n.getReviso() != null ? n.getReviso().getNombreUsuario() : null)
                .comentario(n.getComentario())
                .numeroVerificaciones(n.getNumeroVerificaciones())
                .fechaCreacion(n.getFechaCreacion())
                .activo(n.getActivo())
                .createdAt(n.getCreatedAt())
                .updatedAt(n.getUpdatedAt())
                .build();
    }

    public static List<NotaResponseDTO> toDtoList(List<Notas> list) {
        return list.stream().map(NotaMapper::toDto).collect(Collectors.toList());
    }
}