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
    private String folioNota;

    private TipoPago tipoPago;
    private BigDecimal monto;
    private String cuentaDeposito;
    private String numeroFactura;

    private Boolean pagado;
    private Boolean pendiente;

    private LocalDateTime fechaPedido;
    private String cotizacion;

    private Long reviso;
    private String nombreReviso;

    private Long atendio;
    private String nombreAtendio;

    private String comentario;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}