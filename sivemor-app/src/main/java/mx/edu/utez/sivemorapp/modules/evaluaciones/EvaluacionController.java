package mx.edu.utez.sivemorapp.modules.evaluaciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.evaluaciones.dtos.EvaluacionRequestDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/sivemor/api/evaluaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idVerificacion,
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) Long idTecnico,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin
    ) {
        return evaluacionService.filterEvaluaciones(idVerificacion, placa, idTecnico, fechaInicio, fechaFin);
    }

    @GetMapping("/vehiculo/{vehicleId}")
    public ResponseEntity<ApiResponse> getByVehiculo(@PathVariable Long vehicleId) {
        return evaluacionService.findByVehiculo(vehicleId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return evaluacionService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody EvaluacionRequestDTO dto) {
        return evaluacionService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody EvaluacionRequestDTO dto) {
        dto.setId(id);
        return evaluacionService.update(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return evaluacionService.delete(id);
    }
}