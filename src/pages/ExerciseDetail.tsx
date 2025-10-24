import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Flame, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bolitaLab from "@/assets/bolita-lab.png";
import { toast } from "sonner";

const exerciseData: Record<string, {
  name: string;
  duration: string;
  calories: number;
  description: string;
  instructions: string[];
  sets: number;
  reps: string;
}> = {
  sentadillas: {
    name: "Sentadillas",
    duration: "10 min",
    calories: 80,
    description: "Fortalece tus piernas y glúteos",
    instructions: [
      "Párate con los pies separados al ancho de los hombros",
      "Baja lentamente como si fueras a sentarte en una silla",
      "Mantén la espalda recta y las rodillas alineadas con los pies",
      "Baja hasta que tus muslos estén paralelos al suelo",
      "Empuja a través de los talones para volver a la posición inicial"
    ],
    sets: 3,
    reps: "15-20"
  },
  flexiones: {
    name: "Flexiones",
    duration: "8 min",
    calories: 60,
    description: "Trabaja pecho, brazos y core",
    instructions: [
      "Colócate en posición de plancha con las manos al ancho de los hombros",
      "Mantén el cuerpo en línea recta desde la cabeza hasta los talones",
      "Baja el pecho hacia el suelo doblando los codos",
      "Empuja hacia arriba hasta extender los brazos completamente",
      "Mantén el core activado durante todo el movimiento"
    ],
    sets: 3,
    reps: "10-15"
  },
  plancha: {
    name: "Plancha",
    duration: "5 min",
    calories: 40,
    description: "Fortalece el core y la estabilidad",
    instructions: [
      "Apóyate sobre los antebrazos y las puntas de los pies",
      "Mantén el cuerpo en línea recta, sin arquear ni hundir la cadera",
      "Contrae los abdominales y los glúteos",
      "Mantén la cabeza alineada con la columna",
      "Respira de manera constante durante toda la plancha"
    ],
    sets: 3,
    reps: "30-60 seg"
  },
  burpees: {
    name: "Burpees",
    duration: "12 min",
    calories: 120,
    description: "Ejercicio cardiovascular completo",
    instructions: [
      "Comienza de pie con los pies al ancho de los hombros",
      "Baja a una posición de sentadilla y coloca las manos en el suelo",
      "Salta con los pies hacia atrás para quedar en posición de plancha",
      "Realiza una flexión (opcional para principiantes)",
      "Salta con los pies hacia adelante y haz un salto vertical"
    ],
    sets: 4,
    reps: "8-12"
  },
  abdominales: {
    name: "Abdominales",
    duration: "10 min",
    calories: 50,
    description: "Tonifica tu abdomen",
    instructions: [
      "Acuéstate boca arriba con las rodillas dobladas",
      "Coloca las manos detrás de la cabeza o cruzadas sobre el pecho",
      "Contrae los abdominales y levanta los hombros del suelo",
      "Mantén la barbilla separada del pecho",
      "Baja lentamente sin dejar que los hombros toquen el suelo"
    ],
    sets: 3,
    reps: "20-25"
  },
  saltos: {
    name: "Saltos de Cuerda",
    duration: "15 min",
    calories: 150,
    description: "Mejora resistencia cardiovascular",
    instructions: [
      "Sostén los mangos de la cuerda con las manos a los lados",
      "Mantén los codos cerca del cuerpo",
      "Gira la cuerda con las muñecas, no con los brazos",
      "Salta lo justo para que la cuerda pase bajo tus pies",
      "Aterriza suavemente sobre las puntas de los pies"
    ],
    sets: 5,
    reps: "2-3 min"
  }
};

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = id ? exerciseData[id] : null;

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ejercicio no encontrado</h1>
          <Link to="/exercises">
            <Button>Volver a ejercicios</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
    
    if (!completedDays.includes(today)) {
      completedDays.push(today);
      localStorage.setItem('completedDays', JSON.stringify(completedDays));
    }

    toast.success("¡Guau! ¡Ejercicio completado!", {
      description: "Has marcado el día de hoy como completado."
    });

    setTimeout(() => {
      navigate('/exercises');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link to="/exercises" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a ejercicios</span>
        </Link>

        <div className="text-center mb-8">
          <img src={bolitaLab} alt="Dr. Bolita" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-4xl font-bold text-foreground mb-2">{exercise.name}</h1>
          <p className="text-xl text-muted-foreground">{exercise.description}</p>
        </div>

        <Card className="mb-6 bg-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Información del ejercicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold">{exercise.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                <span className="font-semibold">{exercise.calories} cal</span>
              </div>
            </div>
            <div className="text-lg">
              <span className="font-semibold">{exercise.sets} series</span> de{" "}
              <span className="font-semibold">{exercise.reps} repeticiones</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Cómo hacerlo</CardTitle>
            <CardDescription>Sigue estos pasos para realizar el ejercicio correctamente</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-base pt-1">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Button 
          onClick={handleComplete}
          className="w-full py-6 text-lg font-semibold"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          ¡Completar ejercicio!
        </Button>
      </div>
    </div>
  );
};

export default ExerciseDetail;
