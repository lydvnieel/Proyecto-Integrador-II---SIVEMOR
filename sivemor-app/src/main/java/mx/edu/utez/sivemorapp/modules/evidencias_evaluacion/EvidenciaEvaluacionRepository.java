package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvidenciaEvaluacionRepository extends JpaRepository<EvidenciaEvaluacion, Long> {

    Optional<EvidenciaEvaluacion> findByIdAndActivoTrue(Long id);

    List<EvidenciaEvaluacion> findByActivoTrue();

    List<EvidenciaEvaluacion> findByActivoTrueAndEvaluacion_Id(Long idEvaluacion);

    List<EvidenciaEvaluacion> findByActivoTrueAndNumeroEvidencia(Integer numeroEvidencia);

    List<EvidenciaEvaluacion> findByActivoTrueAndEvaluacion_IdAndNumeroEvidencia(Long idEvaluacion, Integer numeroEvidencia);

    boolean existsByEvaluacion_IdAndNumeroEvidenciaAndActivoTrue(Long idEvaluacion, Integer numeroEvidencia);

    boolean existsByEvaluacion_IdAndNumeroEvidenciaAndIdNotAndActivoTrue(Long idEvaluacion, Integer numeroEvidencia, Long id);

    long countByEvaluacion_IdAndActivoTrue(Long idEvaluacion);
}