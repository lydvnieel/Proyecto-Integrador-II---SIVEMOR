package mx.edu.utez.sivemorapp.modules.login;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private Long id;
    private String nombreUsuario;
    private String email;
    private String tipoUsuario;
}
