import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import bolitaZen from "@/assets/bolita-zen.png";
import { useState, useEffect } from "react";

const Calendar = () => {
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedDays');
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Get current week dates
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  const isCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completedDays.includes(dateStr);
  };

  const isToday = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  const completedThisWeek = weekDates.filter(date => isCompleted(date)).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link to="/exercises" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a ejercicios</span>
        </Link>

        <div className="text-center mb-8">
          <img src={bolitaZen} alt="Bolita zen" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Tu Progreso</h1>
          <p className="text-xl text-muted-foreground">Sigue así, ¡lo estás haciendo genial!</p>
        </div>

        <Card className="mb-6 bg-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Esta semana</CardTitle>
            <CardDescription>
              Has completado <span className="font-bold text-primary text-lg">{completedThisWeek}</span> de 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-4 mb-2">
              <div 
                className="bg-primary h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedThisWeek / 7) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {completedThisWeek === 7 ? "¡Semana completa! 🎉" : `${7 - completedThisWeek} días restantes`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Calendario Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const completed = isCompleted(date);
                const today = isToday(date);
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <span className={`text-sm font-medium ${today ? 'text-primary' : 'text-muted-foreground'}`}>
                      {daysOfWeek[index]}
                    </span>
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all
                        ${completed 
                          ? 'bg-primary text-primary-foreground' 
                          : today 
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }
                        ${today ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}
                    >
                      {completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-accent/20 rounded-xl border-2 border-accent">
          <p className="text-center text-foreground">
            <span className="font-bold">💪 Consejo de Bolita:</span> La constancia es la clave del éxito. 
            ¡Sigue así y verás resultados increíbles!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
