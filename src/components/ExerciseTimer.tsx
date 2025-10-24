import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plan } from "@/data/plans";
import bolitaRest from "@/assets/bolita-rest.png";
import bolitaWorkout from "@/assets/bolita-workout.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExerciseTimerProps {
  plan: Plan;
  onComplete: () => void;
}

interface HRRecord {
  phaseName: string;
  hr: number;
  systolic?: number; // Tensión arterial sistólica
  diastolic?: number; // Tensión arterial diastólica
  target: string;
  comment?: string;
  timestamp: string;
}

export default function ExerciseTimer({ plan, onComplete }: ExerciseTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(plan.phases[0].duration);
  const [hrRecords, setHrRecords] = useState<HRRecord[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHRDialog, setShowHRDialog] = useState(false);
  const [currentHRInput, setCurrentHRInput] = useState("");
  const [currentSystolicInput, setCurrentSystolicInput] = useState("");
  const [currentDiastolicInput, setCurrentDiastolicInput] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [pendingPhaseForHR, setPendingPhaseForHR] = useState<number | null>(null);
  
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
          
          const finishedPhase = plan.phases[currentPhaseIndex];
          const isSetPhase = finishedPhase.name.toLowerCase().startsWith('set') && 
                            finishedPhase.hrTarget;
          const isWarmupPhase = finishedPhase.name.toLowerCase().includes('calentamiento') && 
                                finishedPhase.hrTarget;
          
          if (currentPhaseIndex < plan.phases.length - 1) {
            // Si terminó un set o calentamiento con meta de HR, pausar y pedir registro
            if (isSetPhase || isWarmupPhase) {
              setIsRunning(false);
              setPendingPhaseForHR(currentPhaseIndex);
              setShowHRDialog(true);
            } else {
              // Siguiente fase automática (para descansos, enfriamiento sin HR target)
              setCurrentPhaseIndex((idx) => idx + 1);
              return plan.phases[currentPhaseIndex + 1].duration;
            }
          } else {
            // Ejercicio completado
            setIsRunning(false);
            setIsCompleted(true);
            saveSessionToLocalStorage();
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
    setIsCompleted(false);
    setShowHRDialog(false);
    setPendingPhaseForHR(null);
    setCurrentHRInput("");
    setCurrentSystolicInput("");
    setCurrentDiastolicInput("");
    setCurrentComment("");
    lastBeepRef.current = 0;
  };

  const handleSaveHR = () => {
    if (pendingPhaseForHR !== null && currentHRInput) {
      const phase = plan.phases[pendingPhaseForHR];
      const newRecord: HRRecord = {
        phaseName: phase.name,
        hr: parseInt(currentHRInput),
        systolic: currentSystolicInput ? parseInt(currentSystolicInput) : undefined,
        diastolic: currentDiastolicInput ? parseInt(currentDiastolicInput) : undefined,
        target: phase.hrTarget || "",
        comment: currentComment.trim() || undefined,
        timestamp: new Date().toISOString()
      };
      
      setHrRecords([...hrRecords, newRecord]);
      setShowHRDialog(false);
      setCurrentHRInput("");
      setCurrentSystolicInput("");
      setCurrentDiastolicInput("");
      setCurrentComment("");
      
      // Avanzar a siguiente fase
      setCurrentPhaseIndex(pendingPhaseForHR + 1);
      setPhaseTimeLeft(plan.phases[pendingPhaseForHR + 1].duration);
      setPendingPhaseForHR(null);
      
      // Reanudar automáticamente
      setIsRunning(true);
    }
  };

  const handleSkipHR = () => {
    if (pendingPhaseForHR !== null) {
      setShowHRDialog(false);
      setCurrentHRInput("");
      setCurrentSystolicInput("");
      setCurrentDiastolicInput("");
      setCurrentComment("");
      
      // Avanzar a siguiente fase sin registro
      setCurrentPhaseIndex(pendingPhaseForHR + 1);
      setPhaseTimeLeft(plan.phases[pendingPhaseForHR + 1].duration);
      setPendingPhaseForHR(null);
      
      // Reanudar automáticamente
      setIsRunning(true);
    }
  };

  const saveSessionToLocalStorage = () => {
    const sessionKey = `bolita-exercise-${plan.slug}-${new Date().toISOString().split('T')[0]}`;
    const sessionData = {
      planName: plan.name,
      date: new Date().toISOString(),
      records: hrRecords
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isRestPhase = currentPhase.name.toLowerCase().includes('descanso') || 
                      currentPhase.intensity === 'pausa';
  const isSetPhase = currentPhase.name.toLowerCase().startsWith('set');

  return (
    <div className="space-y-6">
      {/* Intro narrativa */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-gray-700">
        <p className="font-bubblegum text-lg text-gray-100 italic">{plan.intro}</p>
      </div>

      {/* Objetivo y Foco */}
      {(plan.objective || plan.focus) && (
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {plan.objective && (
            <p className="mb-2">
              <span className="font-bold">Objetivo:</span> {plan.objective}
            </p>
          )}
          {plan.focus && (
            <p>
              <span className="font-bold">Foco:</span> {plan.focus}
            </p>
          )}
        </div>
      )}

      {/* Resumen del plan */}
      <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-caveat text-2xl font-bold mb-4">Tabla del ejercicio</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-bold">Fase</th>
                <th className="text-left p-3 font-bold">Duración</th>
                <th className="text-left p-3 font-bold">Meta</th>
                <th className="text-left p-3 font-bold">Notas</th>
              </tr>
            </thead>
            <tbody>
              {plan.phases.map((phase, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-semibold">{phase.name}</td>
                  <td className="p-3">{Math.floor(phase.duration / 60)}'</td>
                  <td className="p-3">{phase.hrTarget || '—'}</td>
                  <td className="p-3 text-sm text-gray-700">{phase.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          
          {isSetPhase && (
            <div className="mb-4">
              <img 
                src={bolitaWorkout} 
                alt="Bolita entrenando" 
                className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
            </div>
          )}
          
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
          
          {isRestPhase && (
            <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg overflow-hidden">
              <img 
                src={bolitaRest} 
                alt="Bolita en meditación" 
                className="w-full h-96 object-cover"
              />
              {plan.restMessage && (
                <p className="font-bubblegum text-green-800 text-lg p-4">{plan.restMessage}</p>
              )}
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

      {/* Dialog para registrar FC al finalizar set */}
      <Dialog open={showHRDialog} onOpenChange={setShowHRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-caveat text-3xl">
              <Heart className="inline-block mr-2 text-red-500" />
              Registra tu FC
            </DialogTitle>
            <DialogDescription>
              {pendingPhaseForHR !== null && (
                <>
                  Has completado: <span className="font-bold">{plan.phases[pendingPhaseForHR].name}</span>
                  <br />
                  Meta: {plan.phases[pendingPhaseForHR].hrTarget}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="hr-input">Frecuencia Cardíaca (lpm) *</Label>
              <Input
                id="hr-input"
                type="number"
                value={currentHRInput}
                onChange={(e) => setCurrentHRInput(e.target.value)}
                placeholder="Ej: 80"
                className="mt-1"
                min="40"
                max="200"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Tensión Arterial (opcional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="systolic-input" className="text-xs text-gray-600">Sistólica</Label>
                  <Input
                    id="systolic-input"
                    type="number"
                    value={currentSystolicInput}
                    onChange={(e) => setCurrentSystolicInput(e.target.value)}
                    placeholder="120"
                    className="mt-1"
                    min="70"
                    max="200"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic-input" className="text-xs text-gray-600">Diastólica</Label>
                  <Input
                    id="diastolic-input"
                    type="number"
                    value={currentDiastolicInput}
                    onChange={(e) => setCurrentDiastolicInput(e.target.value)}
                    placeholder="80"
                    className="mt-1"
                    min="40"
                    max="130"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Formato: sistólica / diastólica</p>
            </div>
            
            <div>
              <Label htmlFor="comment-input">Comentario (opcional)</Label>
              <Textarea
                id="comment-input"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="¿Cómo te sentiste?"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveHR}
              disabled={!currentHRInput}
              className="flex-1"
            >
              Guardar y continuar
            </Button>
            <Button
              onClick={handleSkipHR}
              variant="outline"
              className="flex-1"
            >
              Saltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resumen de registros de FC */}
      {hrRecords.length > 0 && (
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-caveat text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-red-500" />
            Resumen de tu sesión
          </h3>
          <div className="space-y-3">
            {hrRecords.map((record, idx) => (
              <div key={idx} className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-2 border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">{record.phaseName}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{record.hr} lpm</div>
                    <div className="text-xs text-gray-600">Meta: {record.target}</div>
                    {(record.systolic || record.diastolic) && (
                      <div className="text-sm font-semibold text-blue-600 mt-1">
                        TA: {record.systolic || '?'}/{record.diastolic || '?'} mmHg
                      </div>
                    )}
                  </div>
                </div>
                {record.comment && (
                  <p className="text-sm text-gray-700 italic mt-2 border-t border-red-200 pt-2">
                    "{record.comment}"
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(record.timestamp).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            {isCompleted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300 mt-4">
                <p className="text-center font-bold text-green-800">
                  ✨ Promedio de FC: {Math.round(hrRecords.reduce((sum, r) => sum + r.hr, 0) / hrRecords.length)} lpm
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  {hrRecords.length} registro{hrRecords.length !== 1 ? 's' : ''} completado{hrRecords.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
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
