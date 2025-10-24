import { Link } from "react-router-dom";
import { Dumbbell, Clock, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import bolitaHappy from "@/assets/bolita-happy.png";

const exercises = [
  {
    id: "sentadillas",
    name: "Sentadillas",
    duration: "10 min",
    calories: 80,
    description: "Fortalece tus piernas y glúteos"
  },
  {
    id: "flexiones",
    name: "Flexiones",
    duration: "8 min",
    calories: 60,
    description: "Trabaja pecho, brazos y core"
  },
  {
    id: "plancha",
    name: "Plancha",
    duration: "5 min",
    calories: 40,
    description: "Fortalece el core y la estabilidad"
  },
  {
    id: "burpees",
    name: "Burpees",
    duration: "12 min",
    calories: 120,
    description: "Ejercicio cardiovascular completo"
  },
  {
    id: "abdominales",
    name: "Abdominales",
    duration: "10 min",
    calories: 50,
    description: "Tonifica tu abdomen"
  },
  {
    id: "saltos",
    name: "Saltos de Cuerda",
    duration: "15 min",
    calories: 150,
    description: "Mejora resistencia cardiovascular"
  }
];

const Exercises = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <img src={bolitaHappy} alt="Bolita feliz" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-4xl font-bold text-foreground mb-2">¡Guau!</h1>
          <p className="text-xl text-muted-foreground">Elige tu ejercicio de hoy</p>
        </div>

        <div className="grid gap-4 mb-6">
          {exercises.map((exercise) => (
            <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Dumbbell className="w-6 h-6 text-primary" />
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="text-base">{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      <span>{exercise.calories} cal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <Link to="/calendar" className="flex-1">
            <button className="w-full bg-secondary text-secondary-foreground py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
              Ver Calendario
            </button>
          </Link>
          <Link to="/" className="flex-1">
            <button className="w-full bg-muted text-foreground py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
              Salir
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Exercises;
