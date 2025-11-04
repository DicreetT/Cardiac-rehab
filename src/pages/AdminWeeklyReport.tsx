import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw, FileDown } from "lucide-react";

type Row = {
  user_id: string;
  email: string;
  week_start: string; // date
  avg_bpm: number | null;
  avg_sys: number | null;
  avg_dia: number | null;
  n_hr: number;
  n_bp: number;
  sos_count: number;
};

export default function AdminWeeklyReport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_dashboard_weekly_report");
    if (!error && data) setRows(data as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toCsv = (data: Row[]) => {
    const header = [
      "email",
      "week_start",
      "avg_bpm",
      "avg_sys",
      "avg_dia",
      "n_hr",
      "n_bp",
      "sos_count",
    ];
    const lines = data.map((r) =>
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
    return [header.join(","), ...lines].join("\n");
  };

  const downloadCsv = () => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-semanal.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    // 🔸 Importación dinámica solo cuando el usuario lo pide
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 36;

    doc.setFontSize(16);
    doc.text("Reporte semanal — Dashboard", marginX, 40);
    doc.setFontSize(10);
    doc.text(
      `Generado: ${new Date().toLocaleString("es-ES")}`,
      marginX,
      58
    );

    // Ordena por semana descendente y luego por email para que quede prolijo
    const sorted = [...rows].sort((a, b) => {
      if (a.week_start < b.week_start) return 1;
      if (a.week_start > b.week_start) return -1;
      return a.email.localeCompare(b.email);
    });

    const head = [
      [
        "Email",
        "Semana",
        "FC prom",
        "TA prom",
        "#HR",
        "#TA",
        "SOS",
      ],
    ];

    const body = sorted.map((r) => [
      r.email,
      r.week_start,
      r.avg_bpm ?? "-",
      r.avg_sys != null && r.avg_dia != null ? `${r.avg_sys}/${r.avg_dia}` : "-",
      r.n_hr,
      r.n_bp,
      r.sos_count,
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 80,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [33, 33, 33] },
      margin: { left: marginX, right: marginX },
    });

    doc.save("reporte-semanal.pdf");
  };

  return (
    <Card className="mt-8 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="font-caveat text-3xl">Reporte semanal (solo admin)</CardTitle>
        <CardDescription className="font-bubblegum">
          Resumen por usuario y semana con FC/TA promedios, cantidad de mediciones y SOS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <Button onClick={load} disabled={loading} variant="outline" className="font-bubblegum">
            <RefreshCcw className="mr-2 h-4 w-4" />
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button onClick={downloadCsv} variant="outline" className="font-bubblegum">
            <Download className="mr-2 h-4 w-4" />
            Descargar CSV
          </Button>
          <Button onClick={downloadPdf} className="font-bubblegum">
            <FileDown className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>

        {/* Tabla sencilla en pantalla (opcional) */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Email</th>
                <th className="text-left py-2 pr-4">Semana</th>
                <th className="text-left py-2 pr-4">FC prom</th>
                <th className="text-left py-2 pr-4">TA prom</th>
                <th className="text-left py-2 pr-4">#HR</th>
                <th className="text-left py-2 pr-4">#TA</th>
                <th className="text-left py-2 pr-4">SOS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.user_id}-${r.week_start}`} className="border-b">
                  <td className="py-2 pr-4">{r.email}</td>
                  <td className="py-2 pr-4">{r.week_start}</td>
                  <td className="py-2 pr-4">{r.avg_bpm ?? "-"}</td>
                  <td className="py-2 pr-4">
                    {r.avg_sys != null && r.avg_dia != null ? `${r.avg_sys}/${r.avg_dia}` : "-"}
                  </td>
                  <td className="py-2 pr-4">{r.n_hr}</td>
                  <td className="py-2 pr-4">{r.n_bp}</td>
                  <td className="py-2 pr-4">{r.sos_count}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={7}>
                    No hay datos aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
