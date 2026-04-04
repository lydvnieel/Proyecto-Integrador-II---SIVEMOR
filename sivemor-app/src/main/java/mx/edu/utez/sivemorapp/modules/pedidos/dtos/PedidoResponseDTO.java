package mx.edu.utez.sivemorapp.modules.pedidos.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponseDTO {
    private Long id;

    private Long idNota;
    private String folioNota;

    private LocalDateTime fechaEnvio;
    private String numeroGuia;
    private String recibio;

    private Boolean tieneFoto;
    private String fotoMimeType;
    private String fotoNombreArchivo;
    private Integer fotoTamanoBytes;

    private EstatusEnvio estatusEnvio;
    private String comentario;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}