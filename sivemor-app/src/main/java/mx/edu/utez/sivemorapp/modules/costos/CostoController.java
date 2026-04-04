package mx.edu.utez.sivemorapp.modules.costos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.costos.dtos.CostoRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/costos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CostoController {

    private final CostoService costoService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idCliente,
            @RequestParam(required = false) Materia materia,
            @RequestParam(required = false) Long idEncargado,
            @RequestParam(required = false) Long idAtiendeYCobra
    ) {
        return costoService.getAll(idCliente, materia, idEncargado, idAtiendeYCobra);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return costoService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody CostoRequestDTO dto) {
        return costoService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody CostoRequestDTO dto) {
        return costoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return costoService.delete(id);
    }
}