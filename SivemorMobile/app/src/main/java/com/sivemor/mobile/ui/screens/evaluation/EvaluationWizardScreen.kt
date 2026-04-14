package com.sivemor.mobile.ui.screens.evaluation

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.sivemor.mobile.data.repository.AppRepository
import kotlinx.coroutines.delay
import com.sivemor.mobile.network.dto.EvaluacionRequestDTO
import java.io.File

// ── Palette ──
private val Navy1    = Color(0xFF0A2540)
private val Navy2    = Color(0xFF0E3260)
private val GreenOk  = Color(0xFF34A853)
private val BlueBtn  = Color(0xFF2D7DD2)
private val ErrorRed = Color(0xFFE53935)
private val PageBg   = Color(0xFFF0F4F8)
private val CardBg   = Color(0xFFFFFFFF)
private val LabelCol = Color(0xFF374151)
private val BorderC  = Color(0xFFE2E8F0)
private val HintCol  = Color(0xFF94A3B8)
private val GreenTxt = Color(0xFF16A34A)
private val AmberTxt = Color(0xFFD97706)

// ── Opciones ──
private val optsLucesPar   = listOf("Aprobadas", "Izquierda fundida", "Derecha fundida", "Ambas fundidas")
private val optsIndicad    = listOf("Aprobadas", "1 fundida", "2 fundidas", "3 fundidas")
private val optsFaro       = listOf("Aprobado", "Flojo", "Roto")
private val optsRines      = listOf("Aprobados", "Derecho roto/soldado", "Izquierdo roto/soldado", "Ambos rotos/soldados")
private val optsMasas      = listOf("Aprobadas", "Derecha con fuga", "Izquierda con fuga", "Ambas con fuga")
private val optsBirlosTuer = listOf("Aprobados", "Rotos o faltantes")
private val optsBrazo      = listOf("Aprobado", "Golpeado")
private val optsManijas    = listOf("Aprobadas", "1 rota", "2 rotas")
private val optsChavetas   = listOf("Aprobadas", "Faltan algunas")
private val optsCompresor  = listOf("Aprobado", "No corta", "Reprobado")
private val optsTanques    = listOf("Aprobado", "Reprobado")
private val optsHumoGob    = listOf("Aprobado", "Reprobado")
private val optsCajaDep    = listOf("Aprobada", "Fuga")
private val optsParabrisas = listOf("Aprobado", "Estrellado")
private val optsLimpia     = listOf("Aprobado", "Falta 1 pluma", "Faltan 2 plumas", "No funciona")
private val optsHuelgo     = listOf("Aprobado", "Reprobado")
private val optsEscape     = listOf("Aprobado", "Faltante", "Roto")

private val TOTAL_STEPS = 7

private enum class EvalSaveStatus { IDLE, SAVING, SUCCESS, ERROR }

// ── Data class del formulario ──
data class EvalFormState(
    var lucesGalibo: String = "Aprobadas",
    var lucesAltas: String = "Aprobadas",
    var lucesBajas: String = "Aprobadas",
    var lucesDemarcDelanteras: String = "Aprobadas",
    var lucesDemarcTraseras: String = "Aprobadas",
    var lucesIndicadoras: String = "Aprobadas",
    var faroIzquierdo: String = "Aprobado",
    var faroDerecho: String = "Aprobado",
    var lucesDirDelanteras: String = "Aprobadas",
    var lucesDirTraseras: String = "Aprobadas",
    var rinesDelanteros: String = "Aprobados",
    var rinesTraseros: String = "Aprobados",
    var masasDelanteras: String = "Aprobadas",
    var masasTraseras: String = "Aprobadas",
    var presionDelIzq: String = "",
    var presionDelDer: String = "",
    var presionTraIzq1: String = "",
    var presionTraIzq2: String = "",
    var presionTraDer1: String = "",
    var presionTraDer2: String = "",
    var profDelIzq: String = "",
    var profDelDer: String = "",
    var profTraIzq1: String = "",
    var profTraIzq2: String = "",
    var profTraDer1: String = "",
    var profTraDer2: String = "",
    var birlosDelIzq: String = "Aprobados",
    var birlosDelDer: String = "Aprobados",
    var birlosTraIzq: String = "Aprobados",
    var birlosTraDer: String = "Aprobados",
    var birlosDelIzqNum: Int = 0,
    var birlosDelDerNum: Int = 0,
    var birlosTraIzqNum: Int = 0,
    var birlosTraDerNum: Int = 0,
    var tuercasDelIzq: String = "Aprobados",
    var tuercasDelDer: String = "Aprobados",
    var tuercasTraIzq: String = "Aprobados",
    var tuercasTraDer: String = "Aprobados",
    var tuercasDelIzqNum: Int = 0,
    var tuercasDelDerNum: Int = 0,
    var tuercasTraIzqNum: Int = 0,
    var tuercasTraDerNum: Int = 0,
    var brazoPitman: String = "Aprobado",
    var manijasPuertas: String = "Aprobadas",
    var chavetas: String = "Aprobadas",
    var chavetasNum: Int = 0,
    var compresor: String = "Aprobado",
    var tanquesAire: String = "Aprobado",
    var tiempoCargaPsi: String = "",
    var tiempoCargaMin: String = "",
    var humo: String = "Aprobado",
    var gobernado: String = "Aprobado",
    var cajaDireccion: String = "Aprobada",
    var depositoAceite: String = "Aprobada",
    var parabrisas: String = "Aprobado",
    var limpiaparabrisas: String = "Aprobado",
    var huelgo: String = "Aprobado",
    var huelgoCuanto: String = "",
    var escape: String = "Aprobado",
    var comentarios: String = ""
)

@Composable
fun EvaluationWizardScreen(
    vehicleId: String,
    onBack: () -> Unit,
    onFinish: () -> Unit,
    vm: EvaluationViewModel = viewModel()
) {
    var currentStep by rememberSaveable { mutableStateOf(0) }
    var form by remember { mutableStateOf(EvalFormState()) }
    var photos by remember { mutableStateOf<List<Uri>>(emptyList()) }
    var showPhotoSheet by remember { mutableStateOf(false) }
    var showExitDialog by remember { mutableStateOf(false) }
    var saveStatus by remember { mutableStateOf(EvalSaveStatus.IDLE) }

    val context = LocalContext.current
    var pendingUri by remember { mutableStateOf<Uri?>(null) }

    val cameraLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { success ->
        if (success && pendingUri != null) {
            photos = photos + pendingUri!!
            // Guardar foto en el repositorio inmediatamente
            vm.addPhoto(pendingUri!!.toString())
            pendingUri = null
        }
    }

    fun takePhoto() {
        val file = File(context.cacheDir, "eval_${System.currentTimeMillis()}.jpg")
        val uri = FileProvider.getUriForFile(context, "${context.packageName}.provider", file)
        pendingUri = uri
        cameraLauncher.launch(uri)
        showPhotoSheet = false
    }

    val progress = (currentStep + 1).toFloat() / TOTAL_STEPS

    val stepTitles = listOf(
        "Luces", "Llantas", "Dirección y estructura",
        "Sistema de aire / frenos", "Motor y emisiones",
        "Otros componentes", "Evidencias fotográficas"
    )
    val stepIcons = listOf(
        Icons.Outlined.Lightbulb, Icons.Outlined.Circle, Icons.Outlined.Settings,
        Icons.Outlined.Air, Icons.Outlined.DirectionsCar, Icons.Outlined.Build,
        Icons.Outlined.PhotoCamera
    )

    Box(modifier = Modifier.fillMaxSize().background(PageBg)) {
        Column(modifier = Modifier.fillMaxSize()) {

            // ── Header ──
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Brush.verticalGradient(listOf(Navy1, Navy2)))
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = { showExitDialog = true }, modifier = Modifier.size(36.dp)) {
                        Icon(Icons.Outlined.ArrowBack, null, tint = Color.White)
                    }
                    Spacer(Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Evaluación Técnica", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                        Text("Vehículo: $vehicleId", color = Color(0xFF8EB8DC), fontSize = 12.sp)
                    }
                    Text(
                        "${((progress) * 100).toInt()}%",
                        color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold
                    )
                }

                Spacer(Modifier.height(12.dp))

                Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text("Sección ${currentStep + 1} de $TOTAL_STEPS", color = Color(0xFF8EB8DC), fontSize = 11.sp)
                }
                Spacer(Modifier.height(6.dp))
                Box(
                    modifier = Modifier.fillMaxWidth().height(6.dp)
                        .clip(RoundedCornerShape(3.dp)).background(Color.White.copy(alpha = 0.2f))
                ) {
                    Box(
                        modifier = Modifier.fillMaxWidth(progress).fillMaxHeight()
                            .clip(RoundedCornerShape(3.dp)).background(GreenOk)
                    )
                }
                Spacer(Modifier.height(8.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.fillMaxWidth()) {
                    repeat(TOTAL_STEPS) { i ->
                        Box(
                            modifier = Modifier.weight(1f).height(4.dp)
                                .clip(RoundedCornerShape(2.dp))
                                .background(
                                    when {
                                        i < currentStep  -> GreenOk
                                        i == currentStep -> Color.White
                                        else             -> Color.White.copy(alpha = 0.25f)
                                    }
                                )
                        )
                    }
                }
            }

            // ── Section title ──
            Column(
                modifier = Modifier.fillMaxWidth().background(CardBg)
                    .padding(horizontal = 20.dp, vertical = 14.dp)
            ) {
                Text(stepTitles[currentStep], color = Color(0xFF0D2137), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Text("Completa todos los campos de esta sección", color = Color(0xFF64748B), fontSize = 13.sp)
            }

            // ── Content ──
            Column(
                modifier = Modifier.weight(1f).verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        when (currentStep) {
                            0 -> StepLuces(form) { form = it }
                            1 -> StepLlantas(form) { form = it }
                            2 -> StepDireccion(form) { form = it }
                            3 -> StepAire(form) { form = it }
                            4 -> StepMotor(form) { form = it }
                            5 -> StepOtros(form) { form = it }
                            6 -> StepEvidencias(form, photos, { form = it }, { showPhotoSheet = true })
                        }
                    }
                }
                Spacer(Modifier.height(16.dp))
            }

            // ── Bottom bar ──
            Box(
                modifier = Modifier.fillMaxWidth().background(Color.White)
                    .navigationBarsPadding().padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    if (currentStep > 0) {
                        OutlinedButton(
                            onClick = { currentStep-- },
                            modifier = Modifier.weight(1f).height(52.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, BorderC)
                        ) {
                            Icon(Icons.Outlined.ArrowBack, null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Anterior", color = Color(0xFF374151), fontWeight = FontWeight.SemiBold)
                        }
                    }
                    Button(
                        onClick = {
                            if (currentStep < TOTAL_STEPS - 1) {
                                currentStep++
                            } else {
                                // Último paso: guardar
                                vm.comments = form.comentarios
                                saveStatus = EvalSaveStatus.SAVING
                            }
                        },
                        modifier = Modifier.weight(if (currentStep > 0) 1.2f else 1f).height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (currentStep == TOTAL_STEPS - 1) GreenOk else BlueBtn
                        )
                    ) {
                        if (currentStep == TOTAL_STEPS - 1) {
                            Icon(Icons.Outlined.Save, null, tint = Color.White, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Guardar Evaluación", color = Color.White, fontWeight = FontWeight.ExtraBold)
                        } else {
                            Text("Siguiente", color = Color.White, fontWeight = FontWeight.ExtraBold)
                            Spacer(Modifier.width(6.dp))
                            Icon(Icons.Outlined.ArrowForward, null, tint = Color.White, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }

        // ── FAB cámara (visible en todos los pasos) ──
        Box(
            modifier = Modifier.fillMaxSize().padding(end = 20.dp, bottom = 90.dp),
            contentAlignment = Alignment.BottomEnd
        ) {
            Box(
                modifier = Modifier.size(56.dp).background(BlueBtn, CircleShape)
                    .clickable { showPhotoSheet = true },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Outlined.PhotoCamera, null, tint = Color.White, modifier = Modifier.size(26.dp))
            }
            if (photos.isNotEmpty()) {
                Box(
                    modifier = Modifier.size(20.dp).background(ErrorRed, CircleShape).align(Alignment.TopEnd),
                    contentAlignment = Alignment.Center
                ) {
                    Text(photos.size.toString(), color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // ── Sheet de cámara ──
        if (showPhotoSheet) {
            Box(
                modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.5f))
                    .clickable { showPhotoSheet = false }
            ) {
                Card(
                    modifier = Modifier.fillMaxWidth().align(Alignment.BottomCenter)
                        .clickable(enabled = false) {},
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Capturar Evidencia", fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF0D2137))
                            Box(
                                modifier = Modifier.size(30.dp).background(Color(0xFFF1F5F9), CircleShape)
                                    .clickable { showPhotoSheet = false },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Outlined.Close, null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        Box(
                            modifier = Modifier.fillMaxWidth()
                                .background(BlueBtn.copy(alpha = 0.08f), RoundedCornerShape(12.dp))
                                .padding(14.dp)
                        ) {
                            Column {
                                Row {
                                    Text("Sección actual: ", color = Color(0xFF374151), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                    Text(stepTitles[currentStep], color = BlueBtn, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(Modifier.height(2.dp))
                                Text("${photos.size} foto(s) capturadas en total", color = Color(0xFF64748B), fontSize = 12.sp)
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        Button(
                            onClick = { takePhoto() },
                            modifier = Modifier.fillMaxWidth().height(52.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = BlueBtn)
                        ) {
                            Icon(Icons.Outlined.PhotoCamera, null, tint = Color.White, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Tomar Fotografía", color = Color.White, fontWeight = FontWeight.ExtraBold)
                        }

                        if (photos.isNotEmpty()) {
                            Spacer(Modifier.height(16.dp))
                            Text("Fotos capturadas", color = Color(0xFF374151), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Spacer(Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                photos.takeLast(4).forEach { uri ->
                                    AsyncImage(
                                        model = uri,
                                        contentDescription = null,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.size(72.dp).clip(RoundedCornerShape(10.dp))
                                            .border(1.dp, BorderC, RoundedCornerShape(10.dp))
                                    )
                                }
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                    }
                }
            }
        }

        // ── Diálogo salir ──
        if (showExitDialog) {
            AlertDialog(
                onDismissRequest = { showExitDialog = false },
                icon = { Icon(Icons.Outlined.Warning, null, tint = AmberTxt) },
                title = { Text("¿Salir de la evaluación?", fontWeight = FontWeight.ExtraBold) },
                text = { Text("Se perderán todos los datos capturados hasta ahora.", color = Color(0xFF64748B)) },
                confirmButton = {
                    Button(
                        onClick = { showExitDialog = false; onBack() },
                        colors = ButtonDefaults.buttonColors(containerColor = ErrorRed)
                    ) { Text("Salir", color = Color.White, fontWeight = FontWeight.Bold) }
                },
                dismissButton = {
                    OutlinedButton(onClick = { showExitDialog = false }) { Text("Continuar") }
                },
                shape = RoundedCornerShape(20.dp)
            )
        }



        // ── Modales de guardado ──
        when (saveStatus) {
            EvalSaveStatus.SAVING -> {
                EvalSavingModal(photoCount = photos.size)
                LaunchedEffect(Unit) {
                    delay(1600)

                    val request = EvaluacionRequestDTO(
                        idVerificacion = 1L,
                        idTecnico = 1L,

                        lucesGalibo = mapEstadoLuces(form.lucesGalibo),
                        lucesAltas = mapEstadoLuces(form.lucesAltas),
                        lucesBajas = mapEstadoLuces(form.lucesBajas),
                        lucesDemarcadorasDelanteras = mapEstadoLuces(form.lucesDemarcDelanteras),
                        lucesDemarcadorasTraseras = mapEstadoLuces(form.lucesDemarcTraseras),
                        lucesIndicadoras = mapLucesIndicadoras(form.lucesIndicadoras),
                        faroIzquierdo = mapEstadoFaros(form.faroIzquierdo),
                        faroDerecho = mapEstadoFaros(form.faroDerecho),
                        lucesDireccionalesDelanteras = mapEstadoLuces(form.lucesDirDelanteras),
                        lucesDireccionalesTraseras = mapEstadoLuces(form.lucesDirTraseras),

                        llantasRinesDelanteros = mapEstadoRines(form.rinesDelanteros),
                        llantasRinesTraseros = mapEstadoRines(form.rinesTraseros),
                        llantasMasasDelanteras = mapEstadoMasas(form.masasDelanteras),
                        llantasMasasTraseras = mapEstadoMasas(form.masasTraseras),

                        llantasPresionDelanteraIzquierda = form.presionDelIzq.toDoubleOrNull(),
                        llantasPresionDelanteraDerecha = form.presionDelDer.toDoubleOrNull(),
                        llantasPresionTraseraIzquierda1 = form.presionTraIzq1.toDoubleOrNull(),
                        llantasPresionTraseraIzquierda2 = form.presionTraIzq2.toDoubleOrNull(),
                        llantasPresionTraseraDerecha1 = form.presionTraDer1.toDoubleOrNull(),
                        llantasPresionTraseraDerecha2 = form.presionTraDer2.toDoubleOrNull(),

                        llantasProfundidadDelanteraIzquierda = form.profDelIzq.toDoubleOrNull(),
                        llantasProfundidadDelanteraDerecha = form.profDelDer.toDoubleOrNull(),
                        llantasProfundidadTraseraIzquierda1 = form.profTraIzq1.toDoubleOrNull(),
                        llantasProfundidadTraseraIzquierda2 = form.profTraIzq2.toDoubleOrNull(),
                        llantasProfundidadTraseraDerecha1 = form.profTraDer1.toDoubleOrNull(),
                        llantasProfundidadTraseraDerecha2 = form.profTraDer2.toDoubleOrNull(),

                        llantasBirlosDelanteraIzquierda = mapEstadoBirlos(form.birlosDelIzq),
                        llantasBirlosDelanteraDerecha = mapEstadoBirlos(form.birlosDelDer),
                        llantasBirlosTraseraIzquierda = mapEstadoBirlos(form.birlosTraIzq),
                        llantasBirlosTraseraDerecha = mapEstadoBirlos(form.birlosTraDer),

                        llantasBirlosDelanteraIzquierdaNum = form.birlosDelIzqNum,
                        llantasBirlosDelanteraDerechaNum = form.birlosDelDerNum,
                        llantasBirlosTraseraIzquierdaNum = form.birlosTraIzqNum,
                        llantasBirlosTraseraDerechaNum = form.birlosTraDerNum,

                        llantasTuercasDelanteraIzquierda = mapEstadoTuercas(form.tuercasDelIzq),
                        llantasTuercasDelanteraDerecha = mapEstadoTuercas(form.tuercasDelDer),
                        llantasTuercasTraseraIzquierda = mapEstadoTuercas(form.tuercasTraIzq),
                        llantasTuercasTraseraDerecha = mapEstadoTuercas(form.tuercasTraDer),

                        llantasTuercasDelanteraIzquierdaNum = form.tuercasDelIzqNum,
                        llantasTuercasDelanteraDerechaNum = form.tuercasDelDerNum,
                        llantasTuercasTraseraIzquierdaNum = form.tuercasTraIzqNum,
                        llantasTuercasTraseraDerechaNum = form.tuercasTraDerNum,

                        brazoPitman = mapEstadoBrazoPitman(form.brazoPitman),
                        manijasDePuertas = mapEstadoManijas(form.manijasPuertas),
                        chavetas = mapEstadoChavetas(form.chavetas),
                        chavetasNum = form.chavetasNum,

                        compresor = mapEstadoCompresor(form.compresor),
                        tanquesDeAire = mapEstadoTanqueAire(form.tanquesAire),
                        tiempoDeCargaPsi = form.tiempoCargaPsi.toDoubleOrNull(),
                        tiempoDeCargaTiempo = form.tiempoCargaMin.toDoubleOrNull(),

                        humo = mapDictamen(form.humo),
                        gobernado = mapDictamen(form.gobernado),

                        cajaDireccion = mapEstadoFuga(form.cajaDireccion),
                        depositoAceite = mapEstadoFuga(form.depositoAceite),
                        parabrisas = mapEstadoParabrisas(form.parabrisas),
                        limpiaparabrisas = mapEstadoLimpiaparabrisas(form.limpiaparabrisas),
                        huelgo = mapDictamen(form.huelgo),
                        huelgoCuanto = form.huelgoCuanto.toDoubleOrNull(),
                        escape = mapEstadoEscape(form.escape),

                        comentarios = form.comentarios,
                        evidencias = emptyList()
                    )

                    saveStatus = if (vm.save(request)) EvalSaveStatus.SUCCESS else EvalSaveStatus.ERROR
                }
            }
            EvalSaveStatus.SUCCESS -> {
                EvalResultModal(
                    icon = Icons.Outlined.CheckCircle, iconColor = GreenOk,
                    title = "¡Evaluación Guardada!",
                    message = "La verificación fue registrada con ${photos.size} evidencia(s).",
                    buttonText = "Continuar", buttonColor = GreenOk,
                    onAction = { saveStatus = EvalSaveStatus.IDLE; vm.reset(); onFinish() }
                )
            }
            EvalSaveStatus.ERROR -> {
                EvalResultModal(
                    icon = Icons.Outlined.ErrorOutline, iconColor = ErrorRed,
                    title = "Error al guardar",
                    message = "No se pudo registrar la evaluación.",
                    buttonText = "Reintentar", buttonColor = ErrorRed,
                    onAction = { saveStatus = EvalSaveStatus.IDLE }
                )
            }
            EvalSaveStatus.IDLE -> Unit
        }
    }
}

// ═══════════════════════════════════════════
// SECCIÓN 1 — LUCES
// ═══════════════════════════════════════════
@Composable
private fun StepLuces(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Luces Gálibo", form.lucesGalibo, optsLucesPar)       { onUpdate(form.copy(lucesGalibo = it)) }
    EvalDropdown("Luces Altas", form.lucesAltas, optsLucesPar)         { onUpdate(form.copy(lucesAltas = it)) }
    EvalDropdown("Luces Bajas", form.lucesBajas, optsLucesPar)         { onUpdate(form.copy(lucesBajas = it)) }
    EvalDropdown("Luces Demarcadoras Delanteras", form.lucesDemarcDelanteras, optsLucesPar) { onUpdate(form.copy(lucesDemarcDelanteras = it)) }
    EvalDropdown("Luces Demarcadoras Traseras", form.lucesDemarcTraseras, optsLucesPar)    { onUpdate(form.copy(lucesDemarcTraseras = it)) }
    EvalDropdown("Luces Indicadoras", form.lucesIndicadoras, optsIndicad)                  { onUpdate(form.copy(lucesIndicadoras = it)) }
    EvalDropdown("Faro Izquierdo", form.faroIzquierdo, optsFaro)       { onUpdate(form.copy(faroIzquierdo = it)) }
    EvalDropdown("Faro Derecho", form.faroDerecho, optsFaro)           { onUpdate(form.copy(faroDerecho = it)) }
    EvalDropdown("Luces Direccionales Delanteras", form.lucesDirDelanteras, optsLucesPar)  { onUpdate(form.copy(lucesDirDelanteras = it)) }
    EvalDropdown("Luces Direccionales Traseras", form.lucesDirTraseras, optsLucesPar)      { onUpdate(form.copy(lucesDirTraseras = it)) }
}

// ═══════════════════════════════════════════
// SECCIÓN 2 — LLANTAS
// ═══════════════════════════════════════════
@Composable
private fun StepLlantas(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Rines Delanteros", form.rinesDelanteros, optsRines)  { onUpdate(form.copy(rinesDelanteros = it)) }
    EvalDropdown("Rines Traseros", form.rinesTraseros, optsRines)      { onUpdate(form.copy(rinesTraseros = it)) }
    EvalDropdown("Masas Delanteras", form.masasDelanteras, optsMasas)  { onUpdate(form.copy(masasDelanteras = it)) }
    EvalDropdown("Masas Traseras", form.masasTraseras, optsMasas)      { onUpdate(form.copy(masasTraseras = it)) }

    SectionSubtitle("Presión (mín. 80 PSI)", Icons.Outlined.Speed)
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Delantera Izq.", form.presionDelIzq, "PSI", Modifier.weight(1f), isOk = form.presionDelIzq.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionDelIzq = it)) }
        EvalNumField("Delantera Der.", form.presionDelDer, "PSI", Modifier.weight(1f), isOk = form.presionDelDer.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionDelDer = it)) }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Trasera Izq. 1", form.presionTraIzq1, "PSI", Modifier.weight(1f), isOk = form.presionTraIzq1.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionTraIzq1 = it)) }
        EvalNumField("Trasera Izq. 2", form.presionTraIzq2, "PSI", Modifier.weight(1f), isOk = form.presionTraIzq2.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionTraIzq2 = it)) }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Trasera Der. 1", form.presionTraDer1, "PSI", Modifier.weight(1f), isOk = form.presionTraDer1.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionTraDer1 = it)) }
        EvalNumField("Trasera Der. 2", form.presionTraDer2, "PSI", Modifier.weight(1f), isOk = form.presionTraDer2.toFloatOrNull()?.let { it >= 80f } ?: null) { onUpdate(form.copy(presionTraDer2 = it)) }
    }

    SectionSubtitle("Profundidad (Del: 3.2mm | Tras: 1.6mm)", Icons.Outlined.LinearScale)
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Delantera Izq.", form.profDelIzq, "mm", Modifier.weight(1f), isOk = form.profDelIzq.toFloatOrNull()?.let { it >= 3.2f } ?: null) { onUpdate(form.copy(profDelIzq = it)) }
        EvalNumField("Delantera Der.", form.profDelDer, "mm", Modifier.weight(1f), isOk = form.profDelDer.toFloatOrNull()?.let { it >= 3.2f } ?: null) { onUpdate(form.copy(profDelDer = it)) }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Trasera Izq. 1", form.profTraIzq1, "mm", Modifier.weight(1f), isOk = form.profTraIzq1.toFloatOrNull()?.let { it >= 1.6f } ?: null) { onUpdate(form.copy(profTraIzq1 = it)) }
        EvalNumField("Trasera Izq. 2", form.profTraIzq2, "mm", Modifier.weight(1f), isOk = form.profTraIzq2.toFloatOrNull()?.let { it >= 1.6f } ?: null) { onUpdate(form.copy(profTraIzq2 = it)) }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        EvalNumField("Trasera Der. 1", form.profTraDer1, "mm", Modifier.weight(1f), isOk = form.profTraDer1.toFloatOrNull()?.let { it >= 1.6f } ?: null) { onUpdate(form.copy(profTraDer1 = it)) }
        EvalNumField("Trasera Der. 2", form.profTraDer2, "mm", Modifier.weight(1f), isOk = form.profTraDer2.toFloatOrNull()?.let { it >= 1.6f } ?: null) { onUpdate(form.copy(profTraDer2 = it)) }
    }

    SectionSubtitle("Birlos (8 totales, máx. 2 faltantes)", Icons.Outlined.RadioButtonUnchecked)
    TireNutWidget("Delantera Izq.", form.birlosDelIzqNum, form.birlosDelIzq) { n -> onUpdate(form.copy(birlosDelIzqNum = n, birlosDelIzq = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Delantera Der.", form.birlosDelDerNum, form.birlosDelDer) { n -> onUpdate(form.copy(birlosDelDerNum = n, birlosDelDer = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Trasera Izq.", form.birlosTraIzqNum, form.birlosTraIzq) { n -> onUpdate(form.copy(birlosTraIzqNum = n, birlosTraIzq = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Trasera Der.", form.birlosTraDerNum, form.birlosTraDer) { n -> onUpdate(form.copy(birlosTraDerNum = n, birlosTraDer = if (n > 2) "Rotos o faltantes" else "Aprobados")) }

    SectionSubtitle("Tuercas (8 totales, máx. 2 faltantes)", Icons.Outlined.RadioButtonUnchecked)
    TireNutWidget("Delantera Izq.", form.tuercasDelIzqNum, form.tuercasDelIzq) { n -> onUpdate(form.copy(tuercasDelIzqNum = n, tuercasDelIzq = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Delantera Der.", form.tuercasDelDerNum, form.tuercasDelDer) { n -> onUpdate(form.copy(tuercasDelDerNum = n, tuercasDelDer = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Trasera Izq.", form.tuercasTraIzqNum, form.tuercasTraIzq) { n -> onUpdate(form.copy(tuercasTraIzqNum = n, tuercasTraIzq = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
    TireNutWidget("Trasera Der.", form.tuercasTraDerNum, form.tuercasTraDer) { n -> onUpdate(form.copy(tuercasTraDerNum = n, tuercasTraDer = if (n > 2) "Rotos o faltantes" else "Aprobados")) }
}

// ═══════════════════════════════════════════
// SECCIÓN 3 — DIRECCIÓN
// ═══════════════════════════════════════════
@Composable
private fun StepDireccion(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Brazo Pitman", form.brazoPitman, optsBrazo)            { onUpdate(form.copy(brazoPitman = it)) }
    EvalDropdown("Manijas de Puertas", form.manijasPuertas, optsManijas) { onUpdate(form.copy(manijasPuertas = it)) }
    EvalDropdown("Chavetas", form.chavetas, optsChavetas)                { onUpdate(form.copy(chavetas = it)) }
    if (form.chavetas != "Aprobadas") {
        EvalNumField("Número de chavetas faltantes", form.chavetasNum.toString(), "pzas", isOk = null) { onUpdate(form.copy(chavetasNum = it.toIntOrNull() ?: 0)) }
    }
}

// ═══════════════════════════════════════════
// SECCIÓN 4 — AIRE / FRENOS
// ═══════════════════════════════════════════
@Composable
private fun StepAire(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Compresor", form.compresor, optsCompresor)       { onUpdate(form.copy(compresor = it)) }
    EvalDropdown("Tanques de Aire", form.tanquesAire, optsTanques) { onUpdate(form.copy(tanquesAire = it)) }
    EvalNumField("Tiempo de Carga - PSI (70-120 PSI)", form.tiempoCargaPsi, "PSI", isOk = form.tiempoCargaPsi.toFloatOrNull()?.let { it > 70f && it < 120f } ?: null) { onUpdate(form.copy(tiempoCargaPsi = it)) }
    EvalNumField("Tiempo de Carga - Minutos (< 120 min)", form.tiempoCargaMin, "min", isOk = form.tiempoCargaMin.toFloatOrNull()?.let { it < 120f } ?: null) { onUpdate(form.copy(tiempoCargaMin = it)) }
}

// ═══════════════════════════════════════════
// SECCIÓN 5 — MOTOR
// ═══════════════════════════════════════════
@Composable
private fun StepMotor(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Humo", form.humo, optsHumoGob)         { onUpdate(form.copy(humo = it)) }
    EvalDropdown("Gobernado", form.gobernado, optsHumoGob) { onUpdate(form.copy(gobernado = it)) }
}

// ═══════════════════════════════════════════
// SECCIÓN 6 — OTROS
// ═══════════════════════════════════════════
@Composable
private fun StepOtros(form: EvalFormState, onUpdate: (EvalFormState) -> Unit) {
    EvalDropdown("Caja de Dirección", form.cajaDireccion, optsCajaDep)     { onUpdate(form.copy(cajaDireccion = it)) }
    EvalDropdown("Depósito de Aceite", form.depositoAceite, optsCajaDep)   { onUpdate(form.copy(depositoAceite = it)) }
    EvalDropdown("Parabrisas", form.parabrisas, optsParabrisas)            { onUpdate(form.copy(parabrisas = it)) }
    EvalDropdown("Limpiaparabrisas", form.limpiaparabrisas, optsLimpia)    { onUpdate(form.copy(limpiaparabrisas = it)) }
    EvalDropdown("Huelgo", form.huelgo, optsHuelgo)                        { onUpdate(form.copy(huelgo = it)) }
    if (form.huelgo == "Reprobado") {
        EvalNumField("Huelgo - medida", form.huelgoCuanto, "mm", isOk = null) { onUpdate(form.copy(huelgoCuanto = it)) }
    }
    EvalDropdown("Escape", form.escape, optsEscape) { onUpdate(form.copy(escape = it)) }
}

// ═══════════════════════════════════════════
// SECCIÓN 7 — EVIDENCIAS
// ═══════════════════════════════════════════
@Composable
private fun StepEvidencias(
    form: EvalFormState,
    photos: List<Uri>,
    onUpdate: (EvalFormState) -> Unit,
    onOpenCamera: () -> Unit
) {
    if (photos.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF8FAFC), RoundedCornerShape(14.dp))
                .border(1.dp, BorderC, RoundedCornerShape(14.dp))
                .padding(vertical = 32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Outlined.PhotoCamera, null, tint = Color(0xFFCBD5E1), modifier = Modifier.size(40.dp))
                Spacer(Modifier.height(8.dp))
                Text("No has capturado fotografías aún", color = Color(0xFF94A3B8), fontSize = 14.sp, fontWeight = FontWeight.Medium)
                Spacer(Modifier.height(4.dp))
                Text("Usa el botón de cámara flotante\npara agregar evidencias", color = Color(0xFFCBD5E1), fontSize = 12.sp, textAlign = TextAlign.Center)
            }
        }
    } else {
        Text("${photos.size} fotografía(s) capturadas", color = GreenOk, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))

        // Grid completo de todas las fotos (no limitado a 5)
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            photos.chunked(3).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEach { uri ->
                        AsyncImage(
                            model = uri,
                            contentDescription = "Evidencia ${photos.indexOf(uri) + 1}",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .weight(1f)
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .border(1.dp, BorderC, RoundedCornerShape(12.dp))
                        )
                    }
                    repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
                }
            }
        }

        Spacer(Modifier.height(8.dp))
        OutlinedButton(
            onClick = onOpenCamera,
            modifier = Modifier.fillMaxWidth().height(46.dp),
            shape = RoundedCornerShape(12.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, BlueBtn)
        ) {
            Icon(Icons.Outlined.AddAPhoto, null, tint = BlueBtn, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Agregar más fotos", color = BlueBtn, fontWeight = FontWeight.SemiBold)
        }
    }

    Spacer(Modifier.height(4.dp))
    Text("Comentarios adicionales", color = LabelCol, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
    Spacer(Modifier.height(6.dp))
    OutlinedTextField(
        value = form.comentarios,
        onValueChange = { onUpdate(form.copy(comentarios = it)) },
        modifier = Modifier.fillMaxWidth().height(120.dp),
        shape = RoundedCornerShape(14.dp),
        placeholder = { Text("Escribe aquí cualquier observación adicional...", color = HintCol, fontSize = 13.sp) },
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = BlueBtn, unfocusedBorderColor = BorderC,
            focusedContainerColor = Color.White, unfocusedContainerColor = Color(0xFFF8FAFC),
            focusedTextColor = Color(0xFF0D2137), unfocusedTextColor = Color(0xFF0D2137)
        )
    )
}

// ═══════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ═══════════════════════════════════════════

@Composable
private fun SectionSubtitle(text: String, icon: ImageVector) {
    Box(
        modifier = Modifier.fillMaxWidth().background(Navy1.copy(alpha = 0.05f), RoundedCornerShape(10.dp))
            .padding(horizontal = 12.dp, vertical = 10.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = Navy1, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(8.dp))
            Text(text, color = Navy1, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold)
        }
    }
}

@Composable
private fun EvalDropdown(label: String, selected: String, options: List<String>, onSelect: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    val isOk = selected.lowercase().let { it.contains("aprobado") }
    Column {
        Text(label, color = LabelCol, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(5.dp))
        Box {
            Row(
                modifier = Modifier.fillMaxWidth().height(50.dp)
                    .background(Color.White, RoundedCornerShape(12.dp))
                    .border(1.5.dp, if (isOk) GreenOk.copy(alpha = 0.5f) else ErrorRed.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .clickable { expanded = true }.padding(horizontal = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(if (isOk) Icons.Outlined.CheckCircle else Icons.Outlined.Cancel, null,
                    tint = if (isOk) GreenOk else ErrorRed, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text(selected, color = if (isOk) GreenTxt else ErrorRed, fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                Icon(if (expanded) Icons.Outlined.KeyboardArrowUp else Icons.Outlined.KeyboardArrowDown,
                    null, tint = Color(0xFF94A3B8), modifier = Modifier.size(20.dp))
            }
            DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false },
                modifier = Modifier.background(Color(0xFF2A3F5C))) {
                options.forEach { option ->
                    DropdownMenuItem(
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                if (option == selected) { Icon(Icons.Outlined.Check, null, tint = Color.White, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(8.dp)) }
                                else { Spacer(Modifier.width(24.dp)) }
                                Text(option, color = Color.White, fontSize = 14.sp, fontWeight = if (option == selected) FontWeight.Bold else FontWeight.Normal)
                            }
                        },
                        onClick = { onSelect(option); expanded = false },
                        modifier = Modifier.background(if (option == selected) Color.White.copy(alpha = 0.1f) else Color.Transparent)
                    )
                }
            }
        }
    }
}

@Composable
private fun EvalNumField(label: String, value: String, suffix: String, modifier: Modifier = Modifier, isOk: Boolean?, onValueChange: (String) -> Unit) {
    val borderColor = when (isOk) { true -> GreenOk.copy(alpha = 0.5f); false -> ErrorRed.copy(alpha = 0.5f); null -> BorderC }
    Column(modifier = modifier) {
        Text(label, color = LabelCol, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, maxLines = 1)
        Spacer(Modifier.height(5.dp))
        OutlinedTextField(
            value = value, onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
            shape = RoundedCornerShape(12.dp),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            trailingIcon = { Text(suffix, color = HintCol, fontSize = 12.sp, modifier = Modifier.padding(end = 8.dp)) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = borderColor, unfocusedBorderColor = borderColor,
                focusedContainerColor = Color.White, unfocusedContainerColor = Color(0xFFF8FAFC),
                focusedTextColor = Color(0xFF0D2137), unfocusedTextColor = Color(0xFF0D2137)
            )
        )
        if (isOk == false && value.isNotEmpty()) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 3.dp)) {
                Icon(Icons.Outlined.Warning, null, tint = ErrorRed, modifier = Modifier.size(12.dp))
                Spacer(Modifier.width(3.dp))
                Text("Valor fuera de rango", color = ErrorRed, fontSize = 10.sp)
            }
        }
    }
}

@Composable
private fun TireNutWidget(label: String, count: Int, status: String, onCountChange: (Int) -> Unit) {
    val isOk = count <= 2
    val totalNuts = 8
    Column(
        modifier = Modifier.fillMaxWidth()
            .background(if (isOk) GreenOk.copy(alpha = 0.05f) else ErrorRed.copy(alpha = 0.05f), RoundedCornerShape(14.dp))
            .border(1.dp, if (isOk) GreenOk.copy(alpha = 0.3f) else ErrorRed.copy(alpha = 0.3f), RoundedCornerShape(14.dp))
            .padding(14.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text(label, color = LabelCol, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            Box(modifier = Modifier.background(if (isOk) GreenOk.copy(alpha = 0.15f) else ErrorRed.copy(alpha = 0.15f), RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp)) {
                Text(if (isOk) "✓ Aprobado" else "✗ Reprobado", color = if (isOk) GreenTxt else ErrorRed, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }
        Spacer(Modifier.height(10.dp))
        Box(modifier = Modifier.size(130.dp).align(Alignment.CenterHorizontally).background(Color(0xFF1E293B), CircleShape), contentAlignment = Alignment.Center) {
            Box(modifier = Modifier.size(110.dp).background(Color(0xFF374151), CircleShape), contentAlignment = Alignment.Center) {
                Box(modifier = Modifier.size(50.dp).background(Color(0xFF94A3B8), CircleShape))
            }
            val positions = listOf(Pair(0f, -52f), Pair(37f, -37f), Pair(52f, 0f), Pair(37f, 37f), Pair(0f, 52f), Pair(-37f, 37f), Pair(-52f, 0f), Pair(-37f, -37f))
            positions.forEachIndexed { index, (x, y) ->
                val isDamaged = index < count
                Box(modifier = Modifier.offset(x = x.dp, y = y.dp).size(16.dp).background(if (isDamaged) ErrorRed else GreenOk, CircleShape).border(1.5.dp, Color.White, CircleShape), contentAlignment = Alignment.Center) {
                    if (isDamaged) Icon(Icons.Outlined.Close, null, tint = Color.White, modifier = Modifier.size(8.dp))
                    else Icon(Icons.Outlined.Check, null, tint = Color.White, modifier = Modifier.size(8.dp))
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
            Text("${totalNuts - count} OK", color = GreenTxt, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.width(12.dp))
            Box(Modifier.width(1.dp).height(16.dp).background(BorderC))
            Spacer(Modifier.width(12.dp))
            Text("$count Dañados", color = if (count > 0) ErrorRed else Color(0xFF94A3B8), fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(10.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { if (count > 0) onCountChange(count - 1) }, modifier = Modifier.size(40.dp).background(Color(0xFFF1F5F9), CircleShape).border(1.dp, BorderC, CircleShape)) {
                Icon(Icons.Outlined.Remove, null, tint = Color(0xFF374151), modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.width(20.dp))
            Text("$count faltantes", color = LabelCol, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.width(20.dp))
            IconButton(onClick = { if (count < totalNuts) onCountChange(count + 1) }, modifier = Modifier.size(40.dp).background(Color(0xFFF1F5F9), CircleShape).border(1.dp, BorderC, CircleShape)) {
                Icon(Icons.Outlined.Add, null, tint = Color(0xFF374151), modifier = Modifier.size(18.dp))
            }
        }
    }
}

// ═══════════════════════════════════════════
// MODALES DE GUARDADO
// ═══════════════════════════════════════════

@Composable
private fun EvalSavingModal(photoCount: Int) {
    val infiniteTransition = rememberInfiniteTransition(label = "spin")
    val angle by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(900, easing = LinearEasing)), label = "spin"
    )
    Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.4f)), contentAlignment = Alignment.Center) {
        Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 36.dp), shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(16.dp)) {
            Column(modifier = Modifier.padding(36.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(modifier = Modifier.size(72.dp).background(Color(0xFFE8F5FF), CircleShape), contentAlignment = Alignment.Center) {
                    Icon(Icons.Outlined.Sync, null, tint = BlueBtn, modifier = Modifier.size(36.dp).rotate(angle))
                }
                Spacer(Modifier.height(20.dp))
                Text("Guardando Evaluación", color = Color(0xFF1E293B), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(8.dp))
                Text("Registrando verificación${if (photoCount > 0) " y $photoCount foto(s)..." else "..."}",
                    color = Color(0xFF64748B), fontSize = 14.sp, lineHeight = 20.sp)
                Spacer(Modifier.height(22.dp))
                LinearProgressIndicator(modifier = Modifier.fillMaxWidth(), color = BlueBtn, trackColor = Color(0xFFDCEAF9))
            }
        }
    }
}

@Composable
private fun EvalResultModal(icon: ImageVector, iconColor: Color, title: String, message: String, buttonText: String, buttonColor: Color, onAction: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.4f)), contentAlignment = Alignment.Center) {
        Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 30.dp), shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(16.dp)) {
            Column(modifier = Modifier.padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(modifier = Modifier.size(80.dp).background(iconColor.copy(alpha = 0.12f), CircleShape), contentAlignment = Alignment.Center) {
                    Icon(icon, null, tint = iconColor, modifier = Modifier.size(44.dp))
                }
                Spacer(Modifier.height(22.dp))
                Text(title, color = Color(0xFF1E293B), fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(10.dp))
                Text(message, color = Color(0xFF64748B), fontSize = 15.sp, lineHeight = 22.sp)
                Spacer(Modifier.height(30.dp))
                Button(onClick = onAction, modifier = Modifier.fillMaxWidth().height(56.dp), shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = buttonColor)) {
                    Text(buttonText, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                }
            }
        }
    }


}

private fun mapEstadoLuces(value: String): String = when (value) {
    "Aprobadas" -> "APROBADAS"
    "Izquierda fundida" -> "IZQUIERDA_FUNDIDA"
    "Derecha fundida" -> "DERECHA_FUNDIDA"
    "Ambas fundidas" -> "AMBAS_FUNDIDAS"
    else -> "APROBADAS"
}

private fun mapLucesIndicadoras(value: String): String = when (value) {
    "Aprobadas" -> "APROBADAS"
    "1 fundida" -> "UNA_FUNDIDA"
    "2 fundidas" -> "DOS_FUNDIDAS"
    "3 fundidas" -> "TRES_FUNDIDAS"
    else -> "APROBADAS"
}

private fun mapEstadoFaros(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Flojo" -> "FLOJO"
    "Roto" -> "ROTO"
    else -> "APROBADO"
}

private fun mapEstadoRines(value: String): String = when (value) {
    "Aprobados" -> "APROBADOS"
    "Derecho roto/soldado" -> "DERECHO_ROTO_O_SOLDADO"
    "Izquierdo roto/soldado" -> "IZQUIERDO_ROTO_O_SOLDADO"
    "Ambos rotos/soldados" -> "AMBOS_ROTOS_O_SOLDADOS"
    else -> "APROBADOS"
}

private fun mapEstadoMasas(value: String): String = when (value) {
    "Aprobadas" -> "APROBADAS"
    "Derecha con fuga" -> "DERECHA_CON_FUGA"
    "Izquierda con fuga" -> "IZQUIERDA_CON_FUGA"
    "Ambas con fuga" -> "AMBAS_CON_FUGA"
    else -> "APROBADAS"
}

private fun mapEstadoBirlos(value: String): String = when (value) {
    "Aprobados" -> "APROBADOS"
    "Rotos o faltantes" -> "ROTOS_O_FALTANTES"
    else -> "APROBADOS"
}

private fun mapEstadoTuercas(value: String): String = when (value) {
    "Aprobados" -> "APROBADAS"
    "Rotos o faltantes" -> "ROTAS_O_FALTANTES"
    else -> "APROBADAS"
}

private fun mapEstadoBrazoPitman(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Golpeado" -> "GOLPEADO"
    else -> "APROBADO"
}

private fun mapEstadoManijas(value: String): String = when (value) {
    "Aprobadas" -> "APROBADAS"
    "1 rota" -> "UNA_ROTA"
    "2 rotas" -> "DOS_ROTAS"
    else -> "APROBADAS"
}

private fun mapEstadoChavetas(value: String): String = when (value) {
    "Aprobadas" -> "APROBADAS"
    "Faltan algunas" -> "FALTAN"
    else -> "APROBADAS"
}

private fun mapEstadoCompresor(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "No corta" -> "NO_CORTA"
    "Reprobado" -> "REPROBADO"
    else -> "APROBADO"
}

private fun mapEstadoTanqueAire(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Reprobado" -> "REPROBADO"
    else -> "APROBADO"
}

private fun mapDictamen(value: String): String = when (value) {
    "Aprobado", "Aprobada", "Aprobadas", "Aprobados" -> "APROBADO"
    "Reprobado", "Reprobada" -> "REPROBADO"
    else -> "APROBADO"
}

private fun mapEstadoFuga(value: String): String = when (value) {
    "Aprobada", "Aprobado" -> "APROBADA"
    "Fuga" -> "FUGA"
    else -> "APROBADA"
}

private fun mapEstadoParabrisas(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Estrellado" -> "ESTRELLADO"
    else -> "APROBADO"
}

private fun mapEstadoLimpiaparabrisas(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Falta 1 pluma" -> "FALTA_1_PLUMA"
    "Faltan 2 plumas" -> "FALTAN_2_PLUMAS"
    "No funciona" -> "NO_FUNCIONA"
    else -> "APROBADO"
}

private fun mapEstadoEscape(value: String): String = when (value) {
    "Aprobado" -> "APROBADO"
    "Faltante" -> "FALTANTE"
    "Roto" -> "ROTO"
    else -> "APROBADO"
}