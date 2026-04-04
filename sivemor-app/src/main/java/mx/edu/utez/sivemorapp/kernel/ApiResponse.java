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

    public ApiResponse() {
    }

    public ApiResponse(String message, Object data, HttpStatus status) {
        this.message = message;
        this.data = data;
        this.status = status;
        this.error = false;
    }

    public ApiResponse(String message, boolean error, HttpStatus status) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.data = null;
    }

    public ApiResponse(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
        this.error = false;
        this.data = null;
    }
}