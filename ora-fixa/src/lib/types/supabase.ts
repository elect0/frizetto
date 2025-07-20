import type {Database} from '$lib/database.types'

export type Service = Database['public']['Tables']['services']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']