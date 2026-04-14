package com.sivemor.mobile.data.repository

import com.sivemor.mobile.data.model.AppUser
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.Vehicle

/**
 * Mantenido por compatibilidad con código que ya lo referencia.
 * Toda la lógica real está en AppRepository.
 */
object MockRepository {
    fun login(email: String, password: String): Result<AppUser> =
        AppRepository.login(email, password)

    fun getCurrentUser(): AppUser? = AppRepository.getCurrentUser()
    fun getVehicles(): List<Vehicle> = AppRepository.getVehicles()
    fun getVehicleById(id: String): Vehicle? = AppRepository.getVehicleById(id)
    fun addVehicle(vehicle: Vehicle) = AppRepository.addVehicle(vehicle)
    fun saveEvaluation(evaluation: Evaluation) = AppRepository.saveEvaluation(evaluation)
    fun getEvaluations(): List<Evaluation> = AppRepository.getEvaluations()
}