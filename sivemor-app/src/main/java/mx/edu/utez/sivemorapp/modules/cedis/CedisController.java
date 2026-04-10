package mx.edu.utez.sivemorapp.modules.cedis;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.cedis.dtos.CedisRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/cedis")
@RequiredArgsConstructor
public class CedisController {
    private final CedisService cedisService;

    @GetMapping("")
    public ResponseEntity<ApiResponse> findAllCedis(
            @RequestParam(value = "idCliente", required = false) Long idCliente,
            @RequestParam(value = "idRegion", required = false) Long idRegion,
            @RequestParam(value = "nombre", required = false) String nombre
    ) {
        return cedisService.filterCedis(idCliente, idRegion, nombre);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findCedisById(@PathVariable("id") Long id) {
        return cedisService.findCedisById(id);
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse> saveCedis(@RequestBody CedisRequestDTO dto) {
        return cedisService.saveCedis(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCedis(@PathVariable("id") Long id, @RequestBody CedisRequestDTO dto) {
        dto.setId(id);
        return cedisService.updateCedis(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCedis(@PathVariable("id") Long id) {
        return cedisService.deleteCedis(id);
    }
}

