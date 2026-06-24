
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS instructor text,
  ADD COLUMN IF NOT EXISTS schedule_hy text,
  ADD COLUMN IF NOT EXISTS schedule_ru text,
  ADD COLUMN IF NOT EXISTS schedule_en text,
  ADD COLUMN IF NOT EXISTS tools jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS enrollment_url text;
