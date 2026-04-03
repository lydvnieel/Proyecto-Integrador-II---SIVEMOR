package mx.edu.utez.sivemorapp.modules.usuarios.dtos;

import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.TipoUsuario;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String nombreUsuario;
    private String email;
    private TipoUsuario tipoUsuario;
    private Integer intentosFallidos;
    private LocalDateTime bloqueadoHasta;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String contrasenaTemporal;
}
