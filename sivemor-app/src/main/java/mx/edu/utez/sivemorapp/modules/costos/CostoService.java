package mx.edu.utez.sivemorapp.modules.costos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.clientes.ClienteRepository;
import mx.edu.utez.sivemorapp.modules.costos.dtos.CostoRequestDTO;
import mx.edu.utez.sivemorapp.modules.costos.dtos.utils.CostoMapper;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.UsuarioRepository;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CostoService {

    private final CostoRepository costoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final VerificacionRepository verificacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(
            Long idCliente,
            Materia materia,
            Long idEncargado,
            Long idAtiendeYCobra
    ) {
        List<Costo> result = costoRepository.findByActivoTrue();

        if (idCliente != null) {
            result = result.stream()
                    .filter(c -> c.getCliente() != null && c.getCliente().getId().equals(idCliente))
                    .toList();
        }

        if (materia != null) {
            result = result.stream()
                    .filter(c -> c.getMateria() != null && c.getMateria().equals(materia))
                    .toList();
        }

        if (idEncargado != null) {
            result = result.stream()
                    .filter(c -> c.getEncargado() != null && c.getEncargado().getId().equals(idEncargado))
                    .toList();
        }

        if (idAtiendeYCobra != null) {
            result = result.stream()
                    .filter(c -> c.getAtiendeYCobra() != null && c.getAtiendeYCobra().getId().equals(idAtiendeYCobra))
                    .toList();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", CostoMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Costo found = costoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El costo no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", CostoMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(CostoRequestDTO dto) {

        if (dto.getIdCliente() == null || dto.getMateria() == null || dto.getCosto() == null
                || dto.getEncargado() == null || dto.getAtiendeYCobra() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getCosto().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El costo debe ser mayor a cero", true, HttpStatus.BAD_REQUEST));
        }

        Cliente cliente = clienteRepository.findByIdAndActivoTrue(dto.getIdCliente()).orElse(null);
        if (cliente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El cliente no existe", true, HttpStatus.NOT_FOUND));
        }

        Usuario encargado = usuarioRepository.findByIdAndActivoTrue(dto.getEncargado()).orElse(null);
        if (encargado == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El usuario encargado no existe", true, HttpStatus.NOT_FOUND));
        }

        Usuario atiendeYCobra = usuarioRepository.findByIdAndActivoTrue(dto.getAtiendeYCobra()).orElse(null);
        if (atiendeYCobra == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El usuario atiende y cobra no existe", true, HttpStatus.NOT_FOUND));
        }

        boolean duplicado = costoRepository.existsByCliente_IdAndMateriaAndActivoTrue(
                dto.getIdCliente(), dto.getMateria()
        );

        if (duplicado) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe un costo registrado para ese cliente y materia", true, HttpStatus.BAD_REQUEST));
        }

        Costo costo = Costo.builder()
                .cliente(cliente)
                .materia(dto.getMateria())
                .costo(dto.getCosto())
                .encargado(encargado)
                .atiendeYCobra(atiendeYCobra)
                .build();

        costo.setActivo(true);

        Costo saved = costoRepository.save(costo);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Costo creado", CostoMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, CostoRequestDTO dto) {
        Costo found = costoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El costo no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdCliente() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede modificar el cliente asociado al costo", true, HttpStatus.BAD_REQUEST));
        }

        Materia materiaFinal = found.getMateria();

        if (dto.getMateria() != null) {
            materiaFinal = dto.getMateria();
        }

        if (dto.getCosto() != null) {
            if (dto.getCosto().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El costo debe ser mayor a cero", true, HttpStatus.BAD_REQUEST));
            }
            found.setCosto(dto.getCosto());
        }

        if (dto.getMateria() != null) {
            found.setMateria(dto.getMateria());
        }

        boolean duplicado = costoRepository.existsByCliente_IdAndMateriaAndIdNotAndActivoTrue(
                found.getCliente().getId(), materiaFinal, id
        );

        if (duplicado) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe un costo registrado para ese cliente y materia", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getEncargado() != null) {
            Usuario encargado = usuarioRepository.findByIdAndActivoTrue(dto.getEncargado()).orElse(null);
            if (encargado == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("El usuario encargado no existe", true, HttpStatus.NOT_FOUND));
            }
            found.setEncargado(encargado);
        }

        if (dto.getAtiendeYCobra() != null) {
            Usuario atiendeYCobra = usuarioRepository.findByIdAndActivoTrue(dto.getAtiendeYCobra()).orElse(null);
            if (atiendeYCobra == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("El usuario atiende y cobra no existe", true, HttpStatus.NOT_FOUND));
            }
            found.setAtiendeYCobra(atiendeYCobra);
        }

        Costo updated = costoRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Costo actualizado", CostoMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        Costo found = costoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El costo no existe", true, HttpStatus.NOT_FOUND));
        }

        boolean usadoEnVerificaciones = verificacionRepository.existsByNota_Cliente_IdAndMateriaAndActivoTrue(
                found.getCliente().getId(), found.getMateria()
        );

        if (usadoEnVerificaciones) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede eliminar el costo porque ya fue utilizado en verificaciones registradas", true, HttpStatus.BAD_REQUEST));
        }

        found.setActivo(false);
        costoRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Costo eliminado", HttpStatus.OK)
        );
    }
}