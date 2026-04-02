package mx.edu.utez.sivemorapp.modules.regiones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.regiones.dtos.RegionRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/regiones")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @GetMapping("")
    public ResponseEntity<ApiResponse> findAll(
            @RequestParam(value = "nombre", required = false) String nombre
    ) {
        return regionService.filterRegiones(nombre);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findById(@PathVariable Long id) {
        return regionService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse> save(@RequestBody RegionRequestDTO dto) {
        return regionService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody RegionRequestDTO dto) {
        dto.setId(id);
        return regionService.update(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return regionService.delete(id);
    }
}