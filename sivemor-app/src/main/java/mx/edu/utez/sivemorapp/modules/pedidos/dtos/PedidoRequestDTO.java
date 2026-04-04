package mx.edu.utez.sivemorapp.modules.pedidos.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequestDTO {
    private Long id;
    private Long idNota;
    private LocalDateTime fechaEnvio;
    private String numeroGuia;
    private String recibio;

    private String fotoBase64;
    private String fotoMimeType;
    private String fotoNombreArchivo;

    private EstatusEnvio estatusEnvio;
    private String comentario;
}