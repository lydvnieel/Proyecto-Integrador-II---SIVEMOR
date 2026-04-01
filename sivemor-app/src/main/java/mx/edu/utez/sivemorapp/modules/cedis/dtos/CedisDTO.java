package mx.edu.utez.sivemorapp.modules.cedis.dtos;

import lombok.Data;

@Data
public class CedisDTO {
    private Long id_cliente;
    private Long id_region;
    private String nombre;
    private String direccion;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
}
