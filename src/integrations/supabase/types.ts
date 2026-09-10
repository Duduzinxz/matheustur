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
      abastecimentos: {
        Row: {
          combustivel: string | null
          created_at: string
          data: string
          id: string
          km: number | null
          litros: number
          observacoes: string | null
          posto: string | null
          preco_litro: number | null
          valor_total: number
          veiculo_id: string
        }
        Insert: {
          combustivel?: string | null
          created_at?: string
          data?: string
          id?: string
          km?: number | null
          litros?: number
          observacoes?: string | null
          posto?: string | null
          preco_litro?: number | null
          valor_total?: number
          veiculo_id: string
        }
        Update: {
          combustivel?: string | null
          created_at?: string
          data?: string
          id?: string
          km?: number | null
          litros?: number
          observacoes?: string | null
          posto?: string | null
          preco_litro?: number | null
          valor_total?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abastecimentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          categoria: string
          comprovante_url: string | null
          created_at: string
          data: string
          descricao: string | null
          id: string
          km: number | null
          valor: number
          veiculo_id: string
        }
        Insert: {
          categoria?: string
          comprovante_url?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          km?: number | null
          valor?: number
          veiculo_id: string
        }
        Update: {
          categoria?: string
          comprovante_url?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          km?: number | null
          valor?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "despesas_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      km_registros: {
        Row: {
          created_at: string
          data: string
          id: string
          km: number
          km_rodados: number
          observacoes: string | null
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          id?: string
          km: number
          km_rodados?: number
          observacoes?: string | null
          veiculo_id: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          km?: number
          km_rodados?: number
          observacoes?: string | null
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "km_registros_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      manutencoes: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          fornecedor: string | null
          id: string
          km: number | null
          observacoes: string | null
          proxima_data: string | null
          proximo_km: number | null
          tipo: string
          valor: number
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          km?: number | null
          observacoes?: string | null
          proxima_data?: string | null
          proximo_km?: number | null
          tipo?: string
          valor?: number
          veiculo_id: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          fornecedor?: string | null
          id?: string
          km?: number | null
          observacoes?: string | null
          proxima_data?: string | null
          proximo_km?: number | null
          tipo?: string
          valor?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manutencoes_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      pneus: {
        Row: {
          created_at: string
          data_instalacao: string
          data_retirada: string | null
          id: string
          km_instalacao: number
          km_retirada: number | null
          marca: string | null
          medida: string | null
          modelo: string | null
          observacoes: string | null
          posicao: string
          quantidade: number
          valor: number
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          data_instalacao?: string
          data_retirada?: string | null
          id?: string
          km_instalacao?: number
          km_retirada?: number | null
          marca?: string | null
          medida?: string | null
          modelo?: string | null
          observacoes?: string | null
          posicao?: string
          quantidade?: number
          valor?: number
          veiculo_id: string
        }
        Update: {
          created_at?: string
          data_instalacao?: string
          data_retirada?: string | null
          id?: string
          km_instalacao?: number
          km_retirada?: number | null
          marca?: string | null
          medida?: string | null
          modelo?: string | null
          observacoes?: string | null
          posicao?: string
          quantidade?: number
          valor?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pneus_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          cliente: string | null
          created_at: string
          data: string
          id: string
          km_final: number | null
          km_inicial: number | null
          observacoes: string | null
          tipo: string
          valor: number
          veiculo_id: string
        }
        Insert: {
          cliente?: string | null
          created_at?: string
          data?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observacoes?: string | null
          tipo?: string
          valor?: number
          veiculo_id: string
        }
        Update: {
          cliente?: string | null
          created_at?: string
          data?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          observacoes?: string | null
          tipo?: string
          valor?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes: {
        Row: {
          created_at: string
          data_viagem: string | null
          data_volta: string | null
          destino_cidade: string
          destino_uf: string
          horario: string | null
          horario_volta: string | null
          id: string
          km_deslocamento: number
          km_total: number
          km_trecho: number
          origem_cidade: string
          origem_uf: string
          passageiros: number | null
          status: string
        }
        Insert: {
          created_at?: string
          data_viagem?: string | null
          data_volta?: string | null
          destino_cidade: string
          destino_uf: string
          horario?: string | null
          horario_volta?: string | null
          id?: string
          km_deslocamento?: number
          km_total?: number
          km_trecho?: number
          origem_cidade: string
          origem_uf: string
          passageiros?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          data_viagem?: string | null
          data_volta?: string | null
          destino_cidade?: string
          destino_uf?: string
          horario?: string | null
          horario_volta?: string | null
          id?: string
          km_deslocamento?: number
          km_total?: number
          km_trecho?: number
          origem_cidade?: string
          origem_uf?: string
          passageiros?: number | null
          status?: string
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
      veiculos: {
        Row: {
          ano: number | null
          created_at: string
          data_aquisicao: string | null
          id: string
          intervalo_oleo_km: number
          km_atual: number
          marca: string | null
          modelo: string | null
          nome: string
          numero: string | null
          observacoes: string | null
          placa: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ano?: number | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          intervalo_oleo_km?: number
          km_atual?: number
          marca?: string | null
          modelo?: string | null
          nome: string
          numero?: string | null
          observacoes?: string | null
          placa?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ano?: number | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          intervalo_oleo_km?: number
          km_atual?: number
          marca?: string | null
          modelo?: string | null
          nome?: string
          numero?: string | null
          observacoes?: string | null
          placa?: string | null
          status?: string
          tipo?: string
          updated_at?: string
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
