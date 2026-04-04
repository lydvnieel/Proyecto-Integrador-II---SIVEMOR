package mx.edu.utez.sivemorapp.modules.costos.dtos.utils;

import mx.edu.utez.sivemorapp.modules.costos.Costo;
import mx.edu.utez.sivemorapp.modules.costos.dtos.CostoResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class CostoMapper {

    public static CostoResponseDTO toDto(Costo c) {
        return CostoResponseDTO.builder()
                .id(c.getId())
                .idCliente(c.getCliente() != null ? c.getCliente().getId() : null)
                .cliente(c.getCliente() != null ? c.getCliente().getRazonSocial() : null)
                .materia(c.getMateria())
                .costo(c.getCosto())
                .encargado(c.getEncargado() != null ? c.getEncargado().getId() : null)
                .nombreEncargado(c.getEncargado() != null ? c.getEncargado().getNombreUsuario() : null)
                .atiendeYCobra(c.getAtiendeYCobra() != null ? c.getAtiendeYCobra().getId() : null)
                .nombreAtiendeYCobra(c.getAtiendeYCobra() != null ? c.getAtiendeYCobra().getNombreUsuario() : null)
                .activo(c.getActivo())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    public static List<CostoResponseDTO> toDtoList(List<Costo> list) {
        return list.stream().map(CostoMapper::toDto).collect(Collectors.toList());
    }
}