package com.sivemor.mobile.network.dto

data class EvaluacionRequestDTO(
    val id: Long? = null,
    val idVerificacion: Long,
    val idTecnico: Long,

    val lucesGalibo: String? = null,
    val lucesAltas: String? = null,
    val lucesBajas: String? = null,
    val lucesDemarcadorasDelanteras: String? = null,
    val lucesDemarcadorasTraseras: String? = null,
    val lucesIndicadoras: String? = null,
    val faroIzquierdo: String? = null,
    val faroDerecho: String? = null,
    val lucesDireccionalesDelanteras: String? = null,
    val lucesDireccionalesTraseras: String? = null,

    val llantasRinesDelanteros: String? = null,
    val llantasRinesTraseros: String? = null,
    val llantasMasasDelanteras: String? = null,
    val llantasMasasTraseras: String? = null,

    val llantasPresionDelanteraIzquierda: Double? = null,
    val llantasPresionDelanteraDerecha: Double? = null,
    val llantasPresionTraseraIzquierda1: Double? = null,
    val llantasPresionTraseraIzquierda2: Double? = null,
    val llantasPresionTraseraDerecha1: Double? = null,
    val llantasPresionTraseraDerecha2: Double? = null,

    val llantasProfundidadDelanteraIzquierda: Double? = null,
    val llantasProfundidadDelanteraDerecha: Double? = null,
    val llantasProfundidadTraseraIzquierda1: Double? = null,
    val llantasProfundidadTraseraIzquierda2: Double? = null,
    val llantasProfundidadTraseraDerecha1: Double? = null,
    val llantasProfundidadTraseraDerecha2: Double? = null,

    val llantasBirlosDelanteraIzquierda: String? = null,
    val llantasBirlosDelanteraDerecha: String? = null,
    val llantasBirlosTraseraIzquierda: String? = null,
    val llantasBirlosTraseraDerecha: String? = null,

    val llantasBirlosDelanteraIzquierdaNum: Int = 0,
    val llantasBirlosDelanteraDerechaNum: Int = 0,
    val llantasBirlosTraseraIzquierdaNum: Int = 0,
    val llantasBirlosTraseraDerechaNum: Int = 0,

    val llantasTuercasDelanteraIzquierda: String? = null,
    val llantasTuercasDelanteraDerecha: String? = null,
    val llantasTuercasTraseraIzquierda: String? = null,
    val llantasTuercasTraseraDerecha: String? = null,

    val llantasTuercasDelanteraIzquierdaNum: Int = 0,
    val llantasTuercasDelanteraDerechaNum: Int = 0,
    val llantasTuercasTraseraIzquierdaNum: Int = 0,
    val llantasTuercasTraseraDerechaNum: Int = 0,

    val brazoPitman: String? = null,
    val manijasDePuertas: String? = null,
    val chavetas: String? = null,
    val chavetasNum: Int = 0,

    val compresor: String? = null,
    val tanquesDeAire: String? = null,
    val tiempoDeCargaPsi: Double? = null,
    val tiempoDeCargaTiempo: Double? = null,

    val humo: String? = null,
    val gobernado: String? = null,

    val cajaDireccion: String? = null,
    val depositoAceite: String? = null,
    val parabrisas: String? = null,
    val limpiaparabrisas: String? = null,
    val huelgo: String? = null,
    val huelgoCuanto: Double? = null,
    val escape: String? = null,

    val comentarios: String? = null,
    val evidencias: List<EvidenciaEvaluacionDTO> = emptyList()
)