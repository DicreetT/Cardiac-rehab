-- Agregar políticas para que usuarios puedan ver sus propios datos
CREATE POLICY "Users can view their own sessions"
ON public.exercise_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own hr records"
ON public.hr_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM exercise_sessions
    WHERE exercise_sessions.id = hr_records.session_id
    AND exercise_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own sos records"
ON public.sos_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM exercise_sessions
    WHERE exercise_sessions.id = sos_records.session_id
    AND exercise_sessions.user_id = auth.uid()
  )
);