package mx.edu.utez.sivemorapp.modules.costos.dtos;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostoRequestDTO {
    private Long id;
    private Long idCliente;
    private Materia materia;
    private BigDecimal costo;
    private Long encargado;
    private Long atiendeYCobra;
}