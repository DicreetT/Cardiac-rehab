import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plan } from "@/data/plans";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import bolitaHappy from "@/assets/bolita-happy.png";
import bolitaZen from "@/assets/bolita-zen.png";
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
import RPECard from "@/components/RPECard";

interface ExerciseTimerProps {
  plan: Plan;
  onComplete: () => void;
}

interface HRRecord {
  phaseName: string;
  hr: number;
  systolic?: number;
  diastolic?: number;
  target: string;
  comment?: string;
  timestamp: string;
}

interface SOSRecord {
  phaseName: string;
  symptoms: string;
  timestamp: string;
}

export default function ExerciseTimer({ plan, onComplete }: ExerciseTimerProps) {
  const { user } = useAuth();

  // sesión y flujo
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // fase y tiempo
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(plan.phases[0].duration);

  // registros
  const [hrRecords, setHrRecords] = useState<HRRecord[]>([]);
  const [sosRecords, setSOSRecords] = useState<SOSRecord[]>([]);

  // modales
  const [showHRDialog, setShowHRDialog] = useState(false);
  const [showSOSDialog, setShowSOSDialog] = useState(false);
  const [pendingPhaseForHR, setPendingPhaseForHR] = useState<number | null>(null);

  // inputs de modal HR/SOS
  const [currentHRInput, setCurrentHRInput] = useState("");
  const [currentSystolicInput, setCurrentSystolicInput] = useState("");
  const [currentDiastolicInput, setCurrentDiastolicInput] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [currentSOSInput, setCurrentSOSInput] = useState("");

  // audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastBeepRef = useRef<number>(0);

  // derivados
  const currentPhase = plan.phases[currentPhaseIndex];
  const totalDuration = plan.phases.reduce((acc, p) => acc + p.duration, 0);
  const elapsedTotal =
    plan.phases.slice(0, currentPhaseIndex).reduce((acc, p) => acc + p.duration, 0) +
    (currentPhase.duration - phaseTimeLeft);
  const progressPercent = (elapsedTotal / totalDuration) * 100;

  // crear/resumir AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playBeep = (frequency: number = 800, duration: number = 0.2) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    osc.frequency.value = frequency;
    osc.type = "sine";

    const t = audioContextRef.current.currentTime;
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    osc.start(t);
    osc.stop(t + duration);
  };

  // TIMER PRINCIPAL — con 3–2–1 y beepInterval
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        // cuenta atrás final: 3–2–1
        if (prev === 3) playBeep(880, 0.18);
        if (prev === 2) playBeep(980, 0.18);
        if (prev === 1) playBeep(1200, 0.22);

        // fin de fase
        if (prev <= 1) {
          const finishedPhase = plan.phases[currentPhaseIndex];
          const isSetPhase =
            finishedPhase.name.toLowerCase().startsWith("set") && !!finishedPhase.hrTarget;
          const isWarmupPhase =
            finishedPhase.name.toLowerCase().includes("calentamiento") && !!finishedPhase.hrTarget;

          if (currentPhaseIndex < plan.phases.length - 1) {
            // pedir FC si aplica
            if (isSetPhase || isWarmupPhase) {
              setIsRunning(false);
              setPendingPhaseForHR(currentPhaseIndex);
              setShowHRDialog(true);
            } else {
              setCurrentPhaseIndex((i) => i + 1);
              return plan.phases[currentPhaseIndex + 1].duration;
            }
          } else {
            setIsRunning(false);
            setIsCompleted(true);
            saveSessionToDatabase();
            return 0;
          }
        }

        // pitidos intermedios
        if (currentPhase.beepInterval) {
          const elapsed = currentPhase.duration - prev;
          if (
            elapsed > 0 &&
            elapsed % currentPhase.beepInterval === 0 &&
            lastBeepRef.current !== elapsed
          ) {
            playBeep(600, 0.15);
            lastBeepRef.current = elapsed;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCompleted, currentPhaseIndex, currentPhase, plan.phases]);

  // beep al iniciar nueva fase
  useEffect(() => {
    if (isRunning && currentPhaseIndex > 0) {
      playBeep(800, 0.25);
      lastBeepRef.current = 0;
    }
  }, [currentPhaseIndex, isRunning]);

  const handleStart = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (!sessionId && user) {
      const { data } = await supabase
        .from("exercise_sessions")
        .insert({
          user_id: user.id,
          plan_slug: plan.slug,
          plan_name: plan.name,
        })
        .select()
        .single();
      if (data) setSessionId(data.id);
    }

    setIsRunning(true);

    setTimeout(() => playBeep(800, 0.22), 100);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentPhaseIndex(0);
    setPhaseTimeLeft(plan.phases[0].duration);
    setHrRecords([]);
    setSOSRecords([]);
    setShowHRDialog(false);
    setShowSOSDialog(false);
    setPendingPhaseForHR(null);
    setCurrentHRInput("");
    setCurrentSystolicInput("");
    setCurrentDiastolicInput("");
    setCurrentComment("");
    setCurrentSOSInput("");
    lastBeepRef.current = 0;
  };   const handleSaveHR = () => {
    if (pendingPhaseForHR !== null && currentHRInput) {
      const phase = plan.phases[pendingPhaseForHR];
      const newRecord: HRRecord = {
        phaseName: phase.name,
        hr: parseInt(currentHRInput),
        systolic: currentSystolicInput ? parseInt(currentSystolicInput) : undefined,
        diastolic: currentDiastolicInput ? parseInt(currentDiastolicInput) : undefined,
        target: phase.hrTarget || "",
        comment: currentComment.trim() || undefined,
        timestamp: new Date().toISOString(),
      };

      setHrRecords((r) => [...r, newRecord]);

      // limpiar y avanzar
      setShowHRDialog(false);
      setCurrentHRInput("");
      setCurrentSystolicInput("");
      setCurrentDiastolicInput("");
      setCurrentComment("");

      setCurrentPhaseIndex(pendingPhaseForHR + 1);
      setPhaseTimeLeft(plan.phases[pendingPhaseForHR + 1].duration);
      setPendingPhaseForHR(null);
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

      setCurrentPhaseIndex(pendingPhaseForHR + 1);
      setPhaseTimeLeft(plan.phases[pendingPhaseForHR + 1].duration);
      setPendingPhaseForHR(null);
      setIsRunning(true);
    }
  };

  const handleOpenSOS = () => setShowSOSDialog(true);

  const handleSaveSOS = async () => {
    if (currentSOSInput.trim() && sessionId) {
      const newSOSRecord: SOSRecord = {
        phaseName: currentPhase.name,
        symptoms: currentSOSInput.trim(),
        timestamp: new Date().toISOString(),
      };

      await supabase.from("sos_records").insert({
        session_id: sessionId,
        phase_name: newSOSRecord.phaseName,
        symptoms: newSOSRecord.symptoms,
      });

      setSOSRecords((r) => [...r, newSOSRecord]);
      setShowSOSDialog(false);
      setCurrentSOSInput("");
    }
  };

  const saveSessionToDatabase = async () => {
    if (!sessionId) return;

    await supabase.from("exercise_sessions").update({ completed: true }).eq("id", sessionId);

    for (const record of hrRecords) {
      await supabase.from("hr_records").insert({
        session_id: sessionId,
        phase_name: record.phaseName,
        hr: record.hr,
        systolic: record.systolic,
        diastolic: record.diastolic,
        target: record.target,
        comment: record.comment,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isRestPhase =
    currentPhase.name.toLowerCase().includes("descanso") ||
    currentPhase.name.toLowerCase().includes("recuperación") ||
    currentPhase.intensity === "pausa";

  const isSetPhase = currentPhase.name.toLowerCase().startsWith("set");
  const isWarmupPhase = currentPhase.name.toLowerCase().includes("calentamiento");
  const isCooldownPhase = currentPhase.name.toLowerCase().includes("enfriamiento");

  const showSOSButton = isSetPhase || isWarmupPhase || isCooldownPhase;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-gray-700">
        <p className="font-bubblegum text-lg text-gray-100 italic">{plan.intro}</p>
      </div>

      {/* Objetivo / Foco */}
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

      {/* RPE bonito */}
      <RPECard min={plan.rpe?.min ?? 2} max={plan.rpe?.max ?? 4} />

      {/* Tabla del plan */}
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
                  <td className="p-3">{phase.hrTarget || "—"}</td>
                  <td className="p-3 text-sm text-gray-700">{phase.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cronómetro */}
      <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-6">
          <div
            className={`inline-block px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 ${
              isRestPhase ? "bg-blue-300" : "bg-yellow-400"
            }`}
          >
            <h2 className="font-caveat text-4xl font-bold">{currentPhase.name}</h2>
          </div>

          {isSetPhase && (
            <div className="mt-4 mb-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg overflow-hidden p-4">
              <img src={bolitaHappy} alt="Bolita entrenando" className="w-full h-80 object-contain" />
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
              <p className="text-sm font-semibold text-orange-800">🔔 {currentPhase.beepAction}</p>
            </div>
          )}

          {isRestPhase && (
            <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg overflow-hidden">
              <img
                src={bolitaZen}
                alt="Bolita en meditación"
                className="w-full h-96 object-cover object-top"
              />
              {plan.restMessage && (
                <p className="font-bubblegum text-green-800 text-lg p-4">
                  {plan.restMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <Progress value={progressPercent} className="h-3" />
          <p className="text-center text-sm text-gray-600 mt-2">
            Fase {currentPhaseIndex + 1} de {plan.phases.length}
          </p>
        </div>

        {/* Controles */}
        <div className="flex gap-3 justify-center flex-wrap">
          {!isRunning ? (
            <Button onClick={handleStart} size="lg" className="font-bubblegum text-lg" disabled={isCompleted}>
              <Play className="mr-2" />
              {currentPhaseIndex === 0 && phaseTimeLeft === plan.phases[0].duration ? "Iniciar" : "Reanudar"}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" size="lg" className="font-bubblegum text-lg">
              <Pause className="mr-2" />
              Pausar
            </Button>
          )}

          <Button onClick={handleReset} variant="outline" size="lg" className="font-bubblegum text-lg">
            <RotateCcw className="mr-2" />
            Reiniciar
          </Button>

          {showSOSButton && (
            <Button
              onClick={handleOpenSOS}
              variant="destructive"
              size="lg"
              className="font-bubblegum text-lg bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="mr-2" />
              SOS
            </Button>
          )}
        </div>
      </div>

      {/* Modal SOS */}
      <Dialog open={showSOSDialog} onOpenChange={setShowSOSDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-caveat text-3xl text-red-600">
              <AlertTriangle className="inline-block mr-2" />
              Registro SOS
            </DialogTitle>
            <DialogDescription>
              Describe cómo te sientes en este momento. Esto nos ayuda a cuidarte mejor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="sos-input">Síntomas o sensaciones</Label>
              <Textarea
                id="sos-input"
                value={currentSOSInput}
                onChange={(e) => setCurrentSOSInput(e.target.value)}
                placeholder="Ej.: palpitaciones, opresión en el pecho, mareo, sofoco…"
                className="mt-1"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Si persisten o empeoran, detén el ejercicio y avisa.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSaveSOS}
              disabled={!currentSOSInput.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Guardar registro
            </Button>
            <Button
              onClick={() => {
                setShowSOSDialog(false);
                setCurrentSOSInput("");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal HR */}
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
                  Has completado:{" "}
                  <span className="font-bold">{plan.phases[pendingPhaseForHR].name}</span>
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
                placeholder="Ej.: 58"
                className="mt-1"
                min="30"
                max="200"
              />
            </div>

            <div>
              <Label className="mb-2 block">Tensión Arterial (opcional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="systolic-input" className="text-xs text-gray-600">
                    Sistólica
                  </Label>
                  <Input
                    id="systolic-input"
                    type="number"
                    value={currentSystolicInput}
                    onChange={(e) => setCurrentSystolicInput(e.target.value)}
                    placeholder="120"
                    className="mt-1"
                    min="70"
                    max="220"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic-input" className="text-xs text-gray-600">
                    Diastólica
                  </Label>
                  <Input
                    id="diastolic-input"
                    type="number"
                    value={currentDiastolicInput}
                    onChange={(e) => setCurrentDiastolicInput(e.target.value)}
                    placeholder="80"
                    className="mt-1"
                    min="40"
                    max="140"
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
                placeholder="¿Cómo te sentiste en este set?"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveHR} disabled={!currentHRInput} className="flex-1">
              Guardar y continuar
            </Button>
            <Button onClick={handleSkipHR} variant="outline" className="flex-1">
              Saltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resumen FC */}
      {hrRecords.length > 0 && (
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-caveat text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-red-500" />
            Resumen de tu sesión
          </h3>
          <div className="space-y-3">
            {hrRecords.map((r, i) => (
              <div key={i} className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-2 border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">{r.phaseName}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{r.hr} lpm</div>
                    <div className="text-xs text-gray-600">Meta: {r.target}</div>
                    {(r.systolic || r.diastolic) && (
                      <div className="text-sm font-semibold text-blue-600 mt-1">
                        TA: {r.systolic || "?"}/{r.diastolic || "?"} mmHg
                      </div>
                    )}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-700 italic mt-2 border-t border-red-200 pt-2">
                    "{r.comment}"
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(r.timestamp).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {isCompleted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300 mt-4">
                <p className="text-center font-bold text-green-800">
                  ✨ Promedio de FC:{" "}
                  {Math.round(hrRecords.reduce((s, r) => s + r.hr, 0) / hrRecords.length)} lpm
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  {hrRecords.length} registro{hrRecords.length !== 1 ? "s" : ""} completado
                  {hrRecords.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registros SOS */}
      {sosRecords.length > 0 && (
        <div className="bg-red-50 p-6 rounded-xl border-2 border-red-400 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <h3 className="font-caveat text-2xl font-bold mb-4 flex items-center gap-2 text-red-700">
            <AlertTriangle className="text-red-600" />
            Registros SOS
          </h3>
          <div className="space-y-3">
            {sosRecords.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border-2 border-red-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">{r.phaseName}</span>
                  <div className="text-xs text-gray-600">
                    {new Date(r.timestamp).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <p className="text-sm text-gray-700 bg-red-50 p-3 rounded border border-red-200">
                  {r.symptoms}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-300">
            <p className="text-sm text-red-800 font-semibold">
              ⚠️ Si los síntomas persisten o empeoran, detén el ejercicio y consulta con tu médico.
            </p>
          </div>
        </div>
      )}

      {/* Completar */}
      {isCompleted && (
        <Button onClick={onComplete} size="lg" className="w-full font-bubblegum text-lg">
          <CheckCircle className="mr-2" />
          ¡Marcar como completado!
        </Button>
      )}
    </div>
  );
}
