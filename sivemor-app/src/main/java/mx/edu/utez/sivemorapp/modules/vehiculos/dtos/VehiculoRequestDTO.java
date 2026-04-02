package mx.edu.utez.sivemorapp.modules.vehiculos.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehiculoRequestDTO {
    private Long id;
    private Long idCliente;
    private Long idCedis;
    private String placa;
    private String serie;
    private String tipo;
}

