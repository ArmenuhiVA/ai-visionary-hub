
-- Roles enum + table for admin gating
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- First signed-up user automatically becomes admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER bootstrap_first_admin_trg
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- Generic updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- PROFILE
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Dr. Varazdat Avetisyan',
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  headline_hy TEXT, headline_ru TEXT, headline_en TEXT,
  bio_hy TEXT, bio_ru TEXT, bio_en TEXT,
  photo_url TEXT, cv_url TEXT,
  email TEXT DEFAULT 'avetvarazdat@gmail.com',
  phone TEXT,
  location TEXT DEFAULT 'Yerevan, Armenia',
  linkedin_url TEXT, github_url TEXT, facebook_url TEXT, instagram_url TEXT, youtube_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profile TO anon, authenticated;
GRANT ALL ON public.profile TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.profile TO authenticated;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admins write profile" ON public.profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER profile_updated_at BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- STATS
CREATE TABLE public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT, value TEXT NOT NULL,
  label_hy TEXT, label_ru TEXT, label_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true
);
GRANT SELECT ON public.stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.stats TO authenticated;
GRANT ALL ON public.stats TO service_role;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stats" ON public.stats FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins manage stats" ON public.stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COURSES
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  description_hy TEXT, description_ru TEXT, description_en TEXT,
  cover_image_url TEXT, duration TEXT,
  level TEXT CHECK (level IN ('Beginner','Intermediate','Advanced')),
  outcomes_hy JSONB DEFAULT '[]', outcomes_ru JSONB DEFAULT '[]', outcomes_en JSONB DEFAULT '[]',
  prerequisites_hy TEXT, prerequisites_ru TEXT, prerequisites_en TEXT,
  is_featured BOOLEAN DEFAULT false, is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- VIDEOS
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url TEXT NOT NULL, youtube_id TEXT, thumbnail_url TEXT,
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  description_hy TEXT, description_ru TEXT, description_en TEXT,
  category TEXT, duration TEXT,
  sort_order INTEGER DEFAULT 0, is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read videos" ON public.videos FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TALKS
CREATE TABLE public.talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  organization TEXT, event_date DATE, city TEXT, country TEXT, country_flag TEXT,
  type TEXT CHECK (type IN ('Conference Talk','Keynote','Workshop','Panel Discussion','Podcast','Interview','Guest Article','Media Mention')),
  is_international BOOLEAN DEFAULT false, is_upcoming BOOLEAN DEFAULT false,
  description_hy TEXT, description_ru TEXT, description_en TEXT,
  photo_url TEXT, video_url TEXT, is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.talks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.talks TO authenticated;
GRANT ALL ON public.talks TO service_role;
ALTER TABLE public.talks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read talks" ON public.talks FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage talks" ON public.talks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  description_hy TEXT, description_ru TEXT, description_en TEXT,
  category TEXT CHECK (category IN ('AI','Data Science','Educational','Mobile App','Research')),
  technologies JSONB DEFAULT '[]', screenshot_urls JSONB DEFAULT '[]',
  github_url TEXT, demo_url TEXT,
  is_featured BOOLEAN DEFAULT false, is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_hy TEXT, title_ru TEXT, title_en TEXT,
  excerpt_hy TEXT, excerpt_ru TEXT, excerpt_en TEXT,
  content_hy TEXT, content_ru TEXT, content_en TEXT,
  cover_image_url TEXT, category TEXT, tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false, published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage blog_posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, role TEXT, organization TEXT,
  text_hy TEXT, text_ru TEXT, text_en TEXT,
  avatar_url TEXT,
  type TEXT CHECK (type IN ('student','university','corporate')),
  is_featured BOOLEAN DEFAULT false, is_approved BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PARTNERS
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, logo_url TEXT, website_url TEXT,
  type TEXT CHECK (type IN ('university','training','company','ngo')),
  description_hy TEXT, description_ru TEXT, description_en TEXT,
  sort_order INTEGER DEFAULT 0, is_published BOOLEAN DEFAULT true
);
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CONTACT MESSAGES
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
