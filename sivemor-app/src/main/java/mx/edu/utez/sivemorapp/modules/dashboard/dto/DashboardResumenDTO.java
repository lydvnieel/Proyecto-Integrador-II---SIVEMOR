package mx.edu.utez.sivemorapp.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResumenDTO {
    private long pagosPendientes;
    private long totalVerificaciones;
    private long aprobadas;
    private long reprobadas;
    private long conMulta;
    private long notas;
    private long pedidos;
    private long pedidosEntregados;
    private List<DashboardRegionDTO> regiones;
}