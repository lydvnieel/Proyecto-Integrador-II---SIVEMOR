package com.sivemor.mobile.data.repository

import com.sivemor.mobile.network.NetworkModule
import com.sivemor.mobile.network.dto.ReporteOpcionesDTO
import com.sivemor.mobile.network.dto.ReporteResponseDTO

class ReporteRepository {

    suspend fun obtenerOpciones(): ReporteOpcionesDTO {
        return NetworkModule.api.obtenerOpcionesReporte()
    }

    suspend fun generarReporte(
        tipo: String,
        clienteId: Long? = null,
        regionId: Long? = null,
        notaId: Long? = null,
        tipoVerificacion: String? = null,
        estadoDictamen: String? = null,
        fechaInicio: String? = null,
        fechaFin: String? = null
    ): ReporteResponseDTO {
        return NetworkModule.api.generarReporte(
            tipo = tipo,
            clienteId = clienteId,
            regionId = regionId,
            notaId = notaId,
            tipoVerificacion = tipoVerificacion,
            estadoDictamen = estadoDictamen,
            fechaInicio = fechaInicio,
            fechaFin = fechaFin
        )
    }
}