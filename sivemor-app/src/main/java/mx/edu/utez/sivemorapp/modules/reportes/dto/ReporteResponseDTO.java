package mx.edu.utez.sivemorapp.modules.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteResponseDTO {
    private String tipo;
    private Long clienteId;
    private Long regionId;
    private Long notaId;
    private String tipoVerificacion;
    private String estadoDictamen;
    private String fechaInicio;
    private String fechaFin;
    private String reportName;
    private List<ReporteItemDTO> data;
}
