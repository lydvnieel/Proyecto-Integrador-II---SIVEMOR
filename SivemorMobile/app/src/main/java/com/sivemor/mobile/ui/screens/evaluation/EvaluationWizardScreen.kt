package com.sivemor.mobile.ui.screens.evaluation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sivemor.mobile.ui.components.AppTextField
import com.sivemor.mobile.ui.components.OptionSelector
import com.sivemor.mobile.ui.components.SimpleTopBar
import com.sivemor.mobile.util.EvaluationRules

@Composable
fun EvaluationWizardScreen(
    vehicleId: String,
    onBack: () -> Unit,
    onFinish: () -> Unit,
    vm: EvaluationViewModel = viewModel()
) {
    LaunchedEffect(vehicleId) { vm.loadVehicle(vehicleId) }

    Scaffold(topBar = { SimpleTopBar("Nueva Verificación", onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Paso ${vm.currentStep + 1} de 13", style = MaterialTheme.typography.titleMedium)

            when (vm.currentStep) {
                0 -> StepGeneral(vm)
                1 -> StepLuces(vm)
                2 -> StepPresion(vm)
                3 -> StepProfundidad(vm)
                4 -> StepBirlos(vm)
                5 -> StepTuercas(vm)
                6 -> StepDireccion(vm)
                7 -> StepAireFrenos(vm)
                8 -> StepMotor(vm)
                9 -> StepOtros(vm)
                10 -> StepEvidencias(vm)
                11 -> StepComentarios(vm)
                12 -> StepResumen(vm)
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                if (vm.currentStep > 0) {
                    Button(onClick = vm::previousStep, modifier = Modifier.weight(1f)) {
                        Text("Anterior")
                    }
                }
                if (vm.currentStep < 12) {
                    Button(onClick = vm::nextStep, modifier = Modifier.weight(1f)) {
                        Text("Siguiente")
                    }
                } else {
                    Button(
                        onClick = {
                            vm.save()
                            onFinish()
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Guardar")
                    }
                }
            }
        }
    }
}

@Composable
private fun StepGeneral(vm: EvaluationViewModel) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Datos Generales")
            AppTextField(vm.form.unitNumber, { vm.form = vm.form.copy(unitNumber = it) }, "Número de Unidad *")
            AppTextField(vm.form.plate, { vm.form = vm.form.copy(plate = it) }, "Placas *")
            AppTextField(vm.form.model, { vm.form = vm.form.copy(model = it) }, "Modelo *")
            AppTextField(vm.form.year, { vm.form = vm.form.copy(year = it) }, "Año *")
            AppTextField(vm.form.mileage, { vm.form = vm.form.copy(mileage = it) }, "Kilometraje *")
            AppTextField(vm.form.timestamp, {}, "Fecha y Hora", singleLine = false, enabled = false)
        }
    }
}

@Composable
private fun StepLuces(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OptionSelector("Luces delanteras", vm.form.lucesDelanteras, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(lucesDelanteras = it) }
        OptionSelector("Luces traseras", vm.form.lucesTraseras, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(lucesTraseras = it) }
        OptionSelector("Direccionales", vm.form.direccionales, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(direccionales = it) }
        OptionSelector("Cuartos", vm.form.cuartos, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(cuartos = it) }
    }
}

@Composable
private fun StepPresion(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        AppTextField(vm.form.presionDelanteraIzq, { vm.form = vm.form.copy(presionDelanteraIzq = it) }, "Presión delantera izquierda")
        AppTextField(vm.form.presionDelanteraDer, { vm.form = vm.form.copy(presionDelanteraDer = it) }, "Presión delantera derecha")
        AppTextField(vm.form.presionTraseraIzq1, { vm.form = vm.form.copy(presionTraseraIzq1 = it) }, "Presión trasera izquierda 1")
        AppTextField(vm.form.presionTraseraIzq2, { vm.form = vm.form.copy(presionTraseraIzq2 = it) }, "Presión trasera izquierda 2")
        AppTextField(vm.form.presionTraseraDer1, { vm.form = vm.form.copy(presionTraseraDer1 = it) }, "Presión trasera derecha 1")
        AppTextField(vm.form.presionTraseraDer2, { vm.form = vm.form.copy(presionTraseraDer2 = it) }, "Presión trasera derecha 2")
    }
}

@Composable
private fun StepProfundidad(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        AppTextField(vm.form.profundidadDelanteraIzq, { vm.form = vm.form.copy(profundidadDelanteraIzq = it) }, "Profundidad delantera izquierda")
        AppTextField(vm.form.profundidadDelanteraDer, { vm.form = vm.form.copy(profundidadDelanteraDer = it) }, "Profundidad delantera derecha")
        AppTextField(vm.form.profundidadTraseraIzq1, { vm.form = vm.form.copy(profundidadTraseraIzq1 = it) }, "Profundidad trasera izquierda 1")
        AppTextField(vm.form.profundidadTraseraIzq2, { vm.form = vm.form.copy(profundidadTraseraIzq2 = it) }, "Profundidad trasera izquierda 2")
        AppTextField(vm.form.profundidadTraseraDer1, { vm.form = vm.form.copy(profundidadTraseraDer1 = it) }, "Profundidad trasera derecha 1")
        AppTextField(vm.form.profundidadTraseraDer2, { vm.form = vm.form.copy(profundidadTraseraDer2 = it) }, "Profundidad trasera derecha 2")
    }
}

@Composable
private fun StepBirlos(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        AppTextField(vm.form.birlosDelanteraIzqNum, { vm.form = vm.form.copy(birlosDelanteraIzqNum = it) }, "Birlos faltantes delantera izquierda")
        AppTextField(vm.form.birlosDelanteraDerNum, { vm.form = vm.form.copy(birlosDelanteraDerNum = it) }, "Birlos faltantes delantera derecha")
        AppTextField(vm.form.birlosTraseraIzqNum, { vm.form = vm.form.copy(birlosTraseraIzqNum = it) }, "Birlos faltantes trasera izquierda")
        AppTextField(vm.form.birlosTraseraDerNum, { vm.form = vm.form.copy(birlosTraseraDerNum = it) }, "Birlos faltantes trasera derecha")
    }
}

@Composable
private fun StepTuercas(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        AppTextField(vm.form.tuercasDelanteraIzqNum, { vm.form = vm.form.copy(tuercasDelanteraIzqNum = it) }, "Tuercas faltantes delantera izquierda")
        AppTextField(vm.form.tuercasDelanteraDerNum, { vm.form = vm.form.copy(tuercasDelanteraDerNum = it) }, "Tuercas faltantes delantera derecha")
        AppTextField(vm.form.tuercasTraseraIzqNum, { vm.form = vm.form.copy(tuercasTraseraIzqNum = it) }, "Tuercas faltantes trasera izquierda")
        AppTextField(vm.form.tuercasTraseraDerNum, { vm.form = vm.form.copy(tuercasTraseraDerNum = it) }, "Tuercas faltantes trasera derecha")
    }
}

@Composable
private fun StepDireccion(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OptionSelector("Brazo pitman", vm.form.brazoPitman, listOf("APROBADO", "GOLPEADO")) { vm.form = vm.form.copy(brazoPitman = it) }
        OptionSelector("Manijas de puertas", vm.form.manijasPuertas, listOf("APROBADAS", "1 ROTA", "2 ROTAS")) { vm.form = vm.form.copy(manijasPuertas = it) }
        OptionSelector("Chavetas", vm.form.chavetas, listOf("APROBADAS", "FALTAN")) { vm.form = vm.form.copy(chavetas = it) }
        AppTextField(vm.form.chavetasNum, { vm.form = vm.form.copy(chavetasNum = it) }, "Número de chavetas faltantes")
    }
}

@Composable
private fun StepAireFrenos(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OptionSelector("Compresor", vm.form.compresor, listOf("APROBADO", "REPROBADO", "NO CORTA")) { vm.form = vm.form.copy(compresor = it) }
        OptionSelector("Tanques de aire", vm.form.tanquesAire, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(tanquesAire = it) }
        AppTextField(vm.form.tiempoCargaPsi, { vm.form = vm.form.copy(tiempoCargaPsi = it) }, "PSI")
        AppTextField(vm.form.tiempoCargaTiempo, { vm.form = vm.form.copy(tiempoCargaTiempo = it) }, "Tiempo de carga")
    }
}

@Composable
private fun StepMotor(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OptionSelector("Humo", vm.form.humo, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(humo = it) }
        OptionSelector("Gobernado", vm.form.gobernado, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(gobernado = it) }
    }
}

@Composable
private fun StepOtros(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OptionSelector("Caja dirección", vm.form.cajaDireccion, listOf("APROBADA", "FUGA")) { vm.form = vm.form.copy(cajaDireccion = it) }
        OptionSelector("Depósito aceite", vm.form.depositoAceite, listOf("APROBADO", "FUGA")) { vm.form = vm.form.copy(depositoAceite = it) }
        OptionSelector("Quinta rueda", vm.form.quintaRueda, listOf("APROBADA", "REPROBADA")) { vm.form = vm.form.copy(quintaRueda = it) }
        OptionSelector("Parabrisas", vm.form.parabrisas, listOf("APROBADO", "ESTRELLADO")) { vm.form = vm.form.copy(parabrisas = it) }
        OptionSelector("Limpiaparabrisas", vm.form.limpiaparabrisas, listOf("APROBADO", "FALTA 1 PLUMA", "FALTAN 2 PLUMAS", "NO FUNCIONA")) { vm.form = vm.form.copy(limpiaparabrisas = it) }
        OptionSelector("Huelgo", vm.form.huelgo, listOf("APROBADO", "REPROBADO")) { vm.form = vm.form.copy(huelgo = it) }
        AppTextField(vm.form.huelgoCuanto, { vm.form = vm.form.copy(huelgoCuanto = it) }, "Huelgo en mm")
        OptionSelector("Escape", vm.form.escape, listOf("APROBADO", "FALTANTE", "ROTO")) { vm.form = vm.form.copy(escape = it) }
    }
}

@Composable
private fun StepEvidencias(vm: EvaluationViewModel) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Evidencias registradas: ${vm.form.evidenceUris.size}/5")
        Button(onClick = vm::addEvidenceMock, enabled = vm.form.evidenceUris.size < 5, modifier = Modifier.fillMaxWidth()) {
            Text("Agregar evidencia mock")
        }
        vm.form.evidenceUris.forEachIndexed { index, uri ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Text(text = "Evidencia ${index + 1}: $uri", modifier = Modifier.padding(16.dp))
            }
        }
    }
}

@Composable
private fun StepComentarios(vm: EvaluationViewModel) {
    AppTextField(
        value = vm.form.comments,
        onValueChange = { vm.form = vm.form.copy(comments = it) },
        label = "Comentarios",
        singleLine = false
    )
}

@Composable
private fun StepResumen(vm: EvaluationViewModel) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Resumen")
            Text("Unidad: ${vm.form.unitNumber}")
            Text("Placas: ${vm.form.plate}")
            Text("Modelo: ${vm.form.model}")
            Text("Evidencias: ${vm.form.evidenceUris.size}")
            Text("Comentarios: ${vm.form.comments.ifBlank { "Sin comentarios" }}")
            Spacer(modifier = Modifier.height(8.dp))
            Text("Dictamen estimado: ${EvaluationRules.calculateDictamen(vm.form)}")
        }
    }
}
