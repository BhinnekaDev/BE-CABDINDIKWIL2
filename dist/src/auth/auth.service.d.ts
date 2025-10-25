import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class AuthService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: import("@supabase/supabase-js").AuthUser | null;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: import("@supabase/supabase-js").AuthUser;
    }>;
}
