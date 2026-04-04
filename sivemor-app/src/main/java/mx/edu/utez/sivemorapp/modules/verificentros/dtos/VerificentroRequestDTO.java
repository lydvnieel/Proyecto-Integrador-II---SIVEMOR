package mx.edu.utez.sivemorapp.modules.verificentros.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificentroRequestDTO {
    private Long id;
    private Long idRegion;
    private String nombre;
    private String claveVerificentro;
    private String direccion;
    private String responsable;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
    private String horarioGeneral;
}