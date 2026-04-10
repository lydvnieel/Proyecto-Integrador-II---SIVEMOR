package mx.edu.utez.sivemorapp.modules.reportes.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class ReporteFiltroRequest {
    private String tipo;
    private Long clienteId;
    private Long regionId;
    private Long notaId;

    private String tipoVerificacion;
    private String estadoDictamen;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fechaInicio;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fechaFin;
}