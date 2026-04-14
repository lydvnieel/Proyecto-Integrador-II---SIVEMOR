package com.sivemor.mobile.data.model

data class Vehicle(
    val id: Long,
    val idCliente: Long,
    val idCedis: Long,
    val cliente: String,
    val cedis: String,
    val region: String,
    val placa: String,
    val serie: String,
    val tipo: String,
    val activo: Boolean
)