import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { plans } from "@/data/plans";
import { useAuth } from "@/hooks/useAuth";
import BubbleBackground from "@/components/BubbleBackground";
import { clearUserCode } from "@/utils/userCode";

export default function Plans() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);

  const goToRandomPlan = () => {
    setIsShaking(true);
    setTimeout(() => {
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      navigate(`/plan/${randomPlan.slug}`);
    }, 800);
  };

  const handleLogout = () => {
    clearUserCode();
    signOut();
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <section className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
        <BubbleBackground count={8} minSize={40} maxSize={120} />

        <main className="mx-auto max-w-6xl p-6 sm:p-10 relative z-10">
          <header className="mb-8">
            <div className="text-center">
              <div className="inline-block bg-yellow-400 px-5 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 transform hover:rotate-1 transition-transform duration-300">
                <h1 className="font-caveat text-4xl font-bold text-black">Elige una nueva aventura al día</h1>
              </div>
              <p className="font-bubblegum text-lg text-gray-800">Cada ejercicio es una oportunidad de ser más fuerte</p>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {plans.map((plan, index) => (
              <Link
                key={plan.id}
                to={`/plan/${plan.slug}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl mb-4 flex items-center justify-center border-2 border-black/10 overflow-hidden">
                    <img 
                      src={plan.image} 
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-bubblegum text-xl mb-2 text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  
                  <div className="flex gap-2 text-xs">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                      {plan.duration}
                    </span>
                    <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-medium">
                      {plan.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {isAdmin && (
              <Link to="/admin">
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bubblegum text-lg">
                  👑 Admin Dashboard
                </button>
              </Link>
            )}
            
            <button
              onClick={goToRandomPlan}
              className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bubblegum text-lg ${isShaking ? 'animate-shake' : ''}`}
            >
              🎲 ¡Sorpréndeme!
            </button>
            
            <Link to="/calendar">
              <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bubblegum text-lg">
                📅 Ver Calendario
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bubblegum text-lg"
            >
              Salir
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}
