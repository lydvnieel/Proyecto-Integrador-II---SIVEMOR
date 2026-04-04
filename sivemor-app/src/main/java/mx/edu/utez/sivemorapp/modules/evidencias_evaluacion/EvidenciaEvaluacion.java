package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion;

import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.evaluaciones.Evaluacion;

@Entity
@Table(name = "evidencias_evaluacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaEvaluacion extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evidencia")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion", nullable = false)
    private Evaluacion evaluacion;

    @Column(name = "numero_evidencia", nullable = false)
    private Integer numeroEvidencia;

    @Lob
    @Column(name = "imagen")
    private byte[] imagen;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    @Column(name = "tamano_bytes")
    private Integer tamanoBytes;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "activo")
    private Boolean activo;
}