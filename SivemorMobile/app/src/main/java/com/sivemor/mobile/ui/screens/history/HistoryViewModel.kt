package com.sivemor.mobile.ui.screens.history

import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.repository.MockRepository

class HistoryViewModel : ViewModel() {
    fun history(vehicleId: String) = MockRepository.getHistoryByVehicle(vehicleId)
    fun vehicle(vehicleId: String) = MockRepository.getVehicleById(vehicleId)
}
