package mx.edu.utez.sivemorapp.modules.notas;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.clientes.ClienteRepository;
import mx.edu.utez.sivemorapp.modules.notas.dtos.NotaRequestDTO;
import mx.edu.utez.sivemorapp.modules.notas.dtos.utils.NotaMapper;
import mx.edu.utez.sivemorapp.modules.transacciones.TransaccionRepository;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.UsuarioRepository;
import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;
import mx.edu.utez.sivemorapp.modules.verificentros.VerificentroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotaService {

    private final NotaRepository notaRepository;
    private final ClienteRepository clienteRepository;
    private final VerificentroRepository verificentroRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransaccionRepository transaccionRepository;

    private String generarFolioNota() {
        long total = notaRepository.count() + 1;
        return String.format("NOTA-%05d", total);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idCliente, Long idVerificentro, String folioNota,
                                              LocalDate fechaInicio, LocalDate fechaFin) {

        List<Notas> result = notaRepository.findByActivoTrue();

        if (idCliente != null) {
            result = result.stream()
                    .filter(n -> n.getCliente() != null && n.getCliente().getId().equals(idCliente))
                    .toList();
        }

        if (idVerificentro != null) {
            result = result.stream()
                    .filter(n -> n.getVerificentro() != null && n.getVerificentro().getId().equals(idVerificentro))
                    .toList();
        }

        if (folioNota != null && !folioNota.isBlank()) {
            String folio = folioNota.trim().toLowerCase();
            result = result.stream()
                    .filter(n -> n.getFolioNota() != null && n.getFolioNota().toLowerCase().contains(folio))
                    .toList();
        }

        if (fechaInicio != null && fechaFin != null) {
            LocalDateTime inicio = fechaInicio.atStartOfDay();
            LocalDateTime fin = fechaFin.atTime(23, 59, 59);

            result = result.stream()
                    .filter(n -> n.getFechaCreacion() != null &&
                            !n.getFechaCreacion().isBefore(inicio) &&
                            !n.getFechaCreacion().isAfter(fin))
                    .toList();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", NotaMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Notas found = notaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La nota no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", NotaMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(NotaRequestDTO dto) {
        if (dto.getIdCliente() == null || dto.getIdVerificentro() == null ||
                dto.getTipoPago() == null || dto.getAtendio() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        Cliente cliente = clienteRepository.findByIdAndActivoTrue(dto.getIdCliente()).orElse(null);
        Verificentro verificentro = verificentroRepository.findByIdAndActivoTrue(dto.getIdVerificentro()).orElse(null);
        Usuario atendio = usuarioRepository.findByIdAndActivoTrue(dto.getAtendio()).orElse(null);

        Usuario reviso = null;
        if (dto.getReviso() != null) {
            reviso = usuarioRepository.findByIdAndActivoTrue(dto.getReviso()).orElse(null);
            if (reviso == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario revisó no encontrado", true, HttpStatus.NOT_FOUND));
            }
        }

        if (cliente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Cliente no encontrado", true, HttpStatus.NOT_FOUND));
        }

        if (verificentro == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Verificentro no encontrado", true, HttpStatus.NOT_FOUND));
        }

        if (atendio == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Usuario atendió no encontrado", true, HttpStatus.NOT_FOUND));
        }

        BigDecimal anticipo = dto.getAnticipo() != null ? dto.getAnticipo() : BigDecimal.ZERO;
        if (anticipo.compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El anticipo debe ser positivo o cero", true, HttpStatus.BAD_REQUEST));
        }

        Notas nota = Notas.builder()
                .folioNota(generarFolioNota())
                .cliente(cliente)
                .verificentro(verificentro)
                .tipoPago(dto.getTipoPago())
                .anticipo(anticipo)
                .pagadoCompleto(dto.getPagadoCompleto() != null ? dto.getPagadoCompleto() : false)
                .atendio(atendio)
                .reviso(reviso)
                .comentario(dto.getComentario())
                .fechaCreacion(LocalDateTime.now())
                .numeroVerificaciones(0)
                .build();

        nota.setActivo(true);

        Notas saved = notaRepository.save(nota);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Nota creada", NotaMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, NotaRequestDTO dto) {
        Notas found = notaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La nota no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdCliente() != null || dto.getIdVerificentro() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede modificar el cliente ni el verificentro de una nota", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getTipoPago() != null) {
            found.setTipoPago(dto.getTipoPago());
        }

        if (dto.getAnticipo() != null) {
            if (dto.getAnticipo().compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El anticipo debe ser positivo o cero", true, HttpStatus.BAD_REQUEST));
            }
            found.setAnticipo(dto.getAnticipo());
        }

        if (dto.getPagadoCompleto() != null) {
            found.setPagadoCompleto(dto.getPagadoCompleto());
        }

        if (dto.getAtendio() != null) {
            Usuario atendio = usuarioRepository.findByIdAndActivoTrue(dto.getAtendio()).orElse(null);
            if (atendio == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario atendió no encontrado", true, HttpStatus.NOT_FOUND));
            }
            found.setAtendio(atendio);
        }

        if (dto.getReviso() != null) {
            Usuario reviso = usuarioRepository.findByIdAndActivoTrue(dto.getReviso()).orElse(null);
            if (reviso == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario revisó no encontrado", true, HttpStatus.NOT_FOUND));
            }
            found.setReviso(reviso);
        }

        if (dto.getComentario() != null) {
            found.setComentario(dto.getComentario());
        }

        Notas updated = notaRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Nota actualizada", NotaMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        Notas found = notaRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La nota no existe", true, HttpStatus.NOT_FOUND));
        }

        boolean tieneTransacciones = transaccionRepository.existsByNota_IdAndActivoTrue(id);
        if (tieneTransacciones) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede eliminar la nota porque tiene transacciones activas", true, HttpStatus.BAD_REQUEST));
        }

        found.setActivo(false);
        notaRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Nota eliminada", HttpStatus.OK)
        );
    }
}