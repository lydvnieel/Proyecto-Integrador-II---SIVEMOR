package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaEvaluacionRequestDTO {
    private Long id;
    private Long idEvaluacion;
    private Integer numeroEvidencia;
    private String imagenBase64;
    private String mimeType;
    private String nombreArchivo;
    private String comentario;
}