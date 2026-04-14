package com.sivemor.mobile.network

import com.sivemor.mobile.data.model.Vehicle
import com.sivemor.mobile.network.dto.ApiResponseDTO
import com.sivemor.mobile.network.dto.EvaluacionRequestDTO
import com.sivemor.mobile.network.dto.EvaluacionResponseDTO
import com.sivemor.mobile.network.dto.ReporteOpcionesDTO
import com.sivemor.mobile.network.dto.ReporteResponseDTO
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    @GET("reportes/opciones")
    suspend fun obtenerOpcionesReporte(): ReporteOpcionesDTO

    @GET("reportes/generar")
    suspend fun generarReporte(
        @Query("tipo") tipo: String? = null,
        @Query("clienteId") clienteId: Long? = null,
        @Query("regionId") regionId: Long? = null,
        @Query("notaId") notaId: Long? = null,
        @Query("tipoVerificacion") tipoVerificacion: String? = null,
        @Query("estadoDictamen") estadoDictamen: String? = null,
        @Query("fechaInicio") fechaInicio: String? = null,
        @Query("fechaFin") fechaFin: String? = null
    ): ReporteResponseDTO

    @GET("vehiculos")
    suspend fun getVehiculos(): ApiResponseDTO<List<Vehicle>>

    @POST("evaluaciones")
    suspend fun crearEvaluacion(
        @Body body: EvaluacionRequestDTO
    ): ApiResponseDTO<EvaluacionResponseDTO>
}