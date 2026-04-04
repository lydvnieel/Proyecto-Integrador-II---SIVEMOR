package mx.edu.utez.sivemorapp.modules.verificentros.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificentroResponseDTO {
    private Long id;
    private Long idRegion;
    private String region;
    private String nombre;
    private String claveVerificentro;
    private String direccion;
    private String responsable;
    private String correo;
    private String telefono;
    private String telefonoAlternativo;
    private String horarioGeneral;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}