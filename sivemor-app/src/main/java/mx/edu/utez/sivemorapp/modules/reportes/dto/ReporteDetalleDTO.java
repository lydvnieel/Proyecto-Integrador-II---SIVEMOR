package mx.edu.utez.sivemorapp.modules.reportes.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteDetalleDTO {
    private String cliente;
    private String region;
    private String cedis;
    private String placa;
    private String serie;
    private String tipoVehiculo;

    private String folioVerificacion;
    private String materia;
    private String dictamen;
    private String tecnico;
    private String fecha;
}