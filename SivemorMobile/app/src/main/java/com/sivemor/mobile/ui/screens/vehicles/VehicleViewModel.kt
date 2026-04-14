package com.sivemor.mobile.ui.screens.vehicles

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sivemor.mobile.data.model.Vehicle
import com.sivemor.mobile.data.repository.VehicleRepository
import kotlinx.coroutines.launch

class VehicleViewModel : ViewModel() {

    private val repo = VehicleRepository()

    var placa by mutableStateOf("")
    var serie by mutableStateOf("")
    var tipo by mutableStateOf("")

    var vehicles by mutableStateOf<List<Vehicle>>(emptyList())
        private set

    var search by mutableStateOf("")
    var errorMessage by mutableStateOf<String?>(null)
        private set

    fun loadVehicles() {
        viewModelScope.launch {
            try {
                errorMessage = null
                vehicles = repo.getVehiculos()
                Log.d("SIVEMOR_VEH", "vehiculos cargados = ${vehicles.size}")
                Log.d("SIVEMOR_VEH", "lista = $vehicles")
            } catch (e: Exception) {
                vehicles = emptyList()
                errorMessage = e.message
                Log.e("SIVEMOR_VEH", "error cargando vehículos", e)
            }
        }
    }

    fun saveVehicle() {
        viewModelScope.launch {
            try {
                Log.d("VehicleViewModel", "Guardando vehículo: $placa - $serie - $tipo")
            } catch (e: Exception) {
                Log.e("VehicleViewModel", "Error guardando vehículo", e)
            }
        }
    }
}