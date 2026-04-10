package mx.edu.utez.sivemorapp.modules.regiones;

import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {

    List<Region> findByActivoTrue();
    Optional<Region> findByIdAndActivoTrue(Long id);

    List<Region> findByActivoTrueAndNombreContainingIgnoreCase(String nombre);

    Optional<Region> findByNombreIgnoreCase(String nombre);
}
