import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
      throw new UnauthorizedException(`Gagal registrasi: ${error.message}`);
    }

    const user = data.user;

    if (!user) {
      throw new BadRequestException(
        'Gagal membuat akun, user tidak terdaftar di Supabase Auth.',
      );
    }

    const { error: insertError } = await this.supabase.from('admin').insert([
      {
        id: user.id,
        email: dto.email,
        role: 'Admin',
        status_approval: 'Pending',
      },
    ]);

    if (insertError) {
      await this.supabase.auth.admin.deleteUser(user.id);
      throw new BadRequestException(
        `Gagal menyimpan data admin: ${insertError.message}`,
      );
    }

    return {
      message:
        'Registrasi berhasil. Silakan cek email Anda untuk verifikasi. Menunggu approval dari Superadmin.',
      user,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const user = data.user;

    if (!user) {
      throw new UnauthorizedException(
        'Gagal mendapatkan data pengguna dari Supabase.',
      );
    }

    if (!user.email_confirmed_at) {
      throw new ForbiddenException(
        'Email Anda belum diverifikasi. Silakan cek kotak masuk Anda.',
      );
    }

    const { data: adminData, error: adminError } = await this.supabase
      .from('admin')
      .select('id, role, status_approval')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData) {
      throw new UnauthorizedException(
        'Akun tidak ditemukan di tabel admin. Hubungi Superadmin.',
      );
    }

    if (adminData.status_approval !== 'Approved') {
      throw new ForbiddenException(
        'Akun Anda belum disetujui oleh Superadmin. Silakan tunggu konfirmasi.',
      );
    }

    return {
      message: 'Login berhasil',
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: adminData.role,
        status_approval: adminData.status_approval,
      },
    };
  }
}
