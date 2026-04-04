package mx.edu.utez.sivemorapp.modules.verificentros;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificentroRepository extends JpaRepository<Verificentro, Long> {

    Optional<Verificentro> findByIdAndActivoTrue(Long id);

    Optional<Verificentro> findByClaveVerificentroAndActivoTrue(String claveVerificentro);

    boolean existsByClaveVerificentro(String claveVerificentro);

    boolean existsByClaveVerificentroAndIdNot(String claveVerificentro, Long id);

    List<Verificentro> findByActivoTrue();

    List<Verificentro> findByActivoTrueAndRegion_Id(Long idRegion);

    List<Verificentro> findByActivoTrueAndNombreContainingIgnoreCase(String nombre);

    List<Verificentro> findByActivoTrueAndRegion_IdAndNombreContainingIgnoreCase(Long idRegion, String nombre);
}