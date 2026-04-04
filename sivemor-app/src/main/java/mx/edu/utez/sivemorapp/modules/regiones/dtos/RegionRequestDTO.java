package mx.edu.utez.sivemorapp.modules.regiones.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionRequestDTO {
    private Long id;
    private String nombre;
    private String descripcion;
}