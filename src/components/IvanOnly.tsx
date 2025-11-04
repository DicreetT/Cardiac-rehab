import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

export default function IvanOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      type FamilyMember = Database["public"]["Enums"]["family_member"];
      const { data } = await supabase
        .from("profiles")
        .select("member_name")
        .eq("id", user.id)
        .maybeSingle();
      const member = (data?.member_name || null) as FamilyMember | null;
      if (!member) {
        navigate("/choose-avatar", { replace: true });
        return;
      }
      if (member !== "Ivan") {
        navigate(`/member/${member.toLowerCase()}`, { replace: true });
        return;
      }
      setChecking(false);
    };
    run();
  }, [user, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="font-bubblegum text-xl">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
