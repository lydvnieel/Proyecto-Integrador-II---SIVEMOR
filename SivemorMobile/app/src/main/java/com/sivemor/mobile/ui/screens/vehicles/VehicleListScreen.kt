package com.sivemor.mobile.ui.screens.vehicles

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
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.KeyboardArrowDown
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun VehicleListScreen(
    onBack: () -> Unit = {},
    onCreateVehicle: () -> Unit,
    onOpenHistory: (String) -> Unit,
    onOpenEvaluation: (String) -> Unit,
    vm: VehicleViewModel = viewModel()
) {
    var selectedRegion by rememberSaveable { mutableStateOf("Todas las regiones") }
    val regions = listOf("Todas las regiones", "Norte", "Centro", "Occidente", "Bajío", "Sur")
    var showRegions by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        vm.loadVehicles()
    }

    val vehicles = vm.vehicles
        .filter { vehicle ->
            val query = vm.search.trim().lowercase()
            query.isBlank() ||
                    vehicle.placa.lowercase().contains(query) ||
                    vehicle.serie.lowercase().contains(query) ||
                    vehicle.tipo.lowercase().contains(query)
        }

    Scaffold(containerColor = Color(0xFFF5F7FA)) { padding ->
        Box(
            Modifier
                .fillMaxSize()
                .background(Color(0xFFF5F7FA))
                .padding(padding)
        ) {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                item {
                    VehiclesHeader(
                        email = "tecnico@sivemor.com",
                        search = vm.search,
                        onSearchChange = { vm.search = it },
                        selectedRegion = selectedRegion,
                        onRegionClick = { showRegions = !showRegions },
                        onCreateVehicle = onCreateVehicle,
                        onCreateCedis = onBack
                    )
                }

                item {
                    Text(
                        text = "${vehicles.size} vehículos encontrados",
                        color = Color(0xFF4A5568),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(horizontal = 24.dp)
                    )
                }

                items(vehicles) { vehicle ->
                    VehicleCardNew(
                        plate = vehicle.placa,
                        type = vehicle.tipo,
                        serial = vehicle.serie,
                        cedis = vehicle.cedis,
                        region = vehicle.region,
                        docsCount = 2,
                        onHistory = { onOpenHistory(vehicle.id.toString()) },
                        onEvaluate = { onOpenEvaluation(vehicle.id.toString()) }
                    )
                }

                item {
                    Spacer(Modifier.height(24.dp))
                }
            }

            if (showRegions) {
                RegionMenuOverlay(
                    regions = regions,
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
}

@Composable
private fun VehiclesHeader(
    email: String,
    search: String,
    onSearchChange: (String) -> Unit,
    selectedRegion: String,
    onRegionClick: () -> Unit,
    onCreateVehicle: () -> Unit,
    onCreateCedis: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(listOf(Color(0xFF0A1630), Color(0xFF2F4E7D))),
                RoundedCornerShape(bottomStart = 34.dp, bottomEnd = 34.dp)
            )
            .statusBarsPadding()
            .padding(horizontal = 24.dp, vertical = 20.dp)
    ) {
        Row(
            Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Top
        ) {
            Column(Modifier.weight(1f)) {
                Text(
                    "Vehículos",
                    color = Color.White,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    "Técnico: $email",
                    color = Color(0xFFD7E2F2),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            Icon(
                Icons.Outlined.PersonOutline,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }

        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = search,
            onValueChange = onSearchChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(66.dp),
            singleLine = true,
            shape = RoundedCornerShape(20.dp),
            leadingIcon = {
                Icon(
                    Icons.Outlined.Search,
                    contentDescription = null,
                    tint = Color(0xFFC7D2E3)
                )
            },
            placeholder = {
                Text(
                    "Buscar por placa, serie, CEDIS...",
                    color = Color(0xFFD0D8E5),
                    fontSize = 15.sp
                )
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color(0xFF89A0C3),
                unfocusedBorderColor = Color(0xFF89A0C3),
                focusedContainerColor = Color(0xFF4D6790).copy(alpha = 0.55f),
                unfocusedContainerColor = Color(0xFF4D6790).copy(alpha = 0.55f),
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Color.White
            )
        )

        Spacer(Modifier.height(14.dp))

        Row(
            Modifier
                .fillMaxWidth()
                .height(58.dp)
                .background(Color(0xFF4D6790).copy(alpha = 0.55f), RoundedCornerShape(18.dp))
                .border(1.dp, Color(0xFF89A0C3), RoundedCornerShape(18.dp))
                .clickable { onRegionClick() }
                .padding(horizontal = 18.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                selectedRegion,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f)
            )
            Icon(Icons.Outlined.KeyboardArrowDown, contentDescription = null, tint = Color.White)
        }

        Spacer(Modifier.height(26.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            ActionButtonNew(
                text = "Vehículo",
                icon = Icons.Outlined.Add,
                background = Color(0xFF2F91FF),
                modifier = Modifier.weight(1f),
                onClick = onCreateVehicle
            )
            ActionButtonNew(
                text = "CEDIS",
                icon = Icons.Outlined.Add,
                background = Color(0xFF49B64E),
                modifier = Modifier.weight(1f),
                onClick = onCreateCedis
            )
        }
    }
}

@Composable
private fun ActionButtonNew(
    text: String,
    icon: ImageVector,
    background: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Row(
        modifier = modifier
            .background(background, RoundedCornerShape(18.dp))
            .clickable { onClick() }
            .padding(vertical = 18.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = Color.White)
        Spacer(Modifier.width(10.dp))
        Text(
            text,
            color = Color.White,
            fontSize = 16.sp,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
private fun VehicleCardNew(
    plate: String,
    type: String,
    serial: String,
    cedis: String,
    region: String,
    docsCount: Int,
    onHistory: () -> Unit,
    onEvaluate: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Box(
                    Modifier
                        .size(64.dp)
                        .background(Color(0xFFEAF3FF), RoundedCornerShape(18.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Outlined.DirectionsCar,
                        contentDescription = null,
                        tint = Color(0xFF2F91FF),
                        modifier = Modifier.size(30.dp)
                    )
                }

                Spacer(Modifier.width(16.dp))

                Column(Modifier.weight(1f)) {
                    Text(
                        plate,
                        color = Color(0xFF182235),
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        type,
                        color = Color(0xFF6B7280),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                Box(
                    Modifier
                        .background(Color(0xFFEAF3FF), RoundedCornerShape(16.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Outlined.Description,
                            contentDescription = null,
                            tint = Color(0xFF2F91FF),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            docsCount.toString(),
                            color = Color(0xFF2F91FF),
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Text("Serie: $serial", color = Color(0xFF4B5563), fontSize = 14.sp)

            Spacer(Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.Apartment,
                    contentDescription = null,
                    tint = Color(0xFF8D99AE),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(Modifier.width(10.dp))
                Text(cedis, color = Color(0xFF4B5563), fontSize = 15.sp)
            }

            Spacer(Modifier.height(10.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.LocationOn,
                    contentDescription = null,
                    tint = Color(0xFF8D99AE),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(Modifier.width(10.dp))
                Text(region, color = Color(0xFF4B5563), fontSize = 15.sp)
            }

            Spacer(Modifier.height(12.dp))

            Box(
                Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color(0xFFE8EDF3))
            )

            Spacer(Modifier.height(18.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    Modifier
                        .weight(1f)
                        .background(Color(0xFFF1F3F6), RoundedCornerShape(18.dp))
                        .clickable { onHistory() }
                        .padding(vertical = 16.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Outlined.History,
                        contentDescription = null,
                        tint = Color(0xFF3F4B5E),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        "Historial",
                        color = Color(0xFF3F4B5E),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }

                Row(
                    Modifier
                        .weight(1f)
                        .background(Color(0xFF49B64E), RoundedCornerShape(18.dp))
                        .clickable { onEvaluate() }
                        .padding(vertical = 16.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Outlined.Add,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        "Evaluar",
                        color = Color.White,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 15.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun RegionMenuOverlay(
    regions: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    Box(
        Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.15f))
            .clickable { onDismiss() }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 24.dp, end = 24.dp, top = 170.dp),
            shape = RoundedCornerShape(22.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF2F415E))
        ) {
            Column(Modifier.padding(vertical = 10.dp)) {
                regions.forEach { region ->
                    val isSelected = region == selected
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (isSelected) Color(0xFF3E5F8A) else Color.Transparent,
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { onSelect(region) }
                            .padding(horizontal = 18.dp, vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isSelected) {
                            Text(
                                "✔",
                                color = Color.White,
                                fontSize = 16.sp,
                                modifier = Modifier.padding(end = 10.dp)
                            )
                        } else {
                            Spacer(Modifier.width(20.dp))
                        }

                        Text(
                            region,
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }
        }
    }
}