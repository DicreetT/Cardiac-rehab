export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string[];
}

export interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  image: string;
  exercises: Exercise[];
}

export const plans: Plan[] = [
  {
    id: "1",
    slug: "playa",
    name: "Paseando por la playa",
    description: "Camina y disfruta de la brisa marina",
    duration: "30 min",
    difficulty: "Principiante",
    image: "beach",
    exercises: [
      {
        name: "Caminata por la arena",
        sets: 1,
        reps: "30 min",
        rest: "Sin descanso",
        instructions: [
          "Camina descalzo por la arena si es posible",
          "Mantén un ritmo constante y relajado",
          "Respira profundamente y disfruta del aire fresco",
          "Observa el horizonte y relaja tu mente",
          "Deja que las olas mojen tus pies si te apetece"
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "persecucion",
    name: "Bolita se ha robado las llaves, vamos a atraparla!",
    description: "Ejercicio cardiovascular divertido",
    duration: "15 min",
    difficulty: "Intermedio",
    image: "keys",
    exercises: [
      {
        name: "Sprints de persecución",
        sets: 8,
        reps: "30 seg",
        rest: "60 segundos",
        instructions: [
          "Empieza desde una posición relajada",
          "Corre a máxima velocidad durante 30 segundos",
          "Imagina que persigues a Bolita traviesa",
          "Mantén los brazos en movimiento para mayor impulso",
          "Recupera el aliento durante el descanso"
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "bici-bosque",
    name: "De bici por el bosque",
    description: "Pedalea entre la naturaleza",
    duration: "45 min",
    difficulty: "Intermedio",
    image: "bike",
    exercises: [
      {
        name: "Ciclo por sendero natural",
        sets: 1,
        reps: "45 min",
        rest: "Pausas según necesites",
        instructions: [
          "Ajusta tu bicicleta a una altura cómoda",
          "Mantén un ritmo moderado que puedas sostener",
          "Respeta las señales del sendero",
          "Disfruta del paisaje y el aire fresco",
          "Mantente hidratado durante el recorrido"
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "sincronia",
    name: "Sincronía mente y corazón",
    description: "Conecta con tu interior",
    duration: "20 min",
    difficulty: "Principiante",
    image: "meditation",
    exercises: [
      {
        name: "Meditación y respiración consciente",
        sets: 1,
        reps: "20 min",
        rest: "Sesión continua",
        instructions: [
          "Siéntate en una posición cómoda con la espalda recta",
          "Cierra los ojos y respira profundamente",
          "Enfoca tu atención en tu respiración",
          "Observa tus pensamientos sin juzgarlos",
          "Siente la conexión entre tu mente y tu corazón"
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "volvo-taller",
    name: "El Volvo esta en el taller",
    description: "Camina mientras el coche está en reparación",
    duration: "40 min",
    difficulty: "Principiante",
    image: "volvo",
    exercises: [
      {
        name: "Caminata urbana",
        sets: 1,
        reps: "40 min",
        rest: "Pausas breves si es necesario",
        instructions: [
          "Aprovecha que el coche está en el taller para caminar",
          "Mantén un ritmo constante y cómodo",
          "Observa tu entorno y disfruta del camino",
          "Mantén una postura erguida al caminar",
          "Escucha tu música favorita o un podcast si lo deseas"
        ]
      }
    ]
  }
];

export function planBySlug(slug: string): Plan | undefined {
  return plans.find(p => p.slug === slug);
}
