package mx.edu.utez.sivemorapp.modules.cedis.dtos.utils;

import mx.edu.utez.sivemorapp.modules.cedis.Cedis;
import mx.edu.utez.sivemorapp.modules.cedis.dtos.CedisResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class CedisMapper {

    public static CedisResponseDTO toDto(Cedis cedis) {
        return CedisResponseDTO.builder()
                .id(cedis.getId())
                .idCliente(cedis.getCliente() != null ? cedis.getCliente().getId() : null)
                .cliente(cedis.getCliente() != null ? cedis.getCliente().getRazonSocial() : null)
                .idRegion(cedis.getRegion() != null ? cedis.getRegion().getId() : null)
                .region(cedis.getRegion() != null ? cedis.getRegion().getNombre() : null)
                .nombre(cedis.getNombre())
                .direccion(cedis.getDireccion())
                .encargado(cedis.getEncargado())
                .correo(cedis.getCorreo())
                .telefono(cedis.getTelefono())
                .telefonoAlternativo(cedis.getTelefonoAlternativo())
                .activo(cedis.getActivo())
                .build();
    }

    public static List<CedisResponseDTO> toDtoList(List<Cedis> list) {
        return list.stream()
                .map(CedisMapper::toDto)
                .collect(Collectors.toList());
    }
}
