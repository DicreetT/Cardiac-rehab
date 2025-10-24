-- Drop the old policy that only allows admins to view roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create new policies: users can view their own roles, admins can view all roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));