package mx.edu.utez.sivemorapp.modules.notas.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaRequestDTO {
    private Long id;
    private Long idCliente;
    private Long idVerificentro;
    private TipoPago tipoPago;
    private BigDecimal anticipo;
    private Boolean pagadoCompleto;
    private Long atendio;
    private Long reviso;
    private String comentario;
}