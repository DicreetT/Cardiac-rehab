import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserCode } from "@/utils/userCode";
import BubbleBackground from "@/components/BubbleBackground";
import bolitaDoctor from "@/assets/bolita-doctor.png";

export default function Index() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedCode = code.trim().toUpperCase();
    
    if (trimmedCode === "IVÁN" || trimmedCode === "IVAN") {
      saveUserCode(trimmedCode);
      navigate("/auth");
    } else {
      setError("Código incorrecto. Por favor, intenta de nuevo.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground">
      <section className="h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: 'url(/bolita/home.png)' }}>
        <BubbleBackground count={6} minSize={40} maxSize={100} opacity="bg-white/20" />

        <main className="h-full mx-auto max-w-7xl p-6 sm:p-10 relative z-10">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-3xl text-center">
              <div className="mb-2 inline-block rotate-[-4deg] bg-yellow-400 px-4 py-1 rounded-lg shadow-lg transform hover:rotate-[4deg] transition-transform duration-300">
                <span className="font-bubblegum text-xl text-black">
                  ¡Bienvenido!
                </span>
              </div>
              
              <h1 className="font-caveat text-6xl sm:text-7xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse-subtle text-white mb-4">
                Organización de Salud Bolita
              </h1>
              
              <p className="mt-4 text-xl text-white drop-shadow-md bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6">
                Bienvenido/a a la Organización de Salud Bolita. Estamos especializados en acompañar a los papás en su camino hacia una salud próspera y nos alegra que te unas a nuestro programa.
              </p>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-black/10 max-w-md mx-auto">
                <img 
                  src={bolitaDoctor} 
                  alt="Bolita como doctora" 
                  className="w-32 h-32 mx-auto mb-6 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
                  <p className="text-sm text-gray-700">
                    Introduce el código que tu doctora asignada para papás, <span className="font-bold">Thalia</span>, te entregó para obtener acceso y empezar a ponerte realmente en forma, aquí:
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Código de acceso"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 text-center text-lg border-2 border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                  
                  {error && (
                    <p className="text-sm text-red-600 animate-shake">{error}</p>
                  )}
                  
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg border-2 border-black/10 transition-all duration-300 hover:scale-105"
                  >
                    ¡Entrar!
                  </button>
                </form>

                <p className="text-xs text-gray-600 mt-4">
                  * Thalia podrá seguir tu progreso y ayudarte durante todo el proceso.
                </p>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
