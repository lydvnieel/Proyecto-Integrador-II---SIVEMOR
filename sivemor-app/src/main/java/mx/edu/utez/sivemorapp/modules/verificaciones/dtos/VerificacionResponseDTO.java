package mx.edu.utez.sivemorapp.modules.verificaciones.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerificacionResponseDTO {
    private Long id;
    private String folioVerificacion;
    private Long idNota;
    private Long idVehiculo;
    private String materia;
    private BigDecimal precio;
    private BigDecimal multa;
    private LocalDate fechaVerificacion;
    private String dictamen;
    private Boolean activo;
}
