package com.sivemor.mobile.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.sivemor.mobile.ui.screens.auth.LoginScreen
import com.sivemor.mobile.ui.screens.evaluation.EvaluationWizardScreen
import com.sivemor.mobile.ui.screens.history.HistoryScreen
import com.sivemor.mobile.ui.screens.home.HomeScreen
import com.sivemor.mobile.ui.screens.vehicles.VehicleFormScreen
import com.sivemor.mobile.ui.screens.vehicles.VehicleListScreen

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = AppRoutes.LOGIN) {
        composable(AppRoutes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(AppRoutes.HOME) {
                        popUpTo(AppRoutes.LOGIN) { inclusive = true }
                    }
                }
            )
        }
        composable(AppRoutes.HOME) {
            HomeScreen(
                onGoVehicles = { navController.navigate(AppRoutes.VEHICLES) },
                onOpenHistory = { id -> navController.navigate("${AppRoutes.HISTORY_BASE}/$id") },
                onOpenEvaluation = { id -> navController.navigate("${AppRoutes.EVALUATION_BASE}/$id") }
            )
        }
        composable(AppRoutes.VEHICLES) {
            VehicleListScreen(
                onBack = { navController.popBackStack() },
                onCreateVehicle = { navController.navigate(AppRoutes.VEHICLE_FORM) },
                onOpenHistory = { id -> navController.navigate("${AppRoutes.HISTORY_BASE}/$id") },
                onOpenEvaluation = { id -> navController.navigate("${AppRoutes.EVALUATION_BASE}/$id") }
            )
        }
        composable(AppRoutes.VEHICLE_FORM) {
            VehicleFormScreen(onBack = { navController.popBackStack() })
        }
        composable(
            route = AppRoutes.HISTORY,
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            HistoryScreen(
                vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty(),
                onBack = { navController.popBackStack() }
            )
        }
        composable(
            route = AppRoutes.EVALUATION,
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            EvaluationWizardScreen(
                vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty(),
                onBack = { navController.popBackStack() },
                onFinish = {
                    navController.navigate(AppRoutes.HOME) {
                        popUpTo(AppRoutes.HOME) { inclusive = true }
                    }
                }
            )
        }
    }
}
