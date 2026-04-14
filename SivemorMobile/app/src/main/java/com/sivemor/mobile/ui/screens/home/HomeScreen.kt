package com.sivemor.mobile.ui.screens.home

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Apartment
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.FilterList
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sivemor.mobile.R
import com.sivemor.mobile.data.model.Vehicle
import com.sivemor.mobile.data.repository.ReporteRepository
import com.sivemor.mobile.ui.screens.vehicles.VehicleViewModel
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(
    onOpenHistory: (String) -> Unit,
    onCreateVehicle: () -> Unit,
    onCreateCedis: () -> Unit,
    onOpenEvaluation: (String) -> Unit,
    vm: VehicleViewModel = viewModel()
) {
    var search by rememberSaveable { mutableStateOf("") }
    var showRegions by rememberSaveable { mutableStateOf(false) }
    var selectedRegion by rememberSaveable { mutableStateOf("Todas las regiones") }

    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val reporteRepository = remember { ReporteRepository() }

    LaunchedEffect(Unit) {
        android.util.Log.d("SIVEMOR_VEH", "HomeScreen pidió vehículos")
        vm.loadVehicles()
    }

    val dynamicRegions = listOf("Todas las regiones") +
            vm.vehicles.mapNotNull { it.region }
                .distinct()
                .sorted()

    val filtered = vm.vehicles.filter {
        val q = search.trim().lowercase()

        val matchesSearch =
            q.isEmpty() ||
                    it.placa.lowercase().contains(q) ||
                    it.serie.lowercase().contains(q) ||
                    it.cedis.lowercase().contains(q) ||
                    it.cliente.lowercase().contains(q)

        val matchesRegion =
            selectedRegion == "Todas las regiones" || it.region == selectedRegion

        matchesSearch && matchesRegion
    }

    Box {
        Scaffold(
            containerColor = Color(0xFFEFF4F7)
        ) { padding ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFEFF4F7))
                    .padding(padding)
                    .navigationBarsPadding(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    HeaderSection(
                        search = search,
                        onSearchChange = { search = it },
                        selectedRegion = selectedRegion,
                        onToggleRegions = { showRegions = true },
                        onCreateVehicle = onCreateVehicle,
                        onCreateCedis = onCreateCedis,
                        onTestBackend = {
                            scope.launch {
                                try {
                                    val opciones = reporteRepository.obtenerOpciones()
                                    Toast.makeText(
                                        context,
                                        "Conectado. Clientes: ${opciones.clientes.size}, Regiones: ${opciones.regiones.size}",
                                        Toast.LENGTH_LONG
                                    ).show()
                                } catch (e: Exception) {
                                    Toast.makeText(
                                        context,
                                        "Error backend: ${e.message}",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }
                        }
                    )
                }

                item {
                    Text(
                        text = "${filtered.size} vehículos registrados",
                        color = Color(0xFF39516B),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 24.dp)
                    )
                }

                if (vm.errorMessage != null) {
                    item {
                        Text(
                            text = "Error: ${vm.errorMessage}",
                            color = Color.Red,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(horizontal = 24.dp)
                        )
                    }
                }

                items(filtered) { item ->
                    VehicleCard(
                        item = item,
                        onOpenEvaluation = { onOpenEvaluation(item.id.toString()) },
                        onOpenHistory = { onOpenHistory(item.id.toString()) }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(18.dp))
                }
            }
        }

        if (showRegions) {
            RegionDropdownOverlay(
                regions = dynamicRegions,
                selected = selectedRegion,
                onSelect = {
                    selectedRegion = it
                    showRegions = false
                },
                onDismiss = { showRegions = false }
            )
        }
    }
}

@Composable
private fun HeaderSection(
    search: String,
    onSearchChange: (String) -> Unit,
    selectedRegion: String,
    onToggleRegions: () -> Unit,
    onCreateVehicle: () -> Unit,
    onCreateCedis: () -> Unit,
    onTestBackend: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF0A3156), Color(0xFF073258))
                ),
                shape = RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp)
            )
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 14.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Card(
                modifier = Modifier.size(64.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF4F6F8))
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.logo),
                        contentDescription = "Logo",
                        tint = Color.Unspecified,
                        modifier = Modifier.size(52.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "SIVEMOR",
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Panel de Vehículos",
                    color = Color(0xFFDCE6F2),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            Card(
                modifier = Modifier.size(58.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF2D5B87))
            ) {
                IconButton(onClick = {}) {
                    Icon(
                        imageVector = Icons.Outlined.PersonOutline,
                        contentDescription = "Perfil",
                        tint = Color.White,
                        modifier = Modifier.size(23.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        OutlinedTextField(
            value = search,
            onValueChange = onSearchChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(76.dp),
            singleLine = true,
            shape = RoundedCornerShape(22.dp),
            placeholder = {
                Text(
                    "Buscar por placa, serie, CEDIS o cliente",
                    color = Color(0xFF6D778B),
                    fontSize = 14.sp
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Outlined.Search,
                    contentDescription = null,
                    tint = Color(0xFF132948),
                    modifier = Modifier.size(30.dp)
                )
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color(0xFFF7F8FA),
                unfocusedContainerColor = Color(0xFFF7F8FA),
                focusedBorderColor = Color.Transparent,
                unfocusedBorderColor = Color.Transparent,
                focusedTextColor = Color(0xFF132948),
                unfocusedTextColor = Color(0xFF132948),
                cursorColor = Color(0xFF132948)
            )
        )

        Spacer(modifier = Modifier.height(14.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFFF7F8FA))
                .clickable { onToggleRegions() }
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Outlined.FilterList,
                contentDescription = null,
                tint = Color(0xFF132948),
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = selectedRegion,
                color = Color(0xFF1E293B),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            HeaderActionButton(
                text = "Nuevo Vehículo",
                modifier = Modifier.weight(1f),
                onClick = onCreateVehicle
            )
            HeaderActionButton(
                text = "Nuevo CEDIS",
                modifier = Modifier.weight(1f),
                onClick = onCreateCedis
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        HeaderActionButton(
            text = "Probar Backend",
            modifier = Modifier.fillMaxWidth(),
            onClick = onTestBackend
        )
    }
}

@Composable
private fun RegionDropdownOverlay(
    regions: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    Popup(
        alignment = Alignment.TopStart,
        properties = PopupProperties(focusable = true),
        onDismissRequest = onDismiss
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 16.dp, top = 213.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF6B7280)
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 18.dp)
        ) {
            Column(
                modifier = Modifier.padding(vertical = 8.dp)
            ) {
                regions.forEach { region ->
                    val isSelected = region == selected

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelect(region) }
                            .padding(horizontal = 18.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isSelected) {
                            Text(
                                text = "✓",
                                color = Color.White,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                        } else {
                            Spacer(modifier = Modifier.width(20.dp))
                        }

                        Text(
                            text = region,
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HeaderActionButton(
    text: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(68.dp),
        shape = RoundedCornerShape(18.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF39A4DC)
        )
    ) {
        Icon(
            imageVector = Icons.Outlined.Add,
            contentDescription = null,
            tint = Color.White,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            color = Color.White,
            fontSize = 15.sp,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
private fun VehicleCard(
    item: Vehicle,
    onOpenEvaluation: () -> Unit,
    onOpenHistory: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF8F9FB)),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0E4776))
                    .padding(horizontal = 18.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Card(
                    modifier = Modifier.size(54.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF3D6387))
                ) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.LocalShipping,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = item.placa,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        text = item.tipo,
                        color = Color(0xFFE0E8F2),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Card(
                    modifier = Modifier.size(width = 58.dp, height = 38.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF4D7397))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Description,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "0",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }
            }

            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                InfoBox(
                    title = "Número de Serie",
                    value = item.serie
                )

                InfoBox(
                    title = "Cliente",
                    value = item.cliente
                )

                LightInfoRow(
                    icon = Icons.Outlined.Apartment,
                    text = item.cedis
                )

                LightInfoRow(
                    icon = Icons.Outlined.LocationOn,
                    text = item.region
                )

                Button(
                    onClick = onOpenEvaluation,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(62.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF49B64E)
                    )
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Add,
                        contentDescription = null,
                        tint = Color.White
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Nueva Evaluación",
                        color = Color.White,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }

                Button(
                    onClick = onOpenHistory,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(62.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFF1F3F6)
                    )
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Description,
                        contentDescription = null,
                        tint = Color(0xFF1E293B)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Ver Historial",
                        color = Color(0xFF1E293B),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }
    }
}

@Composable
private fun InfoBox(
    title: String,
    value: String
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F3F6)),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Text(
                text = title,
                color = Color(0xFF4E5F75),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                color = Color(0xFF132948),
                fontSize = 15.sp,
                fontWeight = FontWeight.ExtraBold
            )
        }
    }
}

@Composable
private fun LightInfoRow(
    icon: ImageVector,
    text: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFEAF3F9))
            .border(1.dp, Color(0xFFB9D5E8), RoundedCornerShape(16.dp))
            .padding(horizontal = 14.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = Color(0xFF132948),
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = text,
            color = Color(0xFF132948),
            fontSize = 16.sp,
            fontWeight = FontWeight.ExtraBold
        )
    }
}