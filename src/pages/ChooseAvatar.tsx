import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BubbleBackground from "@/components/BubbleBackground";

type FamilyMember = Database["public"]["Enums"]["family_member"];

const AVATARS = [
  { key: "Ivan", label: "Iván", emoji: "🧔" },
  { key: "Nicolas", label: "Nicolás", emoji: "🧑" },
  { key: "Sonia", label: "Sonia", emoji: "👩" },
  { key: "Nadia", label: "Nadia", emoji: "👧" },
] as const;

export default function ChooseAvatar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no hay usuario, volver a /auth
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const handleSelect = async (member: typeof AVATARS[number]["key"]) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ member_name: member as FamilyMember })
        .eq("id", user.id);
      if (error) throw error;

      const lower = member.toLowerCase();
      if (member === "Ivan") navigate("/plans");
      else navigate(`/member/${lower}`);
    } catch (e) {
      console.error("Error setting member_name", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
      <BubbleBackground count={6} minSize={40} maxSize={120} />
      <div className="max-w-5xl mx-auto p-6 sm:p-10 relative z-10">
        <Card className="border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="font-caveat text-4xl text-center">
              Elige tu avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-700 mb-6">
              Selecciona tu representante en la familia para personalizar tu experiencia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {AVATARS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => handleSelect(a.key)}
                  disabled={loading}
                  className="group bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition"
                >
                  <div className="text-6xl text-center mb-3">{a.emoji}</div>
                  <div className="text-center font-bubblegum text-lg">{a.label}</div>
                </button>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button onClick={() => navigate("/plans")} variant="outline" className="font-bubblegum">
                Saltar por ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
