import paseoMarImg from "@/assets/bolita-bike-beach.png";
import bolitaLlavesImg from "@/assets/bolita-llaves.png";
import cotilleoMontanaImg from "@/assets/cotilleo-montana.png";
import sincroniaImg from "@/assets/sincronia-mente-corazon.png";
import noDualidadImg from "@/assets/no-dualidad-cuesta-arriba.png";
import volvoTallerImg from "@/assets/volvo-taller.png";

export interface Phase {
  name: string;
  duration: number; // en segundos
  intensity: string;
  hrTarget?: string; // frecuencia cardíaca objetivo
  description: string;
  beepInterval?: number; // intervalo de pitidos en segundos (si aplica)
  beepAction?: string; // acción durante el pitido
}

export interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string;
  intro: string; // narrativa introductoria (frase entre comillas)
  objective?: string; // Objetivo del ejercicio
  focus?: string; // Foco del ejercicio
  duration: string;
  difficulty: string;
  image: string;
  hrRange: string; // rango de FC, ej: "70-85 lpm"
  phases: Phase[];
  restMessage?: string; // mensaje motivacional durante descansos
}

export const plans: Plan[] = [
    {
  id: "1",
  slug: "paseo-mar",
  name: "🏖️ 1. Marcha y tonificación suave",
  description: "Marcha corta + respiraciones que suben un poquito el pulso",
  intro: "“Hoy mezclamos marcha suave con respiraciones. Todo claro y guiado paso a paso.”",
  objective: "Subir ligeramente el pulso sin fatiga y mejorar la tolerancia al esfuerzo.",
  focus: "Ritmo cómodo, hombros sueltos y respiración tranquila.",
  duration: "33 min",
  difficulty: "Principiante",
  image: paseoMarImg,
  hrRange: "Reposo ~40 lpm · En esfuerzo 50–60 lpm (si superas 65 lpm, baja el ritmo)",
  restMessage: "Recupera suave, sacude hombros y muñecas 🌿",
  phases: [
    {
      name: "Calentamiento",
      duration: 300, // 5 min
      intensity: "sin resistencia",
      hrTarget: "Muy cómodo (40–50 lpm).",
      description: "Pedalea sin resistencia. Espalda larga y hombros sueltos. Respira 4s entra / 4s sale."
    },
    {
      name: "Set 1",
      duration: 540, // 9 min: 2' marcha + 3' resp · repetido 1 vez (2+3)×2 = 10… ajusta si prefieres
      intensity: "leve",
      hrTarget: "50–60 lpm. Si hablar cuesta, baja el ritmo.",
      description:
        "Secuencia: 2 min de marcha suave + 3 min de respiración activa (4s entra / 4s sale). " +
        "En cada 30 s, 3–4 pedaladas un poquito más firmes y vuelves al ritmo cómodo. Repite el patrón para completar el set."
    },
    {
      name: "Recuperación",
      duration: 60, // 1 min
      intensity: "pausa",
      description: "Pedaleo muy suave. Respira 4-4. Sacude hombros y muñecas."
    },
    {
      name: "Set 2",
      duration: 540, // 9 min
      intensity: "leve–moderada",
      hrTarget: "50–60 lpm (objetivo 4/10 de esfuerzo).",
      description:
        "Secuencia: 2 min de marcha + 3 min con respiración “elástica”: 4s entra · 1s pausa · 4s sale · 1s pausa. " +
        "En la última exhalación de cada minuto, haz 5 pedaladas firmes sin mover el tronco. Repite para completar el set."
    },
    {
      name: "Recuperación",
      duration: 60, // 1 min
      intensity: "pausa",
      description: "Muy suave. Observa cómo baja el pulso."
    },
    {
      name: "Set 3",
      duration: 540, // 9 min
      intensity: "muy leve (sin resistencia)",
      hrTarget: "Pulso bajando (hacia 45–55 lpm).",
      description:
        "Estirar en la bici, movimientos simples: " +
        "• Cuello lateral (x4 por lado): oreja a hombro, ayuda suave con mano homóloga, cuenta 4; respira 2-2 y cambia. " +
        "• Pectoral (x4 por lado): mano en respaldo/manillar, abre pecho 4, respira 2-2. " +
        "• Espalda alta (x4): manos unidas al frente, redondea espalda 4, respira 2-2. " +
        "• Sentarse/levantarse suave (x4): detén pedaleo, levántate 2-3 s y siéntate; vuelve a pedalear suave. " +
        "• Pantorrillas (x4 por lado): talón “pesado” abajo 4, respira 2-2."
    },
    {
      name: "Enfriamiento",
      duration: 300, // 5 min
      intensity: "sin resistencia",
      hrTarget: "Volver a cómodo (40–50 lpm).",
      description: "Pedaleo sin carga. Respira 4-4 y termina con 3 respiraciones largas (5 entra / 6 sale)."
    }
  ]
},
  {
    id: "2",
    slug: "bolita-llaves",
    name: "🐾 2. Bolita robó tus llaves",
    description: "Ejercicio con fuerza controlada y respiración especial",
    intro: '"La bolita volvió a escapar. Hoy no la sigues, la alcanzas con ritmo y fuerza."',
    objective: "Fortalecer piernas y control de tensión.",
    focus: "Aumentar fuerza muscular sin picos de TA.",
    duration: "26 min",
    difficulty: "Intermedio",
    image: bolitaLlavesImg,
    hrRange: "75-90 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja, TA estable",
        description: "Pedaleo sin carga"
      },
      {
        name: "Set 1",
        duration: 360,
        intensity: "leve-moderada",
        hrTarget: "HR baja–media, TA baja",
        description: '"Pedalea sin estrés, siente el suelo."'
      },
      {
        name: "Descanso 1",
        duration: 120,
        intensity: "pausa",
        description: "Respirar 3–5"
      },
      {
        name: "Set 2",
        duration: 180,
        intensity: "moderada-alta",
        hrTarget: "HR media–alta, TA < techo",
        description: 'Aumenta resistencia: "Empuja con las piernas, hombros relajados."'
      },
      {
        name: "Descanso 2",
        duration: 120,
        intensity: "pausa",
        description: "Respiración 4s in / 4s out"
      },
      {
        name: "Set 3",
        duration: 180,
        intensity: "moderada-alta",
        hrTarget: "HR media–alta",
        description: 'Repite fuerza: "Solo las piernas trabajan."'
      },
      {
        name: "Descanso 3",
        duration: 120,
        intensity: "pausa",
        description: '"Te limpias el sudor. Todo va bien."'
      },
      {
        name: "Set 4",
        duration: 360,
        intensity: "leve",
        hrTarget: "HR baja",
        description: "Sin resistencia. Respiración especial: 6s inhalar, 2s pausa, 6s exhalar, 2s pausa."
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Respiración 6–2–6–2. Sentir latidos calmos."
      }
    ]
  },
  {
    id: "3",
    slug: "cotilleo-montana",
    name: "🌄 3. De cotilleo por la montaña",
    description: "Entrena recuperación entre esfuerzos",
    intro: '"Chismoseando senderos: subes suave, bajas tierno."',
    objective: "Entrenar recuperación entre esfuerzos.",
    focus: "Alternar carga / descanso y sentir la variación natural.",
    duration: "28 min",
    difficulty: "Intermedio",
    image: cotilleoMontanaImg,
    hrRange: "70-85 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Suave, respirar 5s in / 5s out"
      },
      {
        name: "Set 1",
        duration: 300,
        intensity: "leve-moderada",
        hrTarget: "HR media",
        description: "Coherencia (respiración guiada)"
      },
      {
        name: "Descanso 1",
        duration: 180,
        intensity: "pausa",
        description: '"Siente los latidos en tus manos."'
      },
      {
        name: "Set 2",
        duration: 300,
        intensity: "moderada",
        hrTarget: "HR media",
        description: "Moderado, mantén respiración constante"
      },
      {
        name: "Descanso 2",
        duration: 180,
        intensity: "pausa",
        description: '"Afloja el cuello."'
      },
      {
        name: "Set 3",
        duration: 300,
        intensity: "leve",
        hrTarget: "HR baja",
        description: "Escaneo corporal: siente pies, piernas, abdomen, brazos, cara."
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Respira 4–4, escucha tu corazón."
      }
    ]
  },
  {
    id: "4",
    slug: "sincronia-mente-corazon",
    name: "💓 4. Sincronía mente–corazón",
    description: "Conecta respiración con latido, reduce estrés",
    intro: '"El cuerpo sigue el pulso del corazón, y el corazón sigue el ritmo de tu mente."',
    objective: "Conectar respiración con latido, reducir estrés.",
    focus: "Coherencia cardíaca y conciencia corporal.",
    duration: "28 min",
    difficulty: "Principiante",
    image: sincroniaImg,
    hrRange: "65-75 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Suave, respirar 5s in / 5s out"
      },
      {
        name: "Set 1",
        duration: 480,
        intensity: "muy leve",
        hrTarget: "HR baja",
        description: "Coherencia (respiración guiada)"
      },
      {
        name: "Descanso",
        duration: 120,
        intensity: "pausa",
        description: '"Siente los latidos en tus manos."'
      },
      {
        name: "Set 2",
        duration: 480,
        intensity: "leve",
        hrTarget: "HR media",
        description: "Moderado, mantén respiración constante"
      },
      {
        name: "Descanso 2",
        duration: 120,
        intensity: "pausa",
        description: '"Afloja el cuello."'
      },
      {
        name: "Set 3",
        duration: 360,
        intensity: "muy leve",
        hrTarget: "HR baja",
        description: "Escaneo corporal: siente pies, piernas, abdomen, brazos, cara."
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Respira 4–4, escucha tu corazón."
      }
    ]
  },
  {
    id: "5",
    slug: "no-dualidad",
    name: "🧘 5. La no dualidad va cuesta arriba",
    description: "Postura correcta y consciencia de alineación",
    intro: '"Subir sin empujar, bajar sin caer. Uno en el movimiento."',
    objective: "Postura correcta y consciencia de alineación.",
    focus: "Fortalecer sin rigidez, mantener eje corporal.",
    duration: "22 min",
    difficulty: "Intermedio",
    image: noDualidadImg,
    hrRange: "70-85 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 360,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Siente pelvis estable, manos ligeras"
      },
      {
        name: "Set 1",
        duration: 240,
        intensity: "moderada",
        hrTarget: "HR media",
        description: "Subida controlada: pelvis neutra, mirada al frente"
      },
      {
        name: "Set 2",
        duration: 120,
        intensity: "leve",
        hrTarget: "HR baja",
        description: "Llano, hombros sueltos"
      },
      {
        name: "Set 3",
        duration: 240,
        intensity: "moderada",
        hrTarget: "HR media",
        description: "Subida con pitido cada 60 s → revisa postura: columna, hombros, muñecas, respiración.",
        beepInterval: 60,
        beepAction: "Revisa postura: columna, hombros, muñecas, respiración"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Cierra ojos, respira 4–6, siente eje central"
      }
    ]
  },
  {
    id: "6",
    slug: "volvo-taller",
    name: "🚲 6. He dejado el Volvo en el taller",
    description: "Ritmo progresivo y respiración profunda",
    intro: '"El coche descansa. Hoy el motor eres tú."',
    objective: "Ritmo progresivo y respiración profunda, trabajo cardiovascular sostenido.",
    focus: "Recuperar confianza y tolerancia al esfuerzo.",
    duration: "30 min",
    difficulty: "Intermedio",
    image: volvoTallerImg,
    hrRange: "75-90 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Sin carga, respirar 4–4"
      },
      {
        name: "Set 1",
        duration: 420,
        intensity: "leve-moderada",
        hrTarget: "HR media–baja",
        description: "Pedal fluido, ritmo cómodo"
      },
      {
        name: "Descanso 1",
        duration: 120,
        intensity: "pausa",
        description: "Hidratación"
      },
      {
        name: "Set 2",
        duration: 420,
        intensity: "moderada",
        hrTarget: "HR media",
        description: "Mantén ritmo constante, respiración rítmica"
      },
      {
        name: "Descanso 2",
        duration: 120,
        intensity: "pausa",
        description: '"Escucha tu pulso, no tu mente."'
      },
      {
        name: "Set 3",
        duration: 420,
        intensity: "moderada-alta",
        hrTarget: "HR media–alta",
        description: "Pequeños sprints de 10 s cada 90 s → pitido suave",
        beepInterval: 90,
        beepAction: "Sprint de 10 segundos"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Respiración triangular: 4 s inhalar, 4 s retener, 4 s exhalar"
      }
    ]
  }
];

export function planBySlug(slug: string): Plan | undefined {
  return plans.find(p => p.slug === slug);
}
