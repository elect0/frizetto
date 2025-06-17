import { Database } from '$/lib/database.types';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<{
				session: Session | null;
			}>;
		}
		interface PageData {
			session?: Session | null;
		}
	}
}

export {};
