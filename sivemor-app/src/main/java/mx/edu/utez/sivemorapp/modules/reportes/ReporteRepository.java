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
            cl.id_cliente AS clienteId,
            cl.razon_social AS cliente,
            r.id_region AS regionId,
            r.nombre AS region,
            n.id_nota AS notaId,
            n.folio_nota AS nota,
            v.placa AS vehiculo,
            ver.materia AS tipoVerificacion,
            ver.dictamen AS dictamen,
            COALESCE(ver.fecha_verificacion, n.fecha_creacion) AS fechaReferencia
        FROM verificaciones ver
        INNER JOIN notas n ON n.id_nota = ver.id_nota
        INNER JOIN clientes cl ON cl.id_cliente = n.id_cliente
        INNER JOIN verificentros vf ON vf.id_verificentro = n.id_verificentro
        INNER JOIN regiones r ON r.id_region = vf.id_region
        INNER JOIN vehiculos v ON v.id_vehiculo = ver.id_vehiculo
        WHERE ver.activo = 1
          AND n.activo = 1
          AND cl.activo = 1
          AND vf.activo = 1
          AND v.activo = 1

          AND (:clienteId IS NULL OR cl.id_cliente = :clienteId)
          AND (:regionId IS NULL OR r.id_region = :regionId)
          AND (:notaId IS NULL OR n.id_nota = :notaId)
          AND (:tipoVerificacion IS NULL OR ver.materia = :tipoVerificacion)
          AND (:estadoDictamen IS NULL OR ver.dictamen = :estadoDictamen)

          AND (:fechaInicio IS NULL OR COALESCE(ver.fecha_verificacion, n.fecha_creacion) >= :fechaInicio)
          AND (:fechaFin IS NULL OR COALESCE(ver.fecha_verificacion, n.fecha_creacion) <= :fechaFin)

        ORDER BY fechaReferencia DESC
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

    // OPCIONES

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
    """, nativeQuery = true)
    List<String> obtenerTiposVerificacion();

    @Query(value = """
        SELECT DISTINCT dictamen
        FROM verificaciones
        WHERE activo = 1
    """, nativeQuery = true)
    List<String> obtenerDictamenes();
}