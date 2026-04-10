package mx.edu.utez.sivemorapp.modules.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteItemDTO {
    private String tipo;
    private String agrupacion;
    private String region;
    private String cliente;
    private String nota;
    private String vehiculo;
    private String dictamen;
    private Long numeroVerificaciones;
    private Long aprobadas;
    private Long reprobadas;
    private String porcentajeAprobacion;
}