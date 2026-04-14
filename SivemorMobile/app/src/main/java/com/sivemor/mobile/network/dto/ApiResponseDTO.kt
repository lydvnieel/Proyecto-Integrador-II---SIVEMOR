package com.sivemor.mobile.network.dto

data class ApiResponseDTO<T>(
    val message: String? = null,
    val data: T? = null,
    val error: Boolean? = null,
    val status: String? = null
)