package mx.edu.utez.sivemorapp.modules.reportes;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteFiltroRequest;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteItemDTO;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteOpcionesDTO;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ReporteRepository reporteRepository;

    public ReporteOpcionesDTO obtenerOpciones() {
        List<ReporteOpcionesDTO.OpcionDto> clientes = reporteRepository.obtenerClientes()
                .stream()
                .map(row -> new ReporteOpcionesDTO.OpcionDto(
                        ((Number) row[0]).longValue(),
                        String.valueOf(row[1])
                ))
                .collect(Collectors.toList());

        List<ReporteOpcionesDTO.OpcionDto> regiones = reporteRepository.obtenerRegiones()
                .stream()
                .map(row -> new ReporteOpcionesDTO.OpcionDto(
                        ((Number) row[0]).longValue(),
                        String.valueOf(row[1])
                ))
                .collect(Collectors.toList());

        List<ReporteOpcionesDTO.OpcionDto> notas = reporteRepository.obtenerNotas()
                .stream()
                .map(row -> new ReporteOpcionesDTO.OpcionDto(
                        ((Number) row[0]).longValue(),
                        String.valueOf(row[1])
                ))
                .collect(Collectors.toList());

        return ReporteOpcionesDTO.builder()
                .clientes(clientes)
                .regiones(regiones)
                .notas(notas)
                .tiposVerificacion(reporteRepository.obtenerTiposVerificacion())
                .dictamenes(reporteRepository.obtenerDictamenes())
                .build();
    }

    public ReporteResponseDTO generarReporte(ReporteFiltroRequest filtros) {
        validarFiltros(filtros);

        LocalDateTime fechaInicio = filtros.getFechaInicio() != null
                ? filtros.getFechaInicio().atStartOfDay()
                : null;

        LocalDateTime fechaFin = filtros.getFechaFin() != null
                ? filtros.getFechaFin().atTime(LocalTime.MAX)
                : null;

        List<ReporteBaseProjection> base = reporteRepository.generarBaseReporte(
                filtros.getClienteId(),
                filtros.getRegionId(),
                filtros.getNotaId(),
                blankToNull(filtros.getTipoVerificacion()),
                blankToNull(filtros.getEstadoDictamen()),
                fechaInicio,
                fechaFin
        );

        if (base.isEmpty()) {
            throw new RuntimeException("No hay datos para generar el reporte.");
        }

        List<ReporteItemDTO> data = base.stream()
                .map(item -> ReporteItemDTO.builder()
                        .tipo(normalizarTipo(filtros.getTipo()))
                        .agrupacion(obtenerAgrupacion(item, filtros.getTipo()))
                        .region(valor(item.getRegion(), "-"))
                        .cliente(valor(item.getCliente(), "-"))
                        .nota(valor(item.getNota(), "-"))
                        .placa(valor(item.getPlaca(), "-"))
                        .serie(valor(item.getSerie(), "-"))
                        .tipoVehiculo(valor(item.getTipoVehiculo(), "-"))
                        .folioVerificacion(valor(item.getFolioVerificacion(), "-"))
                        .materia(valor(item.getMateria(), "-"))
                        .dictamen(valor(item.getDictamen(), "-"))
                        .fecha(formatearFecha(item.getFecha()))
                        .tecnico(valor(item.getTecnico(), "-"))
                        .build())
                .collect(Collectors.toList());

        String reportName = "Reporte_" + normalizarTipo(filtros.getTipo()) + "_" + LocalDate.now() + ".pdf";

        return ReporteResponseDTO.builder()
                .tipo(normalizarTipo(filtros.getTipo()))
                .clienteId(filtros.getClienteId())
                .regionId(filtros.getRegionId())
                .notaId(filtros.getNotaId())
                .tipoVerificacion(filtros.getTipoVerificacion())
                .estadoDictamen(filtros.getEstadoDictamen())
                .fechaInicio(filtros.getFechaInicio() != null ? filtros.getFechaInicio().toString() : null)
                .fechaFin(filtros.getFechaFin() != null ? filtros.getFechaFin().toString() : null)
                .reportName(reportName)
                .data(data)
                .build();
    }

    private void validarFiltros(ReporteFiltroRequest filtros) {
        String tipo = normalizarTipo(filtros.getTipo());

        if ("cliente".equals(tipo) && filtros.getRegionId() == null) {
            throw new RuntimeException("La región es obligatoria para el reporte por cliente.");
        }

        if ("region".equals(tipo) && filtros.getClienteId() == null) {
            throw new RuntimeException("El cliente es obligatorio para el reporte por región.");
        }

        if ("nota".equals(tipo) && filtros.getRegionId() == null) {
            throw new RuntimeException("La región es obligatoria para el reporte por nota.");
        }

        if (filtros.getFechaInicio() != null && filtros.getFechaFin() != null
                && filtros.getFechaInicio().isAfter(filtros.getFechaFin())) {
            throw new RuntimeException("La fecha inicio no puede ser mayor a la fecha fin.");
        }
    }

    private String obtenerAgrupacion(ReporteBaseProjection item, String tipo) {
        String tipoNormalizado = normalizarTipo(tipo);

        switch (tipoNormalizado) {
            case "region":
                return valor(item.getRegion(), "SIN REGIÓN");
            case "nota":
                return valor(item.getNota(), "SIN NOTA");
            default:
                return valor(item.getCliente(), "SIN CLIENTE");
        }
    }

    private String formatearFecha(LocalDateTime fecha) {
        if (fecha == null) return "-";
        return fecha.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }

    private String normalizarTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) return "cliente";
        return tipo.trim().toLowerCase();
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private String valor(String value, String defecto) {
        return (value == null || value.isBlank()) ? defecto : value;
    }
}