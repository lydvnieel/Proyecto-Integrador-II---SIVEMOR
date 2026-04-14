package com.sivemor.mobile.data.model

data class Evaluation(
    val id: String,
    val vehicleId: String,
    val vehicleLabel: String,
    val date: String,
    val technician: String,
    val dictamen: String,
    val comments: String,
    val multa: Boolean = false
)
