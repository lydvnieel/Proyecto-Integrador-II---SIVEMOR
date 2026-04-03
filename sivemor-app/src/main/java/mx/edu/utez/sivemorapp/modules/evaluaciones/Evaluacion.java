package mx.edu.utez.sivemorapp.modules.evaluaciones;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.*;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.EvidenciaEvaluacion;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evaluaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Evaluacion extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_verificacion", nullable = false, unique = true)
    private Verificacion verificacion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tecnico", nullable = false)
    private Usuario tecnico;

    // A. Luces
    @Enumerated(EnumType.STRING)
    @Column(name = "luces_galibo")
    private EstadoLuces lucesGalibo;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_altas")
    private EstadoLuces lucesAltas;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_bajas")
    private EstadoLuces lucesBajas;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_demarcadoras_delanteras")
    private EstadoLuces lucesDemarcadorasDelanteras;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_demarcadoras_traseras")
    private EstadoLuces lucesDemarcadorasTraseras;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_indicadoras")
    private LucesIndicadoras lucesIndicadoras;

    @Enumerated(EnumType.STRING)
    @Column(name = "faro_izquierdo")
    private EstadoFaros faroIzquierdo;

    @Enumerated(EnumType.STRING)
    @Column(name = "faro_derecho")
    private EstadoFaros faroDerecho;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_direccionales_delanteras")
    private EstadoLuces lucesDireccionalesDelanteras;

    @Enumerated(EnumType.STRING)
    @Column(name = "luces_direccionales_traseras")
    private EstadoLuces lucesDireccionalesTraseras;

    // B. Llantas
    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_rines_delanteros")
    private EstadoRines llantasRinesDelanteros;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_rines_traseros")
    private EstadoRines llantasRinesTraseros;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_masas_delanteras")
    private EstadoMasas llantasMasasDelanteras;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_masas_traseras")
    private EstadoMasas llantasMasasTraseras;

    @Column(name = "llantas_presion_delantera_izquierda", precision = 5, scale = 2)
    private BigDecimal llantasPresionDelanteraIzquierda;

    @Column(name = "llantas_presion_delantera_derecha", precision = 5, scale = 2)
    private BigDecimal llantasPresionDelanteraDerecha;

    @Column(name = "llantas_presion_trasera_izquierda_1", precision = 5, scale = 2)
    private BigDecimal llantasPresionTraseraIzquierda1;

    @Column(name = "llantas_presion_trasera_izquierda_2", precision = 5, scale = 2)
    private BigDecimal llantasPresionTraseraIzquierda2;

    @Column(name = "llantas_presion_trasera_derecha_1", precision = 5, scale = 2)
    private BigDecimal llantasPresionTraseraDerecha1;

    @Column(name = "llantas_presion_trasera_derecha_2", precision = 5, scale = 2)
    private BigDecimal llantasPresionTraseraDerecha2;

    @Column(name = "llantas_profundidad_delantera_izquierda", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadDelanteraIzquierda;

    @Column(name = "llantas_profundidad_delantera_derecha", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadDelanteraDerecha;

    @Column(name = "llantas_profundidad_trasera_izquierda_1", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadTraseraIzquierda1;

    @Column(name = "llantas_profundidad_trasera_izquierda_2", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadTraseraIzquierda2;

    @Column(name = "llantas_profundidad_trasera_derecha_1", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadTraseraDerecha1;

    @Column(name = "llantas_profundidad_trasera_derecha_2", precision = 5, scale = 2)
    private BigDecimal llantasProfundidadTraseraDerecha2;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_birlos_delantera_izquierda")
    private EstadoBirlos llantasBirlosDelanteraIzquierda;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_birlos_delantera_derecha")
    private EstadoBirlos llantasBirlosDelanteraDerecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_birlos_trasera_izquierda")
    private EstadoBirlos llantasBirlosTraseraIzquierda;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_birlos_trasera_derecha")
    private EstadoBirlos llantasBirlosTraseraDerecha;

    @Column(name = "llantas_birlos_delantera_izquierda_num", nullable = false)
    @Builder.Default
    private Integer llantasBirlosDelanteraIzquierdaNum = 0;


    @Column(name = "llantas_birlos_delantera_derecha_num", nullable = false)
    @Builder.Default
    private Integer llantasBirlosDelanteraDerechaNum = 0;

    @Column(name = "llantas_birlos_trasera_izquierda_num", nullable = false)
    @Builder.Default
    private Integer llantasBirlosTraseraIzquierdaNum = 0;

    @Column(name = "llantas_birlos_trasera_derecha_num", nullable = false)
    @Builder.Default
    private Integer llantasBirlosTraseraDerechaNum = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_tuercas_delantera_izquierda")
    private EstadoTuercas llantasTuercasDelanteraIzquierda;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_tuercas_delantera_derecha")
    private EstadoTuercas llantasTuercasDelanteraDerecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_tuercas_trasera_izquierda")
    private EstadoTuercas llantasTuercasTraseraIzquierda;

    @Enumerated(EnumType.STRING)
    @Column(name = "llantas_tuercas_trasera_derecha")
    private EstadoTuercas llantasTuercasTraseraDerecha;

    @Column(name = "llantas_tuercas_delantera_izquierda_num", nullable = false)
    @Builder.Default
    private Integer llantasTuercasDelanteraIzquierdaNum = 0;

    @Column(name = "llantas_tuercas_delantera_derecha_num", nullable = false)
    @Builder.Default
    private Integer llantasTuercasDelanteraDerechaNum = 0;

    @Column(name = "llantas_tuercas_trasera_izquierda_num", nullable = false)
    @Builder.Default
    private Integer llantasTuercasTraseraIzquierdaNum = 0;

    @Column(name = "llantas_tuercas_trasera_derecha_num", nullable = false)
    @Builder.Default
    private Integer llantasTuercasTraseraDerechaNum = 0;

    // C. Dirección, estructura y accesos
    @Enumerated(EnumType.STRING)
    @Column(name = "brazo_pitman")
    private EstadoBrazoPitman brazoPitman;

    @Enumerated(EnumType.STRING)
    @Column(name = "manijas_de_puertas")
    private EstadoManijas manijasDePuertas;

    @Enumerated(EnumType.STRING)
    @Column(name = "chavetas")
    private EstadoChavetas chavetas;

    @Column(name = "chavetas_num", nullable = false)
    @Builder.Default
    private Integer chavetasNum = 0;

    // D. Sistema de aire / frenos
    @Enumerated(EnumType.STRING)
    @Column(name = "compresor")
    private EstadoCompresor compresor;

    @Enumerated(EnumType.STRING)
    @Column(name = "tanques_de_aire")
    private EstadoTanqueAire tanquesDeAire;

    @Column(name = "tiempo_de_carga_psi", precision = 6, scale = 2)
    private BigDecimal tiempoDeCargaPsi;

    @Column(name = "tiempo_de_carga_tiempo", precision = 6, scale = 2)
    private BigDecimal tiempoDeCargaTiempo;

    // E. Motor y emisiones
    @Enumerated(EnumType.STRING)
    @Column(name = "humo")
    private Dictamen humo;

    @Enumerated(EnumType.STRING)
    @Column(name = "gobernado")
    private Dictamen gobernado;

    // F. Otros
    @Enumerated(EnumType.STRING)
    @Column(name = "caja_direccion")
    private EstadoFuga cajaDireccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "deposito_aceite")
    private EstadoFuga depositoAceite;

    @Enumerated(EnumType.STRING)
    @Column(name = "parabrisas")
    private EstadoParabrisas parabrisas;

    @Enumerated(EnumType.STRING)
    @Column(name = "limpiaparabrisas")
    private EstadoLimpiaparabrisas limpiaparabrisas;

    @Enumerated(EnumType.STRING)
    @Column(name = "huelgo")
    private Dictamen huelgo;

    @Column(name = "huelgo_cuanto", precision = 6, scale = 2)
    private BigDecimal huelgoCuanto;

    @Enumerated(EnumType.STRING)
    @Column(name = "escape")
    private EstadoEscape escape;

    // Resultado y observaciones
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_final")
    private Dictamen resultadoFinal;

    @Column(name = "comentarios", columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_evaluacion", nullable = false)
    private LocalDateTime fechaEvaluacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;


    // Relación con evidencias
    @JsonIgnore
    @OneToMany(mappedBy = "evaluacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EvidenciaEvaluacion> evidencias;
}