package com.sivemor.mobile.ui.screens.vehicles

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.model.Vehicle
import com.sivemor.mobile.data.repository.MockRepository
import java.util.UUID

class VehicleViewModel : ViewModel() {
    var search by mutableStateOf("")

    var unitNumber by mutableStateOf("")
    var plate by mutableStateOf("")
    var serial by mutableStateOf("")
    var model by mutableStateOf("")
    var year by mutableStateOf("")
    var mileage by mutableStateOf("")
    var cedis by mutableStateOf("")
    var region by mutableStateOf("")
    var type by mutableStateOf("Camión Rabón")
    var message by mutableStateOf("")

    fun vehicles(): List<Vehicle> {
        return MockRepository.getVehicles().filter {
            val q = search.trim().lowercase()
            q.isEmpty() ||
                it.plate.lowercase().contains(q) ||
                it.serial.lowercase().contains(q) ||
                it.cedis.lowercase().contains(q) ||
                it.region.lowercase().contains(q)
        }
    }

    fun saveVehicle(): Boolean {
        if (unitNumber.isBlank() || plate.isBlank() || serial.isBlank() || cedis.isBlank()) {
            message = "Completa los campos obligatorios"
            return false
        }
        val vehicle = Vehicle(
            id = UUID.randomUUID().toString(),
            unitNumber = unitNumber,
            plate = plate,
            serial = serial,
            model = model.ifBlank { "Sin modelo" },
            year = year.toIntOrNull() ?: 2020,
            mileage = mileage.toIntOrNull() ?: 0,
            cedis = cedis,
            region = region.ifBlank { "Sin región" },
            type = type
        )
        MockRepository.addVehicle(vehicle)
        message = "Vehículo registrado correctamente"
        return true
    }
}
