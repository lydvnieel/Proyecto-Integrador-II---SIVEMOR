package mx.edu.utez.sivemorapp.modules.regiones;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {

    List<Region> findByActivoTrue();

    List<Region> findByActivoTrueAndNombreContainingIgnoreCase(String nombre);

    Optional<Region> findByNombreIgnoreCase(String nombre);
}
