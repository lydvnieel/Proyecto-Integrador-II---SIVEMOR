package mx.edu.utez.sivemorapp.modules.verificaciones;

import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.dashboard.dto.DashboardRegionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    @Query("""
    SELECT new mx.edu.utez.sivemorapp.modules.dashboard.dto.DashboardRegionDTO(
        r.nombre,
        COUNT(v)
    )
    FROM Verificacion v
    JOIN v.nota n
    JOIN n.verificentro ver
    JOIN ver.region r
    WHERE v.activo = true
    GROUP BY r.nombre
    ORDER BY r.nombre
""")
    List<DashboardRegionDTO> countVerificacionesPorRegion();

    List<Verificacion> findByActivoTrue();
    boolean existsByNota_Cliente_IdAndMateriaAndActivoTrue(Long idCliente, Materia materia);
    Optional<Verificacion> findByIdAndActivoTrue(Long id);

    List<Verificacion> findByActivoTrueAndVehiculo_Id(Long idVehiculo);

    List<Verificacion> findByActivoTrueAndNota_Id(Long idNota);

    List<Verificacion> findByActivoTrueAndMateria(Materia materia);

    List<Verificacion> findByActivoTrueAndDictamen(Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndFechaVerificacion(LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_Id(Long idVehiculo, Long idNota);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndMateria(Long idVehiculo, Materia materia);

    List<Verificacion> findByActivoTrueAndNota_IdAndMateria(Long idNota, Materia materia);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndDictamen(Long idVehiculo, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndNota_IdAndDictamen(Long idNota, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndMateriaAndDictamen(Materia materia, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndFechaVerificacion(Long idVehiculo, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndNota_IdAndFechaVerificacion(Long idNota, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndMateriaAndFechaVerificacion(Materia materia, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndDictamenAndFechaVerificacion(Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndMateria(Long idVehiculo, Long idNota, Materia materia);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndDictamen(Long idVehiculo, Long idNota, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndMateriaAndDictamen(Long idVehiculo, Materia materia, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndNota_IdAndMateriaAndDictamen(Long idNota, Materia materia, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndFechaVerificacion(Long idVehiculo, Long idNota, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndMateriaAndFechaVerificacion(Long idVehiculo, Materia materia, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndDictamenAndFechaVerificacion(Long idVehiculo, Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndNota_IdAndMateriaAndFechaVerificacion(Long idNota, Materia materia, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndNota_IdAndDictamenAndFechaVerificacion(Long idNota, Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndMateriaAndDictamenAndFechaVerificacion(Materia materia, Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndDictamen(Long idVehiculo, Long idNota, Materia materia, Dictamen dictamen);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndFechaVerificacion(Long idVehiculo, Long idNota, Materia materia, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndDictamenAndFechaVerificacion(Long idVehiculo, Long idNota, Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndVehiculo_IdAndMateriaAndDictamenAndFechaVerificacion(Long idVehiculo, Materia materia, Dictamen dictamen, LocalDate fechaVerificacion);

    List<Verificacion> findByActivoTrueAndNota_IdAndMateriaAndDictamenAndFechaVerificacion(Long idNota, Materia materia, Dictamen dictamen, LocalDate fechaVerificacion);
    List<Verificacion> findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndDictamenAndFechaVerificacion(
            Long idVehiculo,
            Long idNota,
            Materia materia,
            Dictamen dictamen,
            LocalDate fechaVerificacion
    );

    Optional<Verificacion> findByFolioVerificacion(String folio);


    boolean existsByVehiculo_IdAndActivoTrue(Long idVehiculo);
    boolean existsByNota_Verificentro_IdAndActivoTrue(Long  idNota);

    long countByNota_IdAndActivoTrue(Long idNota);
    long countByActivoTrue();

    long countByActivoTrueAndPagadoFalse();

    long countByActivoTrueAndDictamen(mx.edu.utez.sivemorapp.kernel.enums.Dictamen dictamen);
    long countByActivoTrueAndMultaIsNotNull();
}