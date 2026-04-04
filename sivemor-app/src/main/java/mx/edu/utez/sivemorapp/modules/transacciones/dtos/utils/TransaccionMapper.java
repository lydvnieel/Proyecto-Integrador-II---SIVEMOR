package mx.edu.utez.sivemorapp.modules.transacciones.dtos.utils;

import mx.edu.utez.sivemorapp.modules.transacciones.Transaccion;
import mx.edu.utez.sivemorapp.modules.transacciones.dtos.TransaccionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class TransaccionMapper {

    public static TransaccionResponseDTO toDto(Transaccion t) {
        return TransaccionResponseDTO.builder()
                .id(t.getId())
                .idNota(t.getNota() != null ? t.getNota().getId() : null)
                .folioNota(t.getNota() != null ? t.getNota().getFolioNota() : null)
                .tipoPago(t.getTipoPago())
                .monto(t.getMonto())
                .cuentaDeposito(t.getCuentaDeposito())
                .numeroFactura(t.getNumeroFactura())
                .pagado(t.getPagado())
                .pendiente(t.getPendiente())
                .fechaPedido(t.getFechaPedido())
                .cotizacion(t.getCotizacion())
                .reviso(t.getReviso() != null ? t.getReviso().getId() : null)
                .nombreReviso(t.getReviso() != null ? t.getReviso().getNombreUsuario() : null)
                .atendio(t.getAtendio() != null ? t.getAtendio().getId() : null)
                .nombreAtendio(t.getAtendio() != null ? t.getAtendio().getNombreUsuario() : null)
                .comentario(t.getComentario())
                .activo(t.getActivo())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }

    public static List<TransaccionResponseDTO> toDtoList(List<Transaccion> list) {
        return list.stream().map(TransaccionMapper::toDto).collect(Collectors.toList());
    }
}