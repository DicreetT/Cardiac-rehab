import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import BubbleBackground from "@/components/BubbleBackground";
import bolitaZen from "@/assets/bolita-zen.png";

export default function Calendar() {
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bolita-completed-days');
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
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
    <div className="min-h-screen w-full bg-background text-foreground">
      <section className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
        <BubbleBackground count={8} minSize={40} maxSize={120} />

        <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
          <Link
            to="/plans"
            className="font-bubblegum inline-flex items-center gap-1 mb-6 px-3 py-1 rounded-lg border-2 border-black bg-white hover:bg-amber-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a planes
          </Link>

          <div className="text-center mb-8">
            <img 
              src={bolitaZen} 
              alt="Bolita zen" 
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg animate-float"
            />
            <div className="inline-block bg-yellow-400 px-5 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3">
              <h1 className="font-caveat text-5xl font-bold text-black">Tu Progreso</h1>
            </div>
            <p className="font-bubblegum text-lg text-gray-800">¡Sigue así, lo estás haciendo genial!</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="font-caveat text-3xl font-bold mb-4 text-gray-900">Esta semana</h2>
            <p className="font-bubblegum text-lg mb-4 text-gray-700">
              Has completado <span className="text-primary font-bold text-2xl">{completedThisWeek}</span> de 7 días
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-6 mb-2 border-2 border-black">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 border-r-2 border-black"
                style={{ width: `${(completedThisWeek / 7) * 100}%` }}
              />
            </div>
            
            <p className="text-center font-bubblegum text-sm text-gray-600">
              {completedThisWeek === 7 ? "¡Semana completa! 🎉" : `${7 - completedThisWeek} días restantes`}
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="font-caveat text-3xl font-bold mb-6 text-gray-900">Calendario Semanal</h2>
            
            <div className="grid grid-cols-7 gap-3">
              {weekDates.map((date, index) => {
                const completed = isCompleted(date);
                const todayDate = isToday(date);
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <span className={`font-bubblegum text-sm ${todayDate ? 'text-primary font-bold' : 'text-gray-600'}`}>
                      {daysOfWeek[index]}
                    </span>
                    
                    <div 
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 border-black
                        ${completed 
                          ? 'bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                          : todayDate 
                            ? 'bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        }
                      `}
                    >
                      {completed ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    <span className="text-xs text-gray-600 font-bold">
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <p className="text-center font-bubblegum text-gray-900 leading-relaxed">
              <span className="text-2xl">💪</span> <span className="font-bold">Consejo de Bolita:</span><br />
              La constancia es la clave del éxito. ¡Sigue así y verás resultados increíbles!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
