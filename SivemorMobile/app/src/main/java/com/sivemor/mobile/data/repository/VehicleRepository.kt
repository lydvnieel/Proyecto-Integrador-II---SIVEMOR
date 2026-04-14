package com.sivemor.mobile.data.repository

import android.util.Log
import com.sivemor.mobile.data.model.Vehicle
import com.sivemor.mobile.network.NetworkModule

class VehicleRepository {

    suspend fun getVehiculos(): List<Vehicle> {
        val response = NetworkModule.api.getVehiculos()
        Log.d("SIVEMOR_VEH", "response = $response")
        Log.d("SIVEMOR_VEH", "data = ${response.data}")
        Log.d("SIVEMOR_VEH", "message = ${response.message}")
        Log.d("SIVEMOR_VEH", "error = ${response.error}")
        Log.d("SIVEMOR_VEH", "status = ${response.status}")
        return response.data ?: emptyList()
    }
}