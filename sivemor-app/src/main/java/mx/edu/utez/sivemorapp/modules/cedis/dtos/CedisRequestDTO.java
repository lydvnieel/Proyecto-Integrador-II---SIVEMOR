package mx.edu.utez.sivemorapp.modules.cedis.dtos;

import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CedisRequestDTO {
    private Long id_cliente;
    private Long id_region;
    private String nombre;
    private String direccion;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
}
