package com.sivemor.mobile.ui.screens.cedis

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.delay

private enum class SaveStatus { IDLE, SAVING, SUCCESS, ERROR }

private val clients = listOf(
    "Transportes del Norte S.A. de C.V.",
    "Logística Express México",
    "Distribuidora Central S.A.",
    "Carga Rápida del Bajío",
    "Fletes Modernos S.A. de C.V."
)

private val regions = listOf("Norte", "Centro", "Sur", "Bajío", "Occidente", "Sureste")

// Colors
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
fun CedisSearchScreen(
    onBack: () -> Unit,
    onSuccessContinue: () -> Unit,
    vm: CedisViewModel = viewModel()
) {
    var selectedClient  by remember { mutableStateOf("") }
    var selectedRegion  by remember { mutableStateOf("") }
    var cedisName       by remember { mutableStateOf("") }
    var address         by remember { mutableStateOf("") }
    var manager         by remember { mutableStateOf("") }
    var email           by remember { mutableStateOf("") }
    var phone           by remember { mutableStateOf("") }
    var altPhone        by remember { mutableStateOf("") }

    var showClientMenu  by remember { mutableStateOf(false) }
    var showRegionMenu  by remember { mutableStateOf(false) }

    // Validation errors
    var errClient   by remember { mutableStateOf(false) }
    var errRegion   by remember { mutableStateOf(false) }
    var errName     by remember { mutableStateOf(false) }
    var errAddress  by remember { mutableStateOf(false) }
    var errManager  by remember { mutableStateOf(false) }
    var errEmail    by remember { mutableStateOf(false) }
    var errPhone    by remember { mutableStateOf(false) }

    var saveStatus  by remember { mutableStateOf(SaveStatus.IDLE) }

    fun validate(): Boolean {
        errClient  = selectedClient.isBlank()
        errRegion  = selectedRegion.isBlank()
        errName    = cedisName.isBlank()
        errAddress = address.isBlank()
        errManager = manager.isBlank()
        errEmail   = email.isBlank()
        errPhone   = phone.isBlank()
        return !errClient && !errRegion && !errName && !errAddress && !errManager && !errEmail && !errPhone
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
                            "Registrar CEDIS",
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            "Centro de Distribución",
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

                // Icon
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .background(Color(0xFFE8F1FB), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Outlined.Apartment,
                            contentDescription = null,
                            tint = AccentBlue,
                            modifier = Modifier.size(40.dp)
                        )
                    }
                }

                Spacer(Modifier.height(28.dp))

                // Cliente dropdown
                DropdownField(
                    label = "Cliente",
                    required = true,
                    selected = selectedClient,
                    placeholder = "Seleccionar cliente",
                    isExpanded = showClientMenu,
                    isError = errClient,
                    onClick = { showClientMenu = true; showRegionMenu = false }
                )
                if (errClient) FieldError("Selecciona un cliente")

                Spacer(Modifier.height(16.dp))

                // Región dropdown
                DropdownField(
                    label = "Región",
                    required = true,
                    selected = selectedRegion,
                    placeholder = "Seleccionar región",
                    isExpanded = showRegionMenu,
                    isError = errRegion,
                    onClick = { showRegionMenu = true; showClientMenu = false }
                )
                if (errRegion) FieldError("Selecciona una región")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Nombre del CEDIS",
                    required = true,
                    value = cedisName,
                    placeholder = "Ej: CEDIS Monterrey Norte",
                    isError = errName,
                    onValueChange = { cedisName = it; errName = false }
                )
                if (errName) FieldError("El nombre del CEDIS es requerido")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Dirección",
                    required = true,
                    value = address,
                    placeholder = "Calle, número, colonia, ciudad, estado",
                    isError = errAddress,
                    singleLine = false,
                    minLines = 3,
                    onValueChange = { address = it; errAddress = false }
                )
                if (errAddress) FieldError("La dirección es requerida")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Encargado",
                    required = true,
                    value = manager,
                    placeholder = "Nombre completo del encargado",
                    isError = errManager,
                    onValueChange = { manager = it; errManager = false }
                )
                if (errManager) FieldError("El nombre del encargado es requerido")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Correo electrónico",
                    required = true,
                    value = email,
                    placeholder = "correo@ejemplo.com",
                    isError = errEmail,
                    keyboardType = KeyboardType.Email,
                    onValueChange = { email = it; errEmail = false }
                )
                if (errEmail) FieldError("El correo electrónico es requerido")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Teléfono",
                    required = true,
                    value = phone,
                    placeholder = "5551234567",
                    isError = errPhone,
                    keyboardType = KeyboardType.Phone,
                    onValueChange = { phone = it; errPhone = false }
                )
                if (errPhone) FieldError("El teléfono es requerido")

                Spacer(Modifier.height(16.dp))

                FormField(
                    label = "Teléfono alternativo",
                    required = false,
                    value = altPhone,
                    placeholder = "5559876543",
                    isError = false,
                    keyboardType = KeyboardType.Phone,
                    onValueChange = { altPhone = it }
                )

                Spacer(Modifier.height(32.dp))
            }

            // ── Save button ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .navigationBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Button(
                    onClick = { if (validate()) saveStatus = SaveStatus.SAVING },
                    modifier = Modifier.fillMaxWidth().height(60.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GreenSave)
                ) {
                    Icon(Icons.Outlined.Save, contentDescription = null, tint = Color.White)
                    Spacer(Modifier.width(10.dp))
                    Text(
                        "Guardar CEDIS",
                        color = Color.White,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }

        // ── Dropdowns overlay ──
        if (showClientMenu) {
            DropdownMenuOverlay(
                items = clients,
                selected = selectedClient,
                topPadding = 220.dp,
                onSelect = { selectedClient = it; errClient = false; showClientMenu = false },
                onDismiss = { showClientMenu = false }
            )
        }

        if (showRegionMenu) {
            DropdownMenuOverlay(
                items = regions,
                selected = selectedRegion,
                topPadding = 310.dp,
                onSelect = { selectedRegion = it; errRegion = false; showRegionMenu = false },
                onDismiss = { showRegionMenu = false }
            )
        }

        // ── Status modals ──
        when (saveStatus) {
            SaveStatus.SAVING -> {
                SavingModal()
                LaunchedEffect(Unit) {
                    delay(1800)
                    saveStatus = SaveStatus.SUCCESS
                }
            }
            SaveStatus.SUCCESS -> {
                ResultModal(
                    icon = Icons.Outlined.CheckCircle,
                    iconColor = GreenSave,
                    title = "¡CEDIS Guardado!",
                    message = "El Centro de Distribución fue registrado correctamente en el sistema.",
                    buttonText = "Continuar",
                    buttonColor = GreenSave,
                    onAction = { saveStatus = SaveStatus.IDLE; onSuccessContinue() }
                )
            }
            SaveStatus.ERROR -> {
                ResultModal(
                    icon = Icons.Outlined.ErrorOutline,
                    iconColor = ErrorRed,
                    title = "Error al guardar",
                    message = "No se pudo registrar el CEDIS. Verifica los datos e intenta de nuevo.",
                    buttonText = "Reintentar",
                    buttonColor = ErrorRed,
                    onAction = { saveStatus = SaveStatus.IDLE }
                )
            }
            SaveStatus.IDLE -> Unit
        }
    }
}

// ── Components ──

@Composable
private fun DropdownField(
    label: String,
    required: Boolean,
    selected: String,
    placeholder: String,
    isExpanded: Boolean,
    isError: Boolean,
    onClick: () -> Unit
) {
    val borderColor = when {
        isError -> ErrorRed
        isExpanded -> AccentBlue
        else -> BorderGray
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
private fun FormField(
    label: String,
    required: Boolean,
    value: String,
    placeholder: String,
    isError: Boolean,
    singleLine: Boolean = true,
    minLines: Int = 1,
    keyboardType: KeyboardType = KeyboardType.Text,
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
        singleLine = singleLine,
        minLines = minLines,
        placeholder = { Text(placeholder, color = HintGray, fontSize = 15.sp) },
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
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
private fun FieldError(text: String) {
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
private fun DropdownMenuOverlay(
    items: List<String>,
    selected: String,
    topPadding: androidx.compose.ui.unit.Dp,
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
                .padding(start = 20.dp, end = 20.dp, top = topPadding)
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
private fun SavingModal() {
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
                    modifier = Modifier
                        .size(72.dp)
                        .background(Color(0xFFE8F5FF), CircleShape),
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
                Text("Guardando CEDIS", color = Color(0xFF1E293B), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Por favor espera mientras se registra el Centro de Distribución...",
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
private fun ResultModal(
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
                Text(
                    message,
                    color = Color(0xFF64748B),
                    fontSize = 15.sp,
                    lineHeight = 22.sp
                )
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