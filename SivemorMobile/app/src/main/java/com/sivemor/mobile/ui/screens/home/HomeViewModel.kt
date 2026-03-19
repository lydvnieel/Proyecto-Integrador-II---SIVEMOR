package com.sivemor.mobile.ui.screens.home

import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.repository.MockRepository

class HomeViewModel : ViewModel() {
    val user = MockRepository.getCurrentUser()
    val stats = MockRepository.getDashboardStats()

    val recent: List<Evaluation> = MockRepository.getRecentEvaluations().map { evaluation ->
        val vehicle = MockRepository.getVehicleById(evaluation.vehicleId)
        evaluation.copy(
            vehicleLabel = "Unidad ${vehicle?.unitNumber ?: ""}",
            comments = "${vehicle?.model ?: "Sin modelo"} • ${vehicle?.plate ?: "Sin placa"}"
        )
    }
}