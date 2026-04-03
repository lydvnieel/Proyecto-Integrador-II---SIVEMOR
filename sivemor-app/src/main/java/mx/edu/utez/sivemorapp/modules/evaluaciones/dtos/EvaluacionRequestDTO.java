package mx.edu.utez.sivemorapp.modules.evaluaciones.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.enums.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluacionRequestDTO {
    private Long id;
    private Long idVerificacion;
    private Long idTecnico;

    private EstadoLuces lucesGalibo;
    private EstadoLuces lucesAltas;
    private EstadoLuces lucesBajas;
    private EstadoLuces lucesDemarcadorasDelanteras;
    private EstadoLuces lucesDemarcadorasTraseras;
    private LucesIndicadoras lucesIndicadoras;
    private EstadoFaros faroIzquierdo;
    private EstadoFaros faroDerecho;
    private EstadoLuces lucesDireccionalesDelanteras;
    private EstadoLuces lucesDireccionalesTraseras;

    private EstadoRines llantasRinesDelanteros;
    private EstadoRines llantasRinesTraseros;
    private EstadoMasas llantasMasasDelanteras;
    private EstadoMasas llantasMasasTraseras;

    private BigDecimal llantasPresionDelanteraIzquierda;
    private BigDecimal llantasPresionDelanteraDerecha;
    private BigDecimal llantasPresionTraseraIzquierda1;
    private BigDecimal llantasPresionTraseraIzquierda2;
    private BigDecimal llantasPresionTraseraDerecha1;
    private BigDecimal llantasPresionTraseraDerecha2;

    private BigDecimal llantasProfundidadDelanteraIzquierda;
    private BigDecimal llantasProfundidadDelanteraDerecha;
    private BigDecimal llantasProfundidadTraseraIzquierda1;
    private BigDecimal llantasProfundidadTraseraIzquierda2;
    private BigDecimal llantasProfundidadTraseraDerecha1;
    private BigDecimal llantasProfundidadTraseraDerecha2;

    private EstadoBirlos llantasBirlosDelanteraIzquierda;
    private EstadoBirlos llantasBirlosDelanteraDerecha;
    private EstadoBirlos llantasBirlosTraseraIzquierda;
    private EstadoBirlos llantasBirlosTraseraDerecha;

    @Builder.Default
    private Integer llantasBirlosDelanteraIzquierdaNum = 0;
    @Builder.Default
    private Integer llantasBirlosDelanteraDerechaNum = 0;
    @Builder.Default
    private Integer llantasBirlosTraseraIzquierdaNum = 0;
    @Builder.Default
    private Integer llantasBirlosTraseraDerechaNum = 0;

    private EstadoTuercas llantasTuercasDelanteraIzquierda;
    private EstadoTuercas llantasTuercasDelanteraDerecha;
    private EstadoTuercas llantasTuercasTraseraIzquierda;
    private EstadoTuercas llantasTuercasTraseraDerecha;

    @Builder.Default
    private Integer llantasTuercasDelanteraIzquierdaNum = 0;
    @Builder.Default
    private Integer llantasTuercasDelanteraDerechaNum = 0;
    @Builder.Default
    private Integer llantasTuercasTraseraIzquierdaNum = 0;
    @Builder.Default
    private Integer llantasTuercasTraseraDerechaNum = 0;

    private EstadoBrazoPitman brazoPitman;
    private EstadoManijas manijasDePuertas;
    private EstadoChavetas chavetas;

    @Builder.Default
    private Integer chavetasNum = 0;

    private EstadoCompresor compresor;
    private EstadoTanqueAire tanquesDeAire;
    private BigDecimal tiempoDeCargaPsi;
    private BigDecimal tiempoDeCargaTiempo;

    private Dictamen humo;
    private Dictamen gobernado;

    private EstadoFuga cajaDireccion;
    private EstadoFuga depositoAceite;
    private EstadoParabrisas parabrisas;
    private EstadoLimpiaparabrisas limpiaparabrisas;
    private Dictamen huelgo;
    private BigDecimal huelgoCuanto;
    private EstadoEscape escape;

    private String comentarios;

    private List<EvidenciaEvaluacionDTO> evidencias;
}