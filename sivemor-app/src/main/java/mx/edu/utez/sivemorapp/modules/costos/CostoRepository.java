package mx.edu.utez.sivemorapp.modules.costos;

import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CostoRepository extends JpaRepository<Costo, Long> {

    Optional<Costo> findByIdAndActivoTrue(Long id);

    List<Costo> findByActivoTrue();

    List<Costo> findByActivoTrueAndCliente_Id(Long idCliente);

    List<Costo> findByActivoTrueAndMateria(Materia materia);

    List<Costo> findByActivoTrueAndEncargado_Id(Long idEncargado);

    List<Costo> findByActivoTrueAndAtiendeYCobra_Id(Long idAtiendeYCobra);

    List<Costo> findByActivoTrueAndCliente_IdAndMateria(Long idCliente, Materia materia);

    boolean existsByCliente_IdAndMateriaAndActivoTrue(Long idCliente, Materia materia);

    boolean existsByCliente_IdAndMateriaAndIdNotAndActivoTrue(Long idCliente, Materia materia, Long id);
}