package com.sivemor.mobile.util

import com.sivemor.mobile.data.model.EvaluationForm

object EvaluationRules {
    fun calculateDictamen(form: EvaluationForm): String {
        val failures = mutableListOf<Boolean>()

        fun d(value: String) = value.toDoubleOrNull() ?: 0.0
        fun i(value: String) = value.toIntOrNull() ?: 0

        failures += form.lucesDelanteras != "APROBADO"
        failures += form.lucesTraseras != "APROBADO"
        failures += form.direccionales != "APROBADO"
        failures += form.cuartos != "APROBADO"

        failures += d(form.profundidadDelanteraIzq) < 3.2
        failures += d(form.profundidadDelanteraDer) < 3.2
        failures += d(form.profundidadTraseraIzq1) < 1.6
        failures += d(form.profundidadTraseraIzq2) < 1.6
        failures += d(form.profundidadTraseraDer1) < 1.6
        failures += d(form.profundidadTraseraDer2) < 1.6

        failures += i(form.birlosDelanteraIzqNum) > 2
        failures += i(form.birlosDelanteraDerNum) > 2
        failures += i(form.birlosTraseraIzqNum) > 2
        failures += i(form.birlosTraseraDerNum) > 2

        failures += i(form.tuercasDelanteraIzqNum) > 2
        failures += i(form.tuercasDelanteraDerNum) > 2
        failures += i(form.tuercasTraseraIzqNum) > 2
        failures += i(form.tuercasTraseraDerNum) > 2

        failures += form.brazoPitman != "APROBADO"
        failures += form.manijasPuertas != "APROBADAS"
        failures += form.chavetas != "APROBADAS"
        failures += i(form.chavetasNum) > 0

        val psi = d(form.tiempoCargaPsi)
        failures += !(psi > 70 && psi < 120)
        failures += d(form.tiempoCargaTiempo) >= 120
        failures += form.compresor != "APROBADO"
        failures += form.tanquesAire != "APROBADO"

        failures += form.humo != "APROBADO"
        failures += form.gobernado != "APROBADO"

        failures += form.cajaDireccion != "APROBADA"
        failures += form.depositoAceite != "APROBADO"
        failures += form.quintaRueda != "APROBADA"
        failures += form.parabrisas != "APROBADO"
        failures += form.limpiaparabrisas != "APROBADO"
        failures += form.huelgo != "APROBADO"
        failures += form.escape != "APROBADO"

        return if (failures.any { it }) "REPROBADO" else "APROBADO"
    }
}
