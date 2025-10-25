import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async register(dto: RegisterDto) {
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: { full_name: dto.fullName },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      message: 'Registrasi berhasil',
      user: data.user,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new UnauthorizedException(error.message);

    return {
      message: 'Login berhasil',
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: data.user,
    };
  }
}
