package mx.edu.utez.sivemorapp.modules.vehiculos;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.vehiculos.dtos.VehiculoRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoController {

    private final VehiculoService vehiculoService;

    @GetMapping("")
    public ResponseEntity<ApiResponse> findAllVehiculos(
            @RequestParam(value = "idCliente", required = false) Long idCliente,
            @RequestParam(value = "idCedis", required = false) Long idCedis,
            @RequestParam(value = "placa", required = false) String placa
    ) {
        return vehiculoService.filterVehiculos(idCliente, idCedis, placa);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findVehiculoById(@PathVariable("id") Long id) {
        return vehiculoService.findByVehiculo(id);
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse> saveVehiculo(@RequestBody VehiculoRequestDTO dto) {
        return vehiculoService.saveVehiculo(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateVehiculo(
            @PathVariable("id") Long id,
            @RequestBody VehiculoRequestDTO dto
    ) {
        dto.setId(id);
        return vehiculoService.updateVehiculo(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteVehiculo(@PathVariable("id") Long id) {
        return vehiculoService.deleteVehiculo(id);
    }
}