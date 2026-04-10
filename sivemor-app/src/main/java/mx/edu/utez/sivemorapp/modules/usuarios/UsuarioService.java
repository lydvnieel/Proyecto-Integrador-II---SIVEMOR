package mx.edu.utez.sivemorapp.modules.usuarios;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.ChangePasswordDTO;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.UsuarioRequestDTO;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.UsuarioResponseDTO;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.utils.UsuarioMapper;
import mx.edu.utez.sivemorapp.services.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(String nombreUsuario, String email, String tipoUsuario) {
        List<Usuario> result;

        if (tipoUsuario != null && !tipoUsuario.isBlank()) {
            result = usuarioRepository.findByActivoTrueAndTipoUsuario(
                    mx.edu.utez.sivemorapp.kernel.enums.TipoUsuario.valueOf(tipoUsuario.toUpperCase())
            );
        } else if (nombreUsuario != null && !nombreUsuario.isBlank()) {
            result = usuarioRepository.findByActivoTrueAndNombreUsuarioContainingIgnoreCase(nombreUsuario);
        } else if (email != null && !email.isBlank()) {
            result = usuarioRepository.findByActivoTrueAndEmailContainingIgnoreCase(email);
        } else {
            result = usuarioRepository.findByActivoTrue();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", UsuarioMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Usuario found = usuarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El usuario no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", UsuarioMapper.toDto(found), HttpStatus.OK)
        );
    }

    private String generarContrasenaTemporal() {
        String mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String minus = "abcdefghijklmnopqrstuvwxyz";
        String nums = "0123456789";
        String especiales = "@#$%&*!?";
        String base = mayus + minus + nums + especiales;

        StringBuilder sb = new StringBuilder();
        sb.append(mayus.charAt((int) (Math.random() * mayus.length())));
        sb.append(minus.charAt((int) (Math.random() * minus.length())));
        sb.append(nums.charAt((int) (Math.random() * nums.length())));
        sb.append(especiales.charAt((int) (Math.random() * especiales.length())));

        for (int i = 0; i < 6; i++) {
            sb.append(base.charAt((int) (Math.random() * base.length())));
        }

        return sb.toString();
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> save(UsuarioRequestDTO dto) {
        if (dto.getNombreUsuario() == null || dto.getNombreUsuario().isBlank()
                || dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getTipoUsuario() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos requeridos vacíos", true, HttpStatus.BAD_REQUEST));
        }

        if (usuarioRepository.existsByNombreUsuarioIgnoreCase(dto.getNombreUsuario())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El nombre de usuario ya existe", true, HttpStatus.BAD_REQUEST));
        }

        if (usuarioRepository.existsByEmailIgnoreCase(dto.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El email ya existe", true, HttpStatus.BAD_REQUEST));
        }

        String contrasenaTemporal = generarContrasenaTemporal();

        Usuario usuario = Usuario.builder()
                .nombreUsuario(dto.getNombreUsuario())
                .email(dto.getEmail())
                .contrasenaHash(passwordEncoder.encode(contrasenaTemporal))
                .tipoUsuario(dto.getTipoUsuario())
                .intentosFallidos(0)
                .build();

        usuario.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        Usuario saved = usuarioRepository.save(usuario);

        try {
            emailService.enviarCredenciales(
                    saved.getEmail(),
                    saved.getNombreUsuario(),
                    contrasenaTemporal,
                    saved.getTipoUsuario().name()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(
                            "Usuario creado y credenciales enviadas por correo.",
                            UsuarioMapper.toDto(saved),
                            HttpStatus.CREATED
                    ));
        } catch (Exception e) {
            e.printStackTrace();

            UsuarioResponseDTO responseDTO = UsuarioMapper.toDto(saved);
            responseDTO.setContrasenaTemporal(contrasenaTemporal);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(
                            "Usuario creado, pero no se pudo enviar el correo. Comparta la contraseña temporal por un medio externo.",
                            responseDTO,
                            HttpStatus.CREATED
                    ));
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, UsuarioRequestDTO dto) {
        Usuario found = usuarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El usuario no existe", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getNombreUsuario() != null && !dto.getNombreUsuario().isBlank()) {
            if (usuarioRepository.existsByNombreUsuarioIgnoreCaseAndIdNot(dto.getNombreUsuario(), id)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El nombre de usuario ya existe", true, HttpStatus.BAD_REQUEST));
            }
            found.setNombreUsuario(dto.getNombreUsuario());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(dto.getEmail(), id)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("El email ya existe", true, HttpStatus.BAD_REQUEST));
            }
            found.setEmail(dto.getEmail());
        }

        if (dto.getTipoUsuario() != null) {
            found.setTipoUsuario(dto.getTipoUsuario());
        }

        if (dto.getActivo() != null) {
            found.setActivo(dto.getActivo());
        }

        Usuario updated = usuarioRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Usuario actualizado", UsuarioMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> regenerarContrasena(Long id) {
        Usuario found = usuarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El usuario no existe", true, HttpStatus.NOT_FOUND));
        }

        String nuevaContrasena = generarContrasenaTemporal();
        found.setContrasenaHash(passwordEncoder.encode(nuevaContrasena));
        found.setIntentosFallidos(0);
        found.setBloqueadoHasta(null);

        Usuario updated = usuarioRepository.save(found);

        UsuarioResponseDTO responseDTO = UsuarioMapper.toDto(updated);
        responseDTO.setContrasenaTemporal(nuevaContrasena);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Contraseña regenerada. Comparta la contraseña temporal por un medio externo.",
                        responseDTO,
                        HttpStatus.OK
                )
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> cambiarContrasena(Long id, ChangePasswordDTO dto) {
        Usuario usuario = usuarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Usuario no encontrado", true, HttpStatus.NOT_FOUND));
        }

        if (dto.getPasswordActual() == null || dto.getPasswordActual().isBlank()
                || dto.getPasswordNueva() == null || dto.getPasswordNueva().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Todos los campos son obligatorios", true, HttpStatus.BAD_REQUEST));
        }

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getContrasenaHash())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La contraseña actual es incorrecta", true, HttpStatus.BAD_REQUEST));
        }

        usuario.setContrasenaHash(passwordEncoder.encode(dto.getPasswordNueva()));
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(
                new ApiResponse("Contraseña actualizada correctamente", null, HttpStatus.OK)
        );
    }
}