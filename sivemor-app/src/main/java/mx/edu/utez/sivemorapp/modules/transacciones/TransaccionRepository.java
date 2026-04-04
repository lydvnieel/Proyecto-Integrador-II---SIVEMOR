package mx.edu.utez.sivemorapp.modules.transacciones;

import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    Optional<Transaccion> findByIdAndActivoTrue(Long id);

    boolean existsByNota_IdAndActivoTrue(Long idNota);

    List<Transaccion> findByActivoTrue();

    List<Transaccion> findByActivoTrueAndNota_Id(Long idNota);

    List<Transaccion> findByActivoTrueAndTipoPago(TipoPago tipoPago);

    List<Transaccion> findByActivoTrueAndFechaPedidoBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Transaccion> findByActivoTrueAndAtendio_Id(Long idAtendio);

    List<Transaccion> findByActivoTrueAndPagado(Boolean pagado);

    List<Transaccion> findByActivoTrueAndPendiente(Boolean pendiente);

    List<Transaccion> findByActivoTrueAndNumeroFacturaContainingIgnoreCase(String numeroFactura);

    List<Transaccion> findByActivoTrueAndNota_IdAndTipoPago(Long idNota, TipoPago tipoPago);

    List<Transaccion> findByActivoTrueAndNota_IdAndAtendio_Id(Long idNota, Long idAtendio);

    List<Transaccion> findByActivoTrueAndNota_IdAndPagado(Long idNota, Boolean pagado);

    List<Transaccion> findByActivoTrueAndNota_IdAndPendiente(Long idNota, Boolean pendiente);

    List<Transaccion> findByActivoTrueAndNota_IdAndNumeroFacturaContainingIgnoreCase(Long idNota, String numeroFactura);
}