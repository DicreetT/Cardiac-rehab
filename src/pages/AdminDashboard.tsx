import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BubbleBackground from "@/components/BubbleBackground";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, AlertTriangle, TrendingUp } from "lucide-react";

interface Session {
  id: string;
  plan_name: string;
  date: string;
  completed: boolean;
  user: {
    full_name: string;
    email: string;
  };
  hr_records: Array<{
    phase_name: string;
    hr: number;
    systolic: number | null;
    diastolic: number | null;
    target: string;
    comment: string | null;
    timestamp: string;
  }>;
  sos_records: Array<{
    phase_name: string;
    symptoms: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data: sessionsData } = await supabase
      .from("exercise_sessions")
      .select(`
        *,
        user:profiles!user_id(full_name, email),
        hr_records(*),
        sos_records(*)
      `)
      .order("date", { ascending: false });

    if (sessionsData) {
      setSessions(sessionsData as any);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="font-bubblegum text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSOSRecords = sessions.reduce((sum, s) => sum + s.sos_records.length, 0);
  const averageHR = sessions.reduce((sum, s) => {
    const sessionAvg = s.hr_records.reduce((hrSum, r) => hrSum + r.hr, 0) / (s.hr_records.length || 1);
    return sum + sessionAvg;
  }, 0) / (totalSessions || 1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
      <BubbleBackground count={8} minSize={40} maxSize={120} />

      <div className="max-w-7xl mx-auto p-6 sm:p-10 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-caveat text-4xl font-bold mb-2">Dashboard de Administrador</h1>
            <p className="font-bubblegum text-gray-700">Vista completa de todas las sesiones</p>
          </div>
          <div className="flex gap-3">
            <Link to="/plans">
              <Button variant="outline" className="font-bubblegum">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Planes
              </Button>
            </Link>
            <Button onClick={signOut} variant="outline" className="font-bubblegum">
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sesiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedSessions}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Heart className="h-4 w-4" /> FC Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(averageHR)} lpm</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Alertas SOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalSOSRecords}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de sesiones */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-caveat text-2xl">{session.plan_name}</CardTitle>
                    <CardDescription className="font-bubblegum">
                      Usuario: {session.user.full_name || session.user.email}
                    </CardDescription>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(session.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {session.completed && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border-2 border-green-300">
                      Completada
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Registros de FC y TA */}
                {session.hr_records.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-red-500" />
                      Frecuencias Cardíacas y Tensiones Arteriales
                    </h4>
                    <div className="grid gap-3">
                      {session.hr_records.map((record, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-bold text-lg text-gray-800">{record.phase_name}</p>
                              <p className="text-sm text-gray-600 mt-1">🎯 Meta: {record.target}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(record.timestamp).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </p>
                              {record.comment && (
                                <p className="text-sm italic mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                                  💬 "{record.comment}"
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="bg-red-100 px-4 py-2 rounded-lg border-2 border-red-300 mb-2">
                                <p className="text-xs text-red-700 font-semibold">FC</p>
                                <p className="text-3xl font-bold text-red-600">{record.hr}</p>
                                <p className="text-xs text-red-700">lpm</p>
                              </div>
                              {(record.systolic || record.diastolic) && (
                                <div className="bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-300">
                                  <p className="text-xs text-blue-700 font-semibold">Tensión Arterial</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {record.systolic || '?'}/{record.diastolic || '?'}
                                  </p>
                                  <p className="text-xs text-blue-700">mmHg</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registros SOS */}
                {session.sos_records.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      Alertas SOS ({session.sos_records.length})
                    </h4>
                    <div className="grid gap-2">
                      {session.sos_records.map((record, idx) => (
                        <div key={idx} className="bg-red-100 p-3 rounded-lg border-2 border-red-400">
                          <p className="font-semibold text-red-900">{record.phase_name}</p>
                          <p className="text-sm text-gray-800 mt-1">{record.symptoms}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(record.timestamp).toLocaleTimeString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {sessions.length === 0 && (
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 font-bubblegum">No hay sesiones registradas aún</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}