package mx.edu.utez.sivemorapp.modules.verificaciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.VerificacionRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sivemor/api/verificaciones")
@RequiredArgsConstructor
public class VerificacionController {

    private final VerificacionService verificacionService;

    @GetMapping("")
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(value = "idVehiculo", required = false) Long idVehiculo,
            @RequestParam(value = "idNota", required = false) Long idNota,
            @RequestParam(value = "materia", required = false) String materia,
            @RequestParam(value = "dictamen", required = false) String dictamen,
            @RequestParam(value = "fechaVerificacion", required = false) String fechaVerificacion
    ) {
        return verificacionService.filterVerificaciones(idVehiculo, idNota, materia, dictamen, fechaVerificacion);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return verificacionService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse> create(@RequestBody VerificacionRequestDTO dto) {
        return verificacionService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(
            @PathVariable Long id,
            @RequestBody VerificacionRequestDTO dto
    ) {
        dto.setId(id);
        return verificacionService.update(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return verificacionService.delete(id);
    }

    @PutMapping("/marcar-pagado")
    public ResponseEntity<ApiResponse> marcarPagado(@RequestBody List<Long> ids) {
        return verificacionService.marcarPagado(ids);
    }
}

