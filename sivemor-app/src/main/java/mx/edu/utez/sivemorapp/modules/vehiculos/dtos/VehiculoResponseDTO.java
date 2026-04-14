package mx.edu.utez.sivemorapp.modules.vehiculos.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehiculoResponseDTO {
    private Long id;
    private Long idCliente;
    private Long idCedis;
    private String cliente;
    private String cedis;
    private String region;
    private String placa;
    private String serie;
    private String tipo;
    private Boolean activo;
}
