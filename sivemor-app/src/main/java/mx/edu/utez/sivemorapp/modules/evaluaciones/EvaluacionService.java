package mx.edu.utez.sivemorapp.modules.evaluaciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.EvaluacionRequestDTO;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.EvidenciaEvaluacionDTO;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.utils.EvaluacionMapper;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.EvidenciaEvaluacion;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.EvidenciaEvaluacionRepository;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.UsuarioRepository;
import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final VerificacionRepository verificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EvidenciaEvaluacionRepository evidenciaEvaluacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> filterEvaluaciones(
            Long idVerificacion,
            String placa,
            Long idTecnico,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ) {
        try {
            List<Evaluacion> result;

            LocalDateTime inicio = fechaInicio != null ? fechaInicio.atStartOfDay() : null;
            LocalDateTime fin = fechaFin != null ? fechaFin.atTime(23, 59, 59) : null;

            if (inicio != null && fin != null) {
                if (idTecnico != null && placa != null && !placa.isBlank()) {
                    result = evaluacionRepository
                            .findByActivoTrueAndTecnico_IdAndVerificacion_Vehiculo_PlacaContainingIgnoreCaseAndFechaEvaluacionBetween(
                                    idTecnico, placa, inicio, fin
                            );
                } else if (idTecnico != null) {
                    result = evaluacionRepository.findByActivoTrueAndTecnico_IdAndFechaEvaluacionBetween(idTecnico, inicio, fin);
                } else if (idVerificacion != null) {
                    result = evaluacionRepository.findByActivoTrueAndVerificacion_IdAndFechaEvaluacionBetween(idVerificacion, inicio, fin);
                } else if (placa != null && !placa.isBlank()) {
                    result = evaluacionRepository
                            .findByActivoTrueAndVerificacion_Vehiculo_PlacaContainingIgnoreCaseAndFechaEvaluacionBetween(
                                    placa, inicio, fin
                            );
                } else {
                    result = evaluacionRepository.findByActivoTrueAndFechaEvaluacionBetween(inicio, fin);
                }
            } else {
                if (idTecnico != null && idVerificacion != null) {
                    result = evaluacionRepository.findByActivoTrueAndTecnico_IdAndVerificacion_Id(idTecnico, idVerificacion);
                } else if (idTecnico != null && placa != null && !placa.isBlank()) {
                    result = evaluacionRepository.findByActivoTrueAndTecnico_IdAndVerificacion_Vehiculo_PlacaContainingIgnoreCase(idTecnico, placa);
                } else if (idVerificacion != null) {
                    result = evaluacionRepository.findByActivoTrueAndVerificacion_Id(idVerificacion);
                } else if (placa != null && !placa.isBlank()) {
                    result = evaluacionRepository.findByActivoTrueAndVerificacion_Vehiculo_PlacaContainingIgnoreCase(placa);
                } else if (idTecnico != null) {
                    result = evaluacionRepository.findByActivoTrueAndTecnico_Id(idTecnico);
                } else {
                    result = evaluacionRepository.findByActivoTrue();
                }
            }

            return ResponseEntity.ok(
                    new ApiResponse("Operación exitosa", EvaluacionMapper.toDtoList(result), HttpStatus.OK)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al consultar evaluaciones", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Evaluacion found = evaluacionRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La evaluación no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", EvaluacionMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findByVehiculo(Long vehicleId) {
        try {
            List<Evaluacion> evaluaciones =
                    evaluacionRepository.findActivasByVehiculoId(vehicleId);

            return ResponseEntity.ok(
                    new ApiResponse("Operación exitosa", EvaluacionMapper.toDtoList(evaluaciones), HttpStatus.OK)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al consultar evaluaciones del vehículo", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(EvaluacionRequestDTO dto) {
        try {
            ResponseEntity<ApiResponse> validationError = validateRequest(dto, true);
            if (validationError != null) return validationError;

            Verificacion verificacion = verificacionRepository.findById(dto.getIdVerificacion()).orElse(null);
            if (verificacion == null || !Boolean.TRUE.equals(verificacion.getActivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Verificación no encontrada", true, HttpStatus.NOT_FOUND));
            }

            Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico()).orElse(null);
            if (tecnico == null || !Boolean.TRUE.equals(tecnico.getActivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Técnico no encontrado", true, HttpStatus.NOT_FOUND));
            }

            boolean yaExiste = evaluacionRepository.existsByVerificacion_IdAndActivoTrue(dto.getIdVerificacion());
            if (yaExiste) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Ya existe una evaluación activa para esa verificación", true, HttpStatus.BAD_REQUEST));
            }

            Evaluacion evaluacion = Evaluacion.builder()
                    .verificacion(verificacion)
                    .tecnico(tecnico)

                    .lucesGalibo(dto.getLucesGalibo())
                    .lucesAltas(dto.getLucesAltas())
                    .lucesBajas(dto.getLucesBajas())
                    .lucesDemarcadorasDelanteras(dto.getLucesDemarcadorasDelanteras())
                    .lucesDemarcadorasTraseras(dto.getLucesDemarcadorasTraseras())
                    .lucesIndicadoras(dto.getLucesIndicadoras())
                    .faroIzquierdo(dto.getFaroIzquierdo())
                    .faroDerecho(dto.getFaroDerecho())
                    .lucesDireccionalesDelanteras(dto.getLucesDireccionalesDelanteras())
                    .lucesDireccionalesTraseras(dto.getLucesDireccionalesTraseras())

                    .llantasRinesDelanteros(dto.getLlantasRinesDelanteros())
                    .llantasRinesTraseros(dto.getLlantasRinesTraseros())
                    .llantasMasasDelanteras(dto.getLlantasMasasDelanteras())
                    .llantasMasasTraseras(dto.getLlantasMasasTraseras())

                    .llantasPresionDelanteraIzquierda(dto.getLlantasPresionDelanteraIzquierda())
                    .llantasPresionDelanteraDerecha(dto.getLlantasPresionDelanteraDerecha())
                    .llantasPresionTraseraIzquierda1(dto.getLlantasPresionTraseraIzquierda1())
                    .llantasPresionTraseraIzquierda2(dto.getLlantasPresionTraseraIzquierda2())
                    .llantasPresionTraseraDerecha1(dto.getLlantasPresionTraseraDerecha1())
                    .llantasPresionTraseraDerecha2(dto.getLlantasPresionTraseraDerecha2())

                    .llantasProfundidadDelanteraIzquierda(dto.getLlantasProfundidadDelanteraIzquierda())
                    .llantasProfundidadDelanteraDerecha(dto.getLlantasProfundidadDelanteraDerecha())
                    .llantasProfundidadTraseraIzquierda1(dto.getLlantasProfundidadTraseraIzquierda1())
                    .llantasProfundidadTraseraIzquierda2(dto.getLlantasProfundidadTraseraIzquierda2())
                    .llantasProfundidadTraseraDerecha1(dto.getLlantasProfundidadTraseraDerecha1())
                    .llantasProfundidadTraseraDerecha2(dto.getLlantasProfundidadTraseraDerecha2())

                    .llantasBirlosDelanteraIzquierda(dto.getLlantasBirlosDelanteraIzquierda())
                    .llantasBirlosDelanteraDerecha(dto.getLlantasBirlosDelanteraDerecha())
                    .llantasBirlosTraseraIzquierda(dto.getLlantasBirlosTraseraIzquierda())
                    .llantasBirlosTraseraDerecha(dto.getLlantasBirlosTraseraDerecha())

                    .llantasBirlosDelanteraIzquierdaNum(defaultZero(dto.getLlantasBirlosDelanteraIzquierdaNum()))
                    .llantasBirlosDelanteraDerechaNum(defaultZero(dto.getLlantasBirlosDelanteraDerechaNum()))
                    .llantasBirlosTraseraIzquierdaNum(defaultZero(dto.getLlantasBirlosTraseraIzquierdaNum()))
                    .llantasBirlosTraseraDerechaNum(defaultZero(dto.getLlantasBirlosTraseraDerechaNum()))

                    .llantasTuercasDelanteraIzquierda(dto.getLlantasTuercasDelanteraIzquierda())
                    .llantasTuercasDelanteraDerecha(dto.getLlantasTuercasDelanteraDerecha())
                    .llantasTuercasTraseraIzquierda(dto.getLlantasTuercasTraseraIzquierda())
                    .llantasTuercasTraseraDerecha(dto.getLlantasTuercasTraseraDerecha())

                    .llantasTuercasDelanteraIzquierdaNum(defaultZero(dto.getLlantasTuercasDelanteraIzquierdaNum()))
                    .llantasTuercasDelanteraDerechaNum(defaultZero(dto.getLlantasTuercasDelanteraDerechaNum()))
                    .llantasTuercasTraseraIzquierdaNum(defaultZero(dto.getLlantasTuercasTraseraIzquierdaNum()))
                    .llantasTuercasTraseraDerechaNum(defaultZero(dto.getLlantasTuercasTraseraDerechaNum()))

                    .brazoPitman(dto.getBrazoPitman())
                    .manijasDePuertas(dto.getManijasDePuertas())
                    .chavetas(dto.getChavetas())
                    .chavetasNum(defaultZero(dto.getChavetasNum()))

                    .compresor(dto.getCompresor())
                    .tanquesDeAire(dto.getTanquesDeAire())
                    .tiempoDeCargaPsi(dto.getTiempoDeCargaPsi())
                    .tiempoDeCargaTiempo(dto.getTiempoDeCargaTiempo())

                    .humo(dto.getHumo())
                    .gobernado(dto.getGobernado())

                    .cajaDireccion(dto.getCajaDireccion())
                    .depositoAceite(dto.getDepositoAceite())
                    .parabrisas(dto.getParabrisas())
                    .limpiaparabrisas(dto.getLimpiaparabrisas())
                    .huelgo(dto.getHuelgo())
                    .huelgoCuanto(dto.getHuelgoCuanto())
                    .escape(dto.getEscape())

                    .resultadoFinal(calcularResultadoFinal(dto))
                    .comentarios(dto.getComentarios())
                    .fechaEvaluacion(LocalDateTime.now())
                    .build();

            evaluacion.setActivo(true);

            Evaluacion saved = evaluacionRepository.save(evaluacion);

            guardarEvidencias(saved, dto.getEvidencias());

            verificacion.setDictamen(saved.getResultadoFinal());
            verificacion.setFechaVerificacion(LocalDate.now());
            verificacionRepository.save(verificacion);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("Evaluación creada", EvaluacionMapper.toDto(saved), HttpStatus.CREATED));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al crear evaluación", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(EvaluacionRequestDTO dto) {
        try {
            if (dto.getId() == null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST));
            }

            ResponseEntity<ApiResponse> validationError = validateRequest(dto, false);
            if (validationError != null) return validationError;

            Evaluacion found = evaluacionRepository.findById(dto.getId()).orElse(null);

            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("La evaluación no existe", true, HttpStatus.NOT_FOUND));
            }

            if (dto.getIdTecnico() != null) {
                Usuario tecnico = usuarioRepository.findById(dto.getIdTecnico()).orElse(null);
                if (tecnico == null || !Boolean.TRUE.equals(tecnico.getActivo())) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("Técnico no encontrado", true, HttpStatus.NOT_FOUND));
                }
                found.setTecnico(tecnico);
            }

            found.setLucesGalibo(dto.getLucesGalibo());
            found.setLucesAltas(dto.getLucesAltas());
            found.setLucesBajas(dto.getLucesBajas());
            found.setLucesDemarcadorasDelanteras(dto.getLucesDemarcadorasDelanteras());
            found.setLucesDemarcadorasTraseras(dto.getLucesDemarcadorasTraseras());
            found.setLucesIndicadoras(dto.getLucesIndicadoras());
            found.setFaroIzquierdo(dto.getFaroIzquierdo());
            found.setFaroDerecho(dto.getFaroDerecho());
            found.setLucesDireccionalesDelanteras(dto.getLucesDireccionalesDelanteras());
            found.setLucesDireccionalesTraseras(dto.getLucesDireccionalesTraseras());

            found.setLlantasRinesDelanteros(dto.getLlantasRinesDelanteros());
            found.setLlantasRinesTraseros(dto.getLlantasRinesTraseros());
            found.setLlantasMasasDelanteras(dto.getLlantasMasasDelanteras());
            found.setLlantasMasasTraseras(dto.getLlantasMasasTraseras());

            found.setLlantasPresionDelanteraIzquierda(dto.getLlantasPresionDelanteraIzquierda());
            found.setLlantasPresionDelanteraDerecha(dto.getLlantasPresionDelanteraDerecha());
            found.setLlantasPresionTraseraIzquierda1(dto.getLlantasPresionTraseraIzquierda1());
            found.setLlantasPresionTraseraIzquierda2(dto.getLlantasPresionTraseraIzquierda2());
            found.setLlantasPresionTraseraDerecha1(dto.getLlantasPresionTraseraDerecha1());
            found.setLlantasPresionTraseraDerecha2(dto.getLlantasPresionTraseraDerecha2());

            found.setLlantasProfundidadDelanteraIzquierda(dto.getLlantasProfundidadDelanteraIzquierda());
            found.setLlantasProfundidadDelanteraDerecha(dto.getLlantasProfundidadDelanteraDerecha());
            found.setLlantasProfundidadTraseraIzquierda1(dto.getLlantasProfundidadTraseraIzquierda1());
            found.setLlantasProfundidadTraseraIzquierda2(dto.getLlantasProfundidadTraseraIzquierda2());
            found.setLlantasProfundidadTraseraDerecha1(dto.getLlantasProfundidadTraseraDerecha1());
            found.setLlantasProfundidadTraseraDerecha2(dto.getLlantasProfundidadTraseraDerecha2());

            found.setLlantasBirlosDelanteraIzquierda(dto.getLlantasBirlosDelanteraIzquierda());
            found.setLlantasBirlosDelanteraDerecha(dto.getLlantasBirlosDelanteraDerecha());
            found.setLlantasBirlosTraseraIzquierda(dto.getLlantasBirlosTraseraIzquierda());
            found.setLlantasBirlosTraseraDerecha(dto.getLlantasBirlosTraseraDerecha());

            found.setLlantasBirlosDelanteraIzquierdaNum(defaultZero(dto.getLlantasBirlosDelanteraIzquierdaNum()));
            found.setLlantasBirlosDelanteraDerechaNum(defaultZero(dto.getLlantasBirlosDelanteraDerechaNum()));
            found.setLlantasBirlosTraseraIzquierdaNum(defaultZero(dto.getLlantasBirlosTraseraIzquierdaNum()));
            found.setLlantasBirlosTraseraDerechaNum(defaultZero(dto.getLlantasBirlosTraseraDerechaNum()));

            found.setLlantasTuercasDelanteraIzquierda(dto.getLlantasTuercasDelanteraIzquierda());
            found.setLlantasTuercasDelanteraDerecha(dto.getLlantasTuercasDelanteraDerecha());
            found.setLlantasTuercasTraseraIzquierda(dto.getLlantasTuercasTraseraIzquierda());
            found.setLlantasTuercasTraseraDerecha(dto.getLlantasTuercasTraseraDerecha());

            found.setLlantasTuercasDelanteraIzquierdaNum(defaultZero(dto.getLlantasTuercasDelanteraIzquierdaNum()));
            found.setLlantasTuercasDelanteraDerechaNum(defaultZero(dto.getLlantasTuercasDelanteraDerechaNum()));
            found.setLlantasTuercasTraseraIzquierdaNum(defaultZero(dto.getLlantasTuercasTraseraIzquierdaNum()));
            found.setLlantasTuercasTraseraDerechaNum(defaultZero(dto.getLlantasTuercasTraseraDerechaNum()));

            found.setBrazoPitman(dto.getBrazoPitman());
            found.setManijasDePuertas(dto.getManijasDePuertas());
            found.setChavetas(dto.getChavetas());
            found.setChavetasNum(defaultZero(dto.getChavetasNum()));

            found.setCompresor(dto.getCompresor());
            found.setTanquesDeAire(dto.getTanquesDeAire());
            found.setTiempoDeCargaPsi(dto.getTiempoDeCargaPsi());
            found.setTiempoDeCargaTiempo(dto.getTiempoDeCargaTiempo());

            found.setHumo(dto.getHumo());
            found.setGobernado(dto.getGobernado());

            found.setCajaDireccion(dto.getCajaDireccion());
            found.setDepositoAceite(dto.getDepositoAceite());
            found.setParabrisas(dto.getParabrisas());
            found.setLimpiaparabrisas(dto.getLimpiaparabrisas());
            found.setHuelgo(dto.getHuelgo());
            found.setHuelgoCuanto(dto.getHuelgoCuanto());
            found.setEscape(dto.getEscape());

            found.setComentarios(dto.getComentarios());
            found.setResultadoFinal(calcularResultadoFinal(dto));
            found.setFechaModificacion(LocalDateTime.now());

            Evaluacion updated = evaluacionRepository.save(found);

            actualizarEvidencias(updated, dto.getEvidencias());

            Verificacion verificacion = updated.getVerificacion();
            verificacion.setDictamen(updated.getResultadoFinal());
            verificacion.setFechaVerificacion(LocalDate.now());
            verificacionRepository.save(verificacion);

            return ResponseEntity.ok(
                    new ApiResponse("Evaluación actualizada", EvaluacionMapper.toDto(updated), HttpStatus.OK)
            );

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al actualizar evaluación", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        try {
            Evaluacion found = evaluacionRepository.findById(id).orElse(null);

            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("La evaluación no existe", true, HttpStatus.NOT_FOUND));
            }

            Verificacion verificacion = found.getVerificacion();

            if (verificacion != null &&
                    verificacion.getFechaVerificacion() != null &&
                    verificacion.getDictamen() != null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(
                                "No se puede eliminar una evaluación asociada a una verificación finalizada",
                                true,
                                HttpStatus.BAD_REQUEST
                        ));
            }

            found.setActivo(false);
            found.setFechaModificacion(LocalDateTime.now());

            if (found.getEvidencias() != null) {
                for (EvidenciaEvaluacion evidencia : found.getEvidencias()) {
                    evidencia.setActivo(false);
                }
            }

            evaluacionRepository.save(found);

            return ResponseEntity.ok(
                    new ApiResponse("Evaluación eliminada", HttpStatus.OK)
            );

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al eliminar evaluación", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    private ResponseEntity<ApiResponse> validateRequest(EvaluacionRequestDTO dto, boolean creating) {
        if (creating && dto.getIdVerificacion() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La verificación es obligatoria", true, HttpStatus.BAD_REQUEST));
        }

        if (creating && dto.getIdTecnico() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El técnico es obligatorio", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getHuelgo() == Dictamen.REPROBADO && dto.getHuelgoCuanto() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Si huelgo está reprobado, huelgoCuanto es obligatorio", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getEvidencias() != null && dto.getEvidencias().size() > 5) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Solo se permiten máximo 5 evidencias por evaluación", true, HttpStatus.BAD_REQUEST));
        }

        return null;
    }

    private Dictamen calcularResultadoFinal(EvaluacionRequestDTO dto) {
        boolean reprobado = false;

        if (dto.getHumo() == Dictamen.REPROBADO) reprobado = true;
        if (dto.getGobernado() == Dictamen.REPROBADO) reprobado = true;
        if (dto.getCompresor() != null && dto.getCompresor().name().contains("REPROBADO")) reprobado = true;
        if (dto.getCompresor() != null && dto.getCompresor().name().contains("NO_CORTA")) reprobado = true;
        if (dto.getTanquesDeAire() != null && dto.getTanquesDeAire().name().equals("REPROBADO")) reprobado = true;
        if (dto.getHuelgo() == Dictamen.REPROBADO) reprobado = true;

        if (isLessThan(dto.getLlantasPresionDelanteraIzquierda(), "80")) reprobado = true;
        if (isLessThan(dto.getLlantasPresionDelanteraDerecha(), "80")) reprobado = true;
        if (isLessThan(dto.getLlantasPresionTraseraIzquierda1(), "80")) reprobado = true;
        if (isLessThan(dto.getLlantasPresionTraseraIzquierda2(), "80")) reprobado = true;
        if (isLessThan(dto.getLlantasPresionTraseraDerecha1(), "80")) reprobado = true;
        if (isLessThan(dto.getLlantasPresionTraseraDerecha2(), "80")) reprobado = true;

        if (isLessThan(dto.getLlantasProfundidadDelanteraIzquierda(), "3.2")) reprobado = true;
        if (isLessThan(dto.getLlantasProfundidadDelanteraDerecha(), "3.2")) reprobado = true;
        if (isLessThan(dto.getLlantasProfundidadTraseraIzquierda1(), "1.6")) reprobado = true;
        if (isLessThan(dto.getLlantasProfundidadTraseraIzquierda2(), "1.6")) reprobado = true;
        if (isLessThan(dto.getLlantasProfundidadTraseraDerecha1(), "1.6")) reprobado = true;
        if (isLessThan(dto.getLlantasProfundidadTraseraDerecha2(), "1.6")) reprobado = true;

        if (defaultZero(dto.getLlantasBirlosDelanteraIzquierdaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasBirlosDelanteraDerechaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasBirlosTraseraIzquierdaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasBirlosTraseraDerechaNum()) > 2) reprobado = true;

        if (defaultZero(dto.getLlantasTuercasDelanteraIzquierdaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasTuercasDelanteraDerechaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasTuercasTraseraIzquierdaNum()) > 2) reprobado = true;
        if (defaultZero(dto.getLlantasTuercasTraseraDerechaNum()) > 2) reprobado = true;

        if (dto.getTiempoDeCargaPsi() != null &&
                (dto.getTiempoDeCargaPsi().compareTo(new BigDecimal("70")) <= 0
                        || dto.getTiempoDeCargaPsi().compareTo(new BigDecimal("120")) >= 0)) {
            reprobado = true;
        }

        if (dto.getTiempoDeCargaTiempo() != null &&
                dto.getTiempoDeCargaTiempo().compareTo(new BigDecimal("120")) >= 0) {
            reprobado = true;
        }

        return reprobado ? Dictamen.REPROBADO : Dictamen.APROBADO;
    }

    private void guardarEvidencias(Evaluacion evaluacion, List<EvidenciaEvaluacionDTO> evidenciasDto) {
        if (evidenciasDto == null || evidenciasDto.isEmpty()) return;

        List<EvidenciaEvaluacion> evidencias = new ArrayList<>();

        for (int i = 0; i < evidenciasDto.size(); i++) {
            EvidenciaEvaluacionDTO dto = evidenciasDto.get(i);

            EvidenciaEvaluacion evidencia = EvidenciaEvaluacion.builder()
                    .evaluacion(evaluacion)
                    .numeroEvidencia(dto.getNumeroEvidencia() != null ? dto.getNumeroEvidencia() : i + 1)
                    .nombreArchivo(dto.getNombreArchivo())
                    .mimeType(dto.getMimeType())
                    .tamanoBytes(dto.getTamanoBytes())
                    .comentario(dto.getComentario())
                    .imagen(parseBase64(dto.getImagenBase64()))
                    .activo(true)
                    .build();

            evidencias.add(evidencia);
        }

        evidenciaEvaluacionRepository.saveAll(evidencias);
        evaluacion.setEvidencias(evidencias);
    }

    private void actualizarEvidencias(Evaluacion evaluacion, List<EvidenciaEvaluacionDTO> evidenciasDto) {
        if (evaluacion.getEvidencias() != null) {
            for (EvidenciaEvaluacion evidencia : evaluacion.getEvidencias()) {
                evidencia.setActivo(false);
            }
            evidenciaEvaluacionRepository.saveAll(evaluacion.getEvidencias());
        }

        if (evidenciasDto == null || evidenciasDto.isEmpty()) return;

        guardarEvidencias(evaluacion, evidenciasDto);
    }

    private byte[] parseBase64(String base64) {
        if (base64 == null || base64.isBlank()) return null;
        try {
            return Base64.getDecoder().decode(base64);
        } catch (Exception e) {
            return null;
        }
    }

    private Integer defaultZero(Integer value) {
        return value == null ? 0 : value;
    }

    private boolean isLessThan(BigDecimal value, String limit) {
        return value != null && value.compareTo(new BigDecimal(limit)) < 0;
    }
}