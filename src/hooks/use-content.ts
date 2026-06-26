import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stats")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourses(opts: { featuredOnly?: boolean } = {}) {
  return useQuery({
    queryKey: ["courses", opts],
    queryFn: async () => {
      let q = supabase.from("courses").select("*").eq("is_published", true).order("sort_order");
      if (opts.featuredOnly) q = q.eq("is_featured", true);
      const { data } = await q;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestimonials(featuredOnly = false) {
  return useQuery({
    queryKey: ["testimonials", featuredOnly],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").eq("is_approved", true).order("sort_order");
      if (featuredOnly) q = q.eq("is_featured", true);
      const { data } = await q;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTalks() {
  return useQuery({
    queryKey: ["talks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("talks")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: false });
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
