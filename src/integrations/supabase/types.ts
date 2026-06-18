export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string | null
          content_en: string | null
          content_hy: string | null
          content_ru: string | null
          cover_image_url: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_hy: string | null
          excerpt_ru: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: Json | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content_en?: string | null
          content_hy?: string | null
          content_ru?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_hy?: string | null
          excerpt_ru?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: Json | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content_en?: string | null
          content_hy?: string | null
          content_ru?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_hy?: string | null
          excerpt_ru?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: Json | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description_en: string | null
          description_hy: string | null
          description_ru: string | null
          duration: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          level: string | null
          outcomes_en: Json | null
          outcomes_hy: Json | null
          outcomes_ru: Json | null
          prerequisites_en: string | null
          prerequisites_hy: string | null
          prerequisites_ru: string | null
          slug: string
          sort_order: number | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string | null
          outcomes_en?: Json | null
          outcomes_hy?: Json | null
          outcomes_ru?: Json | null
          prerequisites_en?: string | null
          prerequisites_hy?: string | null
          prerequisites_ru?: string | null
          slug: string
          sort_order?: number | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string | null
          outcomes_en?: Json | null
          outcomes_hy?: Json | null
          outcomes_ru?: Json | null
          prerequisites_en?: string | null
          prerequisites_hy?: string | null
          prerequisites_ru?: string | null
          slug?: string
          sort_order?: number | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          description_en: string | null
          description_hy: string | null
          description_ru: string | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          name: string
          sort_order: number | null
          type: string | null
          website_url: string | null
        }
        Insert: {
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          name: string
          sort_order?: number | null
          type?: string | null
          website_url?: string | null
        }
        Update: {
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          type?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          bio_en: string | null
          bio_hy: string | null
          bio_ru: string | null
          cv_url: string | null
          email: string | null
          facebook_url: string | null
          github_url: string | null
          headline_en: string | null
          headline_hy: string | null
          headline_ru: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          photo_url: string | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          bio_en?: string | null
          bio_hy?: string | null
          bio_ru?: string | null
          cv_url?: string | null
          email?: string | null
          facebook_url?: string | null
          github_url?: string | null
          headline_en?: string | null
          headline_hy?: string | null
          headline_ru?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          bio_en?: string | null
          bio_hy?: string | null
          bio_ru?: string | null
          cv_url?: string | null
          email?: string | null
          facebook_url?: string | null
          github_url?: string | null
          headline_en?: string | null
          headline_hy?: string | null
          headline_ru?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          demo_url: string | null
          description_en: string | null
          description_hy: string | null
          description_ru: string | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          screenshot_urls: Json | null
          sort_order: number | null
          technologies: Json | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          screenshot_urls?: Json | null
          sort_order?: number | null
          technologies?: Json | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          demo_url?: string | null
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          screenshot_urls?: Json | null
          sort_order?: number | null
          technologies?: Json | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          icon: string | null
          id: string
          is_visible: boolean | null
          label_en: string | null
          label_hy: string | null
          label_ru: string | null
          sort_order: number | null
          value: string
        }
        Insert: {
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label_en?: string | null
          label_hy?: string | null
          label_ru?: string | null
          sort_order?: number | null
          value: string
        }
        Update: {
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label_en?: string | null
          label_hy?: string | null
          label_ru?: string | null
          sort_order?: number | null
          value?: string
        }
        Relationships: []
      }
      talks: {
        Row: {
          city: string | null
          country: string | null
          country_flag: string | null
          created_at: string
          description_en: string | null
          description_hy: string | null
          description_ru: string | null
          event_date: string | null
          id: string
          is_international: boolean | null
          is_published: boolean | null
          is_upcoming: boolean | null
          organization: string | null
          photo_url: string | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
          type: string | null
          video_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_flag?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          event_date?: string | null
          id?: string
          is_international?: boolean | null
          is_published?: boolean | null
          is_upcoming?: boolean | null
          organization?: string | null
          photo_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          type?: string | null
          video_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_flag?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          event_date?: string | null
          id?: string
          is_international?: boolean | null
          is_published?: boolean | null
          is_upcoming?: boolean | null
          organization?: string | null
          photo_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          type?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          name: string
          organization: string | null
          role: string | null
          sort_order: number | null
          text_en: string | null
          text_hy: string | null
          text_ru: string | null
          type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name: string
          organization?: string | null
          role?: string | null
          sort_order?: number | null
          text_en?: string | null
          text_hy?: string | null
          text_ru?: string | null
          type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name?: string
          organization?: string | null
          role?: string | null
          sort_order?: number | null
          text_en?: string | null
          text_hy?: string | null
          text_ru?: string | null
          type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          description_en: string | null
          description_hy: string | null
          description_ru: string | null
          duration: string | null
          id: string
          is_published: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title_en: string | null
          title_hy: string | null
          title_ru: string | null
          youtube_id: string | null
          youtube_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          youtube_id?: string | null
          youtube_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_hy?: string | null
          description_ru?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_en?: string | null
          title_hy?: string | null
          title_ru?: string | null
          youtube_id?: string | null
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
