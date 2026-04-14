package com.sivemor.mobile.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.repository.MockRepository

class LoginViewModel : ViewModel() {
    var email by mutableStateOf("")
    var password by mutableStateOf("")
    var error by mutableStateOf("")

    fun login(onSuccess: () -> Unit) {
        error = ""
        val result = MockRepository.login(email, password)
        result.onSuccess { onSuccess() }
            .onFailure { error = it.message ?: "Error al iniciar sesión" }
    }
}
