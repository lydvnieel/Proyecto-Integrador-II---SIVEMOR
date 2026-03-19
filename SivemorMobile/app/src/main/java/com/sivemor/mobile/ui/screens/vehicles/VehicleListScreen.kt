package com.sivemor.mobile.ui.screens.vehicles

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sivemor.mobile.ui.components.AppTextField
import com.sivemor.mobile.ui.components.SimpleTopBar

@Composable
fun VehicleListScreen(
    onBack: () -> Unit,
    onCreateVehicle: () -> Unit,
    onOpenHistory: (String) -> Unit,
    onOpenEvaluation: (String) -> Unit,
    vm: VehicleViewModel = viewModel()
) {
    Scaffold(topBar = { SimpleTopBar(title = "Vehículos", onBack = onBack) }) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            AppTextField(vm.search, { vm.search = it }, "Buscar por placa, serie, CEDIS o región")
            Spacer(modifier = Modifier.height(12.dp))
            Button(onClick = onCreateVehicle, modifier = Modifier.fillMaxWidth()) {
                Text("Registrar vehículo")
            }
            Spacer(modifier = Modifier.height(16.dp))
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(vm.vehicles()) { item ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(text = item.unitNumber, style = MaterialTheme.typography.titleMedium)
                            Text(text = "Placa: ${item.plate}")
                            Text(text = "Serie: ${item.serial}")
                            Text(text = "CEDIS: ${item.cedis}")
                            Text(text = "Región: ${item.region}")
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(onClick = { onOpenHistory(item.id) }, modifier = Modifier.weight(1f)) {
                                    Text("Historial")
                                }
                                Button(onClick = { onOpenEvaluation(item.id) }, modifier = Modifier.weight(1f)) {
                                    Text("Evaluar")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
