package mx.edu.utez.sivemorapp.modules.vehiculos.dtos.utils;

import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;
import mx.edu.utez.sivemorapp.modules.vehiculos.dtos.VehiculoResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class VehiculoMapper {

    public static VehiculoResponseDTO toDto(Vehiculo vehiculo) {
        return VehiculoResponseDTO.builder()
                .id(vehiculo.getId())
                .idCliente(vehiculo.getCliente() != null ? vehiculo.getCliente().getId() : null)
                .idCedis(vehiculo.getCedis() != null ? vehiculo.getCedis().getId() : null)
                .cliente(vehiculo.getCliente() != null ? vehiculo.getCliente().getRazonSocial() : null)
                .cedis(vehiculo.getCedis() != null ? vehiculo.getCedis().getNombre() : null)
                .region(
                        vehiculo.getCedis() != null &&
                                vehiculo.getCedis().getRegion() != null
                                ? vehiculo.getCedis().getRegion().getNombre()
                                : null
                )
                .placa(vehiculo.getPlaca())
                .serie(vehiculo.getSerie())
                .tipo(vehiculo.getTipo())
                .activo(vehiculo.getActivo())
                .build();
    }

    public static List<VehiculoResponseDTO> toDtoList(List<Vehiculo> list) {
        return list.stream()
                .map(VehiculoMapper::toDto)
                .collect(Collectors.toList());
    }
}