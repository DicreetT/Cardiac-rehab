import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plan } from "@/data/plans";

interface ExerciseTimerProps {
  plan: Plan;
  onComplete: () => void;
}

interface HRRecord {
  phaseName: string;
  hr: string;
  target: string;
}

export default function ExerciseTimer({ plan, onComplete }: ExerciseTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(plan.phases[0].duration);
  const [hrRecords, setHrRecords] = useState<HRRecord[]>([]);
  const [currentHR, setCurrentHR] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const beepTimerRef = useRef<number | null>(null);
  const lastBeepRef = useRef<number>(0);

  const currentPhase = plan.phases[currentPhaseIndex];
  const totalDuration = plan.phases.reduce((acc, phase) => acc + phase.duration, 0);
  const elapsedTotal = plan.phases
    .slice(0, currentPhaseIndex)
    .reduce((acc, phase) => acc + phase.duration, 0) + 
    (currentPhase.duration - phaseTimeLeft);
  const progressPercent = (elapsedTotal / totalDuration) * 100;

  // Inicializar AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Función para reproducir pitido
  const playBeep = (frequency: number = 800, duration: number = 0.2) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // Timer principal
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          // Fin de fase
          playBeep(1000, 0.3);
          
          if (currentPhaseIndex < plan.phases.length - 1) {
            // Siguiente fase
            setCurrentPhaseIndex((idx) => idx + 1);
            return plan.phases[currentPhaseIndex + 1].duration;
          } else {
            // Ejercicio completado
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
        }
        
        // Pitidos intermedios
        if (currentPhase.beepInterval) {
          const elapsedInPhase = currentPhase.duration - prev;
          const nextBeepTime = Math.floor(elapsedInPhase / currentPhase.beepInterval) * currentPhase.beepInterval;
          
          if (elapsedInPhase >= nextBeepTime && elapsedInPhase - lastBeepRef.current >= currentPhase.beepInterval - 1) {
            playBeep(600, 0.15);
            lastBeepRef.current = elapsedInPhase;
          }
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPhaseIndex, currentPhase, plan.phases, isCompleted]);

  // Pitido de inicio de fase
  useEffect(() => {
    if (isRunning) {
      playBeep(800, 0.2);
      lastBeepRef.current = 0;
    }
  }, [currentPhaseIndex, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setPhaseTimeLeft(plan.phases[0].duration);
    setHrRecords([]);
    setCurrentHR("");
    setIsCompleted(false);
    lastBeepRef.current = 0;
  };

  const handleRecordHR = () => {
    if (currentHR && currentPhase.hrTarget) {
      setHrRecords([...hrRecords, {
        phaseName: currentPhase.name,
        hr: currentHR,
        target: currentPhase.hrTarget
      }]);
      setCurrentHR("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isRestPhase = currentPhase.name.toLowerCase().includes('descanso') || 
                      currentPhase.intensity === 'pausa';

  return (
    <div className="space-y-6">
      {/* Intro narrativa */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200">
        <p className="font-bubblegum text-lg text-gray-800 italic">{plan.intro}</p>
      </div>

      {/* Resumen del plan */}
      <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-caveat text-2xl font-bold mb-4">Resumen del plan</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <div className="text-sm text-gray-600">Duración total</div>
            <div className="font-bold text-lg">{plan.duration}</div>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <div className="text-sm text-gray-600">Rango FC objetivo</div>
            <div className="font-bold text-lg">{plan.hrRange}</div>
          </div>
        </div>
      </div>

      {/* Cronómetro y fase actual */}
      <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 ${
            isRestPhase ? 'bg-blue-300' : 'bg-yellow-400'
          }`}>
            <h2 className="font-caveat text-4xl font-bold">{currentPhase.name}</h2>
          </div>
          
          <div className="text-6xl font-bold font-mono mb-2 text-gray-900">
            {formatTime(phaseTimeLeft)}
          </div>
          
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Intensidad:</span> {currentPhase.intensity}
          </p>
          
          {currentPhase.hrTarget && (
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">FC objetivo:</span> {currentPhase.hrTarget}
            </p>
          )}
          
          <p className="text-gray-700 italic">{currentPhase.description}</p>
          
          {currentPhase.beepAction && (
            <div className="mt-3 bg-orange-100 border border-orange-300 rounded-lg p-2">
              <p className="text-sm font-semibold text-orange-800">
                🔔 {currentPhase.beepAction}
              </p>
            </div>
          )}
          
          {isRestPhase && plan.restMessage && (
            <div className="mt-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
              <p className="font-bubblegum text-blue-800">{plan.restMessage}</p>
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <Progress value={progressPercent} className="h-3" />
          <p className="text-center text-sm text-gray-600 mt-2">
            Fase {currentPhaseIndex + 1} de {plan.phases.length}
          </p>
        </div>

        {/* Controles */}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="font-bubblegum text-lg"
              disabled={isCompleted}
            >
              <Play className="mr-2" />
              {currentPhaseIndex === 0 && phaseTimeLeft === plan.phases[0].duration ? 'Iniciar' : 'Reanudar'}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="secondary"
              size="lg"
              className="font-bubblegum text-lg"
            >
              <Pause className="mr-2" />
              Pausar
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="font-bubblegum text-lg"
          >
            <RotateCcw className="mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Registro de FC */}
      {currentPhase.hrTarget && !isRestPhase && (
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-caveat text-2xl font-bold mb-4">Registrar Frecuencia Cardíaca</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={currentHR}
              onChange={(e) => setCurrentHR(e.target.value)}
              placeholder="FC en lpm"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <Button onClick={handleRecordHR} disabled={!currentHR}>
              Registrar
            </Button>
          </div>
        </div>
      )}

      {/* Registros de FC */}
      {hrRecords.length > 0 && (
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-caveat text-2xl font-bold mb-4">Registros de FC</h3>
          <div className="space-y-2">
            {hrRecords.map((record, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-semibold">{record.phaseName}</span>
                <span>
                  <span className="text-primary font-bold">{record.hr} lpm</span>
                  <span className="text-gray-500 text-sm ml-2">(meta: {record.target})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de completar */}
      {isCompleted && (
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full font-bubblegum text-lg"
        >
          <CheckCircle className="mr-2" />
          ¡Marcar como completado!
        </Button>
      )}
    </div>
  );
}
