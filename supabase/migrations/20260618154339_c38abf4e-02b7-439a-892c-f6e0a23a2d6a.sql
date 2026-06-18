
CREATE POLICY "Public read video-thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'video-thumbnails');
CREATE POLICY "Admin insert video-thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'video-thumbnails' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update video-thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'video-thumbnails' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete video-thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'video-thumbnails' AND has_role(auth.uid(), 'admin'));
