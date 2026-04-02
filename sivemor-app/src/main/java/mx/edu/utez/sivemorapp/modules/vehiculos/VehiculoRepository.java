package mx.edu.utez.sivemorapp.modules.vehiculos;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    List<Vehiculo> findByActivoTrue();

    List<Vehiculo> findByActivoTrueAndCliente_Id(Long idCliente);

    List<Vehiculo> findByActivoTrueAndCedis_Id(Long idCedis);

    List<Vehiculo> findByActivoTrueAndPlacaContainingIgnoreCase(String placa);

    List<Vehiculo> findByActivoTrueAndCliente_IdAndCedis_Id(Long idCliente, Long idCedis);

    List<Vehiculo> findByActivoTrueAndCliente_IdAndPlacaContainingIgnoreCase(Long idCliente, String placa);

    List<Vehiculo> findByActivoTrueAndCedis_IdAndPlacaContainingIgnoreCase(Long idCedis, String placa);

    List<Vehiculo> findByActivoTrueAndCliente_IdAndCedis_IdAndPlacaContainingIgnoreCase(Long idCliente, Long idCedis, String placa);

    Optional<Vehiculo> findByPlacaIgnoreCase(String placa);

    Optional<Vehiculo> findBySerieIgnoreCase(String serie);

    boolean existsByCedis_IdAndActivoTrue(Long idCedis);
}
