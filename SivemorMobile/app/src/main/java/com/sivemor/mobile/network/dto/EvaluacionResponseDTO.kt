package com.sivemor.mobile.network.dto

data class EvaluacionResponseDTO(
    val id: Long? = null,
    val idVerificacion: Long? = null,
    val idVehiculo: Long? = null,
    val idTecnico: Long? = null,
    val placa: String? = null,
    val serie: String? = null,
    val folioVerificacion: String? = null,
    val dictamen: String? = null,
    val resultadoFinal: String? = null,
    val nombreTecnico: String? = null,
    val correoTecnico: String? = null,
    val fechaVerificacion: String? = null,
    val fechaEvaluacion: String? = null,
    val comentarios: String? = null,
    val activo: Boolean? = null
)