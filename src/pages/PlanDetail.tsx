import { useState } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { planBySlug } from "@/data/plans";
import BubbleBackground from "@/components/BubbleBackground";
import ExerciseTimer from "@/components/ExerciseTimer";
import { ArrowLeft } from "lucide-react";
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
            <div 
              className="relative border-b-2 border-black bg-cover bg-center h-[400px]"
              style={{
                backgroundImage: `url(${plan.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
            </div>

            <div className="p-8">
              <ExerciseTimer plan={plan} onComplete={handleComplete} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
