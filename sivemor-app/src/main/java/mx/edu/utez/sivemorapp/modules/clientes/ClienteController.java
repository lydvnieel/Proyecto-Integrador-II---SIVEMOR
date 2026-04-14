package mx.edu.utez.sivemorapp.modules.clientes;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.clientes.dtos.ClienteRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/clientes")
@RequiredArgsConstructor


public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping("")
    public ResponseEntity<ApiResponse> findAllClientes(
            @RequestParam(value = "razonSocial", required = false) String razonSocial,
            @RequestParam(value = "gestor", required = false) String gestor
    ) {
        return clienteService.filterClientes(razonSocial, gestor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findClienteById(@PathVariable("id") Long id) {
        return clienteService.findClienteById(id);
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse> saveCliente(@RequestBody ClienteRequestDTO dto) {
        return clienteService.saveCliente(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCliente(
            @PathVariable("id") Long id,
            @RequestBody ClienteRequestDTO dto
    ) {
        dto.setId(id);
        return clienteService.updateCliente(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCliente(@PathVariable("id") Long id) {
        return clienteService.deleteCliente(id);
    }
}
