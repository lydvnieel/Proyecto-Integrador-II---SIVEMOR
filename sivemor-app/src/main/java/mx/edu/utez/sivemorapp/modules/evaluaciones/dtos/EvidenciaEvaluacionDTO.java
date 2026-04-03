package mx.edu.utez.sivemorapp.modules.evaluaciones.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaEvaluacionDTO {
    private Long id;
    private Integer numeroEvidencia;
    private String nombreArchivo;
    private String mimeType;
    private Integer tamanoBytes;

    private String imagenBase64;
    private String comentario;
}