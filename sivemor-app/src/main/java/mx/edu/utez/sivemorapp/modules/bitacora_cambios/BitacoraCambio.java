package mx.edu.utez.sivemorapp.modules.bitacora_cambios;

import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_cambios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BitacoraCambio extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bitacora")
    private Long id;

    @Column(name = "tabla_afectada", nullable = false)
    private String tablaAfectada;

    @Column(name = "id_registro", nullable = false)
    private Integer idRegistro;

    @Column(name = "accion", nullable = false)
    private String accion;

    @Column(name = "detalle")
    private String detalle;

    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    @Column(name = "id_usuario_sistema")
    private Integer idUsuarioSistema;
}