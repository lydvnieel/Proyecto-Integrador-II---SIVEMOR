package mx.edu.utez.sivemorapp.modules.dashboard;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sivemor/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse> getResumen() {
        return dashboardService.getResumen();
    }
}