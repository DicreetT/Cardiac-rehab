import { useEffect, useState, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🧭 Manejo de sesión y rol
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        setTimeout(() => {
          checkAdminStatus(currentSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🌱 Sincroniza o crea el perfil si falta
  useEffect(() => {
    const syncProfile = async () => {
      try {
        if (!user) return;

        // ¿Ya existe fila en profiles con este id?
        const { data: existing, error: selErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // PGRST116 = "no rows found", la ignoramos
        if (selErr && selErr.code !== "PGRST116") {
          console.warn("Error consultando profiles:", selErr);
        }

        if (!existing) {
          const fullName =
            (user.user_metadata &&
              (user.user_metadata.full_name || user.user_metadata.name)) ||
            null;

          const { error: insErr } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email!,
            full_name: fullName,
          });

          if (insErr) {
            console.warn("No se pudo crear profiles en sync:", insErr);
          } else {
            console.log("Perfil creado para:", user.email);
          }
        }
      } catch (e) {
        console.warn("syncProfile exception:", e);
      }
    };

    syncProfile();
  }, [user]);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, isLoading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
