package mx.edu.utez.sivemorapp.modules.pedidos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;
import mx.edu.utez.sivemorapp.modules.pedidos.dtos.PedidoRequestDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/sivemor/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) String folioNota,
            @RequestParam(required = false) EstatusEnvio estatusEnvio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String recibio
    ) {
        return pedidoService.getAll(folioNota, estatusEnvio, fechaInicio, fechaFin, recibio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return pedidoService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody PedidoRequestDTO dto) {
        return pedidoService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody PedidoRequestDTO dto) {
        return pedidoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return pedidoService.delete(id);
    }
}