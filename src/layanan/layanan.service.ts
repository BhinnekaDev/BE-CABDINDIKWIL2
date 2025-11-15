import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateLayananDto } from './dto/create-layanan.dto';
import { ParamLayananDto } from './dto/param-layanan.dto';
import { UpdateLayananDto } from './dto/update-layanan.dto';
import {
  KindServices,
  Layanan,
  LayananView,
} from './interface/layanan.inteface';

@Injectable()
export class LayananService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
  ) {}

  /*
   * Get all layanan or by kind or jenis layanan or ID layanan
   * @param kindServices Jenis layanan (optional)
   * @param idLayanan ID layanan (optional)
   */
  async getLayanan(
    kindServices?: KindServices,
    jenis_file?: string,
    params?: ParamLayananDto,
  ): Promise<LayananView[] | LayananView> {
    try {
      let query = this.supabaseClient.from('layanan').select(`
      id,
      judul,
      nama_file,
      url_file,
      ukuran_file,
      jenis_file,
      jenis_layanan,
      dibuat_pada
    `);

      if (kindServices) {
        query = query.eq('jenis_layanan', kindServices);
      }
      if (jenis_file) {
        query = query.eq('jenis_file', jenis_file);
      }
      if (params?.idParam) {
        query = query.eq('id', params.idParam);
      }
      if (params?.dateFrom && params?.dateTo) {
        query = query
          .gte('dibuat_pada', params.dateFrom)
          .lte('dibuat_pada', params.dateTo);
      }

      const { data, error } = await query.order('dibuat_pada', {
        ascending: false,
      });

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      if (params?.idParam) {
        if (!data || data.length === 0) {
          throw new NotFoundException('Layanan tidak ditemukan');
        }
        return data[0] as LayananView;
      }

      return (data || []) as LayananView[];
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal mendapatkan data layanan: ${err.message}`,
      );
    }
  }

  /*
   * Create layanan
   * @param userJwt JWT user
   * @param createLayananDto Data layanan yang akan dibuat
   * @returns Layanan yang telah dibuat
   */
  async createLayanan(
    userJwt: string,
    dto: CreateLayananDto,
  ): Promise<Layanan> {
    const supabase = createSupabaseClientWithUser(userJwt);

    try {
      const {
        judul,
        jenis_layanan,
        nama_file,
        url_file,
        ukuran_file,
        jenis_file,
      } = dto;

      let finalUrl = url_file;

      // Jika file dalam bentuk base64 data URI
      if (url_file?.startsWith('data:')) {
        const base64Data = url_file.split(';base64,')[1];
        const mimeType = url_file.substring(
          url_file.indexOf(':') + 1,
          url_file.indexOf(';'),
        );

        const ext = this.getExtensionFromMime(mimeType);
        const buffer = Buffer.from(base64Data, 'base64');

        const fileName = `layanan-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('layanan')
          .upload(fileName, buffer, {
            contentType: mimeType,
          });

        if (uploadError) {
          throw new InternalServerErrorException(
            `Gagal upload file: ${uploadError.message}`,
          );
        }

        const { data: urlData } = supabase.storage
          .from('layanan')
          .getPublicUrl(fileName);

        finalUrl = urlData.publicUrl;
      }

      // Insert data ke DB
      const { data, error } = await supabase
        .from('layanan')
        .insert({
          judul,
          jenis_layanan,
          nama_file: nama_file || null,
          url_file: finalUrl,
          ukuran_file,
          jenis_file,
        })
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data as Layanan;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /*
   * Update layanan
   * @param userJwt JWT user
   * @param params Parameter layanan menggunakan DTO
   * @param updateLayananDto Data layanan yang akan diperbarui
   * @returns Layanan yang telah diperbarui
   */
  async updateLayanan(
    userJwt: string,
    params: ParamLayananDto,
    dto: UpdateLayananDto,
  ): Promise<Layanan> {
    const supabase = createSupabaseClientWithUser(userJwt);
    const idLayanan = params.idParam;

    try {
      const { data: layanan, error: selectError } = await supabase
        .from('layanan')
        .select('*')
        .eq('id', idLayanan)
        .single();

      if (selectError || !layanan) {
        throw new NotFoundException('Layanan tidak ditemukan');
      }

      const updateData: any = {};
      let adaFileBaru = false;

      if (dto.judul) updateData.judul = dto.judul.trim();
      if (dto.jenis_layanan) updateData.jenis_layanan = dto.jenis_layanan;
      if (dto.nama_file) updateData.nama_file = dto.nama_file;

      if (dto.url_file?.startsWith('data:')) {
        adaFileBaru = true;

        if (layanan.url_file) {
          const oldFileName = layanan.url_file.split('/').pop();
          if (oldFileName) {
            const { error: removeError } = await supabase.storage
              .from('layanan')
              .remove([oldFileName]);

            if (removeError && !removeError.message.includes('not found')) {
              throw new InternalServerErrorException(
                `Gagal menghapus file lama: ${removeError.message}`,
              );
            }
          }
        }

        const base64Data = dto.url_file.split(';base64,')[1];
        const mimeType = dto.url_file.substring(
          dto.url_file.indexOf(':') + 1,
          dto.url_file.indexOf(';'),
        );

        const ext = this.getExtensionFromMime(mimeType);
        const buffer = Buffer.from(base64Data, 'base64');

        const fileName = `layanan-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('layanan')
          .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false,
          });

        if (uploadError) {
          throw new InternalServerErrorException(
            `Gagal upload file baru: ${uploadError.message}`,
          );
        }

        const { data: urlData } = supabase.storage
          .from('layanan')
          .getPublicUrl(fileName);

        updateData.url_file = urlData.publicUrl;
        updateData.jenis_file = mimeType;
        updateData.ukuran_file = buffer.byteLength;
      } else if (dto.url_file) {
        updateData.url_file = dto.url_file;
      }

      if (!adaFileBaru && Object.keys(updateData).length === 0) {
        throw new BadRequestException('Tidak ada data valid untuk diperbarui');
      }

      const { data: updatedData, error: updateError } = await supabase
        .from('layanan')
        .update(updateData)
        .eq('id', idLayanan)
        .select()
        .single();

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      return updatedData as Layanan;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui layanan: ${err.message}`,
      );
    }
  }

  /*
   * Delete layanan
   * @param userJwt JWT user
   * @param params Parameter layanan menggunakan DTO
   * @returns Layanan yang telah dihapus
   */
  async deleteLayanan(
    userJwt: string,
    params: ParamLayananDto,
  ): Promise<LayananView> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: selectError } = await supabaseWithUser
        .from('layanan')
        .select(
          `
        judul,
        nama_file,
        url_file,
        ukuran_file,
        jenis_file,
        jenis_layanan
      `,
        )
        .eq('id', params.idParam)
        .single();

      if (selectError || !existing) {
        throw new NotFoundException('Layanan tidak ditemukan');
      }

      if (existing.url_file) {
        const fileName = existing.url_file.split('/').pop();
        if (fileName) {
          const { error: removeError } = await supabaseWithUser.storage
            .from('layanan')
            .remove([fileName]);

          if (removeError && !removeError.message.includes('not found')) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteError } = await supabaseWithUser
        .from('layanan')
        .delete()
        .eq('id', params.idParam);

      if (deleteError) {
        throw new InternalServerErrorException(deleteError.message);
      }

      return existing as LayananView;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus layanan: ${err.message}`,
      );
    }
  }

  private getExtensionFromMime(mimeType: string): string {
    const map: Record<string, string> = {
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.ms-excel': 'xls',
    };

    return map[mimeType] || mimeType.split('/')[1] || 'bin';
  }
}
