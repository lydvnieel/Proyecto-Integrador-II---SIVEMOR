package com.sivemor.mobile.ui.screens.history

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sivemor.mobile.ui.components.SimpleTopBar
import com.sivemor.mobile.ui.components.StatusChip

@Composable
fun HistoryScreen(
    vehicleId: String,
    onBack: () -> Unit,
    vm: HistoryViewModel = viewModel()
) {
    val vehicle = vm.vehicle(vehicleId)
    val history = vm.history(vehicleId)

    Scaffold(topBar = { SimpleTopBar("Historial", onBack) }) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("${vehicle?.unitNumber.orEmpty()} - ${vehicle?.plate.orEmpty()}")
                        Text("Serie: ${vehicle?.serial.orEmpty()}")
                        Text("CEDIS: ${vehicle?.cedis.orEmpty()}")
                        Text("Región: ${vehicle?.region.orEmpty()}")
                    }
                }
            }
            items(history) { item ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Fecha: ${item.date}")
                        Text("Técnico: ${item.technician}")
                        Text("Comentarios: ${item.comments}")
                        StatusChip(item.dictamen)
                    }
                }
            }
        }
    }
}
