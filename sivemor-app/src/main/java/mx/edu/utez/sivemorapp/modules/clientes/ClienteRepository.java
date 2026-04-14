package mx.edu.utez.sivemorapp.modules.clientes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByActivoTrue();

    Optional<Cliente> findByIdAndActivoTrue(Long id);
    Optional<Cliente> findByRazonSocialIgnoreCase(String razonSocial);

    List<Cliente> findByActivoTrueAndRazonSocialContainingIgnoreCase(String razonSocial);

    List<Cliente> findByActivoTrueAndGestorContainingIgnoreCase(String gestor);

    List<Cliente> findByActivoTrueAndRazonSocialContainingIgnoreCaseAndGestorContainingIgnoreCase(String razonSocial, String gestor);
}
