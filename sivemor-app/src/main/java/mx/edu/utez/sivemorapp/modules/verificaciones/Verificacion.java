package mx.edu.utez.sivemorapp.modules.verificaciones;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.evaluaciones.Evaluacion;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "verificaciones")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Verificacion extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_verificacion")
    private Long id;

    @Column(name = "folio_verificacion", nullable = false, unique = true)
    private String folioVerificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota", nullable = false)
    private Notas nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_vehiculo", nullable = false)
    private Vehiculo vehiculo;

    @Enumerated(EnumType.STRING)
    @Column(name = "materia", nullable = false)
    private Materia materia;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "multa")
    private BigDecimal multa;

    @Column(name = "fecha_verificacion")
    private LocalDate fechaVerificacion;

    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "dictamen")
    private Dictamen dictamen;

    @JsonIgnore
    @OneToOne(mappedBy = "verificacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Evaluacion evaluacion;

    @Builder.Default
    @Column(name = "pagado")
    private Boolean pagado = false;


}