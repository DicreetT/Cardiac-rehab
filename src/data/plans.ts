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
  slug: "marcha-tonificacion",
  name: "🚶‍♀️ 1. Marcha + Tonificación suave",
  description: "Alterna marcha controlada y respiración activa para mejorar ritmo y control cardiovascular, con estiramientos guiados al final.",
  // 👇 Intro con “tabla” de rangos personalizada para él
  intro:
    "Tus rangos de hoy:\n" +
    "• FC en reposo: 40–45 lpm\n" +
    "• FC durante ejercicio: 50–60 lpm (si pasas de 62, baja el ritmo)\n" +
    "• TA habitual: 120–140 / 70–85 mmHg\n" +
    "• Meta durante ejercicio: ≤ 150/85 mmHg (si sube >150/90 o te mareas → pausa y SOS)\n" +
    "• Esfuerzo (RPE): 3–4/10 → cómodo, puedes hablar en frases cortas\n\n" +
    "Hoy damos los primeros pasos de la nueva fase: ritmo suave, respiración consciente y buena energía. Tras cada bloque activo tendrás 1′ de recuperación suave para registrar FC/TA y sensaciones.",
  objective: "Subir pulsaciones de forma controlada y tonificar sin fatiga.",
  focus: "Resistencia aeróbica ligera y control respiratorio.",
  duration: "40 min",
  difficulty: "Intermedio",
  image: paseoMarImg, // usa tu imagen de portada favorita
  hrRange: "50–60 lpm",
  restMessage: "Recupera el ritmo, respira suave y toma agua 💧",
  phases: [
    {
      name: "Calentamiento",
      duration: 300, // 5 min
      intensity: "suave sin resistencia",
      hrTarget: "HR ≤ 50 lpm",
      description: "Marcha en el sitio 2′ + movilidad (cuello, hombros, tobillos) 2′ + respiración 3–3 (1′)."
    },
    {
      name: "Set 1",
      duration: 600, // 10 min
      intensity: "moderada",
      hrTarget: "HR 50–60 lpm",
      description:
        "Alterna 2′ de marcha continua (paso corto y estable) + 3′ de respiración activa (inhala 3, exhala 3). Repite 2 veces. " +
        "Si superas 62 lpm o notas fatiga, baja el ritmo."
    },
    {
      name: "Recuperación 1",
      duration: 60, // 1 min
      intensity: "muy suave",
      description: "Caminata ligera o respiración tranquila. Anota FC/TA y sensaciones. SOS si hace falta."
    },
    {
      name: "Set 2",
      duration: 600, // 10 min (puedes usar marcha o bici, como prefieras este día)
      intensity: "ligera-media",
      hrTarget: "HR 50–60 lpm",
      description:
        "Repite el patrón 2′ marcha + 3′ respiración diafragmática. Mantén el control del pulso y la respiración. " +
        "Si prefieres, este set puede hacerse en bici con resistencia media (2′ pedaleo cómodo + 3′ respiración en pedaleo suave)."
    },
    {
      name: "Recuperación 2",
      duration: 60, // 1 min
      intensity: "suave",
      description: "Respira, hidrátate, y registra FC/TA y comentario. Si el esfuerzo fue >4/10, considera repetir este set."
    },
    {
      name: "Set 3 · Estiramientos guiados",
      duration: 540, // 9 min
      intensity: "muy ligera",
      hrTarget: "HR bajando hacia 45–50 lpm",
      description:
        "1) Cuello lateral (oreja a hombro) 2×20″ por lado, ayuda suave con la mano.\n" +
        "2) Pectoral en pared 2×20″ por lado (palma en pared, abre pecho con giro suave).\n" +
        "3) Espalda alta (abrazo) 2×20″ (mentón suave hacia el pecho, respira amplio atrás).\n" +
        "4) Isquios sentado 2×20″ por lado (espalda larga, mano hacia el pie). " +
        "Respira 2–2 con calma y sin dolor."
    },
    {
      name: "Enfriamiento",
      duration: 240, // 4 min
      intensity: "sin resistencia",
      hrTarget: "HR ≤ 50",
      description: "Respira profundo (2–2), hombros sueltos, siente el latido calmarse. Finaliza con una inhalación larga y exhala lento."
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
