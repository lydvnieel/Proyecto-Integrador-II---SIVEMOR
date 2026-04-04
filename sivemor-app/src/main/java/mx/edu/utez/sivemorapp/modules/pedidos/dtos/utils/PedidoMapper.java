package mx.edu.utez.sivemorapp.modules.pedidos.dtos.utils;

import mx.edu.utez.sivemorapp.modules.pedidos.Pedido;
import mx.edu.utez.sivemorapp.modules.pedidos.dtos.PedidoResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class PedidoMapper {

    public static PedidoResponseDTO toDto(Pedido p) {
        return PedidoResponseDTO.builder()
                .id(p.getId())
                .idNota(p.getNota() != null ? p.getNota().getId() : null)
                .folioNota(p.getNota() != null ? p.getNota().getFolioNota() : null)
                .fechaEnvio(p.getFechaEnvio())
                .numeroGuia(p.getNumeroGuia())
                .recibio(p.getRecibio())
                .tieneFoto(p.getFoto() != null && p.getFoto().length > 0)
                .fotoMimeType(p.getFotoMimeType())
                .fotoNombreArchivo(p.getFotoNombreArchivo())
                .fotoTamanoBytes(p.getFotoTamanoBytes())
                .estatusEnvio(p.getEstatusEnvio())
                .comentario(p.getComentario())
                .activo(p.getActivo())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public static List<PedidoResponseDTO> toDtoList(List<Pedido> list) {
        return list.stream().map(PedidoMapper::toDto).collect(Collectors.toList());
    }
}