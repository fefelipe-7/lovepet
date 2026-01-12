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
            pets: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    mood: string
                    hunger: number
                    energy: number
                    cleanliness: number
                    happiness: number
                    satisfaction: number
                    is_sleeping: boolean
                    image_url: string | null
                    last_updated: string
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    mood?: string
                    hunger?: number
                    energy?: number
                    cleanliness?: number
                    happiness?: number
                    satisfaction?: number
                    is_sleeping?: boolean
                    image_url?: string | null
                    last_updated?: string
                    owner_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    mood?: string
                    hunger?: number
                    energy?: number
                    cleanliness?: number
                    happiness?: number
                    satisfaction?: number
                    is_sleeping?: boolean
                    image_url?: string | null
                    last_updated?: string
                    owner_id?: string | null
                }
            }
        }
    }
}
