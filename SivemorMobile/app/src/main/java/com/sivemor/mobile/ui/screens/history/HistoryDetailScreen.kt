package com.sivemor.mobile.ui.screens.history

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
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
import androidx.compose.material.icons.outlined.Air
import androidx.compose.material.icons.outlined.Build
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.Message
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sivemor.mobile.data.model.HistoryItem

@Composable
fun HistoryDetailScreen(
    item: HistoryItem,
    onBack: () -> Unit
) {
    val approved = item.resultado == "APROBADO"

    Scaffold(
        containerColor = Color(0xFFF5F7FA),
        topBar = {
            DetailHeader(
                plate = item.placas,
                approved = approved,
                evalId = item.id,
                onBack = onBack
            )
        },
        bottomBar = {
            Spacer(
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .height(8.dp)
                    .background(Color.Transparent)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF5F7FA))
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
                    icon = Icons.Outlined.Lightbulb,
                    title = "Sistema de Luces"
                ) {
                    DetailRow("Luces de gálibo", item.lucesGalibo, blue = true)
                    DetailRow("Luces altas", item.lucesAltas, blue = true)
                    DetailRow("Luces bajas", item.lucesBajas, blue = true)
                    DetailRow("Luces demarcadoras delanteras", item.lucesDemDel, blue = true)
                    DetailRow("Luces demarcadoras traseras", item.lucesDemTras, blue = true)
                    DetailRow("Luces indicadoras", item.lucesIndicadoras, blue = true)
                    DetailRow("Faro izquierdo", item.faroIzq, green = true)
                    DetailRow("Faro derecho", item.faroDer, green = true)
                    DetailRow("Direccionales delanteras", item.direccionalesDel, blue = true)
                    DetailRow("Direccionales traseras", item.direccionalesTras, blue = true)
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
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                    DetailRow("Delantera izquierda", item.birloDelIzq, blue = true)
                    DetailRow("Delantera derecha", item.birloDelDer, blue = true)
                    DetailRow("Trasera izquierda", item.birloTrasIzq, blue = true)
                    DetailRow("Trasera derecha", item.birloTrasDer, blue = true)

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Tuercas",
                        color = Color(0xFF6B7280),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
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
                    icon = Icons.Outlined.Air,
                    title = "Sistema de Aire"
                ) {
                    DetailRow("Compresor", item.compresor, green = true)
                    DetailRow("Tanques de aire", item.tanquesAire, green = true)
                    DetailRow("Tiempo de carga (PSI)", item.tiempoPsi, blue = true)
                    DetailRow("Tiempo de carga (segundos)", item.tiempoSeg, blue = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.DirectionsCar,
                    title = "Motor"
                ) {
                    DetailRow("Humo", item.humo, green = true)
                    DetailRow("Gobernado", item.gobernado, green = true)
                }
            }

            item {
                SectionCard(
                    icon = Icons.Outlined.Description,
                    title = "Otros Sistemas"
                ) {
                    DetailRow("Caja de dirección", item.cajaDireccion, green = true)
                    DetailRow("Depósito de aceite", item.depositoAceite, green = true)
                    DetailRow("Parabrisas", item.parabrisas, green = true)
                    DetailRow("Limpiaparabrisas", item.limpiaparabrisas, blue = true)
                    DetailRow("Huelgo", item.huelgo, green = true)
                    DetailRow("Escape", item.escape, green = true)
                }
            }

            item {
                EvidenceSection(item.evidencias)
            }

            item {
                CommentSection(
                    title = "Comentarios del Técnico",
                    text = item.comentariosTecnico,
                    background = Color(0xFFF8FAFD),
                    border = Color.Transparent
                )
            }

            item {
                CommentSection(
                    title = "Observaciones",
                    text = item.observaciones,
                    background = Color(0xFFFFF8EE),
                    border = Color(0xFFF6C27A)
                )
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun DetailHeader(
    plate: String,
    approved: Boolean,
    evalId: String,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF0A1630), Color(0xFF34517C))
                )
            )
            .statusBarsPadding()
            .padding(horizontal = 18.dp, vertical = 18.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector =Icons.Filled.ArrowBack,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier
                    .size(28.dp)
                    .clickable { onBack() }
            )

            Spacer(modifier = Modifier.width(14.dp))

            Column {
                Text(
                    text = "Detalle de Evaluación",
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = plate,
                    color = Color(0xFFD8E2F3),
                    fontSize = 14.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF506A8E)),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 18.dp, vertical = 18.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(Color(0xFF49B64E), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (approved) Icons.Outlined.CheckCircle else Icons.Outlined.ErrorOutline,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(34.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Dictamen Final",
                        color = Color(0xFFE6EDF8),
                        fontSize = 14.sp
                    )
                    Text(
                        text = if (approved) "APROBADO" else "REPROBADO",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "ID Evaluación",
                        color = Color(0xFFE6EDF8),
                        fontSize = 14.sp
                    )
                    Text(
                        text = evalId,
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
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
            .padding(horizontal = 12.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = {
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
                        color = Color(0xFF182235),
                        fontSize = 20.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(Color(0xFFE9EEF4))
                )

                content()
            }
        )
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String,
    blue: Boolean = false,
    green: Boolean = false
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
                        green -> Color(0xFFEAF9EE)
                        blue -> Color(0xFFEAF2FF)
                        else -> Color(0xFFF4F6F8)
                    },
                    RoundedCornerShape(16.dp)
                )
                .padding(horizontal = 14.dp, vertical = 8.dp)
        ) {
            Text(
                text = value,
                color = when {
                    green -> Color(0xFF4CAF50)
                    blue -> Color(0xFF2F91FF)
                    else -> Color(0xFF4B5563)
                },
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        }
    }

    Spacer(modifier = Modifier.height(4.dp))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(Color(0xFFE9EEF4))
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun EvidenceSection(items: List<String>) {
    SectionCard(
        icon = Icons.Outlined.CameraAlt,
        title = "Evidencias Fotográficas"
    ) {
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items.forEach { title ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth(0.48f)
                        .height(120.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE5E7EB))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                brush = Brush.verticalGradient(
                                    colors = listOf(Color(0xFFBFC7D4), Color(0xFF8F9DB1))
                                )
                            )
                            .padding(12.dp),
                        contentAlignment = Alignment.BottomStart
                    ) {
                        Text(
                            text = title,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
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
    background: Color,
    border: Color
) {
    SectionCard(
        icon = Icons.Outlined.Message,
        title = title
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(background, RoundedCornerShape(20.dp))
                .then(
                    if (border != Color.Transparent) Modifier.background(background, RoundedCornerShape(20.dp))
                    else Modifier
                )
                .padding(18.dp)
        ) {
            Text(
                text = text,
                color = Color(0xFF374151),
                fontSize = 15.sp,
                lineHeight = 24.sp
            )
        }
    }
}