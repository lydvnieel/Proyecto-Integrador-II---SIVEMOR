package com.sivemor.mobile.data.model

data class Vehicle(
    val id: String,
    val unitNumber: String,
    val plate: String,
    val serial: String,
    val model: String,
    val year: Int,
    val mileage: Int,
    val cedis: String,
    val region: String,
    val type: String,
    val active: Boolean = true
)
