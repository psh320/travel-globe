export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      photo_assets: {
        Row: {
          captured_at: string | null;
          created_at: string;
          exif_latitude: number | null;
          exif_longitude: number | null;
          file_name: string;
          file_size_bytes: number | null;
          id: string;
          inferred_city_name: string | null;
          inferred_country_code: string | null;
          inferred_country_name: string | null;
          inferred_latitude: number | null;
          inferred_location_confidence: Database["public"]["Enums"]["location_confidence_level"] | null;
          inferred_longitude: number | null;
          metadata: Json;
          mime_type: string | null;
          storage_bucket: string;
          storage_path: string;
          updated_at: string;
          user_id: string;
          visit_id: string;
        };
        Insert: {
          captured_at?: string | null;
          created_at?: string;
          exif_latitude?: number | null;
          exif_longitude?: number | null;
          file_name: string;
          file_size_bytes?: number | null;
          id?: string;
          inferred_city_name?: string | null;
          inferred_country_code?: string | null;
          inferred_country_name?: string | null;
          inferred_latitude?: number | null;
          inferred_location_confidence?: Database["public"]["Enums"]["location_confidence_level"] | null;
          inferred_longitude?: number | null;
          metadata?: Json;
          mime_type?: string | null;
          storage_bucket?: string;
          storage_path: string;
          updated_at?: string;
          user_id: string;
          visit_id: string;
        };
        Update: {
          captured_at?: string | null;
          created_at?: string;
          exif_latitude?: number | null;
          exif_longitude?: number | null;
          file_name?: string;
          file_size_bytes?: number | null;
          id?: string;
          inferred_city_name?: string | null;
          inferred_country_code?: string | null;
          inferred_country_name?: string | null;
          inferred_latitude?: number | null;
          inferred_location_confidence?: Database["public"]["Enums"]["location_confidence_level"] | null;
          inferred_longitude?: number | null;
          metadata?: Json;
          mime_type?: string | null;
          storage_bucket?: string;
          storage_path?: string;
          updated_at?: string;
          user_id?: string;
          visit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photo_assets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "photo_assets_visit_id_fkey";
            columns: ["visit_id"];
            isOneToOne: false;
            referencedRelation: "visits";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          home_airport_code: string | null;
          id: string;
          preferred_map_theme: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          home_airport_code?: string | null;
          id: string;
          preferred_map_theme?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          home_airport_code?: string | null;
          id?: string;
          preferred_map_theme?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      travel_posts: {
        Row: {
          city_name: string | null;
          content: string;
          country_code: string;
          created_at: string;
          id: string;
          title: string | null;
          updated_at: string;
          user_id: string;
          visit_id: string;
        };
        Insert: {
          city_name?: string | null;
          content: string;
          country_code: string;
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
          visit_id: string;
        };
        Update: {
          city_name?: string | null;
          content?: string;
          country_code?: string;
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
          visit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "travel_posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "travel_posts_visit_id_fkey";
            columns: ["visit_id"];
            isOneToOne: false;
            referencedRelation: "visits";
            referencedColumns: ["id"];
          },
        ];
      };
      visits: {
        Row: {
          city_name: string | null;
          country_code: string;
          country_name: string;
          created_at: string;
          id: string;
          latitude: number | null;
          location_confidence: Database["public"]["Enums"]["location_confidence_level"];
          longitude: number | null;
          source_type: Database["public"]["Enums"]["visit_source_type"];
          updated_at: string;
          user_id: string;
          visited_at: string | null;
        };
        Insert: {
          city_name?: string | null;
          country_code: string;
          country_name: string;
          created_at?: string;
          id?: string;
          latitude?: number | null;
          location_confidence?: Database["public"]["Enums"]["location_confidence_level"];
          longitude?: number | null;
          source_type: Database["public"]["Enums"]["visit_source_type"];
          updated_at?: string;
          user_id: string;
          visited_at?: string | null;
        };
        Update: {
          city_name?: string | null;
          country_code?: string;
          country_name?: string;
          created_at?: string;
          id?: string;
          latitude?: number | null;
          location_confidence?: Database["public"]["Enums"]["location_confidence_level"];
          longitude?: number | null;
          source_type?: Database["public"]["Enums"]["visit_source_type"];
          updated_at?: string;
          user_id?: string;
          visited_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "visits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      location_confidence_level: "low" | "medium" | "high" | "manual";
      visit_source_type: "photo" | "text";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type PublicSchema = Database["public"];
export type PublicTable<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName];
export type Row<TableName extends keyof PublicSchema["Tables"]> =
  PublicTable<TableName>["Row"];
export type InsertDto<TableName extends keyof PublicSchema["Tables"]> =
  PublicTable<TableName>["Insert"];
export type UpdateDto<TableName extends keyof PublicSchema["Tables"]> =
  PublicTable<TableName>["Update"];
