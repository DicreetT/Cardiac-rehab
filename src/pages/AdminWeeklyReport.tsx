// src/pages/AdminWeeklyReport.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

type WeeklyRow = {
  user_id: string;
  email: string;
  week_start: string; // ISO date (yyyy-mm-dd)
  avg_bpm: number | null;
  avg_sys: number | null;
  avg_dia: number | null;
  n_hr: number;
  n_bp: number;
  sos_count: number;
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminWeeklyReport() {
  const [rows, setRows] = useState<WeeklyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_dashboard_weekly_report");
      if (!error && data) setRows(data as WeeklyRow[]);
      setLoading(false);
    })();
  }, []);

  const grouped = useMemo(() => {
    const byUser: Record<string, WeeklyRow[]> = {};
    rows.forEach((r) => {
      if (!byUser[r.email]) byUser[r.email] = [];
      byUser[r.email].push(r);
    });
    // ordena por semana ascendente dentro de cada usuario
    Object.values(byUser).forEach((arr) =>
      arr.sort(
        (a, b) =>
          new Date(a.week_start).getTime() - new Date(b.week_start).getTime()
      )
    );
    return byUser;
  }, [rows]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const genAt = new Date();

    // Título portada
    doc.setFillColor(255, 247, 234);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 110, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Cardiac Rehab — Reporte Semanal", 40, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Generado: ${formatDate(genAt)}`, 40, 75);

    // Por cada usuario, una tabla (nueva página a partir del segundo)
    const userEmails = Object.keys(grouped);
    userEmails.forEach((email, idx) => {
      if (idx > 0) doc.addPage();

      // Encabezado de usuario
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(email, 40, 120);

      // Arma filas para autotable
      const data = grouped[email] as WeeklyRow[];
      const body: RowInput[] = data.map((r) => [
        formatDate(r.week_start),
        r.avg_bpm ?? "—",
        r.avg_sys ?? "—",
        r.avg_dia ?? "—",
        r.n_hr || 0,
        r.n_bp || 0,
        r.sos_count || 0,
      ]);

      autoTable(doc, {
        startY: 140,
        head: [["Semana", "FC prom", "PAS", "PAD", "#FC", "#TA", "SOS"]],
        body,
        styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
        headStyles: {
          fillColor: [255, 213, 128], // ámbar suave
          textColor: 40,
          lineWidth: 0,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        theme: "grid",
        margin: { left: 40, right: 40 },
      });
    });

    // Pie de página con numeración
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Cardiac Rehab • ${genAt.toLocaleString("es-ES")} • Página ${i} / ${pageCount}`,
        pageW / 2,
        pageH - 20,
        { align: "center" }
      );
    }

    doc.save("reporte-semanal.pdf");
  };

  const handleDownloadCSV = () => {
    // CSV crudo por si lo quieres abrir en Excel/Sheets
    const header = [
      "email",
      "week_start",
      "avg_bpm",
      "avg_sys",
      "avg_dia",
      "n_hr",
      "n_bp",
      "sos_count",
    ].join(",");

    const lines = rows.map((r) =>
      [
        r.email,
        r.week_start,
        r.avg_bpm ?? "",
        r.avg_sys ?? "",
        r.avg_dia ?? "",
        r.n_hr,
        r.n_bp,
        r.sos_count,
      ].join(",")
    );

    const blob = new Blob([header + "\n" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-semanal.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return null; // el dashboard principal ya tiene su spinner
  }

  // UI minimal; se monta al final del dashboard
  return (
    <div className="max-w-7xl mx-auto px-6 pb-10 mt-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <p className="font-bubblegum text-gray-700">
            Reporte semanal (solo admin)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Resumen visible rápido */}
      <div className="text-sm text-gray-600">
        {Object.keys(grouped).length === 0 ? (
          <p>No hay métricas semanales todavía.</p>
        ) : (
          <p>
            Usuarios con datos: <b>{Object.keys(grouped).length}</b> • Filas:{" "}
            <b>{rows.length}</b>
          </p>
        )}
      </div>
    </div>
  );
}
