package mx.edu.utez.sivemorapp.modules.notas.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaResponseDTO {
    private Long id;
    private String folioNota;
    private Long idCliente;
    private String cliente;
    private Long idVerificentro;
    private String verificentro;
    private TipoPago tipoPago;
    private BigDecimal anticipo;
    private Boolean pagadoCompleto;
    private Long atendio;
    private String nombreAtendio;
    private Long reviso;
    private String nombreReviso;
    private String comentario;
    private Integer numeroVerificaciones;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}