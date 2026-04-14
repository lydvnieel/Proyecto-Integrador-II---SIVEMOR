package com.sivemor.mobile

import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.sivemor.mobile.navigation.AppNavHost

@Composable
fun SivemorApp() {
    val navController = rememberNavController()
    AppNavHost(navController = navController)
}