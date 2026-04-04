package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos.EvidenciaEvaluacionRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/evidencias-evaluacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EvidenciaEvaluacionController {

    private final EvidenciaEvaluacionService evidenciaService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idEvaluacion,
            @RequestParam(required = false) Integer numeroEvidencia
    ) {
        return evidenciaService.getAll(idEvaluacion, numeroEvidencia);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return evidenciaService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody EvidenciaEvaluacionRequestDTO dto) {
        return evidenciaService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody EvidenciaEvaluacionRequestDTO dto) {
        return evidenciaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return evidenciaService.delete(id);
    }
}