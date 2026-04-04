package mx.edu.utez.sivemorapp.modules.evidencias_evaluacion.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenciaEvaluacionResponseDTO {
    private Long id;

    private Long idEvaluacion;
    private Long idVerificacion;

    private Integer numeroEvidencia;

    private Boolean tieneImagen;
    private String mimeType;
    private String nombreArchivo;
    private Integer tamanoBytes;
    private String comentario;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}