package mx.edu.utez.sivemorapp.modules.reportes;

import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReporteRepository extends JpaRepository<Verificacion, Long> {

    @Query(value = """
    SELECT
        cl.razon_social AS cliente,
        r.nombre AS region,
        n.folio_nota AS nota,
        vf.nombre AS cedis,
        v.placa AS placa,
        v.serie AS serie,
        v.tipo AS tipoVehiculo,
        ver.folio_verificacion AS folioVerificacion,
        ver.materia AS materia,
        ver.dictamen AS dictamen,
        ver.fecha_verificacion AS fecha,
        'Técnico SIVEMOR' AS tecnico
    FROM verificaciones ver
    INNER JOIN notas n ON n.id_nota = ver.id_nota
    INNER JOIN clientes cl ON cl.id_cliente = n.id_cliente
    INNER JOIN verificentros vf ON vf.id_verificentro = n.id_verificentro
    INNER JOIN regiones r ON r.id_region = vf.id_region
    INNER JOIN vehiculos v ON v.id_vehiculo = ver.id_vehiculo
    WHERE ver.activo = 1
      AND (:clienteId IS NULL OR cl.id_cliente = :clienteId)
      AND (:regionId IS NULL OR r.id_region = :regionId)
      AND (:notaId IS NULL OR n.id_nota = :notaId)
      AND (:tipoVerificacion IS NULL OR UPPER(ver.materia) = UPPER(:tipoVerificacion))
      AND (:estadoDictamen IS NULL OR UPPER(ver.dictamen) = UPPER(:estadoDictamen))
      AND (:fechaInicio IS NULL OR ver.fecha_verificacion >= :fechaInicio)
      AND (:fechaFin IS NULL OR ver.fecha_verificacion <= :fechaFin)
    ORDER BY cl.razon_social, n.folio_nota, ver.fecha_verificacion
""", nativeQuery = true)
    List<ReporteBaseProjection> generarBaseReporte(
            @Param("clienteId") Long clienteId,
            @Param("regionId") Long regionId,
            @Param("notaId") Long notaId,
            @Param("tipoVerificacion") String tipoVerificacion,
            @Param("estadoDictamen") String estadoDictamen,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(value = """
        SELECT id_cliente, razon_social
        FROM clientes
        WHERE activo = 1
        ORDER BY razon_social
    """, nativeQuery = true)
    List<Object[]> obtenerClientes();

    @Query(value = """
        SELECT id_region, nombre
        FROM regiones
        WHERE activo = 1
        ORDER BY nombre
    """, nativeQuery = true)
    List<Object[]> obtenerRegiones();

    @Query(value = """
        SELECT id_nota, folio_nota
        FROM notas
        WHERE activo = 1
        ORDER BY folio_nota
    """, nativeQuery = true)
    List<Object[]> obtenerNotas();

    @Query(value = """
        SELECT DISTINCT materia
        FROM verificaciones
        WHERE activo = 1
        ORDER BY materia
    """, nativeQuery = true)
    List<String> obtenerTiposVerificacion();

    @Query(value = """
        SELECT DISTINCT dictamen
        FROM verificaciones
        WHERE activo = 1
        ORDER BY dictamen
    """, nativeQuery = true)
    List<String> obtenerDictamenes();
}