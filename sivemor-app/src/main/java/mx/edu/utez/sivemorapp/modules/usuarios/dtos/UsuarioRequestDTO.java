package mx.edu.utez.sivemorapp.modules.usuarios.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.enums.TipoUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioRequestDTO  {
    private Long id;
    private String nombreUsuario;
    private String email;
    private TipoUsuario tipoUsuario;
    private Boolean activo;
}
