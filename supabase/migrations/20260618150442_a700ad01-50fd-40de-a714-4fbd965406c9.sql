
DO $$
DECLARE b TEXT;
BEGIN
  FOR b IN SELECT unnest(ARRAY['profile-images','course-covers','talk-photos','project-screenshots','partner-logos','testimonial-avatars','blog-covers','cv-documents'])
  LOOP
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = %L)', 'Public read ' || b, b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))', 'Admin insert ' || b, b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))', 'Admin update ' || b, b);
    EXECUTE format('CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))', 'Admin delete ' || b, b);
  END LOOP;
END $$;
