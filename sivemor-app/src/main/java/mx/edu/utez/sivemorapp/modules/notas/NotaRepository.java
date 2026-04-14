package mx.edu.utez.sivemorapp.modules.notas;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotaRepository extends JpaRepository<Notas, Long> {
    boolean existsByCliente_IdAndActivoTrue(Long idCliente);
    boolean existsByVerificentro_IdAndActivoTrue(Long idVerificentro);
    Optional<Notas> findByIdAndActivoTrue(Long id);
    Optional<Notas> findByFolioNotaAndActivoTrue(String folioNota);

    List<Notas> findByActivoTrue();
    List<Notas> findByActivoTrueAndCliente_Id(Long idCliente);
    List<Notas> findByActivoTrueAndVerificentro_Id(Long idVerificentro);
    List<Notas> findByActivoTrueAndFolioNotaContainingIgnoreCase(String folioNota);
    List<Notas> findByActivoTrueAndFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);
    long countByActivoTrue();
}
