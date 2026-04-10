package mx.edu.utez.sivemorapp.modules.reportes;

import java.time.LocalDateTime;

public interface ReporteBaseProjection {
    Long getClienteId();
    String getCliente();

    Long getRegionId();
    String getRegion();

    Long getNotaId();
    String getNota();

    String getVehiculo();
    String getTipoVerificacion();
    String getDictamen();

    LocalDateTime getFechaReferencia();
}