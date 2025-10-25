import { LoginDto } from '@/auth/dto/login.dto';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import type { AuthRequest } from '@/auth/guards/auth-request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: import("@supabase/auth-js").User | null;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: import("@supabase/auth-js").User;
    }>;
    profile(req: AuthRequest): import("@supabase/auth-js").User | undefined;
}
