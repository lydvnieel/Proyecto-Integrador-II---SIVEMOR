package mx.edu.utez.sivemorapp.modules.reportes;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteFiltroRequest;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteOpcionesDTO;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sivemor/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/opciones")
    public ResponseEntity<ReporteOpcionesDTO    > obtenerOpciones() {
        return ResponseEntity.ok(reporteService.obtenerOpciones());
    }

    @GetMapping("/generar")
    public ResponseEntity<?> generarReporte(ReporteFiltroRequest filtros) {
        try {
            ReporteResponseDTO response = reporteService.generarReporte(filtros);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
