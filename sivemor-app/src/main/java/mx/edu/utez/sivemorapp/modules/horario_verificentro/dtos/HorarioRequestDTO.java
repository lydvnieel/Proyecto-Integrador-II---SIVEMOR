package mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HorarioRequestDTO {
    private Long id;
    private Long idVerificentro;
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
