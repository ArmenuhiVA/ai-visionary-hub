import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
