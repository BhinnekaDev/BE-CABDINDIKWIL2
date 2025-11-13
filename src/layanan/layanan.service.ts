import {
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
      // Hanya select field yang ada di LayananView
      let query = this.supabaseClient.from('layanan').select(`
        judul,
        nama_file,
        url_file,
        ukuran_file,
        jenis_file,
        jenis_layanan
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

      const { data, error } = await query.order('created_at', {
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
    createLayananDto: CreateLayananDto,
  ): Promise<Layanan> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { judul, jenis_layanan, nama_file, url_file } = createLayananDto;

      let ukuran_file: number | undefined;
      let jenis_file: string | undefined;
      let publicUrl: string | undefined;

      if (url_file?.startsWith('data:')) {
        const base64Data = url_file.split(';base64,')[1];
        const mimeType = url_file.substring(
          url_file.indexOf(':') + 1,
          url_file.indexOf(';'),
        );
        const ext = mimeType.split('/')[1];
        const buffer = Buffer.from(base64Data!, 'base64');
        ukuran_file = buffer.length;
        jenis_file = ext;

        const fileName = `layanan-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('layanan')
          .upload(fileName, buffer, { contentType: mimeType });

        if (uploadError) {
          throw new InternalServerErrorException(
            `Gagal upload file: ${uploadError.message}`,
          );
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('layanan')
          .getPublicUrl(fileName);

        publicUrl = urlData.publicUrl;
      }

      const { data, error } = await supabaseWithUser
        .from('layanan')
        .insert({
          judul,
          jenis_layanan,
          nama_file: nama_file || null,
          url_file: publicUrl || url_file || null,
          ukuran_file: ukuran_file || null,
          jenis_file: jenis_file || null,
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
    updateLayananDto: UpdateLayananDto,
  ): Promise<Layanan> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const idLayanan = params.idParam;

    try {
      const { data: layanan, error: selectError } = await supabaseWithUser
        .from('layanan')
        .select('*')
        .eq('id', idLayanan)
        .single();

      if (selectError || !layanan) {
        throw new NotFoundException('Layanan tidak ditemukan');
      }

      const updateData: Partial<
        UpdateLayananDto & { ukuran_file?: number; jenis_file?: string }
      > = {};

      if (updateLayananDto.judul)
        updateData.judul = updateLayananDto.judul.trim();
      if (updateLayananDto.jenis_layanan)
        updateData.jenis_layanan = updateLayananDto.jenis_layanan;
      if (updateLayananDto.nama_file)
        updateData.nama_file = updateLayananDto.nama_file;

      if (updateLayananDto.url_file?.startsWith('data:')) {
        if (layanan.url_file) {
          const oldFileName = layanan.url_file.split('/').pop();
          if (oldFileName) {
            const { error: removeError } = await supabaseWithUser.storage
              .from('layanan')
              .remove([oldFileName]);
            if (removeError && !removeError.message.includes('not found')) {
              throw new InternalServerErrorException(removeError.message);
            }
          }
        }

        const base64Data = updateLayananDto.url_file.split(';base64,')[1];
        const mimeType = updateLayananDto.url_file.substring(
          updateLayananDto.url_file.indexOf(':') + 1,
          updateLayananDto.url_file.indexOf(';'),
        );
        const ext = mimeType.split('/')[1];
        const buffer = Buffer.from(base64Data!, 'base64');

        const fileName = `layanan-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('layanan')
          .upload(fileName, buffer, { contentType: mimeType });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('layanan')
          .getPublicUrl(fileName);

        updateData.url_file = urlData.publicUrl;
        updateData.ukuran_file = buffer.length;
        updateData.jenis_file = ext;
      } else if (updateLayananDto.url_file) {
        updateData.url_file = updateLayananDto.url_file;
      }

      if (Object.keys(updateData).length === 0) {
        throw new InternalServerErrorException(
          'Tidak ada data valid untuk diperbarui',
        );
      }

      const { data: updatedData, error: updateError } = await supabaseWithUser
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
}
