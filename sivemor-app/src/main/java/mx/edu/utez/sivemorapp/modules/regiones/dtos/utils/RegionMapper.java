package mx.edu.utez.sivemorapp.modules.regiones.dtos.utils;

import mx.edu.utez.sivemorapp.modules.regiones.Region;
import mx.edu.utez.sivemorapp.modules.regiones.dtos.RegionResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class RegionMapper {
    public static RegionResponseDTO toDto(Region region) {
        return RegionResponseDTO.builder()
                .id(region.getId())
                .nombre(region.getNombre())
                .activo(region.getActivo())
                .build();
    }

    public static List<RegionResponseDTO> toDtoList(List<Region> list) {
        return list.stream()
                .map(RegionMapper::toDto)
                .collect(Collectors.toList());
    }
}
