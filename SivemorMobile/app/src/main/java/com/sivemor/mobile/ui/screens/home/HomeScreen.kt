package com.sivemor.mobile.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ExitToApp
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Dangerous
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.KeyboardArrowRight
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun HomeScreen(
    onGoVehicles: () -> Unit,
    onOpenHistory: (String) -> Unit,
    onOpenEvaluation: (String) -> Unit,
    vm: HomeViewModel = viewModel()
) {
    val bg = Color(0xFFF3F5F7)
    val navy = Color(0xFF061842)
    val blue = Color(0xFF1098E8)
    val blue2 = Color(0xFF214BFF)
    val textDark = Color(0xFF1F2A44)
    val textSoft = Color(0xFF6B7A90)
    val border = Color(0xFFE4E8EE)

    Scaffold(
        containerColor = bg,
        bottomBar = {
            BottomNavMock(
                modifier = Modifier.navigationBarsPadding()
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(bg)
                .padding(padding),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                TopHeader(
                    title = "SIVEMOR",
                    subtitle = "Técnico: ${vm.user?.email.orEmpty()}",
                    bgColor = navy
                )
            }

            item {
                Column(
                    modifier = Modifier.padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Card(
                        shape = RoundedCornerShape(22.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp)
                        ) {
                            Text(
                                text = "Técnico: ${vm.user?.name.orEmpty()}",
                                color = textDark,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Resumen de actividad",
                                color = Color(0xFF5D7395),
                                fontSize = 14.sp
                            )

                            Spacer(modifier = Modifier.height(20.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                SummaryCard(
                                    title = "TOTAL",
                                    value = vm.stats.total.toString(),
                                    container = Color(0xFFF4F6F8),
                                    titleColor = Color(0xFF6E85A3),
                                    valueColor = textDark,
                                    modifier = Modifier.weight(1f)
                                )
                                SummaryCard(
                                    title = "APROBADAS",
                                    value = vm.stats.approved.toString(),
                                    container = Color(0xFFEFF8F1),
                                    titleColor = Color(0xFF16A34A),
                                    valueColor = Color(0xFF15803D),
                                    modifier = Modifier.weight(1f)
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                SummaryCard(
                                    title = "REPROBADAS",
                                    value = vm.stats.rejected.toString(),
                                    container = Color(0xFFFDF0F0),
                                    titleColor = Color(0xFFFF2A2A),
                                    valueColor = Color(0xFFD60000),
                                    modifier = Modifier.weight(1f)
                                )
                                SummaryCard(
                                    title = "MULTAS",
                                    value = vm.stats.fines.toString(),
                                    container = Color(0xFFFCF5EC),
                                    titleColor = Color(0xFFFF6A00),
                                    valueColor = Color(0xFFD35400),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    NewVerificationButton(onClick = onGoVehicles)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Recientes",
                            color = textDark,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )

                        Text(
                            text = "Ver todas",
                            color = blue,
                            fontSize = 14.sp
                        )
                    }
                }
            }

            items(vm.recent) { item ->
                RecentEvaluationCard(
                    title = item.vehicleLabel,
                    subtitle = item.comments.ifBlank { "Sin observaciones" },
                    date = item.date,
                    approved = item.dictamen == "APROBADO",
                    hasWarning = item.multa,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .clickable {
                            onOpenHistory(item.vehicleId)
                        }
                )
            }

            item {
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

@Composable
private fun TopHeader(
    title: String,
    subtitle: String,
    bgColor: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(bgColor)
            .padding(horizontal = 16.dp, vertical = 18.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                color = Color(0xFFB8C4E0),
                fontSize = 13.sp
            )
        }

        Box(
            modifier = Modifier
                .size(34.dp)
                .clip(CircleShape)
                .background(Color.Transparent),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Outlined.ExitToApp,
                contentDescription = "Salir",
                tint = Color.White
            )
        }
    }
}

@Composable
private fun SummaryCard(
    title: String,
    value: String,
    container: Color,
    titleColor: Color,
    valueColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = container),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            Text(
                text = title,
                color = titleColor,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = value,
                color = valueColor,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
private fun NewVerificationButton(
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(
                brush = Brush.horizontalGradient(
                    listOf(
                        Color(0xFF0892D8),
                        Color(0xFF214BFF)
                    )
                )
            )
            .clickable { onClick() }
            .padding(horizontal = 18.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color.White.copy(alpha = 0.18f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Outlined.Add,
                contentDescription = "Agregar",
                tint = Color.White
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        Text(
            text = "Nueva Verificación",
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun RecentEvaluationCard(
    title: String,
    subtitle: String,
    date: String,
    approved: Boolean,
    hasWarning: Boolean,
    modifier: Modifier = Modifier
) {
    val textDark = Color(0xFF1F2A44)
    val textSoft = Color(0xFF667A98)
    val border = Color(0xFFE6EAF0)

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(
                        if (approved) Color(0xFFE5F8EA) else Color(0xFFFFECEC)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (approved) {
                        Icons.Outlined.CheckCircle
                    } else {
                        Icons.Outlined.Dangerous
                    },
                    contentDescription = "Estado",
                    tint = if (approved) Color(0xFF10B44A) else Color(0xFFFF2B2B),
                    modifier = Modifier.size(26.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    color = textDark,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = subtitle,
                    color = textSoft,
                    fontSize = 13.sp,
                    maxLines = 1
                )
            }

            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(Color(0xFFF1F4F8))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = date,
                        color = Color(0xFF7486A1),
                        fontSize = 12.sp
                    )
                }

                if (hasWarning) {
                    Icon(
                        imageVector = Icons.Outlined.WarningAmber,
                        contentDescription = "Multa",
                        tint = Color(0xFFFF7A00),
                        modifier = Modifier.size(18.dp)
                    )
                } else {
                    Spacer(modifier = Modifier.height(18.dp))
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Icon(
                imageVector = Icons.Outlined.KeyboardArrowRight,
                contentDescription = "Ver",
                tint = Color(0xFFB9C3D3),
                modifier = Modifier.size(24.dp)
            )
        }
    }
}

@Composable
private fun BottomNavMock(
    modifier: Modifier = Modifier
) {
    val active = Color(0xFF1197E3)
    val inactive = Color(0xFF97A7BE)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 12.dp, horizontal = 34.dp),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Outlined.GridView,
                contentDescription = "Inicio",
                tint = active,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Inicio",
                color = active,
                fontSize = 13.sp
            )
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Outlined.History,
                contentDescription = "Historial",
                tint = inactive,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Historial",
                color = inactive,
                fontSize = 13.sp
            )
        }
    }
}