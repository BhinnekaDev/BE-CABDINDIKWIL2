import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { FilterAdminDto } from './dto/filter-admin.dto';
import { ParamAdminDto } from './dto/param-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './interface/admin.interface';

@Injectable()
export class AdminManagementService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Get all admin data
   *
   * @param {string} userJwt
   * @returns {Promise<Admin[]>}
   * @throws {ForbiddenException | InternalServerErrorException}
   */
  async getAllAdmins(userJwt: string): Promise<Admin[]> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseWithUser.auth.getUser();

      if (userError || !user) {
        throw new ForbiddenException(
          'Token tidak valid atau pengguna tidak ditemukan.',
        );
      }

      const { data: currentAdmin, error: adminError } = await supabaseWithUser
        .from('admin')
        .select('id, role, status_approval')
        .eq('id', user.id)
        .single();

      if (adminError || !currentAdmin) {
        throw new ForbiddenException('Akun tidak ditemukan di tabel admin.');
      }

      if (
        currentAdmin.role !== 'Superadmin' ||
        currentAdmin.status_approval !== 'Approved'
      ) {
        throw new ForbiddenException(
          'Hanya Superadmin yang telah disetujui yang dapat mengakses data ini.',
        );
      }

      const { data: admins, error: fetchError } = await supabaseWithUser
        .from('admin')
        .select('id, email, role, status_approval, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new InternalServerErrorException(fetchError.message);
      }

      return admins as Admin[];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Get admin by ID
   *
   * @param {string} userJwt
   * @param {ParamAdminDto} paramAdminDto
   * @returns {Promise<Admin>}
   * @throws {NotFoundException | ForbiddenException | InternalServerErrorException}
   */
  async getAdminById(
    userJwt: string,
    paramAdminDto: ParamAdminDto,
  ): Promise<Admin> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseWithUser.auth.getUser();

      if (userError || !user) {
        throw new ForbiddenException(
          'Token tidak valid atau pengguna tidak ditemukan.',
        );
      }

      const { data: currentAdmin, error: adminError } = await supabaseWithUser
        .from('admin')
        .select('id, role, status_approval')
        .eq('id', user.id)
        .maybeSingle();

      if (adminError || !currentAdmin) {
        throw new ForbiddenException('Akun tidak ditemukan di tabel admin.');
      }

      if (
        currentAdmin.role !== 'Superadmin' ||
        currentAdmin.status_approval !== 'Approved'
      ) {
        throw new ForbiddenException(
          'Hanya Superadmin yang telah disetujui yang dapat mengakses data ini.',
        );
      }

      const { data: admin, error: fetchError } = await supabaseWithUser
        .from('admin')
        .select('id, email, role, status_approval, created_at, updated_at')
        .eq('id', paramAdminDto.id)
        .maybeSingle();

      if (fetchError || !admin) {
        throw new NotFoundException(
          'Admin dengan ID tersebut tidak ditemukan.',
        );
      }

      return admin as Admin;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Update admin data
   *
   * @param {string} userJwt
   * @param {ParamAdminDto} paramAdminDto
   * @param {UpdateAdminDto} updateAdminDto
   * @returns {Promise<Admin>}
   */
  async updateAdmin(
    userJwt: string,
    paramAdminDto: ParamAdminDto,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const {
      data: { user },
      error: userError,
    } = await supabaseWithUser.auth.getUser();

    if (userError || !user) {
      throw new ForbiddenException(
        'Token tidak valid atau pengguna tidak ditemukan.',
      );
    }

    const { data: currentAdmin, error: adminError } = await supabaseWithUser
      .from('admin')
      .select('id, role, status_approval')
      .eq('id', user.id)
      .single();

    if (adminError || !currentAdmin) {
      throw new ForbiddenException('Akun tidak ditemukan di tabel admin.');
    }

    if (
      currentAdmin.role !== 'Superadmin' ||
      currentAdmin.status_approval !== 'Approved'
    ) {
      throw new ForbiddenException(
        'Hanya Superadmin yang telah disetujui yang dapat memperbarui data admin.',
      );
    }

    const { data: targetAdmin, error: fetchError } = await supabaseWithUser
      .from('admin')
      .select('id, email, status_approval')
      .eq('id', paramAdminDto.id)
      .single();

    if (fetchError || !targetAdmin) {
      throw new NotFoundException('Admin dengan ID tersebut tidak ditemukan.');
    }

    if (updateAdminDto.new_password) {
      if (!updateAdminDto.old_password) {
        throw new ForbiddenException(
          'Password lama harus diisi untuk mengganti password.',
        );
      }

      const { error: reauthError } =
        await supabaseWithUser.auth.signInWithPassword({
          email: targetAdmin.email,
          password: updateAdminDto.old_password,
        });
      if (reauthError) {
        throw new ForbiddenException('Password lama tidak sesuai.');
      }

      const { error: passError } = await supabaseWithUser.auth.updateUser({
        password: updateAdminDto.new_password,
      });
      if (passError)
        throw new InternalServerErrorException('Gagal memperbarui password.');
    }

    const { data: updatedAdmin, error: updateError } = await supabaseWithUser
      .from('admin')
      .update({
        status_approval:
          updateAdminDto.status_approval ?? targetAdmin.status_approval,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paramAdminDto.id)
      .select()
      .single();

    if (updateError)
      throw new InternalServerErrorException(updateError.message);

    return updatedAdmin as Admin;
  }

  /**
   * Get admin by filter
   *
   * @param {string} userJwt
   * @param {FilterAdminDto} filterAdminDto
   * @returns {Promise<Admin[]>}
   * @throws {ForbiddenException | InternalServerErrorException}
   */
  async getAdminByFilter(
    userJwt: string,
    filterAdminDto: FilterAdminDto,
  ): Promise<Admin[]> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const {
      data: { user },
      error: userError,
    } = await supabaseWithUser.auth.getUser();

    if (userError || !user) {
      throw new ForbiddenException(
        'Token tidak valid atau pengguna tidak ditemukan.',
      );
    }

    const { data: currentAdmin, error: adminError } = await supabaseWithUser
      .from('admin')
      .select('id, role, status_approval')
      .eq('id', user.id)
      .single();

    if (adminError || !currentAdmin) {
      throw new ForbiddenException('Akun tidak ditemukan di tabel admin.');
    }

    if (
      currentAdmin.role !== 'Superadmin' ||
      currentAdmin.status_approval !== 'Approved'
    ) {
      throw new ForbiddenException(
        'Hanya Superadmin yang disetujui dapat memfilter data admin.',
      );
    }

    const { role, status_approval, email } = filterAdminDto;

    let query = supabaseWithUser
      .from('admin')
      .select('id, email, role, status_approval, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (role) query = query.eq('role', role);
    if (status_approval) query = query.eq('status_approval', status_approval);
    if (email) query = query.ilike('email', `%${email}%`);

    const { data: admins, error: fetchError } = await query;

    if (fetchError) {
      throw new InternalServerErrorException(fetchError.message);
    }

    return admins as Admin[];
  }
}
