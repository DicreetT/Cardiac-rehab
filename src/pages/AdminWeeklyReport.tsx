import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface WeeklyRow {
  user_id: string;
  email: string;
  week_start: string;
  avg_bpm: number | null;
  avg_sys: number | null;
  avg_dia: number | null;
  n_hr: number;
  n_bp: number;
  sos_count: number;
}

export default function AdminWeeklyReport() {
  const [data, setData] = useState<WeeklyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc("get_dashboard_weekly_report");
    if (error) {
      console.error("Error cargando reporte:", error);
      setError(error.message);
    } else {
      setData((data as WeeklyRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte semanal de métricas (solo admin)", 14, 16);
    doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [["Semana", "Usuario", "FC Prom", "TA Prom", "#HR", "#TA", "SOS"]],
      body: data.map((r) => [
        new Date(r.week_start).toLocaleDateString("es-ES"),
        r.email ?? "—",
        r.avg_bpm ?? "—",
        r.avg_sys && r.avg_dia ? `${r.avg_sys}/${r.avg_dia}` : "—",
        r.n_hr,
        r.n_bp,
        r.sos_count,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [250, 200, 100] },
    });

    doc.save("reporte-semanal.pdf");
  };

  return (
    <Card className="mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50">
        <CardTitle className="font-caveat text-3xl flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Reporte semanal (solo admin)
        </CardTitle>
        <CardDescription className="font-bubblegum">
          Promedios por usuario y semana (FC, TA, HR y SOS)
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex gap-3 mb-4">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="font-bubblegum"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </Button>
          <Button
            onClick={exportPdf}
            disabled={!data.length}
            className="font-bubblegum"
          >
            Descargar PDF
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-3">
            Nota: {error}. Si no eres admin, este reporte no mostrará datos.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Semana</th>
                <th className="p-2 border-b">Usuario</th>
                <th className="p-2 border-b">FC prom</th>
                <th className="p-2 border-b">TA prom</th>
                <th className="p-2 border-b">#HR</th>
                <th className="p-2 border-b">#TA</th>
                <th className="p-2 border-b">SOS</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">
                    No hay datos para mostrar (o este usuario no es admin)
                  </td>
                </tr>
              ) : (
                data.map((r, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border-b">
                      {new Date(r.week_start).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-2 border-b">{r.email ?? "—"}</td>
                    <td className="p-2 border-b">{r.avg_bpm ?? "—"}</td>
                    <td className="p-2 border-b">
                      {r.avg_sys && r.avg_dia ? `${r.avg_sys}/${r.avg_dia}` : "—"}
                    </td>
                    <td className="p-2 border-b">{r.n_hr}</td>
                    <td className="p-2 border-b">{r.n_bp}</td>
                    <td className="p-2 border-b">{r.sos_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
