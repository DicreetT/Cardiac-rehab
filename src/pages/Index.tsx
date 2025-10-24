import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import bolitaDoctor from "@/assets/bolita-doctor.png";

const Index = () => {
  const [code, setCode] = useState("");
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.toLowerCase() === "iván" || code.toLowerCase() === "ivan") {
      // Check if it's mobile
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        toast.success("¡Bienvenido, Iván! 🐕", {
          description: "Acceso concedido. ¡Vamos a ejercitarnos!"
        });
        setTimeout(() => {
          navigate("/exercises");
        }, 1000);
      } else {
        setShowMobileWarning(true);
      }
    } else {
      toast.error("Código incorrecto", {
        description: "Por favor, verifica el código e intenta de nuevo."
      });
    }
  };

  if (showMobileWarning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-card border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={bolitaDoctor} alt="Dr. Bolita" className="w-32 h-32 rounded-full object-cover" />
            </div>
            <CardTitle className="text-3xl mb-2">¡Guau!</CardTitle>
            <CardDescription className="text-lg">
              <span className="font-bold text-foreground">¡Wuff! ¡Solo para móviles!</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/20 p-6 rounded-lg border-2 border-accent">
              <p className="text-foreground text-center leading-relaxed">
                <span className="font-bold">Bolita dice:</span><br/><br/>
                ¡Hola amigo! Esta aventura de salud está diseñada para disfrutarse en la palma de tu mano.
                <br/><br/>
                Por favor, ábrela en tu teléfono móvil para que podamos ejercitarnos juntos. ¡Guau!
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">¡Escanea el código QR!</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <div className="w-48 h-48 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  [Código QR aquí]
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowMobileWarning(false)} 
              variant="outline"
              className="w-full"
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <p className="text-accent text-lg font-semibold mb-2">¡Bienvenido!</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Organización de Salud Bolita
          </h1>
        </div>

        <Card className="bg-card border-2 mb-6">
          <CardHeader className="text-center pb-4">
            <img src={bolitaDoctor} alt="Dr. Bolita" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground text-center leading-relaxed">
              Bienvenido/a a la Organización de Salud Bolita. Estamos especializados en acompañar a los papás 
              en su camino hacia una salud próspera y nos alegra que te unas a nuestro programa.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground text-center">
                Introduce el código que tu doctora asignada para papás, <span className="font-bold">Thalia</span>, 
                te entregó para obtener acceso y empezar a ponerte realmente en forma, aquí:
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Código de acceso"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg py-6 border-2"
              />
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold"
                size="lg"
              >
                ¡Entrar!
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              * Thalia podrá seguir tu progreso y ayudarte durante todo el proceso.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
