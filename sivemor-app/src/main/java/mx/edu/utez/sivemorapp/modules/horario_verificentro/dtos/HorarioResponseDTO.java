package mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioResponseDTO {
    private Long id;

    private Long idVerificentro;
    private String nombreVerificentro;
    private String claveVerificentro;

    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
