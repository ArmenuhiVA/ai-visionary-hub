
-- Add viewer role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Languages table
CREATE TABLE IF NOT EXISTS public.site_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  flag text,
  enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_languages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_languages TO authenticated;
GRANT ALL ON public.site_languages TO service_role;
ALTER TABLE public.site_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read languages" ON public.site_languages FOR SELECT USING (true);
CREATE POLICY "Admins manage languages" ON public.site_languages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_site_languages_updated_at BEFORE UPDATE ON public.site_languages FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.site_languages (code, label, flag, sort_order) VALUES
  ('en','English','🇬🇧',1),
  ('hy','Հայերեն','🇦🇲',2),
  ('ru','Русский','🇷🇺',3)
ON CONFLICT (code) DO NOTHING;

-- Theme colors table
CREATE TABLE IF NOT EXISTS public.theme_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hex text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.theme_colors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_colors TO authenticated;
GRANT ALL ON public.theme_colors TO service_role;
ALTER TABLE public.theme_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read theme colors" ON public.theme_colors FOR SELECT USING (true);
CREATE POLICY "Admins manage theme colors" ON public.theme_colors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_theme_colors_updated_at BEFORE UPDATE ON public.theme_colors FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.theme_colors (name, hex, is_default, sort_order) VALUES
  ('Cyan', '#06b6d4', true, 1),
  ('Violet', '#8b5cf6', false, 2),
  ('Emerald', '#10b981', false, 3),
  ('Amber', '#f59e0b', false, 4),
  ('Rose', '#f43f5e', false, 5);
