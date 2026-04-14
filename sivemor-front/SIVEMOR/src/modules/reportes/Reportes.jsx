import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Admin from "../../components/Admin";
import ReportFilters from "./components/ReportFilters";
import RecentReportsList from "./components/RecentReportsList";
import ReportPreviewTable from "./components/ReportPreviewTable";
import GenerateReportSuccessModal from "./components/GenerateReportSuccessModal";
import GenerateReportErrorModal from "./components/GenerateReportErrorModal";
import AllReportsModal from "./components/AllReportsModal";
import { api } from "../../../server/api";

export default function Reportes() {
  const [filters, setFilters] = useState({
    tipo: "cliente",
    clienteId: "",
    regionId: "",
    notaId: "",
    tipoVerificacion: "",
    estadoDictamen: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    clientes: [],
    regiones: [],
    notas: [],
    tiposVerificacion: [],
    dictamenes: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [recentReports, setRecentReports] = useState(() => {
    const saved = localStorage.getItem("recentReports");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllReports, setShowAllReports] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
  try {
    const payload = await api.get("/reportes/opciones");

    console.log("Clientes desde backend:", payload.clientes);
    console.log("Regiones desde backend:", payload.regiones);
    console.log("Notas desde backend:", payload.notas);

    setFilterOptions({
      clientes: payload.clientes || [],
      regiones: payload.regiones || [],
      notas: payload.notas || [],
      tiposVerificacion: payload.tiposVerificacion || [],
      dictamenes: payload.dictamenes || [],
    });
  } catch (err) {
    console.error("Error al cargar opciones de reportes:", err);
    setError("No se pudieron cargar las opciones del reporte.");
  }
};

  const saveRecentReport = (reportName, currentFilters, finalData) => {
    const newRecent = {
      id: Date.now(),
      nombre: reportName,
      fecha: new Date().toLocaleString(),
      filters: currentFilters,
      data: finalData,
    };

    const updatedRecent = [newRecent, ...recentReports].slice(0, 8);
    setRecentReports(updatedRecent);
    localStorage.setItem("recentReports", JSON.stringify(updatedRecent));
  };

  const generateReport = async (formFilters, autoDownload = false) => {
  setError("");
  setSuccessMessage("");
  setReportData([]);

  try {
    setIsGenerating(true);

    const params = {
      tipo: formFilters.tipo || "cliente",
      clienteId: formFilters.clienteId || undefined,
      regionId: formFilters.regionId || undefined,
      notaId: formFilters.notaId || undefined,
      tipoVerificacion: formFilters.tipoVerificacion || undefined,
      estadoDictamen: formFilters.estadoDictamen || undefined,
      fechaInicio: formFilters.fechaInicio || undefined,
      fechaFin: formFilters.fechaFin || undefined,
    };

    console.log("Filtros enviados:", params);

    const payload = await api.get("/reportes/generar", { params });
    const finalData = Array.isArray(payload.data) ? payload.data : [];

    console.log("Respuesta reporte:", payload);
    console.log("Datos finales:", finalData);

    if (finalData.length === 0) {
      setError("No hay datos para generar el reporte.");
      return;
    }

    setFilters(params);
    setReportData(finalData);
    saveRecentReport(payload.reportName || "reporte.pdf", params, finalData);

    if (autoDownload) {
      await downloadPDF(finalData, params, payload.reportName || "reporte.pdf");
      return;
    }

    setSuccessMessage("Reporte generado correctamente.");
  } catch (err) {
    console.error("Error al generar reporte:", err);
    setError(err.message || "No se pudo generar el reporte.");
  } finally {
    setIsGenerating(false);
  }
};

  const downloadPDF = async (
    customData = reportData,
    customFilters = filters,
    fileName = "reporte_evaluaciones.pdf"
  ) => {
    setError("");
    setSuccessMessage("");

    if (!customData || customData.length === 0) {
      setError("Primero genera un reporte.");
      return;
    }

    try {
      setIsGenerating(true);

      const doc = new jsPDF("p", "mm", "a4");
      const now = new Date();
      const fechaGeneracion = now.toLocaleString("es-MX");
      const folioReporte = `RPT-${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
        now.getHours()
      ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const drawHeader = (pageNumber) => {
        doc.setFillColor(17, 79, 168);
        doc.rect(0, 0, pageWidth, 24, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("SIVEMOR", 8, 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Sistema de Verificación Morelos", 8, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("REPORTE DE EVALUACIONES VEHICULARES", pageWidth / 2, 10, {
          align: "center",
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `Región: ${customFilters.regionId || "Todas"} | Periodo: ${
            customFilters.fechaInicio || "-"
          } — ${customFilters.fechaFin || "-"}`,
          pageWidth / 2,
          15,
          { align: "center" }
        );

        doc.setFontSize(8);
        doc.text(`Folio de reporte: ${folioReporte}`, pageWidth - 8, 9, {
          align: "right",
        });
        doc.text(`Generado: ${fechaGeneracion}`, pageWidth - 8, 14, {
          align: "right",
        });

        doc.setFillColor(229, 160, 34);
        doc.rect(0, 24, pageWidth, 1.5, "F");

        doc.setDrawColor(60, 130, 200);
        doc.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10);

        doc.setTextColor(90, 90, 90);
        doc.setFontSize(7);
        doc.text(
          "SIVEMOR — Documento generado automáticamente. No requiere firma.",
          10,
          pageHeight - 6
        );
        doc.text(
          "Administrador: Daniel Lugo Valenzuela",
          pageWidth / 2,
          pageHeight - 6,
          { align: "center" }
        );
        doc.text(`Página ${pageNumber}`, pageWidth - 10, pageHeight - 6, {
          align: "right",
        });
      };

      drawHeader(1);

      autoTable(doc, {
        startY: 34,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineColor: [200, 210, 220],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [230, 238, 247],
          textColor: [30, 30, 30],
          fontStyle: "bold",
        },
        body: [
          [
            "Tipo de reporte:",
            customFilters.tipo || "cliente",
            "Región:",
            customFilters.regionId || "Todas",
          ],
          [
            "Periodo:",
            `${customFilters.fechaInicio || "-"} — ${customFilters.fechaFin || "-"}`,
            "Tipo verificación:",
            customFilters.tipoVerificacion || "Todos",
          ],
          [
            "Administrador:",
            "Daniel Lugo Valenzuela",
            "Folio de reporte:",
            folioReporte,
          ],
        ],
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35 },
          1: { cellWidth: 50 },
          2: { fontStyle: "bold", cellWidth: 35 },
          3: { cellWidth: 50 },
        },
        margin: { left: 14, right: 14 },
      });

      let currentY = doc.lastAutoTable.finalY + 8;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(28, 73, 129);
      doc.setFontSize(12);
      doc.text("Detalle de Evaluaciones por Cliente", 14, currentY);
      currentY += 6;

      const agrupadoPorCliente = customData.reduce((acc, item) => {
        const key = item.cliente || "Sin cliente";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      Object.entries(agrupadoPorCliente).forEach(([cliente, items]) => {
        const first = items[0];

        if (currentY > 235) {
          doc.addPage();
          drawHeader(doc.getNumberOfPages());
          currentY = 34;
        }

        const total = items.length;
        const aprobadas = items.filter(
          (i) => String(i.dictamen || "").toUpperCase() === "APROBADO"
        ).length;
        const reprobadas = items.filter(
          (i) => String(i.dictamen || "").toUpperCase() === "REPROBADO"
        ).length;
        const porcentaje = total > 0 ? ((aprobadas * 100) / total).toFixed(1) : "0.0";

        doc.setFillColor(33, 111, 195);
        doc.rect(14, currentY, 182, 8, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(cliente, 16, currentY + 5.5);
        doc.text(`${first.cedis || "-"} — ${first.region || "-"}`, 194, currentY + 5.5, {
          align: "right",
        });

        currentY += 8;

        autoTable(doc, {
          startY: currentY,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [220, 225, 230],
            lineWidth: 0.2,
          },
          body: [[
            `Total: ${total}`,
            `Aprobadas: ${aprobadas}`,
            `Reprobadas: ${reprobadas}`,
            `% Aprobación: ${porcentaje}%`,
          ]],
          columnStyles: {
            0: { textColor: [60, 60, 60], cellWidth: 45 },
            1: { textColor: [56, 142, 60], cellWidth: 45, fontStyle: "bold" },
            2: { textColor: [211, 47, 47], cellWidth: 45, fontStyle: "bold" },
            3: { textColor: [230, 126, 34], cellWidth: 47, fontStyle: "bold" },
          },
          margin: { left: 14, right: 14 },
        });

        currentY = doc.lastAutoTable.finalY + 4;

        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(
          `Placa: ${first.placa || "-"} | Serie: ${first.serie || "-"} | Tipo: ${first.tipoVehiculo || "-"}`,
          14,
          currentY + 4
        );

        currentY += 6;

        autoTable(doc, {
          startY: currentY,
          theme: "grid",
          head: [["Folio", "Materia", "Dictamen", "Fecha Verif.", "Técnico"]],
          body: items.map((item) => [
            item.folioVerificacion || "-",
            item.materia || "-",
            item.dictamen || "-",
            item.fecha || "-",
            item.tecnico || "-",
          ]),
          headStyles: {
            fillColor: [42, 134, 220],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 8,
            cellPadding: 2.5,
            lineColor: [220, 225, 230],
            lineWidth: 0.2,
          },
          didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 2) {
              const value = String(data.cell.raw || "").toUpperCase();
              if (value.includes("APROBADO")) {
                data.cell.styles.textColor = [56, 142, 60];
                data.cell.styles.fontStyle = "bold";
              }
              if (value.includes("REPROBADO")) {
                data.cell.styles.textColor = [211, 47, 47];
                data.cell.styles.fontStyle = "bold";
              }
            }
          },
          margin: { left: 14, right: 14 },
        });

        currentY = doc.lastAutoTable.finalY + 8;
      });

      doc.addPage();
      drawHeader(doc.getNumberOfPages());

      const totalVerificaciones = customData.length;
      const totalAprobadas = customData.filter(
        (item) => String(item.dictamen || "").toUpperCase() === "APROBADO"
      ).length;
      const totalReprobadas = customData.filter(
        (item) => String(item.dictamen || "").toUpperCase() === "REPROBADO"
      ).length;
      const porcentajeGlobal =
        totalVerificaciones > 0
          ? ((totalAprobadas * 100) / totalVerificaciones).toFixed(1)
          : "0.0";

      autoTable(doc, {
        startY: 44,
        theme: "grid",
        head: [["Indicador", "Valor", "Observación"]],
        body: [
          [
            "Total de verificaciones en el periodo",
            `${totalVerificaciones}`,
            "Todas las materias incluidas",
          ],
          [
            "Verificaciones aprobadas",
            `${totalAprobadas}`,
            `${porcentajeGlobal}% del total`,
          ],
          [
            "Verificaciones reprobadas",
            `${totalReprobadas}`,
            "Requieren seguimiento",
          ],
          [
            "Clientes atendidos",
            `${Object.keys(agrupadoPorCliente).length}`,
            "Con datos activos en el reporte",
          ],
          ["Generado por", "Daniel Lugo Valenzuela", "Administrador"],
          ["Fecha", fechaGeneracion, "Sistema SIVEMOR"],
        ],
        headStyles: {
          fillColor: [230, 238, 247],
          textColor: [20, 20, 20],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          lineColor: [220, 225, 230],
          lineWidth: 0.2,
        },
        margin: { left: 14, right: 14 },
      });

      doc.save(fileName);
      setSuccessMessage("PDF generado correctamente.");
    } catch (err) {
      console.error("Error al descargar PDF:", err);
      setError("Error al generar el PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadRecent = (report) => {
    downloadPDF(report.data, report.filters, report.nombre);
  };

  return (
    <Admin>
      <div>
        <h2 className="page-heading">Centro de Reportes</h2>
        <p className="page-title">Generación de informes ejecutivos y operativos</p>
      </div>

      <div className="reports-grid mt-4">
        <div className="report-form-card">
          <h3 className="section-title">
            <i className="bi bi-funnel text-primary"></i>
            Configuración del Reporte
          </h3>

          <ReportFilters
            onGenerate={generateReport}
            onDownload={downloadPDF}
            currentData={reportData}
            isGenerating={isGenerating}
            options={filterOptions}
          />
        </div>

        <div className="report-list-card">
          <RecentReportsList
            reports={recentReports}
            onDownload={handleDownloadRecent}
            onViewAll={() => setShowAllReports(true)}
          />
        </div>
      </div>

      {reportData.length > 0 && <ReportPreviewTable data={reportData} />}

      <GenerateReportSuccessModal message={successMessage} />
      <GenerateReportErrorModal message={error} />

      <AllReportsModal
        isOpen={showAllReports}
        reports={recentReports}
        onClose={() => setShowAllReports(false)}
        onDownload={handleDownloadRecent}
      />
    </Admin>
  );
}