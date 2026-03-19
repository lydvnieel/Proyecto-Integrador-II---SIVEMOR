package com.sivemor.mobile.data.model

data class EvaluationForm(
    var vehicleId: String = "",
    var unitNumber: String = "",
    var plate: String = "",
    var model: String = "",
    var year: String = "",
    var mileage: String = "",
    var timestamp: String = "",

    var lucesDelanteras: String = "APROBADO",
    var lucesTraseras: String = "APROBADO",
    var direccionales: String = "APROBADO",
    var cuartos: String = "APROBADO",

    var presionDelanteraIzq: String = "110",
    var presionDelanteraDer: String = "110",
    var presionTraseraIzq1: String = "100",
    var presionTraseraIzq2: String = "100",
    var presionTraseraDer1: String = "100",
    var presionTraseraDer2: String = "100",

    var profundidadDelanteraIzq: String = "4.0",
    var profundidadDelanteraDer: String = "4.0",
    var profundidadTraseraIzq1: String = "2.0",
    var profundidadTraseraIzq2: String = "2.0",
    var profundidadTraseraDer1: String = "2.0",
    var profundidadTraseraDer2: String = "2.0",

    var birlosDelanteraIzqNum: String = "0",
    var birlosDelanteraDerNum: String = "0",
    var birlosTraseraIzqNum: String = "0",
    var birlosTraseraDerNum: String = "0",

    var tuercasDelanteraIzqNum: String = "0",
    var tuercasDelanteraDerNum: String = "0",
    var tuercasTraseraIzqNum: String = "0",
    var tuercasTraseraDerNum: String = "0",

    var brazoPitman: String = "APROBADO",
    var manijasPuertas: String = "APROBADAS",
    var chavetas: String = "APROBADAS",
    var chavetasNum: String = "0",

    var compresor: String = "APROBADO",
    var tanquesAire: String = "APROBADO",
    var tiempoCargaPsi: String = "100",
    var tiempoCargaTiempo: String = "60",

    var humo: String = "APROBADO",
    var gobernado: String = "APROBADO",

    var cajaDireccion: String = "APROBADA",
    var depositoAceite: String = "APROBADO",
    var quintaRueda: String = "APROBADA",
    var parabrisas: String = "APROBADO",
    var limpiaparabrisas: String = "APROBADO",
    var huelgo: String = "APROBADO",
    var huelgoCuanto: String = "0",
    var escape: String = "APROBADO",

    var evidenceUris: MutableList<String> = mutableListOf(),
    var comments: String = ""
)
