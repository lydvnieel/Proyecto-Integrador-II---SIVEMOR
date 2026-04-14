package mx.edu.utez.sivemorapp.modules.verificaciones.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificacionRequestDTO {
    private Long id;
    private Long idNota;
    private Long idVehiculo;
    private String materia;
    private BigDecimal precio;
    private BigDecimal multa;
    private Boolean pagado;
    private String dictamen;
    private LocalDate fechaVerificacion;
}