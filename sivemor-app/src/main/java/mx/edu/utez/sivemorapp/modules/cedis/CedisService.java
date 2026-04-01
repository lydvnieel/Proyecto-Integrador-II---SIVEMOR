package mx.edu.utez.sivemorapp.modules.cedis;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.cedis.dtos.CedisRequestDTO;
import mx.edu.utez.sivemorapp.modules.cedis.dtos.CedisResponseDTO;
import mx.edu.utez.sivemorapp.modules.cedis.dtos.utils.CedisMapper;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.clientes.ClienteRepository;
import mx.edu.utez.sivemorapp.modules.regiones.Region;
import mx.edu.utez.sivemorapp.modules.regiones.RegionRepository;
import mx.edu.utez.sivemorapp.modules.vehiculos.VehiculoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
@Service
@RequiredArgsConstructor
public class CedisService {
    private final CedisRepository cedisRepository;
    private final ClienteRepository clienteRepository;
    private final RegionRepository regionRepository;
    private final VehiculoRepository vehiculoRepository;

    //Obtener todos cedis activos
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAllCedis() {
        ApiResponse response = new ApiResponse(
                "Operacion exitosa",
                CedisMapper.toDtoList(cedisRepository.findByActivoTrue()),
                HttpStatus.OK
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    //Obtener por ID
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findCedisById(Long id) {
        ApiResponse response;
        Cedis found = cedisRepository.findById(id).orElse(null);
        if (found != null && Boolean.TRUE.equals(found.getActivo())) {
            response = new ApiResponse(
                    "Operacion exitosa", CedisMapper.toDto(found), HttpStatus.OK);
        } else {
            response = new ApiResponse("Recurso no encontrado", true, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> saveCedis(CedisRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getIdCliente() == null) {
                response = new ApiResponse("El cliente es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdRegion() == null) {
                response = new ApiResponse("La región es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getNombre() == null || dto.getNombre().isBlank()) {
                response = new ApiResponse("El nombre es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getDireccion() == null || dto.getDireccion().isBlank()) {
                response = new ApiResponse("La dirección es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getEncargado() == null || dto.getEncargado().isBlank()) {
                response = new ApiResponse("El encargado es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getCorreo() == null || dto.getCorreo().isBlank()) {
                response = new ApiResponse("El correo es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefono() == null || dto.getTelefono().isBlank()) {
                response = new ApiResponse("El teléfono es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response = new ApiResponse("Formato de correo inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!dto.getTelefono().matches("\\d+")) {
                response = new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefonoAlternativo() != null
                    && !dto.getTelefonoAlternativo().isBlank()
                    && !dto.getTelefonoAlternativo().matches("\\d+")) {
                response = new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente cliente = clienteRepository.findById(dto.getIdCliente()).orElse(null);
            if (cliente == null) {
                response = new ApiResponse("Cliente no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Region region = regionRepository.findById(dto.getIdRegion()).orElse(null);
            if (region == null) {
                response = new ApiResponse("Región no encontrada", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cedis cedis = Cedis.builder()
                    .cliente(cliente)
                    .region(region)
                    .nombre(dto.getNombre())
                    .direccion(dto.getDireccion())
                    .encargado(dto.getEncargado())
                    .correo(dto.getCorreo())
                    .telefono(dto.getTelefono())
                    .telefonoAlternativo(dto.getTelefonoAlternativo())
                    .build();

            cedis.setActivo(true);

            cedisRepository.save(cedis);
            response = new ApiResponse("Operación exitosa", HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("No se hizo el registro", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> updateCedis(CedisRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getId() == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cedis found = cedisRepository.findById(dto.getId()).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdCliente() == null) {
                response = new ApiResponse("El cliente es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getIdRegion() == null) {
                response = new ApiResponse("La región es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getNombre() == null || dto.getNombre().isBlank()) {
                response = new ApiResponse("El nombre es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getDireccion() == null || dto.getDireccion().isBlank()) {
                response = new ApiResponse("La dirección es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getEncargado() == null || dto.getEncargado().isBlank()) {
                response = new ApiResponse("El encargado es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getCorreo() == null || dto.getCorreo().isBlank()) {
                response = new ApiResponse("El correo es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefono() == null || dto.getTelefono().isBlank()) {
                response = new ApiResponse("El teléfono es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response = new ApiResponse("Formato de correo inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (!dto.getTelefono().matches("\\d+")) {
                response = new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefonoAlternativo() != null
                    && !dto.getTelefonoAlternativo().isBlank()
                    && !dto.getTelefonoAlternativo().matches("\\d+")) {
                response = new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente cliente = clienteRepository.findById(dto.getIdCliente()).orElse(null);
            if (cliente == null) {
                response = new ApiResponse("Cliente no encontrado", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Region region = regionRepository.findById(dto.getIdRegion()).orElse(null);
            if (region == null) {
                response = new ApiResponse("Región no encontrada", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setCliente(cliente);
            found.setRegion(region);
            found.setNombre(dto.getNombre());
            found.setDireccion(dto.getDireccion());
            found.setEncargado(dto.getEncargado());
            found.setCorreo(dto.getCorreo());
            found.setTelefono(dto.getTelefono());
            found.setTelefonoAlternativo(dto.getTelefonoAlternativo());

            cedisRepository.save(found);
            response = new ApiResponse("Operación exitosa", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al actualizar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> deleteCedis(Long id) {
        ApiResponse response;

        try {
            if (id == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cedis found = cedisRepository.findById(id).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneVehiculos = vehiculoRepository.existsByCedis_IdAndActivoTrue(found.getId());
            if (tieneVehiculos) {
                response = new ApiResponse(
                        "No se puede eliminar el CEDIS porque tiene vehículos asociados",
                        true,
                        HttpStatus.BAD_REQUEST
                );
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setActivo(false);
            cedisRepository.save(found);

            response = new ApiResponse("Operación exitosa", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al eliminar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> filterCedis(Long idCliente, Long idRegion, String nombre) {
        ApiResponse response;

        try {
            if (idCliente != null && idRegion != null && nombre != null && !nombre.isBlank()) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndCliente_IdAndRegion_IdAndNombreContainingIgnoreCase(
                                        idCliente, idRegion, nombre
                                )
                        ),
                        HttpStatus.OK
                );
            } else if (idCliente != null && idRegion != null) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndCliente_IdAndRegion_Id(idCliente, idRegion)
                        ),
                        HttpStatus.OK
                );
            } else if (idCliente != null && nombre != null && !nombre.isBlank()) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndCliente_IdAndNombreContainingIgnoreCase(idCliente, nombre)
                        ),
                        HttpStatus.OK
                );
            } else if (idRegion != null && nombre != null && !nombre.isBlank()) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndRegion_IdAndNombreContainingIgnoreCase(idRegion, nombre)
                        ),
                        HttpStatus.OK
                );
            } else if (idCliente != null) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndCliente_Id(idCliente)
                        ),
                        HttpStatus.OK
                );
            } else if (idRegion != null) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndRegion_Id(idRegion)
                        ),
                        HttpStatus.OK
                );
            } else if (nombre != null && !nombre.isBlank()) {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(
                                cedisRepository.findByActivoTrueAndNombreContainingIgnoreCase(nombre)
                        ),
                        HttpStatus.OK
                );
            } else {
                response = new ApiResponse(
                        "Operación exitosa",
                        CedisMapper.toDtoList(cedisRepository.findByActivoTrue()),
                        HttpStatus.OK
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al consultar CEDIS", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }
}
