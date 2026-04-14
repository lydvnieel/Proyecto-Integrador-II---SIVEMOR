package mx.edu.utez.sivemorapp.modules.pedidos;

import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByIdAndActivoTrue(Long id);

    List<Pedido> findByActivoTrue();

    List<Pedido> findByActivoTrueAndNota_Id(Long idNota);

    List<Pedido> findByActivoTrueAndEstatusEnvio(EstatusEnvio estatusEnvio);

    List<Pedido> findByActivoTrueAndRecibioContainingIgnoreCase(String recibio);

    List<Pedido> findByActivoTrueAndFechaEnvioBetween(LocalDateTime inicio, LocalDateTime fin);
    long countByActivoTrue();

    long countByActivoTrueAndEstatusEnvio(mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio estatusEnvio);
}