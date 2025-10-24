-- Crear enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabla de sesiones de ejercicio
CREATE TABLE public.exercise_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_slug TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden insertar sus propias sesiones
CREATE POLICY "Users can insert their own sessions"
  ON public.exercise_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo admins pueden ver sesiones
CREATE POLICY "Admins can view all sessions"
  ON public.exercise_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de registros de frecuencia cardíaca
CREATE TABLE public.hr_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.exercise_sessions(id) ON DELETE CASCADE NOT NULL,
  phase_name TEXT NOT NULL,
  hr INTEGER NOT NULL CHECK (hr >= 40 AND hr <= 200),
  systolic INTEGER CHECK (systolic IS NULL OR (systolic >= 70 AND systolic <= 200)),
  diastolic INTEGER CHECK (diastolic IS NULL OR (diastolic >= 40 AND diastolic <= 130)),
  target TEXT NOT NULL,
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.hr_records ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden insertar sus propios registros
CREATE POLICY "Users can insert their own hr records"
  ON public.hr_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercise_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Solo admins pueden ver registros
CREATE POLICY "Admins can view all hr records"
  ON public.hr_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de registros SOS
CREATE TABLE public.sos_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.exercise_sessions(id) ON DELETE CASCADE NOT NULL,
  phase_name TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.sos_records ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden insertar sus propios registros SOS
CREATE POLICY "Users can insert their own sos records"
  ON public.sos_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercise_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Solo admins pueden ver registros SOS
CREATE POLICY "Admins can view all sos records"
  ON public.sos_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para actualizar updated_at en profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Asignar rol de usuario por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();