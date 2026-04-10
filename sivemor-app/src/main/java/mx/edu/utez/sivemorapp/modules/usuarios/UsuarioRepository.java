package mx.edu.utez.sivemorapp.modules.usuarios;

import mx.edu.utez.sivemorapp.kernel.enums.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByIdAndActivoTrue(Long id);

    Optional<Usuario> findByEmailAndActivoTrue(String email);
    Optional<Usuario> findByEmailIgnoreCaseAndActivoTrue(String email);

    Optional<Usuario> findByNombreUsuarioAndActivoTrue(String nombreUsuario);

    boolean existsByNombreUsuarioIgnoreCase(String nombreUsuario);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByNombreUsuarioIgnoreCaseAndIdNot(String nombreUsuario, Long id);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    List<Usuario> findByActivoTrue();
    List<Usuario> findByActivoTrueAndTipoUsuario(TipoUsuario tipoUsuario);
    List<Usuario> findByActivoTrueAndNombreUsuarioContainingIgnoreCase(String nombreUsuario);
    List<Usuario> findByActivoTrueAndEmailContainingIgnoreCase(String email);
}