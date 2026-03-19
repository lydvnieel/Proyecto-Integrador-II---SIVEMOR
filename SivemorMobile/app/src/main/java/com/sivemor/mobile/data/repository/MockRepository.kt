package com.sivemor.mobile.data.repository

import com.sivemor.mobile.data.mock.MockData
import com.sivemor.mobile.data.model.AppUser
import com.sivemor.mobile.data.model.DashboardStats
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.Vehicle

object MockRepository {
    private var currentUser: AppUser? = null

    fun login(email: String, password: String): Result<AppUser> {
        return if (email == "oscar@gmail.com" && password == "123456") {
            currentUser = MockData.user
            Result.success(MockData.user)
        } else {
            Result.failure(Exception("Credenciales inválidas"))
        }
    }

    fun getCurrentUser(): AppUser? = currentUser ?: MockData.user

    fun getDashboardStats(): DashboardStats = MockData.dashboardStats()

    fun getRecentEvaluations(): List<Evaluation> = MockData.evaluations.takeLast(4).reversed()

    fun getVehicles(): List<Vehicle> = MockData.vehicles.filter { it.active }

    fun getVehicleById(id: String): Vehicle? = MockData.vehicles.find { it.id == id }

    fun addVehicle(vehicle: Vehicle) {
        MockData.vehicles.add(vehicle)
    }

    fun getHistoryByVehicle(vehicleId: String): List<Evaluation> {
        return MockData.evaluations.filter { it.vehicleId == vehicleId }.reversed()
    }

    fun saveEvaluation(evaluation: Evaluation) {
        MockData.evaluations.add(0, evaluation)
    }
}
