export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          case_type: Database["public"]["Enums"]["casetype"]
          created_at: string | null
          created_by: string | null
          crime_date_time: string | null
          id: string
          location: unknown | null
          place_name: string | null
          status: Database["public"]["Enums"]["status"] | null
          summary: string | null
          title: string
          zip_code: number | null
        }
        Insert: {
          case_type: Database["public"]["Enums"]["casetype"]
          created_at?: string | null
          created_by?: string | null
          crime_date_time?: string | null
          id?: string
          location?: unknown | null
          place_name?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          summary?: string | null
          title: string
          zip_code?: number | null
        }
        Update: {
          case_type?: Database["public"]["Enums"]["casetype"]
          created_at?: string | null
          created_by?: string | null
          crime_date_time?: string | null
          id?: string
          location?: unknown | null
          place_name?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          summary?: string | null
          title?: string
          zip_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          text: string
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          text: string
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      furtherlinks: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          link_type: Database["public"]["Enums"]["link_type"] | null
          type: string | null
          url: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          link_type?: Database["public"]["Enums"]["link_type"] | null
          type?: string | null
          url: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          link_type?: Database["public"]["Enums"]["link_type"] | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "furtherlinks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          type: string
          url: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          type: string
          url: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["role"] | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["role"] | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"] | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
          vote: number | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          vote?: number | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          vote?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_custom_claims_to_jwt_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      add_user_profile_angular: {
        Args: {
          user_id: string
          username: string
          role: Database["public"]["Enums"]["role"]
        }
        Returns: undefined
      }
      create_crime_case_angular: {
        Args: {
          p_title: string
          p_summary: string
          p_longitude: number
          p_latitude: number
          p_created_by: string
          p_place_name: string
          p_zip_code: number
          p_case_type: Database["public"]["Enums"]["casetype"]
          p_crime_date_time: string
          p_status: Database["public"]["Enums"]["status"]
          p_links: Json
        }
        Returns: string
      }
      delete_case_by_id: {
        Args: {
          case_id: string
        }
        Returns: undefined
      }
      find_nearby_cases: {
        Args: {
          distance: number
          currentlat: number
          currentlong: number
        }
        Returns: {
          id: string
          title: string
          summary: string
          status: string
          created_by: string
          created_at: string
          lat: number
          long: number
        }[]
      }
      find_nearby_cases2: {
        Args: {
          distance: number
          currentlat: number
          currentlong: number
        }
        Returns: {
          id: string
          title: string
          summary: string
          status: Database["public"]["Enums"]["status"]
          created_by: string
          created_at: string
          lat: number
          long: number
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          crime_date_time: string
        }
      }
      get_all_cases: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          summary: string
          status: string
          created_by: string
          created_at: string
          lat: number
          long: number
        }
      }
      get_all_cases_flutter: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          summary: string
          lat: number
          long: number
          created_by: string
          created_at: string
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          crime_date_time: string
          status: string
        }[]
      }
      get_case_detailed_flutter: {
        Args: {
          case_id: string
        }
        Returns: {
          id: string
          title: string
          summary: string
          lat: number
          long: number
          created_by: string
          created_at: string
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          crime_date_time: string
          status: string
          link_id: string
          url: string
          link_type: Database["public"]["Enums"]["link_type"]
          link_created_at: string
        }[]
      }
      get_case_details_angular: {
        Args: {
          case_id_param: string
        }
        Returns: {
          case_id: string
          title: string
          summary: string
          lat: number
          long: number
          created_by: string
          created_at: string
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          crime_date_time: string
          status: Database["public"]["Enums"]["status"]
          link_id: string
          url: string
          link_type: Database["public"]["Enums"]["link_type"]
          link_created_at: string
          user_id: string
          username: string
          user_avatar_url: string
        }
      }
      get_case_votes_by_id: {
        Args: {
          p_case_id: string
        }
        Returns: {
          upvotes: number
          downvotes: number
        }
      }
      get_comments: {
        Args: {
          p_case_id: string
        }
        Returns: {
          id: string
          case_id: string
          user_id: string
          text: string
          created_at: string
          username: string
        }
      }
      get_enum_values_angular: {
        Args: {
          enum_typename: string
        }
        Returns: string[]
      }
      get_filtered_cases_angular: {
        Args: {
          start_date?: string
          end_date?: string
          currentlat?: number
          currentlong?: number
          distance?: number
          crime_types?: Database["public"]["Enums"]["casetype"][]
          case_status?: Database["public"]["Enums"]["status"]
          crimefluencer_ids?: string[]
        }
        Returns: {
          id: string
          title: string
          summary: string
          status: Database["public"]["Enums"]["status"]
          created_at: string
          lat: number
          long: number
          created_by: string
          creator_username: string
          creator_avatar_url: string
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          upvotes: number
          downvotes: number
          user_vote: number
          has_newspaper: boolean
          has_podcast: boolean
          has_book: boolean
          has_media: boolean
          crime_date_time: string
          distance_to_location: number
        }
      }
      get_username_with_id: {
        Args: {
          p_user_id: string
        }
        Returns: {
          username: string
        }
      }
      insert_comment: {
        Args: {
          p_case_id: string
          p_user_id: string
          p_text: string
        }
        Returns: undefined
      }
      update_case: {
        Args: {
          title: string
          summary: string
          status: Database["public"]["Enums"]["status"]
          lat: number
          long: number
          place_name: string
          zip_code: number
          case_type: Database["public"]["Enums"]["casetype"]
          crime_date_time: string
          case_id: string
          created_by: string
          p_links: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      casetype: "murder" | "theft" | "robbery-murder" | "brawl" | "rape"
      link_type: "newspaper" | "podcast" | "book"
      role: "crimefluencer" | "crimespotter" | "admin"
      status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
      | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
      | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
      | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
      | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type Case = Database['public']['Functions']['get_all_cases']['Returns']
export type CaseFiltered = Database['public']['Functions']['get_filtered_cases_angular']['Returns']
export type CaseTypes = Database['public']['Functions']['get_enum_values_angular']['Returns']
export type CaseDetails = Database['public']['Functions']['get_case_details_angular']['Returns']

