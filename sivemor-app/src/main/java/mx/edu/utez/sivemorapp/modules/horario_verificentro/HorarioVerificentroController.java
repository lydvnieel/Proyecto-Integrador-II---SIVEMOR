package mx.edu.utez.sivemorapp.modules.horario_verificentro;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;
import mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.HorarioRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/horarios-verificentro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HorarioVerificentroController {

    private final HorarioVerificentroService horarioService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) Long idVerificentro,
            @RequestParam(required = false) DiaSemana diaSemana
    ) {
        return horarioService.getAll(idVerificentro, diaSemana);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return horarioService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody HorarioRequestDTO dto) {
        return horarioService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody HorarioRequestDTO dto) {
        return horarioService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        return horarioService.delete(id);
    }
}