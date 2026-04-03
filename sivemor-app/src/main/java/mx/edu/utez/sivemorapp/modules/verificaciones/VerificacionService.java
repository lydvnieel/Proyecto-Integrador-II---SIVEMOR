package mx.edu.utez.sivemorapp.modules.verificaciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;
import mx.edu.utez.sivemorapp.modules.vehiculos.VehiculoRepository;
import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.VerificacionRequestDTO;
import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.utils.VerificacionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificacionService {

    private final VerificacionRepository verificacionRepository;
    private final VehiculoRepository vehiculoRepository;
    private final NotaRepository notaRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(
                new ApiResponse("OK",
                        VerificacionMapper.toDtoList(verificacionRepository.findByActivoTrue()),
                        HttpStatus.OK),
                HttpStatus.OK
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> save(VerificacionRequestDTO dto) {
        try {
            if (dto.getIdNota() == null || dto.getIdVehiculo() == null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Nota y Vehículo son obligatorios", true, HttpStatus.BAD_REQUEST));
            }

            Notas nota = notaRepository.findById(dto.getIdNota()).orElse(null);
            Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo()).orElse(null);

            if (nota == null || vehiculo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Nota o Vehículo no encontrado", true, HttpStatus.NOT_FOUND));
            }

            Verificacion v = Verificacion.builder()
                    .nota(nota)
                    .vehiculo(vehiculo)
                    .materia(Materia.valueOf(dto.getMateria()))
                    .precio(dto.getPrecio())
                    .multa(dto.getMulta())
                    .folioVerificacion("VER-" + UUID.randomUUID().toString().substring(0, 8))
                    .build();

            v.setActivo(true);

            Verificacion saved = verificacionRepository.save(v);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("Creado", VerificacionMapper.toDto(saved), HttpStatus.CREATED));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al crear", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @Transactional
    public ResponseEntity<ApiResponse> delete(Long id) {
        Verificacion v = verificacionRepository.findById(id).orElse(null);

        if (v == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No existe", true, HttpStatus.NOT_FOUND));
        }

        v.setActivo(false);
        verificacionRepository.save(v);

        return ResponseEntity.ok(new ApiResponse("Eliminado", HttpStatus.OK));
    }
}