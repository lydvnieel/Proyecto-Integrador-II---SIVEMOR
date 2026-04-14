package com.sivemor.mobile.ui.screens.vehicles

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.delay

private enum class VehicleSaveStatus { IDLE, SAVING, SUCCESS, ERROR }

// ── Paleta (igual que CedisSearchScreen) ──
private val NavBlue    = Color(0xFF1A3A5C)
private val NavBlue2   = Color(0xFF0E2B4C)
private val AccentBlue = Color(0xFF2D7DD2)
private val GreenSave  = Color(0xFF3CB95A)
private val ErrorRed   = Color(0xFFE53935)
private val CardBg     = Color(0xFFF7F8FA)
private val LabelGray  = Color(0xFF4A5568)
private val BorderGray = Color(0xFFD8DDE6)
private val HintGray   = Color(0xFF9EAAB8)

@Composable
fun VehicleFormScreen(
    onBack: () -> Unit,
    vm: VehicleViewModel = viewModel()
) {
    val clients = listOf(
        "Transportes del Norte S.A. de C.V.",
        "Logística Express México",
        "Distribuidora Central S.A.",
        "Carga Rápida del Bajío",
        "Fletes Modernos S.A. de C.V."
    )

    val cedisByClient = mapOf(
        "Transportes del Norte S.A. de C.V." to listOf("CEDIS Monterrey Norte"),
        "Logística Express México"            to listOf("CEDIS Ciudad de México"),
        "Distribuidora Central S.A."          to listOf("CEDIS Guadalajara"),
        "Carga Rápida del Bajío"              to listOf("CEDIS Querétaro"),
        "Fletes Modernos S.A. de C.V."        to listOf("CEDIS León")
    )

    val unitTypes = listOf(
        "Camión Rabón 4x2 (por defecto)",
        "Camión Rígido 4x2",
        "Camión Torton",
        "Tractocamión"
    )

    var selectedClient by rememberSaveable { mutableStateOf("") }
    var selectedCedis  by rememberSaveable { mutableStateOf("") }
    var selectedType   by rememberSaveable { mutableStateOf("Camión Rabón 4x2 (por defecto)") }
    var plate          by rememberSaveable { mutableStateOf("") }
    var serial         by rememberSaveable { mutableStateOf("") }

    var showClientMenu by remember { mutableStateOf(false) }
    var showCedisMenu  by remember { mutableStateOf(false) }
    var showTypeMenu   by remember { mutableStateOf(false) }

    // Validación por campo
    var errClient by remember { mutableStateOf(false) }
    var errCedis  by remember { mutableStateOf(false) }
    var errPlate  by remember { mutableStateOf(false) }
    var errSerial by remember { mutableStateOf(false) }
    var errType   by remember { mutableStateOf(false) }

    var saveStatus by remember { mutableStateOf(VehicleSaveStatus.IDLE) }

    val currentCedisOptions = cedisByClient[selectedClient] ?: emptyList()

    fun validate(): Boolean {
        errClient = selectedClient.isBlank()
        errCedis  = selectedCedis.isBlank()
        errPlate  = plate.isBlank()
        errSerial = serial.isBlank()
        errType   = selectedType.isBlank()
        return !errClient && !errCedis && !errPlate && !errSerial && !errType
    }

    Box(modifier = Modifier.fillMaxSize().background(CardBg)) {
        Column(modifier = Modifier.fillMaxSize()) {

            // ── Header ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Brush.verticalGradient(listOf(NavBlue, NavBlue2)))
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack, modifier = Modifier.size(40.dp)) {
                        Icon(Icons.Outlined.ArrowBack, contentDescription = "Atrás", tint = Color.White)
                    }
                    Spacer(Modifier.width(8.dp))
                    Column {
                        Text(
                            "Registrar Vehículo",
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            "Nueva unidad",
                            color = Color(0xFFBDD2EA),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // ── Form ──
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp)
            ) {
                Spacer(Modifier.height(28.dp))

                // Ícono central
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .background(Color(0xFFE8F1FB), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Outlined.DirectionsCar,
                            contentDescription = null,
                            tint = AccentBlue,
                            modifier = Modifier.size(40.dp)
                        )
                    }
                }

                Spacer(Modifier.height(28.dp))

                // Cliente
                VDropdownField(
                    label = "Cliente",
                    required = true,
                    selected = selectedClient,
                    placeholder = "Seleccionar cliente",
                    isExpanded = showClientMenu,
                    isError = errClient,
                    onClick = { showClientMenu = true; showCedisMenu = false; showTypeMenu = false }
                )
                if (errClient) VFieldError("Selecciona un cliente")

                Spacer(Modifier.height(16.dp))

                // CEDIS
                VDropdownField(
                    label = "CEDIS",
                    required = true,
                    selected = selectedCedis,
                    placeholder = if (selectedClient.isBlank()) "Primero selecciona un cliente" else "Seleccionar CEDIS",
                    isExpanded = showCedisMenu,
                    isError = errCedis,
                    onClick = {
                        if (selectedClient.isNotBlank()) {
                            showCedisMenu = true
                            showClientMenu = false
                            showTypeMenu = false
                        }
                    }
                )
                if (errCedis) VFieldError("Selecciona un CEDIS")

                Spacer(Modifier.height(16.dp))

                // Placa
                VFormField(
                    label = "Placa",
                    required = true,
                    value = plate,
                    placeholder = "ABC-123-D",
                    isError = errPlate,
                    onValueChange = { plate = it; errPlate = false }
                )
                if (errPlate) VFieldError("La placa es requerida")

                Spacer(Modifier.height(16.dp))

                // Número de Serie
                VFormField(
                    label = "Número de Serie",
                    required = true,
                    value = serial,
                    placeholder = "3HSDJAPR45N123456",
                    isError = errSerial,
                    onValueChange = { serial = it; errSerial = false }
                )
                if (errSerial) VFieldError("El número de serie es requerido")

                Spacer(Modifier.height(16.dp))

                // Tipo de Unidad
                VDropdownField(
                    label = "Tipo de Unidad",
                    required = true,
                    selected = selectedType,
                    placeholder = "Seleccionar tipo",
                    isExpanded = showTypeMenu,
                    isError = errType,
                    onClick = { showTypeMenu = true; showClientMenu = false; showCedisMenu = false }
                )
                if (errType) VFieldError("Selecciona un tipo de unidad")

                // Nota descriptiva
                Spacer(Modifier.height(8.dp))
                Text(
                    "Por defecto: Camión Rabón o rígido de dos ejes (4x2) con doble rodada trasera",
                    color = HintGray,
                    fontSize = 12.sp,
                    lineHeight = 17.sp
                )

                Spacer(Modifier.height(32.dp))
            }

            // ── Botón guardar ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .navigationBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Button(
                    onClick = {
                        if (validate()) saveStatus = VehicleSaveStatus.SAVING
                    },
                    modifier = Modifier.fillMaxWidth().height(60.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GreenSave)
                ) {
                    Icon(Icons.Outlined.Save, contentDescription = null, tint = Color.White)
                    Spacer(Modifier.width(10.dp))
                    Text(
                        "Guardar Vehículo",
                        color = Color.White,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }

        // ── Dropdowns overlay ──
        if (showClientMenu) {
            VDropdownOverlay(
                items = clients,
                selected = selectedClient,
                onSelect = {
                    selectedClient = it
                    selectedCedis = ""
                    errClient = false
                    showClientMenu = false
                },
                onDismiss = { showClientMenu = false }
            )
        }

        if (showCedisMenu && currentCedisOptions.isNotEmpty()) {
            VDropdownOverlay(
                items = currentCedisOptions,
                selected = selectedCedis,
                onSelect = {
                    selectedCedis = it
                    errCedis = false
                    showCedisMenu = false
                },
                onDismiss = { showCedisMenu = false }
            )
        }

        if (showTypeMenu) {
            VDropdownOverlay(
                items = unitTypes,
                selected = selectedType,
                onSelect = {
                    selectedType = it
                    errType = false
                    showTypeMenu = false
                },
                onDismiss = { showTypeMenu = false }
            )
        }

        // ── Modales de estado ──
        when (saveStatus) {
            VehicleSaveStatus.SAVING -> {
                VSavingModal()
                LaunchedEffect(Unit) {
                    delay(1800)
                    vm.placa = plate
                    vm.serie = serial
                    vm.tipo = selectedType
                    vm.saveVehicle()
                    saveStatus = VehicleSaveStatus.SUCCESS
                }
            }
            VehicleSaveStatus.SUCCESS -> {
                VResultModal(
                    icon = Icons.Outlined.CheckCircle,
                    iconColor = GreenSave,
                    title = "¡Vehículo Guardado!",
                    message = "La unidad fue registrada correctamente en el sistema.",
                    buttonText = "Continuar",
                    buttonColor = GreenSave,
                    onAction = { saveStatus = VehicleSaveStatus.IDLE; onBack() }
                )
            }
            VehicleSaveStatus.ERROR -> {
                VResultModal(
                    icon = Icons.Outlined.ErrorOutline,
                    iconColor = ErrorRed,
                    title = "Error al guardar",
                    message = "No se pudo registrar el vehículo. Verifica los datos e intenta de nuevo.",
                    buttonText = "Reintentar",
                    buttonColor = ErrorRed,
                    onAction = { saveStatus = VehicleSaveStatus.IDLE }
                )
            }
            VehicleSaveStatus.IDLE -> Unit
        }
    }
}

// ── Componentes reutilizables (misma lógica que CedisSearchScreen) ──

@Composable
private fun VDropdownField(
    label: String,
    required: Boolean,
    selected: String,
    placeholder: String,
    isExpanded: Boolean,
    isError: Boolean,
    onClick: () -> Unit
) {
    val borderColor = when {
        isError    -> ErrorRed
        isExpanded -> AccentBlue
        else       -> BorderGray
    }
    Row(modifier = Modifier.padding(bottom = 6.dp)) {
        Text(label, color = LabelGray, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
        if (required) Text(" *", color = ErrorRed, fontSize = 14.sp, fontWeight = FontWeight.Bold)
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(58.dp)
            .background(Color.White, RoundedCornerShape(14.dp))
            .border(1.5.dp, borderColor, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = if (selected.isEmpty()) placeholder else selected,
            color = if (selected.isEmpty()) HintGray else Color(0xFF1E293B),
            fontSize = 15.sp,
            fontWeight = if (selected.isEmpty()) FontWeight.Normal else FontWeight.SemiBold,
            modifier = Modifier.weight(1f)
        )
        Icon(
            if (isExpanded) Icons.Outlined.KeyboardArrowUp else Icons.Outlined.KeyboardArrowDown,
            contentDescription = null,
            tint = if (isError) ErrorRed else Color(0xFF64748B)
        )
    }
}

@Composable
private fun VFormField(
    label: String,
    required: Boolean,
    value: String,
    placeholder: String,
    isError: Boolean,
    onValueChange: (String) -> Unit
) {
    Row(modifier = Modifier.padding(bottom = 6.dp)) {
        Text(label, color = LabelGray, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
        if (required) Text(" *", color = ErrorRed, fontSize = 14.sp, fontWeight = FontWeight.Bold)
    }
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        singleLine = true,
        placeholder = { Text(placeholder, color = HintGray, fontSize = 15.sp) },
        shape = RoundedCornerShape(14.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = if (isError) ErrorRed else AccentBlue,
            unfocusedBorderColor = if (isError) ErrorRed else BorderGray,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = Color.White,
            focusedTextColor = Color(0xFF1E293B),
            unfocusedTextColor = Color(0xFF1E293B),
            cursorColor = AccentBlue
        )
    )
}

@Composable
private fun VFieldError(text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(top = 4.dp, start = 4.dp)
    ) {
        Icon(Icons.Outlined.ErrorOutline, null, tint = ErrorRed, modifier = Modifier.size(15.dp))
        Spacer(Modifier.width(5.dp))
        Text(text, color = ErrorRed, fontSize = 12.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun VDropdownOverlay(
    items: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.15f))
            .clickable { onDismiss() }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp, top = 220.dp)
                .clickable(enabled = false) {},
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF3A3F4A)),
            elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
        ) {
            Column(modifier = Modifier.padding(vertical = 8.dp)) {
                items.forEach { item ->
                    val isSelected = item == selected
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (isSelected) Color(0xFF4A5568) else Color.Transparent,
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { onSelect(item) }
                            .padding(horizontal = 18.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isSelected) {
                            Icon(Icons.Outlined.Check, null, tint = Color.White, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(10.dp))
                        } else {
                            Spacer(Modifier.width(28.dp))
                        }
                        Text(
                            item,
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun VSavingModal() {
    val infiniteTransition = rememberInfiniteTransition(label = "spin")
    val angle by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(900, easing = LinearEasing)),
        label = "spin"
    )
    Box(
        modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.35f)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 36.dp),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 16.dp)
        ) {
            Column(
                modifier = Modifier.padding(36.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier.size(72.dp).background(Color(0xFFE8F5FF), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Outlined.Sync,
                        contentDescription = null,
                        tint = AccentBlue,
                        modifier = Modifier.size(36.dp).rotate(angle)
                    )
                }
                Spacer(Modifier.height(20.dp))
                Text("Guardando Vehículo", color = Color(0xFF1E293B), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Por favor espera mientras se registra la unidad...",
                    color = Color(0xFF64748B),
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(22.dp))
                LinearProgressIndicator(
                    modifier = Modifier.fillMaxWidth(),
                    color = AccentBlue,
                    trackColor = Color(0xFFDCEAF9)
                )
            }
        }
    }
}

@Composable
private fun VResultModal(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconColor: Color,
    title: String,
    message: String,
    buttonText: String,
    buttonColor: Color,
    onAction: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.35f)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 30.dp),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 16.dp)
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(iconColor.copy(alpha = 0.12f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(44.dp))
                }
                Spacer(Modifier.height(22.dp))
                Text(title, color = Color(0xFF1E293B), fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(10.dp))
                Text(message, color = Color(0xFF64748B), fontSize = 15.sp, lineHeight = 22.sp)
                Spacer(Modifier.height(30.dp))
                Button(
                    onClick = onAction,
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = buttonColor)
                ) {
                    Text(buttonText, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                }
            }
        }
    }
}