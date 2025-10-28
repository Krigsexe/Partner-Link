export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
          is_active: boolean
          is_admin: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_admin?: boolean
        }
      }
      partner_links: {
        Row: {
          id: string
          partner_id: string
          name: string
          promo_code: string
          domain: string
          url: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          partner_id: string
          name: string
          promo_code: string
          domain: string
          url: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          partner_id?: string
          name?: string
          promo_code?: string
          domain?: string
          url?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      link_clicks: {
        Row: {
          id: string
          link_id: string
          clicked_at: string
          referer: string | null
          user_agent: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          link_id: string
          clicked_at?: string
          referer?: string | null
          user_agent?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          link_id?: string
          clicked_at?: string
          referer?: string | null
          user_agent?: string | null
          ip_address?: string | null
        }
      }
      conversions: {
        Row: {
          id: string
          link_id: string
          type: 'signup' | 'purchase'
          converted_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          link_id: string
          type: 'signup' | 'purchase'
          converted_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          link_id?: string
          type?: 'signup' | 'purchase'
          converted_at?: string
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
