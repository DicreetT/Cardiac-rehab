import { useState } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { planBySlug } from "@/data/plans";
import BubbleBackground from "@/components/BubbleBackground";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import bolitaHappy from "@/assets/bolita-happy.png";

export default function PlanDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);
  
  const plan = slug ? planBySlug(slug) : undefined;

  if (!plan) {
    return <Navigate to="/plans" replace />;
  }

  const handleComplete = () => {
    setIsCompleting(true);
    const today = new Date().toISOString().split('T')[0];
    const completedDays = JSON.parse(localStorage.getItem('bolita-completed-days') || '[]');
    
    if (!completedDays.includes(today)) {
      completedDays.push(today);
      localStorage.setItem('bolita-completed-days', JSON.stringify(completedDays));
    }

    toast.success("¡Guau! ¡Ejercicio completado!", {
      description: "Has marcado el día de hoy como completado."
    });

    setTimeout(() => {
      navigate('/plans');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <section className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden pb-10">
        <BubbleBackground count={5} minSize={40} maxSize={120} />

        <div className="mx-auto max-w-4xl p-6 sm:p-10 relative z-10">
          <Link
            to="/plans"
            className="font-bubblegum inline-flex items-center gap-1 mb-6 px-3 py-1 rounded-lg border-2 border-black bg-white hover:bg-amber-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a planes
          </Link>

          <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-8 text-center border-b-2 border-black">
              <img 
                src={bolitaHappy} 
                alt="Bolita feliz" 
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <h1 className="font-caveat text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h1>
              <p className="font-bubblegum text-lg text-gray-700">{plan.description}</p>
              
              <div className="flex gap-3 justify-center mt-4">
                <span className="bg-white px-4 py-2 rounded-xl border-2 border-black font-bold text-sm">
                  ⏱️ {plan.duration}
                </span>
                <span className="bg-white px-4 py-2 rounded-xl border-2 border-black font-bold text-sm">
                  📊 {plan.difficulty}
                </span>
              </div>
            </div>

            <div className="p-8">
              {plan.exercises.map((exercise, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <div className="bg-yellow-400 inline-block px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                    <h2 className="font-caveat text-3xl font-bold">{exercise.name}</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-primary/10 p-3 rounded-xl border-2 border-primary/20 text-center">
                      <div className="font-bold text-lg">{exercise.sets}</div>
                      <div className="text-sm text-gray-600">Series</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl border-2 border-primary/20 text-center">
                      <div className="font-bold text-lg">{exercise.reps}</div>
                      <div className="text-sm text-gray-600">Reps</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl border-2 border-primary/20 text-center">
                      <div className="font-bold text-lg">{exercise.rest}</div>
                      <div className="text-sm text-gray-600">Descanso</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
                    <h3 className="font-bubblegum text-lg mb-4 text-gray-800">Cómo hacerlo:</h3>
                    <ol className="space-y-3">
                      {exercise.instructions.map((instruction, instIdx) => (
                        <li key={instIdx} className="flex gap-3">
                          <span className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-black">
                            {instIdx + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}

              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bubblegum flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {isCompleting ? '¡Completado!' : '¡Marcar como completado!'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
