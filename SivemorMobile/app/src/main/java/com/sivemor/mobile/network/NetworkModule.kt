package com.sivemor.mobile.network

object NetworkModule {
    val api: ApiService by lazy {
        ApiClient.retrofit.create(ApiService::class.java)
    }
}