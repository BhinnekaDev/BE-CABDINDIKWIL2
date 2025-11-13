import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
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
    userJwt: string,
    params?: ParamStrukturOrganisasinDto,
  ): Promise<StrukturOrganisasi[]> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    try {
      let query = supabaseWithUser
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
      const strukturBase64 = createDto.gambar_struktur.split(';base64,').pop();
      const strukturExt = createDto.gambar_struktur.substring(
        createDto.gambar_struktur.indexOf('/') + 1,
        createDto.gambar_struktur.indexOf(';'),
      );
      const strukturFileName = `struktur-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${strukturExt}`;

      const { error: uploadStrukturError } = await supabaseWithUser.storage
        .from('struktur-organisasi')
        .upload(strukturFileName, Buffer.from(strukturBase64!, 'base64'), {
          contentType: `image/${strukturExt}`,
        });

      if (uploadStrukturError) {
        throw new InternalServerErrorException(uploadStrukturError.message);
      }

      const { data: strukturUrlData } = supabaseWithUser.storage
        .from('struktur-organisasi')
        .getPublicUrl(strukturFileName);

      const dokumentasiBase64 = createDto.gambar_dokumentasi
        .split(';base64,')
        .pop();
      const dokumentasiExt = createDto.gambar_dokumentasi.substring(
        createDto.gambar_dokumentasi.indexOf('/') + 1,
        createDto.gambar_dokumentasi.indexOf(';'),
      );
      const dokumentasiFileName = `dokumentasi-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${dokumentasiExt}`;

      const { error: uploadDokumentasiError } = await supabaseWithUser.storage
        .from('struktur-organisasi')
        .upload(
          dokumentasiFileName,
          Buffer.from(dokumentasiBase64!, 'base64'),
          {
            contentType: `image/${dokumentasiExt}`,
          },
        );

      if (uploadDokumentasiError) {
        throw new InternalServerErrorException(uploadDokumentasiError.message);
      }

      const { data: dokumentasiUrlData } = supabaseWithUser.storage
        .from('struktur-organisasi')
        .getPublicUrl(dokumentasiFileName);

      const { data, error } = await supabaseWithUser
        .from('struktur_organisasi')
        .insert({
          gambar_struktur: strukturUrlData.publicUrl,
          gambar_dokumentasi: dokumentasiUrlData.publicUrl,
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

      if (
        updateDto.gambar_struktur &&
        updateDto.gambar_struktur.startsWith('data:image')
      ) {
        if (existing.gambar_struktur) {
          const oldFileName = existing.gambar_struktur.split('/').pop();
          if (oldFileName) {
            const { error: removeError } = await supabaseWithUser.storage
              .from('struktur-organisasi')
              .remove([oldFileName]);
            if (removeError && !removeError.message.includes('not found')) {
              throw new InternalServerErrorException(removeError.message);
            }
          }
        }
        const base64 = updateDto.gambar_struktur.split(';base64,').pop();
        const ext = updateDto.gambar_struktur.substring(
          updateDto.gambar_struktur.indexOf('/') + 1,
          updateDto.gambar_struktur.indexOf(';'),
        );
        const fileName = `struktur-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('struktur-organisasi')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${ext}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: publicUrlData } = supabaseWithUser.storage
          .from('struktur-organisasi')
          .getPublicUrl(fileName);

        updateData.gambar_struktur = publicUrlData.publicUrl;
      }

      if (
        updateDto.gambar_dokumentasi &&
        updateDto.gambar_dokumentasi.startsWith('data:image')
      ) {
        if (existing.gambar_dokumentasi) {
          const oldFileName = existing.gambar_dokumentasi.split('/').pop();
          if (oldFileName) {
            const { error: removeError } = await supabaseWithUser.storage
              .from('struktur-organisasi')
              .remove([oldFileName]);
            if (removeError && !removeError.message.includes('not found')) {
              throw new InternalServerErrorException(removeError.message);
            }
          }
        }

        const base64 = updateDto.gambar_dokumentasi.split(';base64,').pop();
        const ext = updateDto.gambar_dokumentasi.substring(
          updateDto.gambar_dokumentasi.indexOf('/') + 1,
          updateDto.gambar_dokumentasi.indexOf(';'),
        );
        const fileName = `dokumentasi-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('struktur-organisasi')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${ext}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: publicUrlData } = supabaseWithUser.storage
          .from('struktur-organisasi')
          .getPublicUrl(fileName);

        updateData.gambar_dokumentasi = publicUrlData.publicUrl;
      }

      if (Object.keys(updateData).length > 0) {
        const { data: updated, error: updateError } = await supabaseWithUser
          .from('struktur_organisasi')
          .update(updateData)
          .eq('id', params.idParam)
          .select()
          .single();

        if (updateError) {
          throw new InternalServerErrorException(updateError.message);
        }

        return updated as StrukturOrganisasi;
      }

      return existing as StrukturOrganisasi;
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

    try {
      const { data: existing, error: selectError } = await supabaseWithUser
        .from('struktur_organisasi')
        .select('*')
        .eq('id', params.idParam)
        .single();

      if (selectError || !existing) {
        throw new NotFoundException('Struktur organisasi tidak ditemukan');
      }

      if (existing.gambar_struktur) {
        const oldFileName = existing.gambar_struktur.split('/').pop();
        if (oldFileName) {
          const { error: removeError } = await supabaseWithUser.storage
            .from('struktur-organisasi')
            .remove([oldFileName]);
          if (removeError && !removeError.message.includes('not found')) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      if (existing.gambar_dokumentasi) {
        const oldFileName = existing.gambar_dokumentasi.split('/').pop();
        if (oldFileName) {
          const { error: removeError } = await supabaseWithUser.storage
            .from('struktur-organisasi')
            .remove([oldFileName]);
          if (removeError && !removeError.message.includes('not found')) {
            throw new InternalServerErrorException(removeError.message);
          }
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
        message:
          'Struktur organisasi berhasil dihapus beserta semua file terkait',
      };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus struktur organisasi: ${err.message}`,
      );
    }
  }
}
