package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.evaluaciones.Evaluacion;
import mx.edu.utez.sivemorapp.modules.evaluaciones.EvaluacionRepository;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos.EvidenciaEvaluacionRequestDTO;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos.utils.EvidenciaEvaluacionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvidenciaEvaluacionService {

    private final EvidenciaEvaluacionRepository evidenciaRepository;
    private final EvaluacionRepository evaluacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idEvaluacion, Integer numeroEvidencia) {
        List<EvidenciaEvaluacion> result;

        if (idEvaluacion != null && numeroEvidencia != null) {
            result = evidenciaRepository.findByActivoTrueAndEvaluacion_IdAndNumeroEvidencia(idEvaluacion, numeroEvidencia);
        } else if (idEvaluacion != null) {
            result = evidenciaRepository.findByActivoTrueAndEvaluacion_Id(idEvaluacion);
        } else if (numeroEvidencia != null) {
            result = evidenciaRepository.findByActivoTrueAndNumeroEvidencia(numeroEvidencia);
        } else {
            result = evidenciaRepository.findByActivoTrue();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", EvidenciaEvaluacionMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        EvidenciaEvaluacion found = evidenciaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La evidencia no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", EvidenciaEvaluacionMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(EvidenciaEvaluacionRequestDTO dto) {

        if (dto.getIdEvaluacion() == null || dto.getNumeroEvidencia() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        Evaluacion evaluacion = evaluacionRepository.findByIdAndActivoTrue(dto.getIdEvaluacion()).orElse(null);
        if (evaluacion == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La evaluación no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getNumeroEvidencia() < 1 || dto.getNumeroEvidencia() > 5) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El número de evidencia debe estar entre 1 y 5", true, HttpStatus.BAD_REQUEST));
        }

        long total = evidenciaRepository.countByEvaluacion_IdAndActivoTrue(dto.getIdEvaluacion());
        if (total >= 5) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La evaluación ya tiene el máximo de 5 evidencias", true, HttpStatus.BAD_REQUEST));
        }

        boolean duplicada = evidenciaRepository.existsByEvaluacion_IdAndNumeroEvidenciaAndActivoTrue(
                dto.getIdEvaluacion(), dto.getNumeroEvidencia()
        );
        if (duplicada) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe una evidencia con ese número para esta evaluación", true, HttpStatus.BAD_REQUEST));
        }

        byte[] imagenBytes = null;
        Integer tamanoBytes = null;

        if (dto.getImagenBase64() != null && !dto.getImagenBase64().isBlank()) {
            try {
                imagenBytes = Base64.getDecoder().decode(dto.getImagenBase64());
                tamanoBytes = imagenBytes.length;
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("La imagen en base64 no es válida", true, HttpStatus.BAD_REQUEST));
            }
        }

        EvidenciaEvaluacion evidencia = EvidenciaEvaluacion.builder()
                .evaluacion(evaluacion)
                .numeroEvidencia(dto.getNumeroEvidencia())
                .imagen(imagenBytes)
                .mimeType(dto.getMimeType())
                .nombreArchivo(dto.getNombreArchivo())
                .tamanoBytes(tamanoBytes)
                .comentario(dto.getComentario())
                .build();

        evidencia.setActivo(true);

        EvidenciaEvaluacion saved = evidenciaRepository.save(evidencia);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Evidencia creada", EvidenciaEvaluacionMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, EvidenciaEvaluacionRequestDTO dto) {
        EvidenciaEvaluacion found = evidenciaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La evidencia no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdEvaluacion() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede modificar la evaluación asociada a la evidencia", true, HttpStatus.BAD_REQUEST));
        }

        Integer numeroFinal = found.getNumeroEvidencia();

        if (dto.getNumeroEvidencia() != null) {
            if (dto.getNumeroEvidencia() < 1 || dto.getNumeroEvidencia() > 5) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El número de evidencia debe estar entre 1 y 5", true, HttpStatus.BAD_REQUEST));
            }
            numeroFinal = dto.getNumeroEvidencia();
        }

        boolean duplicada = evidenciaRepository.existsByEvaluacion_IdAndNumeroEvidenciaAndIdNotAndActivoTrue(
                found.getEvaluacion().getId(), numeroFinal, id
        );
        if (duplicada) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe una evidencia con ese número para esta evaluación", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getNumeroEvidencia() != null) {
            found.setNumeroEvidencia(dto.getNumeroEvidencia());
        }

        if (dto.getComentario() != null) {
            found.setComentario(dto.getComentario());
        }

        if (dto.getImagenBase64() != null) {
            if (dto.getImagenBase64().isBlank()) {
                found.setImagen(null);
                found.setMimeType(null);
                found.setNombreArchivo(null);
                found.setTamanoBytes(null);
            } else {
                try {
                    byte[] imagenBytes = Base64.getDecoder().decode(dto.getImagenBase64());
                    found.setImagen(imagenBytes);
                    found.setMimeType(dto.getMimeType());
                    found.setNombreArchivo(dto.getNombreArchivo());
                    found.setTamanoBytes(imagenBytes.length);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("La imagen en base64 no es válida", true, HttpStatus.BAD_REQUEST));
                }
            }
        }

        EvidenciaEvaluacion updated = evidenciaRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Evidencia actualizada", EvidenciaEvaluacionMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        EvidenciaEvaluacion found = evidenciaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La evidencia no existe", true, HttpStatus.NOT_FOUND));
        }

        found.setActivo(false);
        evidenciaRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Evidencia eliminada", HttpStatus.OK)
        );
    }
}