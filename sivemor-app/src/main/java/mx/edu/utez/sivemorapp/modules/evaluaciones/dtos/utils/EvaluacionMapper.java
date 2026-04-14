package mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.utils;

import mx.edu.utez.sivemorapp.modules.evaluaciones.Evaluacion;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.EvaluacionResponseDTO;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.EvidenciaEvaluacionDTO;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.EvidenciaEvaluacion;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class EvaluacionMapper {

    public static EvaluacionResponseDTO toDto(Evaluacion e) {
        return EvaluacionResponseDTO.builder()
                .id(e.getId())
                .idVerificacion(e.getVerificacion() != null ? e.getVerificacion().getId() : null)
                .idVehiculo(e.getVerificacion() != null && e.getVerificacion().getVehiculo() != null ? e.getVerificacion().getVehiculo().getId() : null)
                .idTecnico(e.getTecnico() != null ? e.getTecnico().getId() : null)

                .placa(e.getVerificacion() != null && e.getVerificacion().getVehiculo() != null ? e.getVerificacion().getVehiculo().getPlaca() : null)
                .serie(e.getVerificacion() != null && e.getVerificacion().getVehiculo() != null ? e.getVerificacion().getVehiculo().getSerie() : null)
                .folioVerificacion(e.getVerificacion() != null ? e.getVerificacion().getFolioVerificacion() : null)
                .materia(e.getVerificacion() != null && e.getVerificacion().getMateria() != null ? e.getVerificacion().getMateria().name() : null)
                .dictamen(e.getVerificacion() != null ? e.getVerificacion().getDictamen() : null)
                .resultadoFinal(e.getResultadoFinal())

                .nombreTecnico(e.getTecnico() != null ? e.getTecnico().getNombreUsuario() : null)
                .correoTecnico(e.getTecnico() != null ? e.getTecnico().getEmail() : null)

                .fechaVerificacion(e.getVerificacion() != null ? e.getVerificacion().getFechaVerificacion() : null)
                .fechaEvaluacion(e.getFechaEvaluacion())
                .fechaModificacion(e.getFechaModificacion())

                .activo(e.getActivo())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())

                .lucesGalibo(e.getLucesGalibo())
                .lucesAltas(e.getLucesAltas())
                .lucesBajas(e.getLucesBajas())
                .lucesDemarcadorasDelanteras(e.getLucesDemarcadorasDelanteras())
                .lucesDemarcadorasTraseras(e.getLucesDemarcadorasTraseras())
                .lucesIndicadoras(e.getLucesIndicadoras())
                .faroIzquierdo(e.getFaroIzquierdo())
                .faroDerecho(e.getFaroDerecho())
                .lucesDireccionalesDelanteras(e.getLucesDireccionalesDelanteras())
                .lucesDireccionalesTraseras(e.getLucesDireccionalesTraseras())

                .llantasRinesDelanteros(e.getLlantasRinesDelanteros())
                .llantasRinesTraseros(e.getLlantasRinesTraseros())
                .llantasMasasDelanteras(e.getLlantasMasasDelanteras())
                .llantasMasasTraseras(e.getLlantasMasasTraseras())

                .llantasPresionDelanteraIzquierda(e.getLlantasPresionDelanteraIzquierda())
                .llantasPresionDelanteraDerecha(e.getLlantasPresionDelanteraDerecha())
                .llantasPresionTraseraIzquierda1(e.getLlantasPresionTraseraIzquierda1())
                .llantasPresionTraseraIzquierda2(e.getLlantasPresionTraseraIzquierda2())
                .llantasPresionTraseraDerecha1(e.getLlantasPresionTraseraDerecha1())
                .llantasPresionTraseraDerecha2(e.getLlantasPresionTraseraDerecha2())

                .llantasProfundidadDelanteraIzquierda(e.getLlantasProfundidadDelanteraIzquierda())
                .llantasProfundidadDelanteraDerecha(e.getLlantasProfundidadDelanteraDerecha())
                .llantasProfundidadTraseraIzquierda1(e.getLlantasProfundidadTraseraIzquierda1())
                .llantasProfundidadTraseraIzquierda2(e.getLlantasProfundidadTraseraIzquierda2())
                .llantasProfundidadTraseraDerecha1(e.getLlantasProfundidadTraseraDerecha1())
                .llantasProfundidadTraseraDerecha2(e.getLlantasProfundidadTraseraDerecha2())

                .llantasBirlosDelanteraIzquierda(e.getLlantasBirlosDelanteraIzquierda())
                .llantasBirlosDelanteraDerecha(e.getLlantasBirlosDelanteraDerecha())
                .llantasBirlosTraseraIzquierda(e.getLlantasBirlosTraseraIzquierda())
                .llantasBirlosTraseraDerecha(e.getLlantasBirlosTraseraDerecha())

                .llantasBirlosDelanteraIzquierdaNum(e.getLlantasBirlosDelanteraIzquierdaNum())
                .llantasBirlosDelanteraDerechaNum(e.getLlantasBirlosDelanteraDerechaNum())
                .llantasBirlosTraseraIzquierdaNum(e.getLlantasBirlosTraseraIzquierdaNum())
                .llantasBirlosTraseraDerechaNum(e.getLlantasBirlosTraseraDerechaNum())

                .llantasTuercasDelanteraIzquierda(e.getLlantasTuercasDelanteraIzquierda())
                .llantasTuercasDelanteraDerecha(e.getLlantasTuercasDelanteraDerecha())
                .llantasTuercasTraseraIzquierda(e.getLlantasTuercasTraseraIzquierda())
                .llantasTuercasTraseraDerecha(e.getLlantasTuercasTraseraDerecha())

                .llantasTuercasDelanteraIzquierdaNum(e.getLlantasTuercasDelanteraIzquierdaNum())
                .llantasTuercasDelanteraDerechaNum(e.getLlantasTuercasDelanteraDerechaNum())
                .llantasTuercasTraseraIzquierdaNum(e.getLlantasTuercasTraseraIzquierdaNum())
                .llantasTuercasTraseraDerechaNum(e.getLlantasTuercasTraseraDerechaNum())

                .brazoPitman(e.getBrazoPitman())
                .manijasDePuertas(e.getManijasDePuertas())
                .chavetas(e.getChavetas())
                .chavetasNum(e.getChavetasNum())

                .compresor(e.getCompresor())
                .tanquesDeAire(e.getTanquesDeAire())
                .tiempoDeCargaPsi(e.getTiempoDeCargaPsi())
                .tiempoDeCargaTiempo(e.getTiempoDeCargaTiempo())

                .humo(e.getHumo())
                .gobernado(e.getGobernado())

                .cajaDireccion(e.getCajaDireccion())
                .depositoAceite(e.getDepositoAceite())
                .parabrisas(e.getParabrisas())
                .limpiaparabrisas(e.getLimpiaparabrisas())
                .huelgo(e.getHuelgo())
                .huelgoCuanto(e.getHuelgoCuanto())
                .escape(e.getEscape())

                .comentarios(e.getComentarios())
                .evidencias(toEvidenciaDtoList(e.getEvidencias()))
                .build();
    }

    public static List<EvaluacionResponseDTO> toDtoList(List<Evaluacion> list) {
        return list.stream().map(EvaluacionMapper::toDto).collect(Collectors.toList());
    }

    private static List<EvidenciaEvaluacionDTO> toEvidenciaDtoList(List<EvidenciaEvaluacion> evidencias) {
        if (evidencias == null) return Collections.emptyList();

        return evidencias.stream()
                .map(e -> EvidenciaEvaluacionDTO.builder()
                        .id(e.getId())
                        .numeroEvidencia(e.getNumeroEvidencia())
                        .nombreArchivo(e.getNombreArchivo())
                        .mimeType(e.getMimeType())
                        .tamanoBytes(e.getTamanoBytes())
                        .comentario(e.getComentario())
                        .build())
                .collect(Collectors.toList());
    }
}