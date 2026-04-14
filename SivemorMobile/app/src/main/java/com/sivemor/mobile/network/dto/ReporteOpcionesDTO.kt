package com.sivemor.mobile.network.dto

data class ReporteOpcionesDTO(
    val clientes: List<OpcionDto> = emptyList(),
    val regiones: List<OpcionDto> = emptyList(),
    val notas: List<OpcionDto> = emptyList(),
    val tiposVerificacion: List<String> = emptyList(),
    val dictamenes: List<String> = emptyList()
)

data class OpcionDto(
    val id: Long,
    val nombre: String
)