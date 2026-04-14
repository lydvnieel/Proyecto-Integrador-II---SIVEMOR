package com.sivemor.mobile.data.repository

import com.sivemor.mobile.data.mock.MockData
import com.sivemor.mobile.data.model.AppUser
import com.sivemor.mobile.data.model.Cedis
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.HistoryItem
import com.sivemor.mobile.data.model.Vehicle

object AppRepository {

    // ── Auth ──────────────────────────────────────────────────────────────────
    private var currentUser: AppUser? = null

    fun login(email: String, password: String): Result<AppUser> {
        return if (email == "tecnico@sivemor.com" && password == "123456") {
            currentUser = MockData.user
            Result.success(MockData.user)
        } else {
            Result.failure(Exception("Credenciales inválidas"))
        }
    }

    fun getCurrentUser(): AppUser? = currentUser ?: MockData.user


    private val localVehicles = mutableListOf<Vehicle>()

    fun getVehicles(): List<Vehicle> = localVehicles.filter { it.activo }

    fun getVehicleById(id: String): Vehicle? =
        localVehicles.find { it.id.toString() == id }

    fun addVehicle(vehicle: Vehicle) {
        localVehicles.add(0, vehicle)
    }

    // ── CEDIS ─────────────────────────────────────────────────────────────────
    fun getCedisList(): List<Cedis> = MockData.cedisList

    fun getCedisById(id: String): Cedis? = MockData.cedisList.find { it.id == id }

    fun getCedisByClient(client: String): List<Cedis> =
        MockData.cedisList.filter { it.client == client }

    fun getCedisNames(): List<String> = MockData.cedisList.map { it.name }

    fun addCedis(cedis: Cedis) {
        MockData.cedisList.add(0, cedis)
    }

    // ── Evaluaciones ──────────────────────────────────────────────────────────
    fun getEvaluations(): List<Evaluation> = MockData.evaluations

    fun saveEvaluation(evaluation: Evaluation) {
        MockData.evaluations.add(0, evaluation)
    }

    // ── Historial ─────────────────────────────────────────────────────────────
    fun getHistoryByVehicle(vehicleId: String): List<HistoryItem> =
        MockData.historyItems.filter { it.vehicleId == vehicleId }

    fun addHistoryItem(item: HistoryItem) {
        MockData.historyItems.add(0, item)
    }

    // ── Fotos de evaluación ───────────────────────────────────────────────────
    private val evaluationPhotos = mutableMapOf<String, MutableList<String>>()

    fun addPhoto(evaluationId: String, photoPath: String) {
        evaluationPhotos.getOrPut(evaluationId) { mutableListOf() }.add(photoPath)
    }

    fun getPhotos(evaluationId: String): List<String> =
        evaluationPhotos[evaluationId] ?: emptyList()
}