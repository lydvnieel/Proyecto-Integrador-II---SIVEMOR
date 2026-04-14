package com.sivemor.mobile.data.repository

import com.sivemor.mobile.data.model.HistoryItem

/**
 * Mantenido por compatibilidad. Delega a AppRepository.
 */
object HistoryRepository {
    fun getHistoryByVehicle(vehicleId: String): List<HistoryItem> =
        AppRepository.getHistoryByVehicle(vehicleId)
}