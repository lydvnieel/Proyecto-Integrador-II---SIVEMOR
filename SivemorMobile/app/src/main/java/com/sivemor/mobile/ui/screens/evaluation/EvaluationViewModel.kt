package com.sivemor.mobile.ui.screens.evaluation

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.EvaluationForm
import com.sivemor.mobile.data.repository.MockRepository
import com.sivemor.mobile.util.EvaluationRules
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class EvaluationViewModel : ViewModel() {
    var currentStep by mutableIntStateOf(0)
    var form by mutableStateOf(EvaluationForm())
    var resultMessage by mutableStateOf("")

    fun loadVehicle(vehicleId: String) {
        val vehicle = MockRepository.getVehicleById(vehicleId) ?: return
        form = form.copy(
            vehicleId = vehicle.id,
            unitNumber = vehicle.unitNumber,
            plate = vehicle.plate,
            model = vehicle.model,
            year = vehicle.year.toString(),
            mileage = vehicle.mileage.toString(),
            timestamp = SimpleDateFormat("dd/MM/yyyy, hh:mm:ss a", Locale.getDefault()).format(Date())
        )
    }

    fun nextStep() {
        if (currentStep < 12) currentStep++
    }

    fun previousStep() {
        if (currentStep > 0) currentStep--
    }

    fun addEvidenceMock() {
        if (form.evidenceUris.size < 5) {
            val updated = form.evidenceUris.toMutableList()
            updated.add("mock://evidence_${updated.size + 1}")
            form = form.copy(evidenceUris = updated)
        }
    }

    fun save(): String {
        val dictamen = EvaluationRules.calculateDictamen(form)
        val evaluation = Evaluation(
            id = UUID.randomUUID().toString(),
            vehicleId = form.vehicleId,
            vehicleLabel = "Unidad ${form.unitNumber}",
            date = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date()),
            technician = MockRepository.getCurrentUser()?.name ?: "Técnico",
            dictamen = dictamen,
            comments = form.comments,
            multa = dictamen == "REPROBADO"
        )
        MockRepository.saveEvaluation(evaluation)
        resultMessage = "Verificación guardada con dictamen: $dictamen"
        return dictamen
    }
}
