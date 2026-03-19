package com.sivemor.mobile.data.mock

import com.sivemor.mobile.data.model.AppUser
import com.sivemor.mobile.data.model.DashboardStats
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.Vehicle

object MockData {
    val user = AppUser(
        id = "tec-1",
        name = "Oscar Mendoza",
        email = "oscar@gmail.com"
    )

    val vehicles = mutableListOf(
        Vehicle("1", "U-2432", "ABC-345", "SER12345", "Volvo VNL 760", 2020, 150000, "CEDIS Norte", "Norte", "Camión Rabón"),
        Vehicle("2", "U-1024", "ABC-123", "SER55555", "Volvo VNL", 2019, 130000, "CEDIS Central", "Centro", "Camión rígido 4x2"),
        Vehicle("3", "U-9901", "XYZ-789", "SER77777", "Kenworth T680", 2021, 110000, "CEDIS Sur", "Sur", "Camión Rabón"),
        Vehicle("4", "U-3040", "LMN-456", "SER99999", "Freightliner Cascadia", 2018, 180000, "CEDIS Bajío", "Bajío", "Camión rígido 4x2")
    )

    val evaluations = mutableListOf(
        Evaluation("ev1", "1", "Unidad U-2432", "15/02/2026", "Oscar Mendoza", "APROBADO", "Sin incidencias", false),
        Evaluation("ev2", "2", "Unidad U-1024", "25/10/2023", "Oscar Mendoza", "REPROBADO", "Falla en presión", true),
        Evaluation("ev3", "3", "Unidad U-9901", "24/10/2023", "Oscar Mendoza", "APROBADO", "Correcto", false),
        Evaluation("ev4", "4", "Unidad U-3040", "20/10/2023", "Oscar Mendoza", "APROBADO", "Correcto", false)
    )

    fun dashboardStats(): DashboardStats {
        val total = evaluations.size
        val approved = evaluations.count { it.dictamen == "APROBADO" }
        val rejected = evaluations.count { it.dictamen == "REPROBADO" }
        val fines = evaluations.count { it.multa }
        return DashboardStats(total, approved, rejected, fines)
    }
}
