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
    slug: "sentadillas",
    name: "Sentadillas",
    description: "Fortalece tus piernas y glúteos",
    duration: "10 min",
    difficulty: "Principiante",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Sentadillas básicas",
        sets: 3,
        reps: "15-20",
        rest: "30 segundos",
        instructions: [
          "Párate con los pies separados al ancho de los hombros",
          "Baja lentamente como si fueras a sentarte en una silla",
          "Mantén la espalda recta y las rodillas alineadas con los pies",
          "Baja hasta que tus muslos estén paralelos al suelo",
          "Empuja a través de los talones para volver a la posición inicial"
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "flexiones",
    name: "Flexiones",
    description: "Trabaja pecho, brazos y core",
    duration: "8 min",
    difficulty: "Intermedio",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Flexiones de pecho",
        sets: 3,
        reps: "10-15",
        rest: "45 segundos",
        instructions: [
          "Colócate en posición de plancha con las manos al ancho de los hombros",
          "Mantén el cuerpo en línea recta desde la cabeza hasta los talones",
          "Baja el pecho hacia el suelo doblando los codos",
          "Empuja hacia arriba hasta extender los brazos completamente",
          "Mantén el core activado durante todo el movimiento"
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "plancha",
    name: "Plancha",
    description: "Fortalece el core y la estabilidad",
    duration: "5 min",
    difficulty: "Principiante",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Plancha abdominal",
        sets: 3,
        reps: "30-60 seg",
        rest: "30 segundos",
        instructions: [
          "Apóyate sobre los antebrazos y las puntas de los pies",
          "Mantén el cuerpo en línea recta, sin arquear ni hundir la cadera",
          "Contrae los abdominales y los glúteos",
          "Mantén la cabeza alineada con la columna",
          "Respira de manera constante durante toda la plancha"
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "burpees",
    name: "Burpees",
    description: "Ejercicio cardiovascular completo",
    duration: "12 min",
    difficulty: "Avanzado",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Burpees completos",
        sets: 4,
        reps: "8-12",
        rest: "60 segundos",
        instructions: [
          "Comienza de pie con los pies al ancho de los hombros",
          "Baja a una posición de sentadilla y coloca las manos en el suelo",
          "Salta con los pies hacia atrás para quedar en posición de plancha",
          "Realiza una flexión (opcional para principiantes)",
          "Salta con los pies hacia adelante y haz un salto vertical"
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "abdominales",
    name: "Abdominales",
    description: "Tonifica tu abdomen",
    duration: "10 min",
    difficulty: "Principiante",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Abdominales clásicos",
        sets: 3,
        reps: "20-25",
        rest: "30 segundos",
        instructions: [
          "Acuéstate boca arriba con las rodillas dobladas",
          "Coloca las manos detrás de la cabeza o cruzadas sobre el pecho",
          "Contrae los abdominales y levanta los hombros del suelo",
          "Mantén la barbilla separada del pecho",
          "Baja lentamente sin dejar que los hombros toquen el suelo"
        ]
      }
    ]
  },
  {
    id: "6",
    slug: "saltos",
    name: "Saltos de Cuerda",
    description: "Mejora resistencia cardiovascular",
    duration: "15 min",
    difficulty: "Intermedio",
    image: "/bolita/doctor.png",
    exercises: [
      {
        name: "Saltos básicos",
        sets: 5,
        reps: "2-3 min",
        rest: "60 segundos",
        instructions: [
          "Sostén los mangos de la cuerda con las manos a los lados",
          "Mantén los codos cerca del cuerpo",
          "Gira la cuerda con las muñecas, no con los brazos",
          "Salta lo justo para que la cuerda pase bajo tus pies",
          "Aterriza suavemente sobre las puntas de los pies"
        ]
      }
    ]
  }
];

export function planBySlug(slug: string): Plan | undefined {
  return plans.find(p => p.slug === slug);
}
