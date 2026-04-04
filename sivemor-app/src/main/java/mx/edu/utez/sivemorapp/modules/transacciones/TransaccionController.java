package mx.edu.utez.sivemorapp.modules.transacciones;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;
import mx.edu.utez.sivemorapp.modules.transacciones.dtos.TransaccionRequestDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/sivemor/api/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransaccionController {

    private final TransaccionService transaccionService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idNota,
            @RequestParam(required = false) TipoPago tipoPago,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long idAtendio,
            @RequestParam(required = false) String estadoPago,
            @RequestParam(required = false) String numeroFactura
    ) {
        return transaccionService.getAll(
                idNota,
                tipoPago,
                fechaInicio,
                fechaFin,
                idAtendio,
                estadoPago,
                numeroFactura
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return transaccionService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody TransaccionRequestDTO dto) {
        return transaccionService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody TransaccionRequestDTO dto) {
        return transaccionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return transaccionService.delete(id);
    }
}