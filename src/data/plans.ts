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
  intro: string; // narrativa introductoria
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
    name: "Paseo por el mar 🏖️",
    description: "Pedalea suave como si estuvieras junto al mar",
    intro: "Imagina la brisa marina mientras pedaleas tranquilamente. Hoy vamos a disfrutar de un paseo relajante.",
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
        description: "activar músculos, respiración lenta"
      },
      {
        name: "Set 1",
        duration: 540,
        intensity: "leve",
        hrTarget: "70-75 lpm",
        description: "pedalear sin resistencia, meta calor muscular"
      },
      {
        name: "Descanso 1",
        duration: 180,
        intensity: "pausa",
        description: "recuperación activa"
      },
      {
        name: "Set 2",
        duration: 540,
        intensity: "moderada",
        hrTarget: "80 lpm",
        description: "ritmo que permita hablar, meta 80 lpm, sin elevar TA"
      },
      {
        name: "Descanso 2",
        duration: 180,
        intensity: "pausa",
        description: "recuperación activa"
      },
      {
        name: "Set 3",
        duration: 540,
        intensity: "leve con levantadas",
        hrTarget: "75-80 lpm",
        description: "pedaleo suave, cada 30 s pitido → ponerse de pie 2 s",
        beepInterval: 30,
        beepAction: "¡De pie 2 segundos!"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "respiración 4 s inspira / 4 s espira"
      }
    ]
  },
  {
    id: "2",
    slug: "subida-zen",
    name: "Subida zen 🚴‍♂️",
    description: "Sube la montaña con calma y determinación",
    intro: "Hoy escalamos una montaña imaginaria. Cada pedalada te acerca a la cima.",
    duration: "35 min",
    difficulty: "Intermedio",
    image: "bike",
    hrRange: "75-90 lpm",
    restMessage: "Pausa para admirar el paisaje desde la altura 🏔️",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "preparar el cuerpo para el esfuerzo"
      },
      {
        name: "Set 1",
        duration: 480,
        intensity: "moderada",
        hrTarget: "80 lpm",
        description: "comenzamos la subida con ritmo constante"
      },
      {
        name: "Descanso 1",
        duration: 120,
        intensity: "pausa",
        description: "recuperación breve"
      },
      {
        name: "Set 2",
        duration: 480,
        intensity: "moderada-alta",
        hrTarget: "85 lpm",
        description: "aumentamos resistencia, seguimos subiendo"
      },
      {
        name: "Descanso 2",
        duration: 120,
        intensity: "pausa",
        description: "recuperación breve"
      },
      {
        name: "Set 3",
        duration: 480,
        intensity: "alta",
        hrTarget: "90 lpm",
        description: "último empujón hacia la cima"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "bajada suave y respiración profunda"
      }
    ]
  },
  {
    id: "3",
    slug: "camino-bosque",
    name: "Camino del bosque 🌿",
    description: "Explora senderos naturales a tu ritmo",
    intro: "Adéntrate en el bosque, donde cada pedalada te conecta con la naturaleza.",
    duration: "40 min",
    difficulty: "Intermedio",
    image: "bike",
    hrRange: "70-85 lpm",
    restMessage: "Pausa para escuchar los pájaros y respirar aire fresco 🌳",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "entrada suave al bosque"
      },
      {
        name: "Set 1",
        duration: 600,
        intensity: "leve-moderada",
        hrTarget: "75 lpm",
        description: "ritmo constante por el sendero"
      },
      {
        name: "Descanso 1",
        duration: 150,
        intensity: "pausa",
        description: "recuperación y observación"
      },
      {
        name: "Set 2",
        duration: 600,
        intensity: "moderada",
        hrTarget: "80 lpm",
        description: "avanzamos por terreno variado"
      },
      {
        name: "Descanso 2",
        duration: 150,
        intensity: "pausa",
        description: "recuperación y observación"
      },
      {
        name: "Set 3",
        duration: 600,
        intensity: "leve",
        hrTarget: "75 lpm",
        description: "regreso tranquilo"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "salida del bosque con respiración profunda"
      }
    ]
  },
  {
    id: "4",
    slug: "respiracion-equilibrio",
    name: "Respiración y equilibrio 🌬️",
    description: "Conecta cuerpo y mente con movimiento consciente",
    intro: "Hoy el ejercicio es interno. Cada respiración cuenta, cada pedalada es meditación.",
    duration: "25 min",
    difficulty: "Principiante",
    image: "meditation",
    hrRange: "65-75 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "respiración consciente, enfoque mental"
      },
      {
        name: "Set 1",
        duration: 420,
        intensity: "muy leve",
        hrTarget: "70 lpm",
        description: "pedaleo suave coordinado con respiración"
      },
      {
        name: "Set 2",
        duration: 420,
        intensity: "muy leve",
        hrTarget: "70 lpm",
        description: "mantener la conexión mente-cuerpo"
      },
      {
        name: "Enfriamiento",
        duration: 360,
        intensity: "sin resistencia",
        description: "respiración profunda 5 s inspira / 5 s espira"
      }
    ]
  },
  {
    id: "5",
    slug: "rueda-interior",
    name: "Rueda interior 🔄",
    description: "Gira y fluye con tu propio ritmo",
    intro: "Hoy exploramos nuestro ritmo interno. Como una rueda que gira sin prisa pero sin pausa.",
    duration: "30 min",
    difficulty: "Intermedio",
    image: "keys",
    hrRange: "75-85 lpm",
    restMessage: "Pausa para resetear y volver a empezar 🔄",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "iniciar el movimiento circular"
      },
      {
        name: "Set 1",
        duration: 480,
        intensity: "moderada",
        hrTarget: "80 lpm",
        description: "encuentra tu ritmo natural"
      },
      {
        name: "Descanso 1",
        duration: 120,
        intensity: "pausa",
        description: "breve pausa"
      },
      {
        name: "Set 2",
        duration: 480,
        intensity: "moderada",
        hrTarget: "82 lpm",
        description: "mantén el flujo constante"
      },
      {
        name: "Descanso 2",
        duration: 120,
        intensity: "pausa",
        description: "breve pausa"
      },
      {
        name: "Set 3",
        duration: 480,
        intensity: "moderada",
        hrTarget: "80 lpm",
        description: "cierre del ciclo con conciencia"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "desaceleración gradual"
      }
    ]
  },
  {
    id: "6",
    slug: "mente-corazon",
    name: "Mente-corazón sincronía 💓",
    description: "Sincroniza pensamiento, respiración y movimiento",
    intro: "La verdadera fuerza viene de la sincronía entre mente y corazón. Hoy los unimos.",
    duration: "28 min",
    difficulty: "Principiante",
    image: "meditation",
    hrRange: "70-80 lpm",
    phases: [
      {
        name: "Calentamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "conectar con el cuerpo y la respiración"
      },
      {
        name: "Set 1",
        duration: 480,
        intensity: "leve",
        hrTarget: "72 lpm",
        description: "pedaleo consciente, observa tu corazón"
      },
      {
        name: "Descanso",
        duration: 120,
        intensity: "pausa",
        description: "momento de introspección"
      },
      {
        name: "Set 2",
        duration: 480,
        intensity: "leve-moderada",
        hrTarget: "78 lpm",
        description: "aumenta intensidad manteniendo la calma mental"
      },
      {
        name: "Enfriamiento",
        duration: 300,
        intensity: "sin resistencia",
        description: "cierre con gratitud, respiración 4-4"
      }
    ]
  }
];

export function planBySlug(slug: string): Plan | undefined {
  return plans.find(p => p.slug === slug);
}
