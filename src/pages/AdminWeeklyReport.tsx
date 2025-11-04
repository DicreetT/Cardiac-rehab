import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Row = {
  user_id: string;
  email: string;
  week_start: string; // date como string
  avg_bpm: number | null;
  avg_sys: number | null;
  avg_dia: number | null;
  n_hr: number;
  n_bp: number;
  sos_count: number;
};

export default function AdminWeeklyReport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_dashboard_weekly_report");
    if (error) setError(error.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const downloadCSV = () => {
    if (!rows.length) return;
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
    const body = rows.map(r => [
      r.email,
      r.week_start,
      r.avg_bpm ?? "",
      r.avg_sys ?? "",
      r.avg_dia ?? "",
      r.n_hr,
      r.n_bp,
      r.sos_count,
    ]);

    const csv = [header, ...body].map(line => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-semanal.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Si no hay datos, no estorba al dashboard
  if (loading) return null;

  return (
    <Card className="mt-8 border-2 border-black">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="font-caveat text-3xl">
          Reporte semanal (solo admin)
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}>Actualizar</Button>
          <Button onClick={downloadCSV}>Descargar CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <p className="text-sm text-gray-600">Sin datos aún.</p>
        ) : (
          <div className="w-full overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Semana</th>
                  <th className="py-2 pr-4">FC prom</th>
                  <th className="py-2 pr-4">TA prom</th>
                  <th className="py-2 pr-4">#HR</th>
                  <th className="py-2 pr-4">#TA</th>
                  <th className="py-2 pr-4">SOS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.user_id}-${r.week_start}`} className="border-b">
                    <td className="py-2 pr-4">{r.email}</td>
                    <td className="py-2 pr-4">
                      {new Date(r.week_start).toLocaleDateString("es-ES")}
                    </td>
                    <td className="py-2 pr-4">{r.avg_bpm ?? "-"}</td>
                    <td className="py-2 pr-4">
                      {r.avg_sys && r.avg_dia ? `${r.avg_sys}/${r.avg_dia}` : "-"}
                    </td>
                    <td className="py-2 pr-4">{r.n_hr}</td>
                    <td className="py-2 pr-4">{r.n_bp}</td>
                    <td className="py-2 pr-4">{r.sos_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
