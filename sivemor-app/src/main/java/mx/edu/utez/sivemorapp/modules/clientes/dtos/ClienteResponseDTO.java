package mx.edu.utez.sivemorapp.modules.clientes.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponseDTO {
    private Long id;
    private String razonSocial;
    private String email;
    private String telefono;
    private String telefonoAlternativo;
    private String gestor;
    private Boolean activo;
}
