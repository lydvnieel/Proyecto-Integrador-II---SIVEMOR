package com.sivemor.mobile.data.model

data class Cedis(
    val id: String,
    val client: String,
    val region: String,
    val name: String,
    val address: String,
    val manager: String,
    val email: String,
    val phone: String,
    val altPhone: String = ""
)