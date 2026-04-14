package com.sivemor.mobile.data.mock

import com.sivemor.mobile.data.model.AppUser
import com.sivemor.mobile.data.model.Cedis
import com.sivemor.mobile.data.model.Evaluation
import com.sivemor.mobile.data.model.HistoryItem
import com.sivemor.mobile.data.model.Vehicle

object MockData {

    val user = AppUser(
        id = "tec-1",
        name = "Técnico SIVEMOR",
        email = "tecnico@sivemor.com"
    )


    // ── CEDIS ─────────────────────────────────────────────────────────────────
    val cedisList = mutableListOf<Cedis>()

    // ── Evaluaciones ──────────────────────────────────────────────────────────
    val evaluations = mutableListOf<Evaluation>()

    // ── Historial ─────────────────────────────────────────────────────────────
    val historyItems = mutableListOf<HistoryItem>()
}