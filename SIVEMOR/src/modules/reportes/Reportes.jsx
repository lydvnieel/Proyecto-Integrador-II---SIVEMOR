import { useState } from "react";
import { jsPDF } from "jspdf";
import Admin from "../../components/Admin";
import ReportFilters from "./components/ReportFilters";
import RecentReportsList from "./components/RecentReportsList";
import ReportPreviewTable from "./components/ReportPreviewTable";
import GenerateReportSuccessModal from "./components/GenerateReportSuccessModal";
import GenerateReportErrorModal from "./components/GenerateReportErrorModal";

export default function Reportes() {
  const [filters, setFilters] = useState({
    tipo: "cliente",
    cliente: "",
    region: "",
    nota: "",
    tipoVerificacion: "",
    estadoDictamen: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [recentReports, setRecentReports] = useState(() => {
    const saved = localStorage.getItem("recentReports");
    return saved ? JSON.parse(saved) : [];
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const data = JSON.parse(localStorage.getItem("evaluaciones")) || [];

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toUpperCase();

  const getEvaluationDate = (item) =>
    item.fecha ||
    item.fechaEvaluacion ||
    item.fecha_verificacion ||
    item.createdAt ||
    "";

  const generateReport = (formFilters) => {
    setError("");
    setSuccessMessage("");
    setReportData([]);

    const currentFilters = {
      tipo: formFilters.tipo || "cliente",
      cliente: (formFilters.cliente || "").trim(),
      region: (formFilters.region || "").trim(),
      nota: (formFilters.nota || "").trim(),
      tipoVerificacion: (formFilters.tipoVerificacion || "").trim(),
      estadoDictamen: (formFilters.estadoDictamen || "").trim(),
      fechaInicio: formFilters.fechaInicio || "",
      fechaFin: formFilters.fechaFin || "",
    };

    if (currentFilters.tipo === "cliente" && !currentFilters.region) {
      setError("La región es obligatoria para el reporte por cliente.");
      return;
    }

    if (currentFilters.tipo === "region" && !currentFilters.cliente) {
      setError("El cliente es obligatorio para el reporte por región.");
      return;
    }

    if (currentFilters.tipo === "nota" && !currentFilters.region) {
      setError("La región es obligatoria para el reporte por nota.");
      return;
    }

    const filtered = data.filter((item) => {
      const itemRegion = String(item.region || "").trim();
      const itemCliente = String(item.cliente || "").trim();
      const itemNota = String(item.nota || "").trim();
      const itemTipoVerificacion = String(item.tipoVerificacion || "").trim();
      const itemDictamen = normalizeText(item.dictamen);
      const itemFecha = String(getEvaluationDate(item)).slice(0, 10);

      const matchRegion = currentFilters.region
        ? itemRegion.toLowerCase() === currentFilters.region.toLowerCase()
        : true;

      const matchCliente = currentFilters.cliente
        ? itemCliente.toLowerCase() === currentFilters.cliente.toLowerCase()
        : true;

      const matchNota = currentFilters.nota
        ? itemNota.toLowerCase().includes(currentFilters.nota.toLowerCase())
        : true;

      const matchTipoVerificacion = currentFilters.tipoVerificacion
        ? itemTipoVerificacion.toLowerCase() ===
          currentFilters.tipoVerificacion.toLowerCase()
        : true;

      const matchDictamen = currentFilters.estadoDictamen
        ? itemDictamen === normalizeText(currentFilters.estadoDictamen)
        : true;

      const matchFechaInicio = currentFilters.fechaInicio
        ? itemFecha >= currentFilters.fechaInicio
        : true;

      const matchFechaFin = currentFilters.fechaFin
        ? itemFecha <= currentFilters.fechaFin
        : true;

      return (
        matchRegion &&
        matchCliente &&
        matchNota &&
        matchTipoVerificacion &&
        matchDictamen &&
        matchFechaInicio &&
        matchFechaFin
      );
    });

    if (filtered.length === 0) {
      setError("No hay datos para generar el reporte.");
      return;
    }

    const grouped = {};

    filtered.forEach((item) => {
      let key = "";

      if (currentFilters.tipo === "cliente") {
        key = item.cliente || "SIN CLIENTE";
      } else if (currentFilters.tipo === "region") {
        key = item.region || "SIN REGIÓN";
      } else {
        key = item.nota || "SIN NOTA";
      }

      if (!grouped[key]) {
        grouped[key] = {
          agrupacion: key,
          region: item.region || "-",
          cliente: item.cliente || "-",
          vehiculo:
            item.vehiculo ||
            item.placa ||
            item.unidad ||
            item.numeroEconomico ||
            "-",
          numeroVerificaciones: 0,
          aprobadas: 0,
          reprobadas: 0,
        };
      }

      grouped[key].numeroVerificaciones += 1;

      if (normalizeText(item.dictamen) === "APROBADO") {
        grouped[key].aprobadas += 1;
      } else {
        grouped[key].reprobadas += 1;
      }
    });

    const finalData = Object.values(grouped).map((group) => ({
      ...group,
      porcentajeAprobacion:
        group.numeroVerificaciones > 0
          ? ((group.aprobadas / group.numeroVerificaciones) * 100).toFixed(2)
          : "0.00",
    }));

    setFilters(currentFilters);
    setReportData(finalData);

    const reportName = `Reporte_${currentFilters.tipo}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

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

    setSuccessMessage("Reporte generado correctamente.");
  };

  const downloadPDF = async (
    customData = reportData,
    customFilters = filters,
    fileName = "reporte_evaluaciones.pdf",
  ) => {
    setError("");
    setSuccessMessage("");

    if (!customData || customData.length === 0) {
      setError("Primero genera un reporte.");
      return;
    }

    try {
      setIsGenerating(true);

      // 🔥 Simula carga (puedes quitarlo si no quieres delay)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("REPORTE DE EVALUACIONES", 14, 16);

      doc.setFontSize(10);
      doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 24);

      let y = 40;

      customData.forEach((row) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }

        doc.text(`${row.agrupacion}`, 14, y);
        y += 6;
        doc.text(`Cliente: ${row.cliente}`, 18, y);
        y += 6;
        doc.text(`Total: ${row.numeroVerificaciones}`, 18, y);
        y += 6;
        doc.text(`%: ${row.porcentajeAprobacion}%`, 18, y);
        y += 10;
      });

      doc.save(fileName);

      setSuccessMessage("PDF generado correctamente.");
    } catch (err) {
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
        <p className="page-title">
          Generación de informes ejecutivos y operativos
        </p>
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
          />
        </div>

        <div className="report-list-card">
          <RecentReportsList
            reports={recentReports}
            onDownload={handleDownloadRecent}
          />
        </div>
      </div>

      {reportData.length > 0 && <ReportPreviewTable data={reportData} />}

      <GenerateReportSuccessModal message={successMessage} />
      <GenerateReportErrorModal message={error} />
    </Admin>
  );
}
