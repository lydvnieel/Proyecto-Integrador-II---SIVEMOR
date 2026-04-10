package mx.edu.utez.sivemorapp.modules.usuarios.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDTO {
    private String passwordActual;
    private String passwordNueva;
}