package mx.edu.utez.sivemorapp.modules.pedidos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.pedidos.dtos.PedidoRequestDTO;
import mx.edu.utez.sivemorapp.modules.pedidos.dtos.utils.PedidoMapper;
import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final NotaRepository notaRepository;
    private final VerificacionRepository verificacionRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(
            String folioNota,
            EstatusEnvio estatusEnvio,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            String recibio
    ) {
        List<Pedido> result = pedidoRepository.findByActivoTrue();

        if (folioNota != null && !folioNota.isBlank()) {
            String filtro = folioNota.trim().toLowerCase();
            result = result.stream()
                    .filter(p -> p.getNota() != null
                            && p.getNota().getFolioNota() != null
                            && p.getNota().getFolioNota().toLowerCase().contains(filtro))
                    .toList();
        }

        if (estatusEnvio != null) {
            result = result.stream()
                    .filter(p -> p.getEstatusEnvio() != null && p.getEstatusEnvio().equals(estatusEnvio))
                    .toList();
        }

        if (fechaInicio != null && fechaFin != null) {
            LocalDateTime inicio = fechaInicio.atStartOfDay();
            LocalDateTime fin = fechaFin.atTime(23, 59, 59);

            result = result.stream()
                    .filter(p -> p.getFechaEnvio() != null
                            && !p.getFechaEnvio().isBefore(inicio)
                            && !p.getFechaEnvio().isAfter(fin))
                    .toList();
        }

        if (recibio != null && !recibio.isBlank()) {
            String filtroRecibio = recibio.trim().toLowerCase();
            result = result.stream()
                    .filter(p -> p.getRecibio() != null
                            && p.getRecibio().toLowerCase().contains(filtroRecibio))
                    .toList();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", PedidoMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Pedido found = pedidoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El pedido no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", PedidoMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(PedidoRequestDTO dto) {

        if (dto.getIdNota() == null || dto.getEstatusEnvio() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        Notas nota = notaRepository.findByIdAndActivoTrue(dto.getIdNota()).orElse(null);
        if (nota == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("La nota no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getEstatusEnvio() == EstatusEnvio.ENVIADO
                && (dto.getNumeroGuia() == null || dto.getNumeroGuia().isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El número de guía es obligatorio cuando el estatus es ENVIADO", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getEstatusEnvio() == EstatusEnvio.ENTREGADO
                && (dto.getRecibio() == null || dto.getRecibio().isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La persona que recibió es obligatoria cuando el estatus es ENTREGADO", true, HttpStatus.BAD_REQUEST));
        }

        byte[] fotoBytes = null;
        Integer tamanoBytes = null;

        if (dto.getFotoBase64() != null && !dto.getFotoBase64().isBlank()) {
            try {
                fotoBytes = Base64.getDecoder().decode(dto.getFotoBase64());
                tamanoBytes = fotoBytes.length;
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("La foto en base64 no es válida", true, HttpStatus.BAD_REQUEST));
            }
        }

        Pedido pedido = Pedido.builder()
                .nota(nota)
                .fechaEnvio(dto.getFechaEnvio())
                .numeroGuia(dto.getNumeroGuia() != null ? dto.getNumeroGuia().trim() : null)
                .recibio(dto.getRecibio() != null ? dto.getRecibio().trim() : null)
                .foto(fotoBytes)
                .fotoMimeType(dto.getFotoMimeType())
                .fotoNombreArchivo(dto.getFotoNombreArchivo())
                .fotoTamanoBytes(tamanoBytes)
                .estatusEnvio(dto.getEstatusEnvio())
                .comentario(dto.getComentario())
                .build();

        pedido.setActivo(true);

        Pedido saved = pedidoRepository.save(pedido);

        List<Verificacion> verificaciones = verificacionRepository.findByActivoTrueAndNota_Id(nota.getId());

        for (Verificacion verificacion : verificaciones) {
            verificacion.setFechaPedido(saved.getFechaEnvio() != null ? saved.getFechaEnvio() : LocalDateTime.now());
        }

        verificacionRepository.saveAll(verificaciones);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Pedido creado", PedidoMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, PedidoRequestDTO dto) {
        Pedido found = pedidoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El pedido no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getIdNota() != null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("No se puede modificar la nota asociada al pedido", true, HttpStatus.BAD_REQUEST));
        }

        if (dto.getFechaEnvio() != null) {
            found.setFechaEnvio(dto.getFechaEnvio());
        }

        if (dto.getNumeroGuia() != null) {
            found.setNumeroGuia(dto.getNumeroGuia().isBlank() ? null : dto.getNumeroGuia().trim());
        }

        if (dto.getRecibio() != null) {
            found.setRecibio(dto.getRecibio().isBlank() ? null : dto.getRecibio().trim());
        }

        if (dto.getEstatusEnvio() != null) {
            found.setEstatusEnvio(dto.getEstatusEnvio());
        }

        if (dto.getComentario() != null) {
            found.setComentario(dto.getComentario());
        }

        if (dto.getFotoBase64() != null) {
            if (dto.getFotoBase64().isBlank()) {
                found.setFoto(null);
                found.setFotoMimeType(null);
                found.setFotoNombreArchivo(null);
                found.setFotoTamanoBytes(null);
            } else {
                try {
                    byte[] fotoBytes = Base64.getDecoder().decode(dto.getFotoBase64());
                    found.setFoto(fotoBytes);
                    found.setFotoMimeType(dto.getFotoMimeType());
                    found.setFotoNombreArchivo(dto.getFotoNombreArchivo());
                    found.setFotoTamanoBytes(fotoBytes.length);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("La foto en base64 no es válida", true, HttpStatus.BAD_REQUEST));
                }
            }
        }

        if (found.getEstatusEnvio() == EstatusEnvio.ENVIADO
                && (found.getNumeroGuia() == null || found.getNumeroGuia().isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El número de guía es obligatorio cuando el estatus es ENVIADO", true, HttpStatus.BAD_REQUEST));
        }

        if (found.getEstatusEnvio() == EstatusEnvio.ENTREGADO
                && (found.getRecibio() == null || found.getRecibio().isBlank())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La persona que recibió es obligatoria cuando el estatus es ENTREGADO", true, HttpStatus.BAD_REQUEST));
        }

        Pedido updated = pedidoRepository.save(found);
        List<Verificacion> verificaciones = verificacionRepository.findByActivoTrueAndNota_Id(found.getNota().getId());

        for (Verificacion verificacion : verificaciones) {
            verificacion.setFechaPedido(updated.getFechaEnvio());
        }

        verificacionRepository.saveAll(verificaciones);

        return ResponseEntity.ok(
                new ApiResponse("Pedido actualizado", PedidoMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        Pedido found = pedidoRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El pedido no existe", true, HttpStatus.NOT_FOUND));
        }

        found.setActivo(false);
        pedidoRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Pedido eliminado", HttpStatus.OK)
        );
    }
}