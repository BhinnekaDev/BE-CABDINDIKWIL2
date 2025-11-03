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
      const message = error.message?.toLowerCase() || '';

      if (
        message.includes('email not confirmed') ||
        message.includes('email not verified')
      ) {
        throw new ForbiddenException(
          'Alamat email Anda belum terverifikasi. Mohon periksa kotak masuk atau folder spam untuk menyelesaikan proses verifikasi akun.',
        );
      }

      throw new UnauthorizedException('Email atau password salah.');
    }

    const user = data.user;
    if (!user) {
      throw new UnauthorizedException(
        'Data pengguna tidak ditemukan di Supabase.',
      );
    }

    const { data: adminData, error: adminError } = await this.supabase
      .from('admin')
      .select('id, email, role, status_approval')
      .eq('id', user.id)
      .eq('email', user.email)
      .single();

    if (adminError || !adminData) {
      throw new UnauthorizedException(
        'Data akun Anda tidak ditemukan dalam sistem administrator. Silakan menghubungi Superadmin untuk konfirmasi lebih lanjut.',
      );
    }

    if (!user.email_confirmed_at) {
      throw new ForbiddenException(
        'Alamat email Anda belum terverifikasi. Silakan periksa kotak masuk atau folder spam untuk melakukan verifikasi.',
      );
    }

    if (adminData.status_approval === 'Pending') {
      throw new ForbiddenException(
        'Akun Anda saat ini belum mendapatkan persetujuan dari Superadmin. Mohon menunggu proses verifikasi lebih lanjut.',
      );
    }

    if (adminData.status_approval === 'Rejected') {
      throw new ForbiddenException(
        'Permohonan akun Anda telah ditolak oleh Superadmin. Silakan hubungi pihak terkait untuk informasi lebih lanjut.',
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
        user_metadata: user.user_metadata,
      },
    };
  }
}
