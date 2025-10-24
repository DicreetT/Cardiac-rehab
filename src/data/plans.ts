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
    name: "🏖️ 1. Paseo por el mar",
    description: "Pedalea suave como si estuvieras junto al mar",
    intro: '"La brisa trae calma. Hoy pedaleas como si el océano respirara contigo."',
    objective: "Recuperar movilidad, ritmo, respiración constante.",
    focus: "Control del pulso sin forzar.",
    duration: "37 min",
    difficulty: "Principiante",
    image: "beach",
    hrRange: "70-85 lpm",
    restMessage: "Paras en un puesto de arepas a tomarte un juguito y recuperar fuerzas 🍍",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR <70% del rango, TA estable",
        description: "Sin resistencia, solo fluir"
      },
      {
        name: "Set 1",
        duration: 540,
        intensity: "leve",
        hrTarget: "HR baja, meta entrar en ritmo",
        description: "Sentir calor muscular"
      },
      {
        name: "Descanso 1",
        duration: 180,
        intensity: "pausa",
        description: '"Juguito de piña 🍍, hombros sueltos."'
      },
      {
        name: "Set 2",
        duration: 540,
        intensity: "moderada",
        hrTarget: "HR media (≈80 lpm)",
        description: "Moderado, respirar 4–4"
      },
      {
        name: "Descanso 2",
        duration: 180,
        intensity: "pausa",
        description: '"El mar suena más cerca."'
      },
      {
        name: "Set 3",
        duration: 540,
        intensity: "leve",
        hrTarget: "HR baja, pitido cada 30 s",
        description: "Levantarse 2–3 s cada aviso",
        beepInterval: 30,
        beepAction: "¡Levantarse 2-3 segundos!"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        hrTarget: "HR baja",
        description: "Respirar 4s in / 4s out"
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
    image: "keys",
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
    image: "bike",
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
        duration: 480,
        intensity: "leve-moderada",
        hrTarget: "HR media",
        description: "Coherencia (respiración guiada)"
      },
      {
        name: "Descanso 1",
        duration: 120,
        intensity: "pausa",
        description: '"Siente los latidos en tus manos."'
      },
      {
        name: "Set 2",
        duration: 480,
        intensity: "moderada",
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
    image: "meditation",
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
    image: "meditation",
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
    image: "volvo",
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
