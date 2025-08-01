import { Database } from '$/lib/database.types';
import { Session, User } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			isAdmin: Boolean | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
