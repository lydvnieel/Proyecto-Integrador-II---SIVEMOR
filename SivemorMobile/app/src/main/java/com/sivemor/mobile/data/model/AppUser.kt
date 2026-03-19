package com.sivemor.mobile.data.model

data class AppUser(
    val id: String,
    val name: String,
    val email: String,
    val role: String = "TECNICO"
)
