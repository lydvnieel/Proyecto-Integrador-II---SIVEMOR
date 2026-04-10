package mx.edu.utez.sivemorapp.modules.auth;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.TipoUsuario;
import mx.edu.utez.sivemorapp.modules.login.LoginRequestDTO;
import mx.edu.utez.sivemorapp.modules.login.LoginResponseDTO;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.usuarios.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int MAX_INTENTOS = 5;
    private static final int MINUTOS_BLOQUEO = 15;

    @Transactional
    public ResponseEntity<ApiResponse> loginAdmin(LoginRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getPassword() == null || dto.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(
                            "Por favor, rellene todos los campos antes de continuar",
                            true,
                            HttpStatus.BAD_REQUEST
                    ));
        }

        Usuario usuario = usuarioRepository.findByEmailIgnoreCaseAndActivoTrue(dto.getEmail().trim()).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(
                            "Correo o contraseña incorrecta",
                            true,
                            HttpStatus.UNAUTHORIZED
                    ));
        }

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(
                            "Usuario no encontrado",
                            true,
                            HttpStatus.UNAUTHORIZED
                    ));
        }

        LocalDateTime ahora = LocalDateTime.now();

        if (usuario.getBloqueadoHasta() != null && ahora.isBefore(usuario.getBloqueadoHasta())) {
            return ResponseEntity.status(HttpStatus.LOCKED)
                    .body(new ApiResponse(
                            "Cuenta bloqueada por múltiples intentos fallidos. Intente nuevamente más tarde.",
                            true,
                            HttpStatus.LOCKED
                    ));
        }

        boolean passwordCorrecta = passwordEncoder.matches(dto.getPassword(), usuario.getContrasenaHash());

        if (!passwordCorrecta) {
            int intentos = usuario.getIntentosFallidos() == null ? 0 : usuario.getIntentosFallidos();
            intentos++;
            usuario.setIntentosFallidos(intentos);

            if (intentos >= MAX_INTENTOS) {
                usuario.setBloqueadoHasta(ahora.plusMinutes(MINUTOS_BLOQUEO));
                usuario.setIntentosFallidos(0);
            }

            usuarioRepository.save(usuario);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(
                            "Correo o contraseña incorrecta",
                            true,
                            HttpStatus.UNAUTHORIZED
                    ));
        }

        if (usuario.getTipoUsuario() != TipoUsuario.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(
                            "Acceso denegado. Solo los administradores pueden iniciar sesión en este portal.",
                            true,
                            HttpStatus.FORBIDDEN
                    ));
        }

        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);

        LoginResponseDTO response = LoginResponseDTO.builder()
                .id(usuario.getId())
                .nombreUsuario(usuario.getNombreUsuario())
                .email(usuario.getEmail())
                .tipoUsuario(usuario.getTipoUsuario().name())
                .build();

        return ResponseEntity.ok(
                new ApiResponse("Inicio de sesión exitoso", response, HttpStatus.OK)
        );
    }
}