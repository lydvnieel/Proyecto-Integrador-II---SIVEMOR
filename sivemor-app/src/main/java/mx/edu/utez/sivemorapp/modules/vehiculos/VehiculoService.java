package mx.edu.utez.sivemorapp.modules.vehiculos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.cedis.Cedis;
import mx.edu.utez.sivemorapp.modules.cedis.CedisRepository;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.clientes.ClienteRepository;
import mx.edu.utez.sivemorapp.modules.evaluaciones.Evaluacion;
import mx.edu.utez.sivemorapp.modules.evaluaciones.EvaluacionRepository;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.utils.EvaluacionMapper;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import mx.edu.utez.sivemorapp.modules.vehiculos.dtos.VehiculoRequestDTO;
import mx.edu.utez.sivemorapp.modules.vehiculos.dtos.utils.VehiculoMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;
    private final ClienteRepository clienteRepository;
    private final CedisRepository cedisRepository;
    private final VerificacionRepository verificacionRepository;
    private final EvaluacionRepository evaluacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> filterVehiculos(Long idCliente, Long idCedis, String placa) {
        ApiResponse response;

        try {
            List<Vehiculo> vehiculos;

            if (idCliente != null && idCedis != null && placa != null && !placa.isBlank()) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCliente_IdAndCedis_IdAndPlacaContainingIgnoreCase(
                        idCliente, idCedis, placa
                );
            } else if (idCliente != null && idCedis != null) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCliente_IdAndCedis_Id(idCliente, idCedis);
            } else if (idCliente != null && placa != null && !placa.isBlank()) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCliente_IdAndPlacaContainingIgnoreCase(idCliente, placa);
            } else if (idCedis != null && placa != null && !placa.isBlank()) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCedis_IdAndPlacaContainingIgnoreCase(idCedis, placa);
            } else if (idCliente != null) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCliente_Id(idCliente);
            } else if (idCedis != null) {
                vehiculos = vehiculoRepository.findByActivoTrueAndCedis_Id(idCedis);
            } else if (placa != null && !placa.isBlank()) {
                vehiculos = vehiculoRepository.findByActivoTrueAndPlacaContainingIgnoreCase(placa);
            } else {
                vehiculos = vehiculoRepository.findByActivoTrue();
            }

            response = new ApiResponse(
                    "Operación exitosa",
                    VehiculoMapper.toDtoList(vehiculos),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al consultar vehículos", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findByVehiculo(Long vehicleId) {
        try {
            List<Evaluacion> evaluaciones =
                    evaluacionRepository.findActivasByVehiculoId(vehicleId);

            return ResponseEntity.ok(
                    new ApiResponse("Operación exitosa", EvaluacionMapper.toDtoList(evaluaciones), HttpStatus.OK)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al consultar evaluaciones del vehículo", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> saveVehiculo(VehiculoRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getIdCliente() == null) {
                response = new ApiResponse("El cliente es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdCedis() == null) {
                response = new ApiResponse("El CEDIS es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getPlaca() == null || dto.getPlaca().isBlank()) {
                response = new ApiResponse("La placa es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getSerie() == null || dto.getSerie().isBlank()) {
                response = new ApiResponse("La serie es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTipo() == null || dto.getTipo().isBlank()) {
                response = new ApiResponse("El tipo es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            String placa = dto.getPlaca().trim().toUpperCase();
            String serie = dto.getSerie().trim().toUpperCase();

            if (!placa.matches("^[A-Z0-9-]{5,10}$")) {
                response = new ApiResponse("Formato de placa inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!serie.matches("^[A-HJ-NPR-Z0-9]{17}$")) {
                response = new ApiResponse("Formato de serie inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (vehiculoRepository.findByPlacaIgnoreCase(placa).isPresent()) {
                response = new ApiResponse("Ya existe un vehículo con esa placa", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (vehiculoRepository.findBySerieIgnoreCase(serie).isPresent()) {
                response = new ApiResponse("Ya existe un vehículo con esa serie", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente cliente = clienteRepository.findById(dto.getIdCliente()).orElse(null);
            if (cliente == null || !Boolean.TRUE.equals(cliente.getActivo())) {
                response = new ApiResponse("Cliente no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cedis cedis = cedisRepository.findById(dto.getIdCedis()).orElse(null);
            if (cedis == null || !Boolean.TRUE.equals(cedis.getActivo())) {
                response = new ApiResponse("CEDIS no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (cedis.getCliente() == null || !cedis.getCliente().getId().equals(cliente.getId())) {
                response = new ApiResponse("El CEDIS no pertenece al cliente seleccionado", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Vehiculo vehiculo = Vehiculo.builder()
                    .cliente(cliente)
                    .cedis(cedis)
                    .placa(placa)
                    .serie(serie)
                    .tipo(dto.getTipo().trim())
                    .build();

            vehiculo.setActivo(true);

            Vehiculo saved = vehiculoRepository.save(vehiculo);

            response = new ApiResponse(
                    "Operación exitosa",
                    VehiculoMapper.toDto(saved),
                    HttpStatus.CREATED
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("No se hizo el registro", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> updateVehiculo(VehiculoRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getId() == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Vehiculo found = vehiculoRepository.findById(dto.getId()).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdCliente() == null) {
                response = new ApiResponse("El cliente es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdCedis() == null) {
                response = new ApiResponse("El CEDIS es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getPlaca() == null || dto.getPlaca().isBlank()) {
                response = new ApiResponse("La placa es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getSerie() == null || dto.getSerie().isBlank()) {
                response = new ApiResponse("La serie es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTipo() == null || dto.getTipo().isBlank()) {
                response = new ApiResponse("El tipo es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            String placa = dto.getPlaca().trim().toUpperCase();
            String serie = dto.getSerie().trim().toUpperCase();

            if (!placa.matches("^[A-Z0-9-]{5,10}$")) {
                response = new ApiResponse("Formato de placa inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!serie.matches("^[A-HJ-NPR-Z0-9]{17}$")) {
                response = new ApiResponse("Formato de serie inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            vehiculoRepository.findByPlacaIgnoreCase(placa).ifPresent(vehiculo -> {
                if (!vehiculo.getId().equals(found.getId())) {
                    throw new RuntimeException("Ya existe un vehículo con esa placa");
                }
            });

            vehiculoRepository.findBySerieIgnoreCase(serie).ifPresent(vehiculo -> {
                if (!vehiculo.getId().equals(found.getId())) {
                    throw new RuntimeException("Ya existe un vehículo con esa serie");
                }
            });

            Cliente cliente = clienteRepository.findById(dto.getIdCliente()).orElse(null);
            if (cliente == null || !Boolean.TRUE.equals(cliente.getActivo())) {
                response = new ApiResponse("Cliente no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cedis cedis = cedisRepository.findById(dto.getIdCedis()).orElse(null);
            if (cedis == null || !Boolean.TRUE.equals(cedis.getActivo())) {
                response = new ApiResponse("CEDIS no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (cedis.getCliente() == null || !cedis.getCliente().getId().equals(cliente.getId())) {
                response = new ApiResponse("El CEDIS no pertenece al cliente seleccionado", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setCliente(cliente);
            found.setCedis(cedis);
            found.setPlaca(placa);
            found.setSerie(serie);
            found.setTipo(dto.getTipo().trim());

            Vehiculo updated = vehiculoRepository.save(found);

            response = new ApiResponse(
                    "Operación exitosa",
                    VehiculoMapper.toDto(updated),
                    HttpStatus.OK
            );

        } catch (RuntimeException e) {
            response = new ApiResponse(e.getMessage(), true, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al actualizar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> deleteVehiculo(Long id) {
        ApiResponse response;

        try {
            if (id == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Vehiculo found = vehiculoRepository.findById(id).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneVerificaciones = verificacionRepository.existsByVehiculo_IdAndActivoTrue(id);
            if (tieneVerificaciones) {
                response = new ApiResponse(
                        "No se puede eliminar el vehículo porque tiene verificaciones asociadas",
                        true,
                        HttpStatus.BAD_REQUEST
                );
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setActivo(false);
            vehiculoRepository.save(found);

            response = new ApiResponse("Operación exitosa", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al eliminar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }
}