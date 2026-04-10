package mx.edu.utez.sivemorapp.modules.usuarios;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.ChangePasswordDTO;
import mx.edu.utez.sivemorapp.modules.usuarios.dtos.UsuarioRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sivemor/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(
            @RequestParam(required = false) String nombreUsuario,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String tipoUsuario
    ) {
        return usuarioService.getAll(nombreUsuario, email, tipoUsuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.save(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody UsuarioRequestDTO dto) {
        return usuarioService.update(id, dto);
    }

    @PostMapping("/{id}/regenerar-contrasena")
    public ResponseEntity<ApiResponse> regenerarContrasena(@PathVariable Long id) {
        return usuarioService.regenerarContrasena(id);
    }

    @PostMapping("/{id}/cambiar-contrasena")
    public ResponseEntity<ApiResponse> cambiarContrasena(@PathVariable Long id,@RequestBody ChangePasswordDTO dto){
        return usuarioService.cambiarContrasena(id, dto);
    }
}