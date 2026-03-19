package com.sivemor.mobile.ui.screens.vehicles

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sivemor.mobile.ui.components.AppTextField
import com.sivemor.mobile.ui.components.OptionSelector
import com.sivemor.mobile.ui.components.SimpleTopBar

@Composable
fun VehicleFormScreen(
    onBack: () -> Unit,
    vm: VehicleViewModel = viewModel()
) {
    Scaffold(topBar = { SimpleTopBar("Registrar vehículo", onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            AppTextField(vm.unitNumber, { vm.unitNumber = it }, "Número de Unidad *")
            AppTextField(vm.plate, { vm.plate = it }, "Placas *")
            AppTextField(vm.serial, { vm.serial = it }, "Serie *")
            AppTextField(vm.model, { vm.model = it }, "Modelo")
            AppTextField(vm.year, { vm.year = it }, "Año")
            AppTextField(vm.mileage, { vm.mileage = it }, "Kilometraje")
            AppTextField(vm.cedis, { vm.cedis = it }, "CEDIS *")
            AppTextField(vm.region, { vm.region = it }, "Región")
            OptionSelector(
                title = "Tipo de unidad",
                selected = vm.type,
                options = listOf("Camión Rabón", "Camión rígido 4x2"),
                onSelected = { vm.type = it }
            )
            if (vm.message.isNotEmpty()) {
                Text(text = vm.message, color = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = {
                    if (vm.saveVehicle()) onBack()
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Guardar vehículo")
            }
        }
    }
}
