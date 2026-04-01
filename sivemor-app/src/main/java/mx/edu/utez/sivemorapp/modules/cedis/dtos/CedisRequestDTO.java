package mx.edu.utez.sivemorapp.modules.cedis.dtos;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CedisRequestDTO {
    private Long id;
    private Long idCliente;
    private Long idRegion;
    private String nombre;
    private String direccion;
    private String encargado;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
}
