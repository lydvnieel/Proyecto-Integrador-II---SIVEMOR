package mx.edu.utez.sivemorapp.modules.evaluaciones;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {

    boolean existsByVerificacion_Vehiculo_IdAndActivoTrue(Long idVehiculo);
    boolean existsByVerificacion_IdAndActivoTrue(Long idVerificacion);

    Optional<Evaluacion> findByIdAndActivoTrue(Long id);
    Optional<Evaluacion> findByVerificacion_IdAndActivoTrue(Long idVerificacion);

    List<Evaluacion> findByActivoTrue();
    List<Evaluacion> findByActivoTrueAndVerificacion_Id(Long idVerificacion);
    List<Evaluacion> findByActivoTrueAndVerificacion_Vehiculo_PlacaContainingIgnoreCase(String placa);
    List<Evaluacion> findByActivoTrueAndTecnico_Id(Long idTecnico);

    List<Evaluacion> findByActivoTrueAndTecnico_IdAndVerificacion_Id(Long idTecnico, Long idVerificacion);
    List<Evaluacion> findByActivoTrueAndTecnico_IdAndVerificacion_Vehiculo_PlacaContainingIgnoreCase(Long idTecnico, String placa);

    List<Evaluacion> findByActivoTrueAndFechaEvaluacionBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    List<Evaluacion> findByActivoTrueAndVerificacion_IdAndFechaEvaluacionBetween(
            Long idVerificacion,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    List<Evaluacion> findByActivoTrueAndTecnico_IdAndFechaEvaluacionBetween(
            Long idTecnico,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    List<Evaluacion> findByActivoTrueAndVerificacion_Vehiculo_PlacaContainingIgnoreCaseAndFechaEvaluacionBetween(
            String placa,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    List<Evaluacion> findByActivoTrueAndTecnico_IdAndVerificacion_Vehiculo_PlacaContainingIgnoreCaseAndFechaEvaluacionBetween(
            Long idTecnico,
            String placa,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );
}