package mx.edu.utez.sivemorapp.modules.dashboard;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;
import mx.edu.utez.sivemorapp.modules.dashboard.dto.DashboardRegionDTO;
import mx.edu.utez.sivemorapp.modules.dashboard.dto.DashboardResumenDTO;
import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
import mx.edu.utez.sivemorapp.modules.pedidos.PedidoRepository;
import mx.edu.utez.sivemorapp.modules.verificaciones.VerificacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VerificacionRepository verificacionRepository;
    private final NotaRepository notaRepository;
    private final PedidoRepository pedidoRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getResumen() {
        try {
            long pagosPendientes = verificacionRepository.countByActivoTrueAndPagadoFalse();
            long totalVerificaciones = verificacionRepository.countByActivoTrue();
            long aprobadas = verificacionRepository.countByActivoTrueAndDictamen(Dictamen.APROBADO);
            long reprobadas = verificacionRepository.countByActivoTrueAndDictamen(Dictamen.REPROBADO);
            long conMulta = verificacionRepository.countByActivoTrueAndMultaIsNotNull();
            long notas = notaRepository.countByActivoTrue();
            long pedidos = pedidoRepository.countByActivoTrue();
            long pedidosEntregados = pedidoRepository.countByActivoTrueAndEstatusEnvio(EstatusEnvio.ENTREGADO);

            List<DashboardRegionDTO> regiones = verificacionRepository.countVerificacionesPorRegion();

            DashboardResumenDTO dto = DashboardResumenDTO.builder()
                    .pagosPendientes(pagosPendientes)
                    .totalVerificaciones(totalVerificaciones)
                    .aprobadas(aprobadas)
                    .reprobadas(reprobadas)
                    .conMulta(conMulta)
                    .notas(notas)
                    .pedidos(pedidos)
                    .pedidosEntregados(pedidosEntregados)
                    .regiones(regiones)
                    .build();

            return ResponseEntity.ok(
                    new ApiResponse("Resumen del dashboard obtenido correctamente", dto, HttpStatus.OK)
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error al obtener el resumen del dashboard", true, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}