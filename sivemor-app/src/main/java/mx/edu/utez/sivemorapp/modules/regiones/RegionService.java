package mx.edu.utez.sivemorapp.modules.regiones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.cedis.CedisRepository;
import mx.edu.utez.sivemorapp.modules.regiones.dtos.RegionRequestDTO;
import mx.edu.utez.sivemorapp.modules.regiones.dtos.utils.RegionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository regionRepository;
    private final CedisRepository cedisRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> filterRegiones(String nombre) {
        ApiResponse response;

        try {
            List<Region> regiones;

            if (nombre != null && !nombre.isBlank()) {
                regiones = regionRepository.findByActivoTrueAndNombreContainingIgnoreCase(nombre);
            } else {
                regiones = regionRepository.findByActivoTrue();
            }

            response = new ApiResponse(
                    "Operación exitosa",
                    RegionMapper.toDtoList(regiones),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al consultar regiones", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        ApiResponse response;
        Region found = regionRepository.findById(id).orElse(null);

        if (found != null && Boolean.TRUE.equals(found.getActivo())) {
            response = new ApiResponse("Operación exitosa", RegionMapper.toDto(found), HttpStatus.OK);
        } else {
            response = new ApiResponse("Recurso no encontrado", true, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(RegionRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getNombre() == null || dto.getNombre().isBlank()) {
                response = new ApiResponse("El nombre es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean existe = regionRepository.findByNombreIgnoreCase(dto.getNombre()).isPresent();
            if (existe) {
                response = new ApiResponse("Ya existe una región con ese nombre", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Region region = Region.builder()
                    .nombre(dto.getNombre().trim())
                    .descripcion(
                            dto.getDescripcion() == null || dto.getDescripcion().isBlank()
                                    ? ""
                                    : dto.getDescripcion().trim()
                    )
                    .build();

            region.setActivo(true);

            Region saved = regionRepository.save(region);

            response = new ApiResponse(
                    "Operación exitosa",
                    RegionMapper.toDto(saved),
                    HttpStatus.CREATED
            );

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al registrar región", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(RegionRequestDTO dto) {
        ApiResponse response;

        try {
            if (dto.getId() == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Region found = regionRepository.findById(dto.getId()).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            if (dto.getNombre() == null || dto.getNombre().isBlank()) {
                response = new ApiResponse("El nombre es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            regionRepository.findByNombreIgnoreCase(dto.getNombre()).ifPresent(region -> {
                if (!region.getId().equals(found.getId())) {
                    throw new RuntimeException("Ya existe una región con ese nombre");
                }
            });

            found.setNombre(dto.getNombre());

            Region updated = regionRepository.save(found);

            response = new ApiResponse(
                    "Operación exitosa",
                    RegionMapper.toDto(updated),
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
    public ResponseEntity<ApiResponse> delete(Long id) {
        ApiResponse response;

        try {
            if (id == null) {
                response = new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            Region found = regionRepository.findById(id).orElse(null);
            if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                response = new ApiResponse("El recurso no existe", true, HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(response, response.getStatus());
            }

            boolean tieneCedis = !cedisRepository.findByActivoTrueAndRegion_Id(id).isEmpty();
            if (tieneCedis) {
                response = new ApiResponse("No se puede eliminar la región porque tiene CEDIS asociados", true, HttpStatus.BAD_REQUEST);
                return new ResponseEntity<>(response, response.getStatus());
            }

            found.setActivo(false);
            regionRepository.save(found);

            response = new ApiResponse("Operación exitosa", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            response = new ApiResponse("Error al eliminar", true, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, response.getStatus());
    }
}