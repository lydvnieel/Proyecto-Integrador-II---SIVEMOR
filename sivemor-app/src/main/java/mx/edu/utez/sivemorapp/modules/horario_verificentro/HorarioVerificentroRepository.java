package mx.edu.utez.sivemorapp.modules.horario_verificentro;

import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HorarioVerificentroRepository extends JpaRepository<HorarioVerificentro, Long> {

    Optional<HorarioVerificentro> findByIdAndActivoTrue(Long id);

    List<HorarioVerificentro> findByActivoTrue();

    List<HorarioVerificentro> findByActivoTrueAndVerificentro_Id(Long idVerificentro);

    List<HorarioVerificentro> findByActivoTrueAndDiaSemana(DiaSemana diaSemana);

    List<HorarioVerificentro> findByActivoTrueAndVerificentro_IdAndDiaSemana(Long idVerificentro, DiaSemana diaSemana);

    boolean existsByVerificentro_IdAndDiaSemanaAndActivoTrue(Long idVerificentro, DiaSemana diaSemana);

    boolean existsByVerificentro_IdAndDiaSemanaAndIdNotAndActivoTrue(Long idVerificentro, DiaSemana diaSemana, Long id);
}