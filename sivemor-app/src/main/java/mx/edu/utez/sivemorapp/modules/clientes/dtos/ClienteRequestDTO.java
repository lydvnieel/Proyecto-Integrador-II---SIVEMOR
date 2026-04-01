package mx.edu.utez.sivemorapp.modules.clientes.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRequestDTO {
    private Long id;
    private String razonSocial;
    private String email;
    private String telefono;
    private String telefonoAlternativo;
    private String gestor;
}
