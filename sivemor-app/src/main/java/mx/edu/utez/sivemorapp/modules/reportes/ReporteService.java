package mx.edu.utez.sivemorapp.modules.reportes;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteFiltroRequest;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteItemDTO;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteOpcionesDTO;
import mx.edu.utez.sivemorapp.modules.reportes.dto.ReporteResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
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

        Map<String, List<ReporteBaseProjection>> agrupado = new LinkedHashMap<>();

        for (ReporteBaseProjection item : base) {
            String clave;

            switch (normalizarTipo(filtros.getTipo())) {
                case "region":
                    clave = valor(item.getRegion(), "SIN REGIÓN");
                    break;
                case "nota":
                    clave = valor(item.getNota(), "SIN NOTA");
                    break;
                default:
                    clave = valor(item.getCliente(), "SIN CLIENTE");
                    break;
            }

            agrupado.computeIfAbsent(clave, k -> new ArrayList<>()).add(item);
        }

        List<ReporteItemDTO> data = new ArrayList<>();

        for (Map.Entry<String, List<ReporteBaseProjection>> entry : agrupado.entrySet()) {
            List<ReporteBaseProjection> items = entry.getValue();

            long total = items.size();
            long aprobadas = items.stream()
                    .filter(i -> "APROBADO".equalsIgnoreCase(valor(i.getDictamen(), "")))
                    .count();
            long reprobadas = total - aprobadas;

            ReporteBaseProjection first = items.get(0);

            String porcentaje = total > 0
                    ? String.format(Locale.US, "%.2f", (aprobadas * 100.0) / total)
                    : "0.00";

            data.add(ReporteItemDTO.builder()
                    .tipo(normalizarTipo(filtros.getTipo()))
                    .agrupacion(entry.getKey())
                    .region(valor(first.getRegion(), "-"))
                    .cliente(valor(first.getCliente(), "-"))
                    .nota(valor(first.getNota(), "-"))
                    .vehiculo(valor(first.getVehiculo(), "-"))
                    .dictamen(valor(first.getDictamen(), "-"))
                    .numeroVerificaciones(total)
                    .aprobadas(aprobadas)
                    .reprobadas(reprobadas)
                    .porcentajeAprobacion(porcentaje)
                    .build());
        }

        String reportName = "Reporte_" + normalizarTipo(filtros.getTipo()) + "_" + java.time.LocalDate.now() + ".pdf";

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