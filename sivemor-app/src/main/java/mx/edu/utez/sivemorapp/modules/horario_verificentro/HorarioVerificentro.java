package mx.edu.utez.sivemorapp.modules.horario_verificentro;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;
import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;

import java.time.LocalTime;

@Entity
@Table(name = "horario_verificentro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class HorarioVerificentro extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_verificentro", nullable = false)
    private Verificentro verificentro;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana", nullable = false)
    private DiaSemana diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;
}