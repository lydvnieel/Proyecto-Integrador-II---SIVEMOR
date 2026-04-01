package mx.edu.utez.sivemorapp.modules.cedis.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CedisResponseDTO {
    private Long id;
    private Long id_cliente;
    private String cliente;
    private Long id_region;
    private String region;
    private String nombre;
    private String direccion;
    private String encargado;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
    private Boolean activo;
}
