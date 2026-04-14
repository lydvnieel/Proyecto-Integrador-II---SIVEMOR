package com.sivemor.mobile.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import androidx.navigation.NavHostController
import com.sivemor.mobile.ui.screens.auth.LoginScreen
import com.sivemor.mobile.ui.screens.home.HomeScreen
import com.sivemor.mobile.ui.screens.vehicles.VehicleFormScreen
import com.sivemor.mobile.ui.screens.history.HistoryScreen
import com.sivemor.mobile.ui.screens.evaluation.EvaluationWizardScreen
import com.sivemor.mobile.ui.screens.cedis.CedisSearchScreen
import com.sivemor.mobile.ui.screens.history.ResultScreen
import com.tuapp.sivemor.ui.screens.PerfilTecnicoScreen
import com.sivemor.mobile.data.model.HistoryItem
import com.sivemor.mobile.ui.screens.history.HistoryDetailScreen
import com.sivemor.mobile.ui.screens.history.HistoryScreen
import com.sivemor.mobile.ui.screens.vehicles.VehicleListScreen

@Composable
fun AppNavHost(navController: NavHostController) {
    NavHost(navController = navController, startDestination = AppRoutes.LOGIN) {

        // Pantalla de Login
        composable(AppRoutes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(AppRoutes.HOME) {
                        popUpTo(AppRoutes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        // Pantalla principal (Home)
        composable(AppRoutes.HOME) {
            HomeScreen(
                onOpenHistory = { vehicleId ->
                    navController.navigate("${AppRoutes.HISTORY_BASE}/$vehicleId")
                },
                onCreateVehicle = {
                    navController.navigate(AppRoutes.VEHICLE_FORM)
                },
                onCreateCedis = {
                    navController.navigate(AppRoutes.CEDIS_SEARCH)
                },
                onOpenEvaluation = { vehicleId ->
                    navController.navigate("${AppRoutes.EVALUATION_BASE}/$vehicleId")
                }
            )
        }

        // Pantalla de CEDIS Search
        composable(AppRoutes.CEDIS_SEARCH) {
            CedisSearchScreen(
                onBack = { navController.popBackStack() },
                onSuccessContinue = {
                    navController.navigate(AppRoutes.HOME) {
                        popUpTo(AppRoutes.HOME) { inclusive = false }
                    }
                }
            )
        }

        // Pantalla para Registrar un Vehículo
        composable(AppRoutes.VEHICLE_FORM) {
            VehicleFormScreen(onBack = { navController.popBackStack() })
        }

        composable(
            route = AppRoutes.HISTORY,
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            HistoryScreen(
                vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty(),
                onBack = { navController.popBackStack() },
                onDetail = { historyItem ->

                    navController.currentBackStackEntry
                        ?.savedStateHandle
                        ?.set("history_item", historyItem)

                    navController.navigate(AppRoutes.HISTORY_DETAIL)
                }
            )
        }

        composable(
            route = "${AppRoutes.RESULT}/{vehicleId}",
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            val vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty()
            ResultScreen(
                vehicleId = vehicleId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(
            route = "${AppRoutes.EVALUATION_BASE}/{vehicleId}",
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            val vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty()

            EvaluationWizardScreen(
                vehicleId = vehicleId,
                onBack = { navController.popBackStack() },
                onFinish = {
                    navController.navigate(AppRoutes.HOME) {
                        popUpTo(AppRoutes.HOME) { inclusive = true }
                    }
                }
            )
        }
        composable(
            route = AppRoutes.HISTORY,
            arguments = listOf(navArgument("vehicleId") { type = NavType.StringType })
        ) { backStackEntry ->
            HistoryScreen(
                vehicleId = backStackEntry.arguments?.getString("vehicleId").orEmpty(),
                onBack = { navController.popBackStack() },
                onDetail = { item ->
                    navController.currentBackStackEntry
                        ?.savedStateHandle
                        ?.set("history_item", item)

                    navController.navigate(AppRoutes.HISTORY_DETAIL)
                }
            )
        }

        composable(AppRoutes.HISTORY_DETAIL) {
            val item = navController.previousBackStackEntry
                ?.savedStateHandle
                ?.get<HistoryItem>("history_item")

            item?.let {
                HistoryDetailScreen(
                    item = it,
                    onBack = { navController.popBackStack() }
                )
            }
        }


    }
}

