package mx.edu.utez.sivemorapp.modules.transacciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.transacciones.dtos.TransaccionRequestDTO;
import mx.edu.utez.sivemorapp.modules.transacciones.dtos.utils.TransaccionMapper;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.UsuarioRepository;
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
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final NotaRepository notaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(
            Long idNota,
            TipoPago tipoPago,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Long idAtendio,
            String estadoPago,
            String numeroFactura
    ) {
        List<Transaccion> result = transaccionRepository.findByActivoTrue();

        if (idNota != null) {
            result = result.stream()
                    .filter(t -> t.getNota() != null && t.getNota().getId().equals(idNota))
                    .toList();
        }

        if (tipoPago != null) {
            result = result.stream()
                    .filter(t -> t.getTipoPago() != null && t.getTipoPago().equals(tipoPago))
                    .toList();
        }

        if (fechaInicio != null && fechaFin != null) {
            LocalDateTime inicio = fechaInicio.atStartOfDay();
            LocalDateTime fin = fechaFin.atTime(23, 59, 59);

            result = result.stream()
                    .filter(t -> t.getFechaPedido() != null
                            && !t.getFechaPedido().isBefore(inicio)
                            && !t.getFechaPedido().isAfter(fin))
                    .toList();
        }

        if (idAtendio != null) {
            result = result.stream()
                    .filter(t -> t.getAtendio() != null && t.getAtendio().getId().equals(idAtendio))
                    .toList();
        }

        if (estadoPago != null && !estadoPago.isBlank()) {
            String estado = estadoPago.trim().toUpperCase();

            result = switch (estado) {
                case "PAGADO" -> result.stream()
                        .filter(t -> Boolean.TRUE.equals(t.getPagado()))
                        .toList();

                case "PENDIENTE" -> result.stream()
                        .filter(t -> Boolean.TRUE.equals(t.getPendiente()))
                        .toList();

                case "NO_PAGADO" -> result.stream()
                        .filter(t -> Boolean.FALSE.equals(t.getPagado()))
                        .toList();

                default -> result;
            };
        }

        if (numeroFactura != null && !numeroFactura.isBlank()) {
            String factura = numeroFactura.trim().toLowerCase();
            result = result.stream()
                    .filter(t -> t.getNumeroFactura() != null &&
                            t.getNumeroFactura().toLowerCase().contains(factura))
                    .toList();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", TransaccionMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Transaccion found = transaccionRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La transacción no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", TransaccionMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(TransaccionRequestDTO dto) {

        if (dto.getIdNota() == null || dto.getTipoPago() == null || dto.getMonto() == null
                || dto.getNumeroFactura() == null || dto.getNumeroFactura().isBlank()
                || dto.getReviso() == null || dto.getAtendio() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El monto debe ser mayor a cero", true, HttpStatus.BAD_REQUEST));
        }

        if ((dto.getTipoPago() == TipoPago.DEPOSITO || dto.getTipoPago() == TipoPago.TRANSFERENCIA)
                && (dto.getCuentaDeposito() == null || dto.getCuentaDeposito().isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La cuenta de depósito es obligatoria para DEPÓSITO o TRANSFERENCIA", true, HttpStatus.BAD_REQUEST));
        }

        Notas nota = notaRepository.findByIdAndActivoTrue(dto.getIdNota()).orElse(null);
        if (nota == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La nota no existe", true, HttpStatus.NOT_FOUND));
        }

        Usuario reviso = usuarioRepository.findByIdAndActivoTrue(dto.getReviso()).orElse(null);
        if (reviso == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Usuario revisó no encontrado", true, HttpStatus.NOT_FOUND));
        }

        Usuario atendio = usuarioRepository.findByIdAndActivoTrue(dto.getAtendio()).orElse(null);
        if (atendio == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Usuario atendió no encontrado", true, HttpStatus.NOT_FOUND));
        }

        Transaccion t = Transaccion.builder()
                .nota(nota)
                .tipoPago(dto.getTipoPago())
                .monto(dto.getMonto())
                .cuentaDeposito(dto.getCuentaDeposito())
                .numeroFactura(dto.getNumeroFactura())
                .pagado(dto.getPagado() != null ? dto.getPagado() : false)
                .pendiente(dto.getPendiente() != null ? dto.getPendiente() : true)
                .fechaPedido(LocalDateTime.now())
                .cotizacion(dto.getCotizacion())
                .reviso(reviso)
                .atendio(atendio)
                .comentario(dto.getComentario())
                .build();

        t.setActivo(true);

        Transaccion saved = transaccionRepository.save(t);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Transacción creada", TransaccionMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, TransaccionRequestDTO dto) {
        Transaccion found = transaccionRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La transacción no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdNota() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede modificar la nota asociada a la transacción", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getTipoPago() != null) {
            found.setTipoPago(dto.getTipoPago());
        }

        if (dto.getMonto() != null) {
            if (dto.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El monto debe ser mayor a cero", true, HttpStatus.BAD_REQUEST));
            }
            found.setMonto(dto.getMonto());
        }

        TipoPago tipoFinal = dto.getTipoPago() != null ? dto.getTipoPago() : found.getTipoPago();
        String cuentaFinal = dto.getCuentaDeposito() != null ? dto.getCuentaDeposito() : found.getCuentaDeposito();

        if ((tipoFinal == TipoPago.DEPOSITO || tipoFinal == TipoPago.TRANSFERENCIA)
                && (cuentaFinal == null || cuentaFinal.isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La cuenta de depósito es obligatoria para DEPÓSITO o TRANSFERENCIA", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getCuentaDeposito() != null) {
            found.setCuentaDeposito(dto.getCuentaDeposito());
        }

        if (dto.getNumeroFactura() != null && !dto.getNumeroFactura().isBlank()) {
            found.setNumeroFactura(dto.getNumeroFactura().trim());
        }

        if (dto.getPagado() != null) {
            found.setPagado(dto.getPagado());
        }

        if (dto.getPendiente() != null) {
            found.setPendiente(dto.getPendiente());
        }

        if (dto.getCotizacion() != null) {
            found.setCotizacion(dto.getCotizacion());
        }

        if (dto.getReviso() != null) {
            Usuario reviso = usuarioRepository.findByIdAndActivoTrue(dto.getReviso()).orElse(null);
            if (reviso == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario revisó no encontrado", true, HttpStatus.NOT_FOUND));
            }
            found.setReviso(reviso);
        }

        if (dto.getAtendio() != null) {
            Usuario atendio = usuarioRepository.findByIdAndActivoTrue(dto.getAtendio()).orElse(null);
            if (atendio == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario atendió no encontrado", true, HttpStatus.NOT_FOUND));
            }
            found.setAtendio(atendio);
        }

        if (dto.getComentario() != null) {
            found.setComentario(dto.getComentario());
        }

        Transaccion updated = transaccionRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Transacción actualizada", TransaccionMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        Transaccion found = transaccionRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La transacción no existe", true, HttpStatus.NOT_FOUND));
        }

        found.setActivo(false);
        transaccionRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Transacción eliminada", HttpStatus.OK)
        );
    }
}