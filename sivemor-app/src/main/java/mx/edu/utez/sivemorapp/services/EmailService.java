package mx.edu.utez.sivemorapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarCredenciales(String to, String usuario, String password, String rol) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Credenciales de acceso - SIVEMOR");

        message.setText(
                "Bienvenido a SIVEMOR\n\n" +
                        "Usuario: " + usuario + "\n" +
                        "Contraseña: " + password + "\n" +
                        "Rol: " + rol + "\n\n" +
                        "Por seguridad, cambia tu contraseña al iniciar sesión."
        );

        mailSender.send(message);
    }
}