package mx.edu.utez.sivemorapp.modules.verificentros;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.verificentros.dtos.VerificentroRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/verificentros")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VerificentroController {

    private final VerificentroService verificentroService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idRegion,
            @RequestParam(required = false) String nombre
    ) {
        return verificentroService.getAll(idRegion, nombre);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return verificentroService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody VerificentroRequestDTO dto) {
        return verificentroService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody VerificentroRequestDTO dto) {
        return verificentroService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return verificentroService.delete(id);
    }
}