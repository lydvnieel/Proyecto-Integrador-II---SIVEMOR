package mx.edu.utez.sivemorapp.modules.cedis;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CedisRepository extends JpaRepository<Cedis, Long> {
    List<Cedis> findByActivoTrue();
    List<Cedis> findByActivoTrueAndCliente_Id(Long idCliente);

    List<Cedis> findByActivoTrueAndRegion_Id(Long idRegion);

    List<Cedis> findByActivoTrueAndNombreContainingIgnoreCase(String nombre);

    List<Cedis> findByActivoTrueAndCliente_IdAndRegion_Id(Long idCliente, Long idRegion);

    List<Cedis> findByActivoTrueAndCliente_IdAndNombreContainingIgnoreCase(Long idCliente, String nombre);

    List<Cedis> findByActivoTrueAndRegion_IdAndNombreContainingIgnoreCase(Long idRegion, String nombre);

    List<Cedis> findByActivoTrueAndCliente_IdAndRegion_IdAndNombreContainingIgnoreCase(Long idCliente, Long idRegion, String nombre);
}
