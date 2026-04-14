package com.sivemor.mobile.network.dto

data class ReporteResponseDTO(
    val tipo: String? = null,
    val clienteId: Long? = null,
    val regionId: Long? = null,
    val notaId: Long? = null,
    val tipoVerificacion: String? = null,
    val estadoDictamen: String? = null,
    val fechaInicio: String? = null,
    val fechaFin: String? = null,
    val reportName: String? = null,
    val data: List<ReporteItemDTO> = emptyList()
)

data class ReporteItemDTO(
    val tipo: String? = null,
    val agrupacion: String? = null,
    val region: String? = null,
    val cliente: String? = null,
    val nota: String? = null,
    val vehiculo: String? = null,
    val dictamen: String? = null,
    val numeroVerificaciones: Long? = null,
    val aprobadas: Long? = null,
    val reprobadas: Long? = null,
    val porcentajeAprobacion: String? = null
)