import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { SpmbJoined, SpmbView } from './interface/spmb.interface';
import { FilterSpmbDto } from './dto/filter-spmb.dto';
import { ParamSPMBDto } from './dto/param-spmb.dto';
import { CreateSPMBDto } from './dto/create-spmb.dto';
import { UpdateSPMBDto } from './dto/update-spmb.dto';
@Injectable()
export class SpmbService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}
  /**
   * Get All SPMB
   *
   * @returns {Promise<SpmbJoined[]>}
   * @throws {InternalServerErrorException}
   */
  async getAllSpmb(): Promise<SpmbJoined[]> {
    const { data, error } = await this.supabase
      .from('spmb')
      .select(
        `
        id,
        judul,
        link_text,
        link_url,
        dibuat_pada,
        diperbarui_pada,

        spmb_media_image (
          id,
          image_url,
          dibuat_pada
        ),

        spmb_media_file (
          id,
          file_url,
          dibuat_pada
        )
      `,
      )
      .order('dibuat_pada', {
        ascending: false,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as SpmbJoined[];
  }

  /**
   * Get filtered SPMB
   *
   * Filter berdasarkan:
   * - judul
   * - link_text
   * - dibuat_pada
   *
   * @returns {Promise<SpmbView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredSpmb(filter: FilterSpmbDto): Promise<SpmbView[]> {
    const { judul, link_text, dibuat_pada } = filter;

    let query = this.supabase.from('spmb').select(`
      judul,
      link_text,
      link_url,

      spmb_media_image (
        image_url
      ),

      spmb_media_file (
        file_url
      )
    `);

    /**
     * Filter judul
     */
    if (judul) {
      query = query.ilike('judul', `%${judul}%`);
    }

    /**
     * Filter link text
     */
    if (link_text) {
      query = query.ilike('link_text', `%${link_text}%`);
    }

    /**
     * Filter tanggal dibuat
     */
    if (dibuat_pada) {
      /**
       * Filter Tahun
       * Contoh:
       * 2026
       */
      if (/^\d{4}$/.test(dibuat_pada)) {
        const start = `${dibuat_pada}-01-01`;

        const end = `${parseInt(dibuat_pada) + 1}-01-01`;

        query = query.gte('dibuat_pada', start).lt('dibuat_pada', end);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dibuat_pada)) {
        /**
         * Filter tanggal spesifik
         */
        const start = new Date(dibuat_pada);

        const end = new Date(dibuat_pada);

        end.setDate(end.getDate() + 1);

        query = query
          .gte('dibuat_pada', start.toISOString())
          .lt('dibuat_pada', end.toISOString());
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    /**
     * Transform relational result
     */
    const transformed = data.map((item) => ({
      judul: item.judul,

      link_text: item.link_text,

      link_url: item.link_url,

      image_url: item.spmb_media_image?.[0]?.image_url || null,

      file_url: item.spmb_media_file?.[0]?.file_url || null,
    }));

    return transformed as SpmbView[];
  }

  /**
   * Create SPMB
   *
   * @returns {Promise<SpmbJoined>}
   * @throws {InternalServerErrorException}
   */
  async createSPMB(
    userJwt: string,
    createSPMBDto: CreateSPMBDto,
  ): Promise<SpmbJoined> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: spmbData, error: spmbError } = await supabaseWithUser
        .from('spmb')
        .insert({
          judul: createSPMBDto.judul,
          link_text: createSPMBDto.link_text || null,
          link_url: createSPMBDto.link_url || null,
        })
        .select()
        .single();

      if (spmbError) {
        throw new InternalServerErrorException(spmbError.message);
      }

      const spmbId = spmbData.id;

      /**
       * Insert Images
       */
      if (createSPMBDto.spmb_media_image?.length) {
        const images = createSPMBDto.spmb_media_image.map((img) => ({
          spmb_id: spmbId,
          image_url: img.image_url,
        }));

        const { error: imageError } = await supabaseWithUser
          .from('spmb_media_image')
          .insert(images);

        if (imageError) {
          throw new InternalServerErrorException(imageError.message);
        }
      }

      /**
       * Insert Files
       */
      if (createSPMBDto.spmb_media_file?.length) {
        const files = createSPMBDto.spmb_media_file.map((file) => ({
          spmb_id: spmbId,
          file_url: file.file_url,
        }));

        const { error: fileError } = await supabaseWithUser
          .from('spmb_media_file')
          .insert(files);

        if (fileError) {
          throw new InternalServerErrorException(fileError.message);
        }
      }

      const { data: joinedData, error: selectError } = await supabaseWithUser
        .from('spmb')
        .select(
          `
          id,
          judul,
          link_text,
          link_url,
          dibuat_pada,
          diperbarui_pada,

          spmb_media_image (
            id,
            image_url,
            dibuat_pada
          ),

          spmb_media_file (
            id,
            file_url,
            dibuat_pada
          )
        `,
        )
        .eq('id', spmbId)
        .single();

      if (selectError) {
        throw new InternalServerErrorException(selectError.message);
      }

      return joinedData as SpmbJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal membuat SPMB: ${err.message}`,
      );
    }
  }

  /**
   * Update SPMB
   */
  async updateSPMB(
    userJwt: string,
    paramSPMBDto: ParamSPMBDto,
    updateSPMBDto: UpdateSPMBDto,
  ): Promise<SpmbJoined> {
    const { idParam } = paramSPMBDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('spmb')
        .select(
          `
          *,
          spmb_media_image(*),
          spmb_media_file(*)
        `,
        )
        .eq('id', idParam)
        .single();

      if (fetchError || !existing) {
        throw new NotFoundException('SPMB tidak ditemukan');
      }

      const { error: updateError } = await supabaseWithUser
        .from('spmb')
        .update({
          judul: updateSPMBDto.judul ?? existing.judul,

          link_text: updateSPMBDto.link_text ?? existing.link_text,

          link_url: updateSPMBDto.link_url ?? existing.link_url,

          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      /**
       * Replace Images
       */
      if (updateSPMBDto.spmb_media_image) {
        await supabaseWithUser
          .from('spmb_media_image')
          .delete()
          .eq('spmb_id', idParam);

        if (updateSPMBDto.spmb_media_image.length) {
          await supabaseWithUser.from('spmb_media_image').insert(
            updateSPMBDto.spmb_media_image.map((img) => ({
              spmb_id: Number(idParam),
              image_url: img.image_url,
            })),
          );
        }
      }

      /**
       * Replace Files
       */
      if (updateSPMBDto.spmb_media_file) {
        await supabaseWithUser
          .from('spmb_media_file')
          .delete()
          .eq('spmb_id', idParam);

        if (updateSPMBDto.spmb_media_file.length) {
          await supabaseWithUser.from('spmb_media_file').insert(
            updateSPMBDto.spmb_media_file.map((file) => ({
              spmb_id: Number(idParam),
              file_url: file.file_url,
            })),
          );
        }
      }

      const { data: updated, error: selectError } = await supabaseWithUser
        .from('spmb')
        .select(
          `
          id,
          judul,
          link_text,
          link_url,
          dibuat_pada,
          diperbarui_pada,

          spmb_media_image (
            id,
            image_url,
            dibuat_pada
          ),

          spmb_media_file (
            id,
            file_url,
            dibuat_pada
          )
        `,
        )
        .eq('id', idParam)
        .single();

      if (selectError) {
        throw new InternalServerErrorException(selectError.message);
      }

      return updated as SpmbJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui SPMB: ${err.message}`,
      );
    }
  }

  /**
   * Delete SPMB
   */
  async deleteSPMB(
    userJwt: string,
    paramSPMBDto: ParamSPMBDto,
  ): Promise<SpmbJoined[]> {
    const { idParam } = paramSPMBDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('spmb')
        .select(
          `
          id,
          judul,
          link_text,
          link_url,
          dibuat_pada,
          diperbarui_pada,

          spmb_media_image (
            id,
            image_url
          ),

          spmb_media_file (
            id,
            file_url
          )
        `,
        )
        .eq('id', idParam)
        .single();

      if (fetchError || !existing) {
        throw new NotFoundException('SPMB tidak ditemukan');
      }

      await supabaseWithUser
        .from('spmb_media_image')
        .delete()
        .eq('spmb_id', idParam);

      await supabaseWithUser
        .from('spmb_media_file')
        .delete()
        .eq('spmb_id', idParam);

      const { error: deleteError } = await supabaseWithUser
        .from('spmb')
        .delete()
        .eq('id', idParam);

      if (deleteError) {
        throw new InternalServerErrorException(deleteError.message);
      }

      return [existing as SpmbJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus SPMB: ${err.message}`,
      );
    }
  }
}
