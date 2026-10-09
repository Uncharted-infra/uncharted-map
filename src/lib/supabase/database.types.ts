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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      inventory: {
        Row: {
          id: string
          label: string
          qty: number
          reorder_point: number
          shop_id: string
          sku: string
          supplier: string
          unit: string
        }
        Insert: {
          id?: string
          label: string
          qty?: number
          reorder_point?: number
          shop_id: string
          sku: string
          supplier?: string
          unit: string
        }
        Update: {
          id?: string
          label?: string
          qty?: number
          reorder_point?: number
          shop_id?: string
          sku?: string
          supplier?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "unclaimed_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          available: boolean
          bestseller: boolean
          category: string
          description: string
          flavor_tags: string[]
          id: string
          name: string
          photo: string | null
          price_cents: number
          shop_id: string
          sort: number
        }
        Insert: {
          available?: boolean
          bestseller?: boolean
          category: string
          description?: string
          flavor_tags?: string[]
          id?: string
          name: string
          photo?: string | null
          price_cents: number
          shop_id: string
          sort?: number
        }
        Update: {
          available?: boolean
          bestseller?: boolean
          category?: string
          description?: string
          flavor_tags?: string[]
          id?: string
          name?: string
          photo?: string | null
          price_cents?: number
          shop_id?: string
          sort?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "unclaimed_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          item_id: string | null
          name: string
          options: Json
          order_id: string
          qty: number
          unit_price_cents: number
        }
        Insert: {
          id?: string
          item_id?: string | null
          name: string
          options?: Json
          order_id: string
          qty: number
          unit_price_cents: number
        }
        Update: {
          id?: string
          item_id?: string | null
          name?: string
          options?: Json
          order_id?: string
          qty?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_email: string
          customer_name: string
          fulfillment: string
          id: string
          placed_at: string
          shop_id: string
          status: string
          total_cents: number
        }
        Insert: {
          customer_email?: string
          customer_name?: string
          fulfillment?: string
          id?: string
          placed_at?: string
          shop_id: string
          status?: string
          total_cents?: number
        }
        Update: {
          customer_email?: string
          customer_name?: string
          fulfillment?: string
          id?: string
          placed_at?: string
          shop_id?: string
          status?: string
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "unclaimed_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      sales_daily: {
        Row: {
          date: string
          item_id: string
          revenue_cents: number
          shop_id: string
          units: number
        }
        Insert: {
          date: string
          item_id: string
          revenue_cents?: number
          shop_id: string
          units?: number
        }
        Update: {
          date?: string
          item_id?: string
          revenue_cents?: number
          shop_id?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_daily_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_daily_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_daily_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "unclaimed_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_members: {
        Row: {
          created_at: string
          profile_id: string
          role: string
          shop_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          role?: string
          shop_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          role?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_members_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_members_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "unclaimed_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string
          categories: string[]
          city: string
          created_at: string
          hours: Json
          id: string
          lat: number
          lng: number
          name: string
          phone: string
          photo: string | null
          slug: string
          state: string
          status: string
          story: string
        }
        Insert: {
          address?: string
          categories?: string[]
          city?: string
          created_at?: string
          hours?: Json
          id?: string
          lat?: number
          lng?: number
          name: string
          phone?: string
          photo?: string | null
          slug: string
          state?: string
          status?: string
          story?: string
        }
        Update: {
          address?: string
          categories?: string[]
          city?: string
          created_at?: string
          hours?: Json
          id?: string
          lat?: number
          lng?: number
          name?: string
          phone?: string
          photo?: string | null
          slug?: string
          state?: string
          status?: string
          story?: string
        }
        Relationships: []
      }
    }
    Views: {
      unclaimed_shops: {
        Row: {
          address: string | null
          categories: string[] | null
          city: string | null
          id: string | null
          name: string | null
          slug: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          city?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          city?: string | null
          id?: string | null
          name?: string | null
          slug?: string | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      claim_shop: { Args: { p_shop_id: string }; Returns: undefined }
      create_shop: {
        Args: { p_address: string; p_name: string; p_phone: string }
        Returns: string
      }
      is_shop_member: { Args: { p_shop_id: string }; Returns: boolean }
      network_flavor_trends: {
        Args: never
        Returns: {
          tag: string
          units_last_week: number
          units_prev_week: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
