package mx.edu.utez.sivemorapp.modules.regiones.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionResponseDTO {
    private long id;
    private String nombre;
    private Boolean activo;
}
