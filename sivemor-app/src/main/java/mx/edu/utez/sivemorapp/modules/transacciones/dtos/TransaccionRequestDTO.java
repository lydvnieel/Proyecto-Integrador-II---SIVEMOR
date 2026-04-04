package mx.edu.utez.sivemorapp.modules.transacciones.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionRequestDTO {

    private Long idNota;
    private TipoPago tipoPago;
    private BigDecimal monto;
    private String cuentaDeposito;
    private String numeroFactura;
    private Boolean pagado;
    private Boolean pendiente;
    private String cotizacion;
    private Long reviso;
    private Long atendio;
    private String comentario;
}