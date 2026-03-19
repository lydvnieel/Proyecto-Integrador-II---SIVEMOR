package com.sivemor.mobile.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.repository.MockRepository
import com.sivemor.mobile.util.Validators

class LoginViewModel : ViewModel() {
    var email by mutableStateOf("admin@gmail.com")
    var password by mutableStateOf("123456")
    var error by mutableStateOf("")

    fun login(onSuccess: () -> Unit) {
        error = ""
        if (!Validators.isValidEmail(email)) {
            error = "Ingresa un correo válido"
            return
        }
        if (password.length < 6) {
            error = "La contraseña debe tener al menos 6 caracteres"
            return
        }

        val result = MockRepository.login(email, password)
        result.onSuccess { onSuccess() }
            .onFailure { error = it.message ?: "Error al iniciar sesión" }
    }
}
