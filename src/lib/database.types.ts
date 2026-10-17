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
      admins: {
        Row: {
          cree_le: string
          user_id: string
        }
        Insert: {
          cree_le?: string
          user_id: string
        }
        Update: {
          cree_le?: string
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          corps_md: string
          couverture_path: string | null
          cree_le: string
          id: string
          modifie_le: string
          pole: Database["public"]["Enums"]["pole"]
          publie_le: string | null
          resume: string
          rubrique: string | null
          slug: string
          statut: Database["public"]["Enums"]["statut_article"]
          titre: string
        }
        Insert: {
          corps_md?: string
          couverture_path?: string | null
          cree_le?: string
          id?: string
          modifie_le?: string
          pole: Database["public"]["Enums"]["pole"]
          publie_le?: string | null
          resume: string
          rubrique?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_article"]
          titre: string
        }
        Update: {
          corps_md?: string
          couverture_path?: string | null
          cree_le?: string
          id?: string
          modifie_le?: string
          pole?: Database["public"]["Enums"]["pole"]
          publie_le?: string | null
          resume?: string
          rubrique?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_article"]
          titre?: string
        }
        Relationships: []
      }
      demandes: {
        Row: {
          consentement: boolean
          cree_le: string
          description: string
          email: string | null
          id: string
          ip_hash: string | null
          nom: string
          note_interne: string | null
          objet: string
          page_origine: string | null
          piece_jointe_path: string | null
          pole: Database["public"]["Enums"]["pole"]
          statut: Database["public"]["Enums"]["statut_demande"]
          telephone: string
        }
        Insert: {
          consentement: boolean
          cree_le?: string
          description: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          nom: string
          note_interne?: string | null
          objet: string
          page_origine?: string | null
          piece_jointe_path?: string | null
          pole: Database["public"]["Enums"]["pole"]
          statut?: Database["public"]["Enums"]["statut_demande"]
          telephone: string
        }
        Update: {
          consentement?: boolean
          cree_le?: string
          description?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          nom?: string
          note_interne?: string | null
          objet?: string
          page_origine?: string | null
          piece_jointe_path?: string | null
          pole?: Database["public"]["Enums"]["pole"]
          statut?: Database["public"]["Enums"]["statut_demande"]
          telephone?: string
        }
        Relationships: []
      }
      familles_produits: {
        Row: {
          id: string
          nom: string
          ordre: number
          slug: string
        }
        Insert: {
          id?: string
          nom: string
          ordre?: number
          slug: string
        }
        Update: {
          id?: string
          nom?: string
          ordre?: number
          slug?: string
        }
        Relationships: []
      }
      offres_consulting: {
        Row: {
          cree_le: string
          description: string | null
          id: string
          mise_en_avant: boolean
          modifie_le: string
          nom: string
          ordre: number
          periodicite: string
          prestations: string[]
          tarif_fcfa: number | null
          visible: boolean
        }
        Insert: {
          cree_le?: string
          description?: string | null
          id?: string
          mise_en_avant?: boolean
          modifie_le?: string
          nom: string
          ordre?: number
          periodicite?: string
          prestations?: string[]
          tarif_fcfa?: number | null
          visible?: boolean
        }
        Update: {
          cree_le?: string
          description?: string | null
          id?: string
          mise_en_avant?: boolean
          modifie_le?: string
          nom?: string
          ordre?: number
          periodicite?: string
          prestations?: string[]
          tarif_fcfa?: number | null
          visible?: boolean
        }
        Relationships: []
      }
      produits: {
        Row: {
          conditionnement: string | null
          cree_le: string
          description: string | null
          famille_id: string
          id: string
          modifie_le: string
          nom: string
          ordre: number
          photo_path: string | null
          prix_fcfa: number | null
          slug: string
          visible: boolean
        }
        Insert: {
          conditionnement?: string | null
          cree_le?: string
          description?: string | null
          famille_id: string
          id?: string
          modifie_le?: string
          nom: string
          ordre?: number
          photo_path?: string | null
          prix_fcfa?: number | null
          slug: string
          visible?: boolean
        }
        Update: {
          conditionnement?: string | null
          cree_le?: string
          description?: string | null
          famille_id?: string
          id?: string
          modifie_le?: string
          nom?: string
          ordre?: number
          photo_path?: string | null
          prix_fcfa?: number | null
          slug?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "produits_famille_id_fkey"
            columns: ["famille_id"]
            isOneToOne: false
            referencedRelation: "familles_produits"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          cree_le: string
          date_debut: string
          date_fin: string
          description: string | null
          id: string
          modifie_le: string
          prix_promo_fcfa: number | null
          produit_id: string | null
          titre: string
          visible: boolean
        }
        Insert: {
          cree_le?: string
          date_debut: string
          date_fin: string
          description?: string | null
          id?: string
          modifie_le?: string
          prix_promo_fcfa?: number | null
          produit_id?: string | null
          titre: string
          visible?: boolean
        }
        Update: {
          cree_le?: string
          date_debut?: string
          date_fin?: string
          description?: string | null
          id?: string
          modifie_le?: string
          prix_promo_fcfa?: number | null
          produit_id?: string | null
          titre?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "promotions_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          captures: string[]
          cree_le: string
          fonctionnalites: string[]
          id: string
          logo_path: string | null
          mise_en_avant: boolean
          modifie_le: string
          nom: string
          ordre: number
          pole: Database["public"]["Enums"]["pole"]
          probleme: string | null
          publie: boolean
          resume: string
          slug: string
          type: Database["public"]["Enums"]["type_solution"]
        }
        Insert: {
          captures?: string[]
          cree_le?: string
          fonctionnalites?: string[]
          id?: string
          logo_path?: string | null
          mise_en_avant?: boolean
          modifie_le?: string
          nom: string
          ordre?: number
          pole?: Database["public"]["Enums"]["pole"]
          probleme?: string | null
          publie?: boolean
          resume: string
          slug: string
          type?: Database["public"]["Enums"]["type_solution"]
        }
        Update: {
          captures?: string[]
          cree_le?: string
          fonctionnalites?: string[]
          id?: string
          logo_path?: string | null
          mise_en_avant?: boolean
          modifie_le?: string
          nom?: string
          ordre?: number
          pole?: Database["public"]["Enums"]["pole"]
          probleme?: string | null
          publie?: boolean
          resume?: string
          slug?: string
          type?: Database["public"]["Enums"]["type_solution"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      est_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      pole: "consulting" | "distribution" | "technologie" | "groupe"
      statut_article: "brouillon" | "publie"
      statut_demande: "nouvelle" | "traitee" | "convertie"
      type_solution:
        | "logiciel"
        | "site_web"
        | "reseau"
        | "videosurveillance"
        | "mission"
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
    Enums: {
      pole: ["consulting", "distribution", "technologie", "groupe"],
      statut_article: ["brouillon", "publie"],
      statut_demande: ["nouvelle", "traitee", "convertie"],
      type_solution: [
        "logiciel",
        "site_web",
        "reseau",
        "videosurveillance",
        "mission",
      ],
    },
  },
} as const
