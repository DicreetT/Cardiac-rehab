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
              
              <h1 className="font-caveat text-5xl sm:text-6xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse-subtle text-white mb-4">
                Rehabilitación cardiaca para volver a tu vida con seguridad
              </h1>
              
              <p className="mt-4 text-lg sm:text-xl text-white drop-shadow-md bg-black/40 backdrop-blur-sm rounded-xl p-4 mb-6">
                Acompañamiento de especialistas: ejercicio, educación y apoyo emocional para ti y tu familia.
              </p>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-black/10 max-w-md mx-auto">
                <img 
                  src={bolitaDoctor} 
                  alt="Bolita como doctora" 
                  className="w-32 h-32 mx-auto mb-6 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />
                
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
                  <p className="text-sm text-gray-700">
                    Introduce el código que te entregó tu profesional de Bolita para acceder al programa.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder=""
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
                    Entrar
                  </button>
                </form>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Tus datos se tratan con confidencialidad. Esta información es educativa y no sustituye tu consulta médica.
                    Si presentas dolor en el pecho, falta de aire intensa o mareo, acude a urgencias.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Qué esperar</h3>
                  <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Valoración inicial</li>
                    <li>Plan de ejercicio adaptado y monitorizado</li>
                    <li>Educación (medicación, nutrición, estrés)</li>
                    <li>Seguimiento y alta con plan en casa</li>
                  </ol>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Preguntas frecuentes</h3>
                  <div className="space-y-3 text-xs text-gray-700">
                    <div>
                      <p className="font-semibold">¿Es seguro?</p>
                      <p>Sí. Empezamos con una valoración y adaptamos la intensidad.</p>
                    </div>
                    <div>
                      <p className="font-semibold">¿Cuánto dura?</p>
                      <p>8–12 semanas, 2–3 sesiones por semana.</p>
                    </div>
                    <div>
                      <p className="font-semibold">¿Quién me acompaña?</p>
                      <p>Un equipo de cardiología, fisioterapia, enfermería, psicología y nutrición.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
