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
  rpe?: { min: number; max: number };
}

export const plans: Plan[] = [
  {
  id: "1",
  slug: "paseo-mar",
  name: "🏖️ 1. Paseo por el mar (bici solo al inicio y al final)",
  description:
    "Caliento y enfrío en bici. En el medio hago marcha, fuerza muy suave y movilidad SIN bici, con respiraciones guiadas.",
  intro:
    "La brisa trae calma. Hoy pedaleas solo para entrar y salir del ejercicio; el trabajo principal lo haces en el suelo, con tu propio cuerpo.",
  objective: "Activar el cuerpo, mover articulaciones y subir ligeramente pulsaciones sin forzar.",
  focus: "Respiración consciente, control del ritmo y confianza en el movimiento.",
  duration: "≈ 25 min",
  difficulty: "Principiante",
  image: paseoMarImg,
    rpe: { min: 2, max: 4 },
  hrRange: "Rango general de frecuencia cardíaca: 48–60 lpm (bajo esfuerzo).",
  restMessage:
    "Respira por la nariz, hombros sueltos, mandíbula relajada. No hay prisa: el descanso también es parte del trabajo.",
  phases: [
    // ---------- BICI: CALENTAMIENTO ----------
    {
      name: "Calentamiento (en bici)",
      duration: 300, // 5 min
      intensity: "muy suave, sin resistencia",
      hrTarget: "Entre 48 y 56 lpm.",
      description:
        "Pedalea sin resistencia, a ritmo lento y constante. Imagina que paseas junto al mar. Respira 4 segundos por la nariz y exhala 4 por la boca. Hombros y manos relajadas.",
    },

    // ---------- BLOQUE SIN BICI ----------
    {
      name: "Set 1 (sin bici) · Marcha cómoda + brazos",
      duration: 180, // 3 min
      intensity: "suave",
      hrTarget: "Entre 50 y 58 lpm.",
      description:
        "Camina en el sitio o por la habitación. Balancea los brazos a los lados. Cada 30 segundos, eleva un poco las rodillas durante 5–6 pasos y vuelve al ritmo cómodo. 🌬️\n" +
        "👉 RPE (Esfuerzo percibido): **3/10** — puedes mantener una conversación sin dificultad.",
    },
    {
      name: "Recuperación 1 (sin bici) · Respiración de caja",
      duration: 60,
      intensity: "pausa activa",
      description:
        "De pie o sentado: respira 4 segundos entrando aire, 4 mantén, 4 suelta, 4 mantén sin aire. Repite este ritmo completo al menos tres veces. 🕊️",
    },

    {
      name: "Set 2 (sin bici) · Silla: fuerza controlada",
      duration: 240, // 4 min
      intensity: "suave-media",
      hrTarget: "Hasta 60 lpm.",
      description:
        "Coloca una silla detrás. Haz 60 segundos de sentarte y levantarte muy lento, con control (usa las manos si lo necesitas). Luego 60 segundos de puntillas y talones alternando, agarrándote al respaldo si lo prefieres.\n" +
        "👉 Repite ese bloque **dos veces seguidas** (4 minutos en total).\n" +
        "👉 RPE: **4/10** — notas el esfuerzo, pero sigues respirando con calma.",
    },
    {
      name: "Recuperación 2 (sin bici) · Nariz–nariz",
      duration: 60,
      intensity: "pausa",
      description:
        "Respira solo por la nariz: inhala 4 segundos, exhala 4 segundos. Deja que el aire entre suave. Sacude brazos y hombros. 🌸",
    },

    {
      name: "Set 3 (sin bici) · Movilidad guiada paso a paso",
      duration: 300, // 5 min
      intensity: "muy suave",
      hrTarget: "Entre 48 y 56 lpm.",
      description:
        "🌿 Vamos a mover todo el cuerpo con calma. Cambia de ejercicio cada pitido (cada 60 s):\n\n" +
        "1️⃣ **Cuello:** Inclina oreja hacia hombro derecho, ayuda con la mano muy suave. 4 respiraciones por lado.\n" +
        "2️⃣ **Hombros:** Círculos grandes hacia atrás (10), luego hacia delante (10). Respira profundo.\n" +
        "3️⃣ **Columna:** Brazos cruzados sobre el pecho. Gira el tronco suave a un lado y al otro. 6 veces cada lado.\n" +
        "4️⃣ **Tobillos:** Círculos con el pie derecho 10 veces por sentido; cambia de pie.\n" +
        "5️⃣ **Pantorrillas:** Apoya manos en pared, pierna atrás, talón al suelo. Mantén 20 s y cambia.\n\n" +
        "👉 RPE: **2/10** — debe sentirse relajante y fluido, sin esfuerzo. Si notas rigidez, disminuye la amplitud del movimiento.",
      beepInterval: 60,
      beepAction: "Cambio de ejercicio dentro del set de movilidad",
    },

    // ---------- BICI: ENFRIAMIENTO ----------
    {
      name: "Enfriamiento (en bici)",
      duration: 240, // 4 min
      intensity: "muy suave, sin resistencia",
      hrTarget: "Vuelve lentamente hacia 48–52 lpm.",
      description:
        "Pedalea suave, sin presión. Nariz–nariz: 5 segundos entrar, 5 segundos salir. Cierra con tres respiraciones largas. Agradece el esfuerzo de tu cuerpo. 💛\n" +
        "👉 RPE: **2/10** — sensación de ligereza y recuperación.",
    },
  ],
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
    rpe: { min: 2, max: 4 },
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
    rpe: { min: 2, max: 4 },
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
    rpe: { min: 2, max: 4 },
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
    rpe: { min: 2, max: 4 },
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
    rpe: { min: 2, max: 4 },
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
