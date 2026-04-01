package mx.edu.utez.sivemorapp.modules.clientes.utils;

import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.clientes.dtos.ClienteResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

public class ClienteMapper {
    public static ClienteResponseDTO toDto(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .id(cliente.getId())
                .razonSocial(cliente.getRazonSocial())
                .email(cliente.getEmail())
                .telefono(cliente.getTelefono())
                .telefonoAlternativo(cliente.getTelefonoAlternativo())
                .gestor(cliente.getGestor())
                .activo(cliente.getActivo())
                .build();
    }

    public static List<ClienteResponseDTO> toDtoList(List<Cliente> clientes) {
        return clientes.stream()
                .map(ClienteMapper::toDto)
                .collect(Collectors.toList());
    }
}
