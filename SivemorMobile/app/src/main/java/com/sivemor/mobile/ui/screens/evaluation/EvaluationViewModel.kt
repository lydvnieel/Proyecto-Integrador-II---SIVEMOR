package com.sivemor.mobile.ui.screens.evaluation

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.sivemor.mobile.network.ApiClient
import com.sivemor.mobile.network.dto.EvaluacionRequestDTO
import com.sivemor.mobile.network.dto.EvidenciaEvaluacionDTO
import java.util.UUID

class EvaluationViewModel : ViewModel() {

    var dictamen by mutableStateOf("APROBADO")
    var conMulta by mutableStateOf(false)
    var comments by mutableStateOf("")
    var observations by mutableStateOf("")

    val photos = mutableStateListOf<String>()

    private var savedEvaluationId: String? = null

    fun addPhoto(uri: String) {
        photos.add(uri)
        if (savedEvaluationId == null) {
            savedEvaluationId = "temp-${UUID.randomUUID()}"
        }
    }

    suspend fun save(
        request: EvaluacionRequestDTO
    ): Boolean {
        return try {
            val response = ApiClient.apiService.crearEvaluacion(request)
            response.error != true && response.data != null
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun reset() {
        dictamen = "APROBADO"
        conMulta = false
        comments = ""
        observations = ""
        photos.clear()
        savedEvaluationId = null
    }
}