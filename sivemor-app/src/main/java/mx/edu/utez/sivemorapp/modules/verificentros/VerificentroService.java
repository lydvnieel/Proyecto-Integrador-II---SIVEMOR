package mx.edu.utez.sivemorapp.modules.verificentros;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.regiones.Region;
import mx.edu.utez.sivemorapp.modules.regiones.RegionRepository;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import mx.edu.utez.sivemorapp.modules.verificentros.dtos.VerificentroRequestDTO;
import mx.edu.utez.sivemorapp.modules.verificentros.dtos.utils.VerificentroMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificentroService {

    private final VerificentroRepository verificentroRepository;
    private final RegionRepository regionRepository;
    private final NotaRepository notaRepository;
    private final VerificacionRepository verificacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idRegion, String nombre) {
        List<Verificentro> result;

        if (idRegion != null && nombre != null && !nombre.isBlank()) {
            result = verificentroRepository.findByActivoTrueAndRegion_IdAndNombreContainingIgnoreCase(idRegion, nombre.trim());
        } else if (idRegion != null) {
            result = verificentroRepository.findByActivoTrueAndRegion_Id(idRegion);
        } else if (nombre != null && !nombre.isBlank()) {
            result = verificentroRepository.findByActivoTrueAndNombreContainingIgnoreCase(nombre.trim());
        } else {
            result = verificentroRepository.findByActivoTrue();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", VerificentroMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Verificentro found = verificentroRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El verificentro no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", VerificentroMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(VerificentroRequestDTO dto) {

        if (dto.getIdRegion() == null
                || dto.getNombre() == null || dto.getNombre().isBlank()
                || dto.getClaveVerificentro() == null || dto.getClaveVerificentro().isBlank()
                || dto.getDireccion() == null || dto.getDireccion().isBlank()
                || dto.getResponsable() == null || dto.getResponsable().isBlank()
                || dto.getHorarioGeneral() == null || dto.getHorarioGeneral().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        Region region = regionRepository.findByIdAndActivoTrue(dto.getIdRegion()).orElse(null);
        if (region == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La región no existe", true, HttpStatus.NOT_FOUND));
        }

        if (verificentroRepository.existsByClaveVerificentro(dto.getClaveVerificentro().trim())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La clave del verificentro ya está registrada", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getCorreo() != null && !dto.getCorreo().isBlank() && !dto.getCorreo()
                .matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El correo no tiene un formato válido", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getTelefono() != null && !dto.getTelefono().isBlank() && !dto.getTelefono().matches("^[0-9]+$")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getTelefonoAlternativo() != null
                && !dto.getTelefonoAlternativo().isBlank()
                && !dto.getTelefonoAlternativo().matches("^[0-9]+$")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST));
        }

        Verificentro verificentro = Verificentro.builder()
                .region(region)
                .nombre(dto.getNombre().trim())
                .claveVerificentro(dto.getClaveVerificentro().trim())
                .direccion(dto.getDireccion().trim())
                .responsable(dto.getResponsable().trim())
                .correo(dto.getCorreo() != null ? dto.getCorreo().trim() : null)
                .telefono(dto.getTelefono() != null ? dto.getTelefono().trim() : null)
                .telefonoAlternativo(dto.getTelefonoAlternativo() != null ? dto.getTelefonoAlternativo().trim() : null)
                .horarioGeneral(dto.getHorarioGeneral().trim())
                .build();

        verificentro.setActivo(true);

        Verificentro saved = verificentroRepository.save(verificentro);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Verificentro creado", VerificentroMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, VerificentroRequestDTO dto) {
        Verificentro found = verificentroRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El verificentro no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdRegion() != null) {
            Region region = regionRepository.findByIdAndActivoTrue(dto.getIdRegion()).orElse(null);
            if (region == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("La región no existe", true, HttpStatus.NOT_FOUND));
            }
            found.setRegion(region);
        }

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            found.setNombre(dto.getNombre().trim());
        }

        if (dto.getClaveVerificentro() != null && !dto.getClaveVerificentro().isBlank()) {
            String nuevaClave = dto.getClaveVerificentro().trim();

            if (verificentroRepository.existsByClaveVerificentroAndIdNot(nuevaClave, id)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("La clave del verificentro ya está registrada", true, HttpStatus.BAD_REQUEST));
            }

            found.setClaveVerificentro(nuevaClave);
        }

        if (dto.getDireccion() != null && !dto.getDireccion().isBlank()) {
            found.setDireccion(dto.getDireccion().trim());
        }

        if (dto.getResponsable() != null && !dto.getResponsable().isBlank()) {
            found.setResponsable(dto.getResponsable().trim());
        }

        if (dto.getCorreo() != null) {
            if (!dto.getCorreo().isBlank() &&
                    !dto.getCorreo().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El correo no tiene un formato válido", true, HttpStatus.BAD_REQUEST));
            }
            found.setCorreo(dto.getCorreo().isBlank() ? null : dto.getCorreo().trim());
        }

        if (dto.getTelefono() != null) {
            if (!dto.getTelefono().isBlank() && !dto.getTelefono().matches("^[0-9]+$")) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El teléfono solo debe contener números", true, HttpStatus.BAD_REQUEST));
            }
            found.setTelefono(dto.getTelefono().isBlank() ? null : dto.getTelefono().trim());
        }

        if (dto.getTelefonoAlternativo() != null) {
            if (!dto.getTelefonoAlternativo().isBlank() && !dto.getTelefonoAlternativo().matches("^[0-9]+$")) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El teléfono alternativo solo debe contener números", true, HttpStatus.BAD_REQUEST));
            }
            found.setTelefonoAlternativo(dto.getTelefonoAlternativo().isBlank() ? null : dto.getTelefonoAlternativo().trim());
        }

        if (dto.getHorarioGeneral() != null && !dto.getHorarioGeneral().isBlank()) {
            found.setHorarioGeneral(dto.getHorarioGeneral().trim());
        }

        Verificentro updated = verificentroRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Verificentro actualizado", VerificentroMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        Verificentro found = verificentroRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El verificentro no existe", true, HttpStatus.NOT_FOUND));
        }

        boolean tieneNotas = notaRepository.existsByVerificentro_IdAndActivoTrue(id);
        if (tieneNotas) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede eliminar el verificentro porque tiene notas activas registradas", true, HttpStatus.BAD_REQUEST));
        }

        boolean tieneVerificaciones = verificacionRepository.existsByNota_Verificentro_IdAndActivoTrue(id);
        if (tieneVerificaciones) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede eliminar el verificentro porque tiene verificaciones registradas", true, HttpStatus.BAD_REQUEST));
        }

        found.setActivo(false);
        verificentroRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Verificentro eliminado", HttpStatus.OK)
        );
    }
}