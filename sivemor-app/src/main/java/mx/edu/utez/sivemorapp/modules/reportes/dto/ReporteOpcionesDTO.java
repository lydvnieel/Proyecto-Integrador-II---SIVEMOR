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
public class ReporteOpcionesDTO {
    private List<OpcionDto> clientes;
    private List<OpcionDto> regiones;
    private List<OpcionDto> notas;
    private List<String> tiposVerificacion;
    private List<String> dictamenes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpcionDto {
        private Long id;
        private String nombre;
    }
}
