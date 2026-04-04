package mx.edu.utez.sivemorapp.modules.costos.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CostoResponseDTO {
    private Long id;

    private Long idCliente;
    private String cliente;

    private Materia materia;
    private BigDecimal costo;

    private Long encargado;
    private String nombreEncargado;

    private Long atiendeYCobra;
    private String nombreAtiendeYCobra;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
