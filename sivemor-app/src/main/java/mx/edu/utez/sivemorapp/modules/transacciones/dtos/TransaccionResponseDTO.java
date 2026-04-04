package mx.edu.utez.sivemorapp.modules.transacciones.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionResponseDTO {

    private Long id;
    private Long idNota;
    private TipoPago tipoPago;
    private BigDecimal monto;
    private String numeroFactura;
    private Boolean pagado;
    private Boolean pendiente;
    private LocalDateTime fechaPedido;
}