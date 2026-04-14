package mx.edu.utez.sivemorapp.modules.clientes;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.cedis.CedisRepository;
import mx.edu.utez.sivemorapp.modules.clientes.dtos.ClienteRequestDTO;
import mx.edu.utez.sivemorapp.modules.clientes.utils.ClienteMapper;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.vehiculos.VehiculoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final CedisRepository  cedisRepository;
    private final VehiculoRepository vehiculoRepository;
    private final NotaRepository  notaRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAllClientes(){
        ApiResponse response = new ApiResponse(
                "Operacion exitosa",
                ClienteMapper.toDtoList(clienteRepository.findByActivoTrue()),
                HttpStatus.OK
        );
        return new  ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findClienteById(Long id){
        ApiResponse response;
        Cliente found = clienteRepository.findById(id).orElse(null);
        if(found != null && Boolean.TRUE.equals(found.getActivo())){
            response = new ApiResponse("Operacion exitosa", ClienteMapper.toDto(found), HttpStatus.OK);
        }else{
            response = new ApiResponse("Recurso no encontrado", true, HttpStatus.NOT_FOUND);
        }

        return new   ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> filterClientes(String razonSocial, String gestor) {
        ApiResponse response;

        try {
            List<Cliente> clientes;

            if (razonSocial != null && !razonSocial.isBlank() && gestor != null && !gestor.isBlank()) {
                clientes = clienteRepository.findByActivoTrueAndRazonSocialContainingIgnoreCaseAndGestorContainingIgnoreCase(
                        razonSocial, gestor
                );
            } else if (razonSocial != null && !razonSocial.isBlank()) {
                clientes = clienteRepository.findByActivoTrueAndRazonSocialContainingIgnoreCase(razonSocial);
            } else if (gestor != null && !gestor.isBlank()) {
                clientes = clienteRepository.findByActivoTrueAndGestorContainingIgnoreCase(gestor);
            } else {
                clientes = clienteRepository.findByActivoTrue();
            }

            response = new ApiResponse(
                    "Operación exitosa",
                    ClienteMapper.toDtoList(clientes),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al consultar clientes", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }


    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> saveCliente(ClienteRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getRazonSocial() == null || dto.getRazonSocial().isBlank()) {
                response = new ApiResponse("La razón social es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getGestor() == null || dto.getGestor().isBlank()) {
                response = new ApiResponse("El gestor es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getEmail() != null && !dto.getEmail().isBlank()
                    && !dto.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response = new ApiResponse("Formato de correo inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefono() != null && !dto.getTelefono().isBlank()
                    && !dto.getTelefono().matches("\\d+")) {
                response = new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefonoAlternativo() != null && !dto.getTelefonoAlternativo().isBlank()
                    && !dto.getTelefonoAlternativo().matches("\\d+")) {
                response = new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean existeRazonSocial = clienteRepository.findByRazonSocialIgnoreCase(dto.getRazonSocial()).isPresent();
            if (existeRazonSocial) {
                response = new ApiResponse("Ya existe un cliente con esa razón social", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente cliente = Cliente.builder()
                    .razonSocial(dto.getRazonSocial())
                    .email(dto.getEmail())
                    .telefono(dto.getTelefono())
                    .telefonoAlternativo(dto.getTelefonoAlternativo())
                    .gestor(dto.getGestor())
                    .build();

            cliente.setActivo(true);

            Cliente saved = clienteRepository.save(cliente);

            response = new ApiResponse(
                    "Operación exitosa",
                    ClienteMapper.toDto(saved),
                    HttpStatus.CREATED
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("No se hizo el registro", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> updateCliente(ClienteRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getId() == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente found = clienteRepository.findById(dto.getId()).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getRazonSocial() == null || dto.getRazonSocial().isBlank()) {
                response = new ApiResponse("La razón social es obligatoria", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getGestor() == null || dto.getGestor().isBlank()) {
                response = new ApiResponse("El gestor es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getEmail() != null && !dto.getEmail().isBlank()
                    && !dto.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response = new ApiResponse("Formato de correo inválido", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefono() != null && !dto.getTelefono().isBlank()
                    && !dto.getTelefono().matches("\\d+")) {
                response = new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getTelefonoAlternativo() != null && !dto.getTelefonoAlternativo().isBlank()
                    && !dto.getTelefonoAlternativo().matches("\\d+")) {
                response = new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            clienteRepository.findByRazonSocialIgnoreCase(dto.getRazonSocial()).ifPresent(cliente -> {
                if (!cliente.getId().equals(found.getId())) {
                    throw new RuntimeException("Ya existe un cliente con esa razón social");
                }
            });

            found.setRazonSocial(dto.getRazonSocial());
            found.setEmail(dto.getEmail());
            found.setTelefono(dto.getTelefono());
            found.setTelefonoAlternativo(dto.getTelefonoAlternativo());
            found.setGestor(dto.getGestor());

            Cliente updated = clienteRepository.save(found);

            response = new ApiResponse(
                    "Operación exitosa",
                    ClienteMapper.toDto(updated),
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
    public ResponseEntity<ApiResponse> deleteCliente(Long id) {
        ApiResponse response;

        try {
            if (id == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Cliente found = clienteRepository.findById(id).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneCedis = !cedisRepository.findByActivoTrueAndCliente_Id(id).isEmpty();
            if (tieneCedis) {
                response = new ApiResponse("No se puede eliminar el cliente porque tiene CEDIS asociados", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneVehiculos = !vehiculoRepository.findByActivoTrueAndCliente_Id(id).isEmpty();
            if (tieneVehiculos) {
                response = new ApiResponse("No se puede eliminar el cliente porque tiene vehículos asociados", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneNotas = notaRepository.existsByCliente_IdAndActivoTrue(id);
            if (tieneNotas) {
                response = new ApiResponse("No se puede eliminar el cliente porque tiene notas asociadas", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setActivo(false);
            clienteRepository.save(found);

            response = new ApiResponse("Operación exitosa", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al eliminar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }
}
