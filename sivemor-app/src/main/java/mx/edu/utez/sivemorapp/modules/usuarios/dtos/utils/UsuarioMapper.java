package mx.edu.utez.sivemorapp.modules.usuarios.dtos.utils;

import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.UsuarioResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class UsuarioMapper {
    public static UsuarioResponseDTO toDto(Usuario u) {
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .nombreUsuario(u.getNombreUsuario())
                .email(u.getEmail())
                .tipoUsuario(u.getTipoUsuario())
                .intentosFallidos(u.getIntentosFallidos())
                .bloqueadoHasta(u.getBloqueadoHasta())
                .activo(u.getActivo())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }

    public static List<UsuarioResponseDTO> toDtoList(List<Usuario> list) {
        return list.stream().map(UsuarioMapper::toDto).collect(Collectors.toList());
    }
}