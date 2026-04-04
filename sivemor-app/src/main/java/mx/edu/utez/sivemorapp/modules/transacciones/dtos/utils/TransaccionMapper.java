package mx.edu.utez.sivemorapp.modules.transacciones.dtos.utils;

import mx.edu.utez.sivemorapp.modules.transacciones.Transaccion;
import mx.edu.utez.sivemorapp.modules.transacciones.dtos.TransaccionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class TransaccionMapper {

    public static TransaccionResponseDTO toDto(Transaccion t) {
        return TransaccionResponseDTO.builder()
                .id(t.getId())
                .idNota(t.getNota().getId())
                .tipoPago(t.getTipoPago())
                .monto(t.getMonto())
                .numeroFactura(t.getNumeroFactura())
                .pagado(t.getPagado())
                .pendiente(t.getPendiente())
                .fechaPedido(t.getFechaPedido())
                .build();
    }

    public static List<TransaccionResponseDTO> toList(List<Transaccion> list) {
        return list.stream().map(TransaccionMapper::toDto).collect(Collectors.toList());
    }
}