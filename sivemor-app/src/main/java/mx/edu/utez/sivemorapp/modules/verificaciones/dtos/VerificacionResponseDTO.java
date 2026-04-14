package mx.edu.utez.sivemorapp.modules.verificaciones.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private LocalDateTime fechaPedido;
    private String dictamen;
    private Boolean activo;
    private Boolean pagado;

    private String numeroNota;
    private String placa;
    private String serie;
    private String razonSocial;
    private String gestor;
    private String verificentro;
    private String tipoPago;
}
