package mx.edu.utez.sivemorapp.modules.verificaciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.VerificacionRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/verificaciones")
@RequiredArgsConstructor
public class VerificacionController {

    private final VerificacionService service;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody VerificacionRequestDTO dto) {
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return service.delete(id);
    }
}