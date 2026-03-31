package mx.edu.utez.sivemorapp.kernel;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiResponse {
    private String message;
    private Object data;
    private boolean error;
    private HttpStatus status;
}
