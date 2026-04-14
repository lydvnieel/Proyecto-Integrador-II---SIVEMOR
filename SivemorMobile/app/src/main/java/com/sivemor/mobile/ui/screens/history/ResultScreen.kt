package com.sivemor.mobile.ui.screens.history

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.outlined.Build
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.Message
import androidx.compose.material.icons.outlined.ReportProblem
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sivemor.mobile.data.model.HistoryItem
import com.sivemor.mobile.data.repository.HistoryRepository
import androidx.compose.foundation.layout.ColumnScope

@Composable
fun ResultScreen(
    vehicleId: String,
    onBack: () -> Unit
) {
    val item = remember(vehicleId) {
        HistoryRepository.getHistoryByVehicle(vehicleId).firstOrNull()
    } ?: return

    EvaluationDetailContent(item = item, onBack = onBack)
}

@Composable
fun EvaluationDetailContent(
    item: HistoryItem,
    onBack: () -> Unit
) {
    val approved = item.resultado == "APROBADO"

    Scaffold(
        containerColor = Color(0xFFF3F5F7),
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF183B67), Color(0xFF34517C))
                        ),
                        RoundedCornerShape(bottomStart = 30.dp, bottomEnd = 30.dp)
                    )
                    .statusBarsPadding()
                    .padding(horizontal = 18.dp, vertical = 18.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.ArrowBack,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier
                            .size(28.dp)
                            .background(Color.Transparent)
                            .padding(2.dp)
                            .run {
                                this
                            }
                    )
                    Icon(
                        imageVector = Icons.Filled.ArrowBack,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier
                            .size(28.dp)
                            .padding(2.dp)
                    )
                }
            }
        }
    ) { _ -> }

    Scaffold(
        containerColor = Color(0xFFF3F5F7),
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF183B67), Color(0xFF34517C))
                        ),
                        RoundedCornerShape(bottomStart = 30.dp, bottomEnd = 30.dp)
                    )
                    .statusBarsPadding()
                    .padding(horizontal = 18.dp, vertical = 18.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.ArrowBack,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier
                            .size(28.dp)
                            .background(Color.Transparent)
                            .padding(2.dp)
                            .run { this }
                    )
                    Spacer(modifier = Modifier.width(14.dp))
                    Column {
                        Text(
                            text = "Detalle de Evaluación",
                            color = Color.White,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = item.placas,
                            color = Color(0xFFDCE5F2),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF516A8D))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 18.dp, vertical = 18.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(62.dp)
                                .background(
                                    if (approved) Color(0xFF4CAF50) else Color(0xFFF44336),
                                    CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (approved) Icons.Outlined.CheckCircle else Icons.Outlined.ErrorOutline,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(36.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Dictamen Final",
                                color = Color(0xFFE8EEF7),
                                fontSize = 14.sp
                            )
                            Text(
                                text = item.resultado,
                                color = Color.White,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "ID Evaluación",
                                color = Color(0xFFE8EEF7),
                                fontSize = 14.sp
                            )
                            Text(
                                text = item.id,
                                color = Color.White,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }
                }
            }
        },
        bottomBar = {
            Spacer(
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .height(6.dp)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF3F5F7))
                .padding(padding),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                SectionCard(
                    icon = Icons.Outlined.Description,
                    title = "Información General"
                ) {
                    DetailRow("Fecha de evaluación", item.fecha, blue = true)
                    DetailRow("Técnico", item.tecnico, blue = true)
                    DetailRow("Vehículo", item.placas, blue = true)
                    DetailRow("Tipo", item.tipo, blue = true)
                    DetailRow("Serie", item.serie, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.ReportProblem,
                    title = "Sistema de Luces"
                ) {
                    DetailRow("Luces de gálibo", item.lucesGalibo, green = item.lucesGalibo == "Aprobado", red = item.lucesGalibo == "Reprobado")
                    DetailRow("Luces altas", item.lucesAltas, green = item.lucesAltas == "Aprobado", red = item.lucesAltas == "Reprobado")
                    DetailRow("Luces bajas", item.lucesBajas, green = item.lucesBajas == "Aprobado", red = item.lucesBajas == "Reprobado")
                    DetailRow("Luces demarcadoras delanteras", item.lucesDemDel, green = item.lucesDemDel == "Aprobado", red = item.lucesDemDel == "Reprobado")
                    DetailRow("Luces demarcadoras traseras", item.lucesDemTras, green = item.lucesDemTras == "Aprobado", red = item.lucesDemTras == "Reprobado")
                    DetailRow("Luces indicadoras", item.lucesIndicadoras, green = item.lucesIndicadoras == "Aprobado", red = item.lucesIndicadoras == "Reprobado")
                    DetailRow("Faro izquierdo", item.faroIzq, green = item.faroIzq == "Aprobado", red = item.faroIzq == "Reprobado")
                    DetailRow("Faro derecho", item.faroDer, green = item.faroDer == "Aprobado", red = item.faroDer == "Reprobado")
                    DetailRow("Direccionales delanteras", item.direccionalesDel, green = item.direccionalesDel == "Aprobado", red = item.direccionalesDel == "Reprobado")
                    DetailRow("Direccionales traseras", item.direccionalesTras, green = item.direccionalesTras == "Aprobado", red = item.direccionalesTras == "Reprobado")
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.DirectionsCar,
                    title = "Llantas y Rines"
                ) {
                    DetailRow("Rines delanteros", item.rinesDel, green = true)
                    DetailRow("Rines traseros", item.rinesTras, green = true)
                    DetailRow("Masas delanteras", item.masasDel, green = true)
                    DetailRow("Masas traseras", item.masasTras, green = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.ErrorOutline,
                    title = "Presión de Llantas (PSI)"
                ) {
                    DetailRow("Delantera izquierda", item.psiDelIzq, blue = true)
                    DetailRow("Delantera derecha", item.psiDelDer, blue = true)
                    DetailRow("Trasera izquierda 1", item.psiTrasIzq1, blue = true)
                    DetailRow("Trasera izquierda 2", item.psiTrasIzq2, blue = true)
                    DetailRow("Trasera derecha 1", item.psiTrasDer1, blue = true)
                    DetailRow("Trasera derecha 2", item.psiTrasDer2, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.ErrorOutline,
                    title = "Profundidad de Llantas (mm)"
                ) {
                    DetailRow("Delantera izquierda", item.profDelIzq, blue = true)
                    DetailRow("Delantera derecha", item.profDelDer, blue = true)
                    DetailRow("Trasera izquierda 1", item.profTrasIzq1, blue = true)
                    DetailRow("Trasera izquierda 2", item.profTrasIzq2, blue = true)
                    DetailRow("Trasera derecha 1", item.profTrasDer1, blue = true)
                    DetailRow("Trasera derecha 2", item.profTrasDer2, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.ErrorOutline,
                    title = "Birlos y Tuercas Faltantes"
                ) {
                    Text(
                        text = "Birlos",
                        color = Color(0xFF6B7280),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    DetailRow("Delantera izquierda", item.birloDelIzq, blue = true)
                    DetailRow("Delantera derecha", item.birloDelDer, blue = true)
                    DetailRow("Trasera izquierda", item.birloTrasIzq, blue = true)
                    DetailRow("Trasera derecha", item.birloTrasDer, blue = true)

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Tuercas",
                        color = Color(0xFF6B7280),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    DetailRow("Delantera izquierda", item.tuercaDelIzq, blue = true)
                    DetailRow("Delantera derecha", item.tuercaDelDer, blue = true)
                    DetailRow("Trasera izquierda", item.tuercaTrasIzq, blue = true)
                    DetailRow("Trasera derecha", item.tuercaTrasDer, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.DirectionsCar,
                    title = "Sistema de Dirección"
                ) {
                    DetailRow("Brazo Pitman", item.brazoPitman, green = true)
                    DetailRow("Manijas de puertas", item.manijas, green = true)
                    DetailRow("Chavetas", item.chavetas, green = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.ErrorOutline,
                    title = "Sistema de Aire"
                ) {
                    DetailRow("Compresor", item.compresor, green = item.compresor == "Aprobado")
                    DetailRow("Tanques de aire", item.tanquesAire, green = item.tanquesAire == "Aprobado")
                    DetailRow("Tiempo de carga (PSI)", item.tiempoPsi, blue = true)
                    DetailRow("Tiempo de carga (segundos)", item.tiempoSeg, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.DirectionsCar,
                    title = "Motor"
                ) {
                    DetailRow("Humo", item.humo, green = item.humo == "Aprobado")
                    DetailRow("Gobernado", item.gobernado, green = item.gobernado == "Aprobado")
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.Description,
                    title = "Otros Sistemas"
                ) {
                    DetailRow("Caja de dirección", item.cajaDireccion, green = item.cajaDireccion == "Aprobado", red = item.cajaDireccion == "Reprobado")
                    DetailRow("Depósito de aceite", item.depositoAceite, green = item.depositoAceite == "Aprobado", red = item.depositoAceite == "Reprobado")
                    DetailRow("Parabrisas", item.parabrisas, green = item.parabrisas == "Aprobado", red = item.parabrisas == "Reprobado")
                    DetailRow("Limpiaparabrisas", item.limpiaparabrisas, green = item.limpiaparabrisas == "Aprobado", red = item.limpiaparabrisas == "Reprobado")
                    DetailRow("Huelgo", item.huelgo, green = item.huelgo == "Aprobado", red = item.huelgo == "Reprobado")
                    DetailRow("Escape", item.escape, green = item.escape == "Aprobado", red = item.escape == "Reprobado")
                }
            }

            item {
                EvidenceSection(
                    title = "Evidencias Fotográficas",
                    items = item.evidencias,
                    approved = approved
                )
            }

            item {
                CommentSection(
                    title = "Comentarios del Técnico",
                    text = item.comentariosTecnico
                )
            }

            item {
                CommentSection(
                    title = "Observaciones",
                    text = item.observaciones,
                    warn = true
                )
            }

            item {
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
private fun SectionCard(
    icon: ImageVector,
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 5.dp)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = Color(0xFF2F91FF),
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = title,
                    color = Color(0xFF111827),
                    fontSize = 19.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color(0xFFE9EEF4))
            )

            Spacer(modifier = Modifier.height(16.dp))

            content()
        }
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String,
    blue: Boolean = false,
    green: Boolean = false,
    red: Boolean = false
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            color = Color(0xFF4B5563),
            fontSize = 15.sp,
            modifier = Modifier.weight(1f)
        )

        Box(
            modifier = Modifier
                .background(
                    when {
                        green -> Color(0xFFE3F5E6)
                        red -> Color(0xFFFFE5E5)
                        blue -> Color(0xFFE3F0FF)
                        else -> Color(0xFFF3F4F6)
                    },
                    RoundedCornerShape(16.dp)
                )
                .padding(horizontal = 14.dp, vertical = 8.dp)
        ) {
            Text(
                text = value,
                color = when {
                    green -> Color(0xFF43A047)
                    red -> Color(0xFFF44336)
                    blue -> Color(0xFF2F91FF)
                    else -> Color(0xFF374151)
                },
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }

    Spacer(modifier = Modifier.height(14.dp))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(Color(0xFFE9EEF4))
    )

    Spacer(modifier = Modifier.height(14.dp))
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun EvidenceSection(
    title: String,
    items: List<String>,
    approved: Boolean
) {
    SectionCard(
        icon = Icons.Outlined.CameraAlt,
        title = title
    ) {
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.forEach { text ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth(0.48f)
                        .height(180.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (approved) Color(0xFFD7E0E8) else Color(0xFFE2D6D6)
                    )
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    listOf(Color.Transparent, Color(0xAA000000))
                                )
                            ),
                        contentAlignment = Alignment.BottomStart
                    ) {
                        Text(
                            text = text,
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CommentSection(
    title: String,
    text: String,
    warn: Boolean = false
) {
    SectionCard(
        icon = Icons.Outlined.Message,
        title = title
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    if (warn) Color(0xFFFFF6E8) else Color(0xFFF7F8FB),
                    RoundedCornerShape(18.dp)
                )
                .padding(18.dp)
        ) {
            Text(
                text = text,
                color = Color(0xFF374151),
                fontSize = 16.sp,
                lineHeight = 28.sp
            )
        }
    }
}