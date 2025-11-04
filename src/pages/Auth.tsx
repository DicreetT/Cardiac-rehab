import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BubbleBackground from "@/components/BubbleBackground";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

 const routeAfterAuth = async (userId: string) => {
  type FamilyMember = Database["public"]["Enums"]["family_member"];
  const { data } = await supabase
    .from("profiles")
    .select("member_name")
    .eq("id", userId)
    .maybeSingle();
  const member = (data?.member_name || null) as FamilyMember | null;
  if (!member) {
    navigate("/choose-avatar");
    return;
  }
  const lower = member.toLowerCase();
  if (member === "Ivan") navigate("/plans");
  else navigate(`/member/${lower}`);
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente" });
      const uid = data.user?.id;
      if (uid) await routeAfterAuth(uid);
      else navigate("/choose-avatar");
    } else {
      // 1) Crear usuario en Auth con metadata (full_name)
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/plans`,
        },
      });
      if (error) throw error;

      // 2) Crear fila en "profiles" (¡clave para el JOIN del Admin!)
      const newUser = signUpData.user;
      if (newUser) {
        const { error: profileErr } = await supabase.from("profiles").insert({
          id: newUser.id,          // FK = auth.users.id
          email: newUser.email!,   // correo
          full_name: fullName || null,
        });
        if (profileErr) {
          // No frenamos el flujo, solo informamos en consola
          console.warn("No se pudo crear profiles en registro:", profileErr);
        }
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Elige tu avatar para continuar.",
      });
      if (signUpData.user?.id) await routeAfterAuth(signUpData.user.id);
      else navigate("/choose-avatar");
    }
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Ups…",
      description: err?.message ?? "Ocurrió un error",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden flex items-center justify-center">
      <BubbleBackground count={8} minSize={40} maxSize={120} />
      
      <Card className="w-full max-w-md mx-4 relative z-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="font-caveat text-3xl text-center">
            {isLogin ? "¡Bienvenido!" : "Crea tu cuenta"}
          </CardTitle>
          <CardDescription className="text-center font-bubblegum">
            {isLogin ? "Inicia sesión para continuar" : "Únete y empieza a entrenar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Tu nombre"
                  className="border-2 border-black"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="border-2 border-black"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••"
                className="border-2 border-black"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bubblegum text-lg"
              disabled={loading}
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
