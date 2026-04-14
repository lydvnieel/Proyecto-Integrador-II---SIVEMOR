package com.sivemor.mobile.ui.screens.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sivemor.mobile.R

private const val MAX_LOGIN_ATTEMPTS = 5

// Colors
private val NavyDark  = Color(0xFF0E2340)
private val NavyMid   = Color(0xFF1A3A5C)
private val CardWhite = Color(0xFFFFFFFF)
private val InputBg   = Color(0xFFF8FAFC)
private val LabelCol  = Color(0xFF374151)
private val HintCol   = Color(0xFF94A3B8)
private val BorderCol = Color(0xFFD1D9E0)
private val SubText   = Color(0xFF64748B)
private val ErrorRed  = Color(0xFFE53935)

@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    var email          by rememberSaveable { mutableStateOf("") }
    var password       by rememberSaveable { mutableStateOf("") }
    var showPassword   by rememberSaveable { mutableStateOf(false) }
    var emailError     by rememberSaveable { mutableStateOf(false) }
    var passwordError  by rememberSaveable { mutableStateOf(false) }
    var failedAttempts by rememberSaveable { mutableStateOf(0) }
    var isBlocked      by rememberSaveable { mutableStateOf(false) }
    var topAlert       by remember { mutableStateOf<LoginAlert?>(null) }

    val validEmail    = "tecnico@sivemor.com"
    val validPassword = "123456"

    fun tryLogin() {
        emailError    = email.isBlank()
        passwordError = password.isBlank()
        if (emailError || passwordError) { topAlert = null; return }
        if (isBlocked) { topAlert = LoginAlert.Blocked; return }
        if (email == validEmail && password == validPassword) {
            failedAttempts = 0; topAlert = null; onLoginSuccess()
        } else {
            failedAttempts += 1
            val remaining = MAX_LOGIN_ATTEMPTS - failedAttempts
            if (remaining <= 0) { isBlocked = true; topAlert = LoginAlert.Blocked }
            else topAlert = LoginAlert.InvalidCredentials(remaining)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(NavyDark, NavyMid)))
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding()
            .padding(horizontal = 24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            // ── Logo + nombre ──
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Card(
                    modifier = Modifier
                        .size(110.dp)
                        .shadow(20.dp, RoundedCornerShape(28.dp)),
                    shape = RoundedCornerShape(28.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF112236))
                ) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Image(
                            painter = painterResource(id = R.drawable.logo),
                            contentDescription = "Logo SIVEMOR",
                            modifier = Modifier.size(82.dp)
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                Text(
                    "SIVEMOR",
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 3.sp
                )
                Text(
                    "Sistema de Verificación Morelos",
                    color = Color(0xFF7FA8CC),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Normal
                )
            }

            Spacer(Modifier.height(32.dp))

            // ── Card del formulario ──
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = CardWhite),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 28.dp)
                ) {
                    Text(
                        "Bienvenido",
                        color = NavyDark,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Ingresa tus credenciales para continuar",
                        color = SubText,
                        fontSize = 14.sp
                    )

                    Spacer(Modifier.height(24.dp))

                    // Alert
                    topAlert?.let { alert ->
                        LoginAlertCard(alert)
                        Spacer(Modifier.height(20.dp))
                    }

                    // Email
                    FieldLabel("Correo electrónico")
                    Spacer(Modifier.height(8.dp))
                    LoginInput(
                        value = email,
                        onValueChange = { email = it; emailError = false },
                        placeholder = "Ingresa el correo elctrónico",
                        leadingIcon = Icons.Outlined.PersonOutline,
                        isError = emailError,
                        keyboardType = KeyboardType.Email
                    )
                    if (emailError) FieldError("El correo es requerido")

                    Spacer(Modifier.height(20.dp))

                    // Password
                    FieldLabel("Contraseña")
                    Spacer(Modifier.height(8.dp))
                    LoginInput(
                        value = password,
                        onValueChange = { password = it; passwordError = false },
                        placeholder = "••••••••",
                        leadingIcon = Icons.Outlined.Lock,
                        trailingIcon = if (showPassword) Icons.Outlined.VisibilityOff else Icons.Outlined.Visibility,
                        onTrailingClick = { showPassword = !showPassword },
                        isPassword = true,
                        showPassword = showPassword,
                        isError = passwordError,
                        keyboardType = KeyboardType.Password
                    )
                    if (passwordError) FieldError("La contraseña es requerida")

                    Spacer(Modifier.height(28.dp))

                    // Botón
                    Button(
                        onClick = { tryLogin() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = NavyMid)
                    ) {
                        Text(
                            "Acceder al Sistema",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(Modifier.width(10.dp))
                        Icon(
                            Icons.Outlined.ArrowForward,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(Modifier.height(20.dp))

                    // Footer seguridad
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Outlined.VerifiedUser,
                            contentDescription = null,
                            tint = HintCol,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Conexión segura y encriptada",
                            color = HintCol,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            Text(
                "© 2026 Sistema de Verificación Morelos",
                color = Color(0xFF4A6A8A),
                fontSize = 12.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}

// ── Components ──

@Composable
private fun FieldLabel(text: String) {
    Text(text, color = LabelCol, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
}

@Composable
private fun FieldError(text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(top = 5.dp, start = 2.dp)
    ) {
        Icon(Icons.Outlined.ErrorOutline, null, tint = ErrorRed, modifier = Modifier.size(14.dp))
        Spacer(Modifier.width(5.dp))
        Text(text, color = ErrorRed, fontSize = 12.sp)
    }
}

@Composable
private fun LoginInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector,
    trailingIcon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    onTrailingClick: () -> Unit = {},
    isPassword: Boolean = false,
    showPassword: Boolean = false,
    isError: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth().height(54.dp),
        singleLine = true,
        textStyle = TextStyle(fontSize = 14.sp),
        shape = RoundedCornerShape(14.dp),
        placeholder = { Text(placeholder, color = HintCol, fontSize = 14.sp) },
        leadingIcon = {
            Icon(leadingIcon, null, tint = if (isError) ErrorRed else Color(0xFF94A3B8), modifier = Modifier.size(20.dp))
        },
        trailingIcon = {
            if (trailingIcon != null) {
                IconButton(onClick = onTrailingClick) {
                    Icon(trailingIcon, null, tint = HintCol, modifier = Modifier.size(20.dp))
                }
            }
        },
        visualTransformation = if (isPassword && !showPassword) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor   = if (isError) ErrorRed else NavyMid,
            unfocusedBorderColor = if (isError) ErrorRed else BorderCol,
            focusedContainerColor   = InputBg,
            unfocusedContainerColor = InputBg,
            focusedTextColor   = NavyDark,
            unfocusedTextColor = NavyDark,
            cursorColor = NavyMid
        )
    )
}

@Composable
private fun LoginAlertCard(alert: LoginAlert) {
    val (bg, border, iconColor, line1, line2) = when (alert) {
        is LoginAlert.InvalidCredentials -> AlertStyle(
            bg = Color(0xFFFFF8EE), border = Color(0xFFFF5A1F),
            iconColor = Color(0xFFFF5A1F),
            line1 = "Credenciales incorrectas.",
            line2 = "Intentos restantes: ${alert.remaining}"
        )
        LoginAlert.Blocked -> AlertStyle(
            bg = Color(0xFFFFF4F4), border = Color(0xFFFF3B30),
            iconColor = Color(0xFFFF3B30),
            line1 = "Cuenta bloqueada.",
            line2 = "Demasiados intentos fallidos.\nContacta al administrador."
        )
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(bg, RoundedCornerShape(14.dp))
            .border(1.dp, border, RoundedCornerShape(14.dp))
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.Top
    ) {
        Icon(Icons.Outlined.ErrorOutline, null, tint = iconColor, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(12.dp))
        Column {
            Text(line1, color = iconColor, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(2.dp))
            Text(line2, color = iconColor, fontSize = 13.sp, lineHeight = 18.sp)
        }
    }
}

private data class AlertStyle(
    val bg: Color,
    val border: Color,
    val iconColor: Color,
    val line1: String,
    val line2: String
)

private sealed interface LoginAlert {
    data class InvalidCredentials(val remaining: Int) : LoginAlert
    data object Blocked : LoginAlert
}