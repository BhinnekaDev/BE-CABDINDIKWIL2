import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateStrukturOrganisasiDto } from './dto/create-strukturorganisasi.dto';
import { ParamStrukturOrganisasinDto } from './dto/param-struktur_organisasi.dto';
import { UpdateStrukturOrganisasiDto } from './dto/update-strukturorganisasi.dto';
import { StrukturOrganisasi } from './interface/struktur-organisasi.interface';

@Injectable()
export class StrukturOrganisasiService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
  ) {}

  /*
   * Get all Struktur Organisasi or by ParamStrukturOrganisasinDto
   * @param userJwt JWT token pengguna untuk autentikasi
   * @param params (opsional) Parameter untuk memfilter struktur organisasi berdasarkan ID
   * @returns Array StrukturOrganisasi yang sesuai dengan kriteria
   */
  async getStrukturOrganisasi(
    params?: ParamStrukturOrganisasinDto,
  ): Promise<StrukturOrganisasi[]> {
    try {
      let query = this.supabaseClient
        .from('struktur_organisasi')
        .select('*')
        .order('id', { ascending: true });

      if (params && params.idParam) {
        query = query.eq('id', params.idParam);
      }

      const { data, error } = await query;

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data as StrukturOrganisasi[];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /*
   * Create Struktur Organisasi
   * @param userJwt JWT token pengguna untuk autentikasi
   * @param createDto Data DTO untuk membuat struktur organisasi
   * @returns StrukturOrganisasi yang baru dibuat
   */
  async createStrukturOrganisasi(
    userJwt: string,
    createDto: CreateStrukturOrganisasiDto,
  ): Promise<StrukturOrganisasi> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data, error } = await supabaseWithUser
        .from('struktur_organisasi')
        .insert({
          gambar_struktur: createDto.gambar_struktur,
          gambar_dokumentasi: createDto.gambar_dokumentasi,
        })
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data as StrukturOrganisasi;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /*
   * Update Struktur Organisasi
   * @param userJwt JWT token pengguna untuk autentikasi
   * @param params Parameter untuk mengidentifikasi struktur organisasi yang akan diperbarui
   * @param updateDto Data DTO untuk memperbarui struktur organisasi
   * @returns StrukturOrganisasi yang telah diperbarui
   */
  async updateStrukturOrganisasi(
    userJwt: string,
    params: ParamStrukturOrganisasinDto,
    updateDto: UpdateStrukturOrganisasiDto,
  ): Promise<StrukturOrganisasi> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
      const { data: existing, error: selectError } = await supabaseWithUser
        .from('struktur_organisasi')
        .select('*')
        .eq('id', params.idParam)
        .single();

      if (selectError || !existing) {
        throw new NotFoundException('Struktur organisasi tidak ditemukan');
      }

      const updateData: Partial<UpdateStrukturOrganisasiDto> = {};

      const extractFileName = (url: string | null): string | null => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1] ?? null;
      };

      if (
        updateDto.gambar_struktur &&
        updateDto.gambar_struktur !== existing.gambar_struktur
      ) {
        const oldFile = extractFileName(existing.gambar_struktur);

        if (oldFile) {
          const { error: removeErr } = await supabaseAdmin.storage
            .from('struktur-organisasi')
            .remove([oldFile]);

          if (removeErr) {
            throw new InternalServerErrorException(
              `Gagal menghapus file struktur lama: ${removeErr.message}`,
            );
          }
        }

        updateData.gambar_struktur = updateDto.gambar_struktur;
      }

      if (
        updateDto.gambar_dokumentasi &&
        updateDto.gambar_dokumentasi !== existing.gambar_dokumentasi
      ) {
        const oldFile = extractFileName(existing.gambar_dokumentasi);

        if (oldFile) {
          const { error: removeErr } = await supabaseAdmin.storage
            .from('struktur-organisasi')
            .remove([oldFile]);

          if (removeErr) {
            throw new InternalServerErrorException(
              `Gagal menghapus file dokumentasi lama: ${removeErr.message}`,
            );
          }
        }

        updateData.gambar_dokumentasi = updateDto.gambar_dokumentasi;
      }

      if (Object.keys(updateData).length === 0) {
        return existing;
      }

      const { data: updated, error: updateError } = await supabaseWithUser
        .from('struktur_organisasi')
        .update(updateData)
        .eq('id', params.idParam)
        .select()
        .single();

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      return updated;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui struktur organisasi: ${err.message}`,
      );
    }
  }

  /*
   * Delete Struktur Organisasi
   * @param userJwt JWT token pengguna untuk autentikasi
   * @param params Parameter untuk mengidentifikasi struktur organisasi yang akan dihapus
   * @returns Pesan konfirmasi penghapusan
   */
  async deleteStrukturOrganisasi(
    userJwt: string,
    params: ParamStrukturOrganisasinDto,
  ): Promise<{ message: string }> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    try {
      const { data: existing, error: selectError } = await supabaseWithUser
        .from('struktur_organisasi')
        .select('*')
        .eq('id', params.idParam)
        .single();

      if (selectError || !existing) {
        throw new NotFoundException('Struktur organisasi tidak ditemukan');
      }

      const extractFileName = (url: string): string | null => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1] ?? null;
      };

      const filesToDelete: string[] = [];

      const fileStruktur = extractFileName(existing.gambar_struktur);
      const fileDok = extractFileName(existing.gambar_dokumentasi);

      if (fileStruktur) filesToDelete.push(fileStruktur);
      if (fileDok) filesToDelete.push(fileDok);

      if (filesToDelete.length > 0) {
        const { error: removeError } = await supabaseAdmin.storage
          .from('struktur-organisasi')
          .remove(filesToDelete);

        if (removeError) {
          throw new InternalServerErrorException(
            `Gagal menghapus file: ${removeError.message}`,
          );
        }
      }

      const { error: deleteError } = await supabaseWithUser
        .from('struktur_organisasi')
        .delete()
        .eq('id', params.idParam);

      if (deleteError) {
        throw new InternalServerErrorException(deleteError.message);
      }

      return {
        message: 'Struktur organisasi dan seluruh file berhasil dihapus',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus struktur organisasi: ${err.message}`,
      );
    }
  }
}
