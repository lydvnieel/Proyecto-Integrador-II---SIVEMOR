package mx.edu.utez.sivemorapp.modules.verificaciones;

import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    List<Verificacion> findByActivoTrue();

    List<Verificacion> findByActivoTrueAndVehiculo_Id(Long idVehiculo);

    List<Verificacion> findByActivoTrueAndNota_Id(Long idNota);

    List<Verificacion> findByActivoTrueAndMateria(Materia materia);

    List<Verificacion> findByActivoTrueAndDictamen(Dictamen dictamen);

    Optional<Verificacion> findByFolioVerificacion(String folio);

    boolean existsByVehiculo_IdAndActivoTrue(Long idVehiculo);

    long countByNota_IdAndActivoTrue(Long idNota);
}
