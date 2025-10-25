import { User } from '@supabase/supabase-js';
export declare class SupabaseService {
    getUser(token: string): Promise<User>;
}
