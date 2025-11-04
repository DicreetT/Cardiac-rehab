-- Add enum and column for member_name in profiles
DO $$ BEGIN
  CREATE TYPE public.family_member AS ENUM ('Ivan','Nicolas','Sonia','Nadia');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS member_name public.family_member;

-- Ensure RLS allows owner to update their own profile (if not already)
DO $$ BEGIN
  CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Optionally allow owner to insert their own profile (safe for manual creation)
DO $$ BEGIN
  CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
