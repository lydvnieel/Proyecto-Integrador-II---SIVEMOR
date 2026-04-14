package com.sivemor.mobile.network.dto

data class EvidenciaEvaluacionDTO(
    val numeroEvidencia: Int? = null,
    val nombreArchivo: String? = null,
    val mimeType: String? = null,
    val tamanoBytes: Int? = null,
    val comentario: String? = null,
    val imagenBase64: String? = null
)