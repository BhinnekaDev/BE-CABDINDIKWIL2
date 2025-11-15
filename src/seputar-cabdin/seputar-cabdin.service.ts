import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateSeputarCabdinWithGambarDto } from './dto/create-seputarcabdin.dto';
import { FilterSeputarCabdinDto } from './dto/filter-seputarcabdin.dto';
import { ParamSeputarCabdinDto } from './dto/param-seputarcabdin.dto';
import { UpdateSeputarCabdinWithGambarDto } from './dto/update-seputarcabdin.dto';
import {
  SeputarCabdinJoined,
  SeputarCabdinView,
} from './interface/seputar-cabdin.interface';

@Injectable()
export class SeputarCabdinService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}
  /**
   * Get All Seputarcabdin
   *
   * @returns {Promise<SeputarCabdinJoined[]>}
   * @throws {InternalServerErrorException}
   */

  async getAllSeputarCabdin(): Promise<SeputarCabdinJoined[]> {
    const { data, error } = await this.supabase
      .from('seputar_cabdin')
      .select(
        `
      id,
      judul,
      penulis,
      tanggal_diterbitkan,
      isi,
      dibuat_pada,
      diperbarui_pada,
      seputar_cabdin_gambar (
        id,
        url_gambar,
        keterangan,
        dibuat_pada
      )
    `,
      )
      .order('tanggal_diterbitkan', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as SeputarCabdinJoined[];
  }

  /**
   * Get all seputarcabdin dari view dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @returns {Promise<SeputarCabdinView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredSeputarCabdin(
    filter: FilterSeputarCabdinDto,
  ): Promise<SeputarCabdinView[]> {
    const { judul, penulis, tanggal_diterbitkan } = filter;

    let query = this.supabase.from('seputarcabdin_with_gambar').select('*');

    if (judul) {
      query = query.ilike('judul', `%${judul}%`);
    }

    if (penulis) {
      query = query.ilike('penulis', `%${penulis}%`);
    }

    if (tanggal_diterbitkan) {
      if (/^\d{4}$/.test(tanggal_diterbitkan)) {
        const start = `${tanggal_diterbitkan}-01-01`;
        const end = `${parseInt(tanggal_diterbitkan) + 1}-01-01`;

        query = query
          .gte('tanggal_diterbitkan', start)
          .lt('tanggal_diterbitkan', end);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(tanggal_diterbitkan)) {
        const start = new Date(tanggal_diterbitkan);
        const end = new Date(tanggal_diterbitkan);
        end.setDate(end.getDate() + 1);

        query = query
          .gte('tanggal_diterbitkan', start.toISOString())
          .lt('tanggal_diterbitkan', end.toISOString());
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as SeputarCabdinView[];
  }

  /**
   * Create seputarcabdin
   *
   * @returns {Promise<SeputarCabdinJoined>}
   * @throws {InternalServerErrorException}
   */
  async createSeputarCabdin(
    userJwt: string,
    createSeputarCabdinDto: CreateSeputarCabdinWithGambarDto,
  ): Promise<SeputarCabdinJoined> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const isiHTML = createSeputarCabdinDto.isi ?? '';

      const sanitizedIsi = sanitizeHtml(isiHTML, {
        allowedTags: [
          'b',
          'i',
          'em',
          'strong',
          'a',
          'p',
          'ul',
          'ol',
          'li',
          'br',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'img',
        ],
        allowedAttributes: {
          a: ['href', 'name', 'target'],
          img: ['src', 'alt', 'title'],
        },
        allowedSchemes: ['http', 'https'],
        allowProtocolRelative: false,
      });

      const { data: seputarcabdinData, error: seputarcabdinError } =
        await supabaseWithUser
          .from('seputar_cabdin')
          .insert({
            judul: createSeputarCabdinDto.judul,
            penulis: createSeputarCabdinDto.penulis,
            isi: sanitizedIsi,
          })
          .select()
          .single();

      if (seputarcabdinError) {
        throw new InternalServerErrorException(seputarcabdinError.message);
      }

      const seputarId = seputarcabdinData.id;

      if (createSeputarCabdinDto.seputar_cabdin_gambar?.length) {
        const gambar = createSeputarCabdinDto.seputar_cabdin_gambar[0];

        if (gambar.url_gambar) {
          const { error: insertGambarError } = await supabaseWithUser
            .from('seputar_cabdin_gambar')
            .insert({
              seputar_id: seputarId,
              url_gambar: gambar.url_gambar,
              keterangan: gambar.keterangan?.trim() || null,
            });

          if (insertGambarError) {
            throw new InternalServerErrorException(insertGambarError.message);
          }
        }
      }

      const { data: seputarCabdinJoined, error: selectError } =
        await supabaseWithUser
          .from('seputar_cabdin')
          .select(
            `
          id,
          judul,
          penulis,
          tanggal_diterbitkan,
          isi,
          dibuat_pada,
          diperbarui_pada,
          seputar_cabdin_gambar (
            id,
            url_gambar,
            keterangan,
            dibuat_pada
          )
        `,
          )
          .eq('id', seputarId)
          .single();

      if (selectError) {
        throw new InternalServerErrorException(selectError.message);
      }

      return seputarCabdinJoined as SeputarCabdinJoined;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException('Terjadi kesalahan tidak terduga');
    }
  }

  /**
   * Update seputarcabdin
   *
   * @returns {Promise<SeputarCabdinJoined>}
   * @throws {InternalServerErrorException, NotFoundException, BadRequestException}
   */
  async updateSeputarCabdin(
    userJwt: string,
    paramSeputarCabdinDto: ParamSeputarCabdinDto,
    updateSeputarCabdinDto: UpdateSeputarCabdinWithGambarDto,
  ): Promise<SeputarCabdinJoined> {
    const { idParam } = paramSeputarCabdinDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: seputarcabdin, error: seputarcabdinError } =
        await supabaseWithUser
          .from('seputar_cabdin')
          .select('*, seputar_cabdin_gambar(id, url_gambar, keterangan)')
          .eq('id', idParam)
          .single();

      if (seputarcabdinError || !seputarcabdin) {
        throw new NotFoundException('Seputarcabdin tidak ditemukan');
      }

      const judulBaru =
        updateSeputarCabdinDto.judul?.trim() || seputarcabdin.judul;
      const penulisBaru =
        updateSeputarCabdinDto.penulis?.trim() || seputarcabdin.penulis;
      const isiBaru = updateSeputarCabdinDto.isi
        ? sanitizeHtml(updateSeputarCabdinDto.isi, {
            allowedTags: [
              'b',
              'i',
              'em',
              'strong',
              'a',
              'p',
              'ul',
              'ol',
              'li',
              'br',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'img',
            ],
            allowedAttributes: {
              a: ['href', 'name', 'target'],
              img: ['src', 'alt', 'title'],
            },
            allowedSchemes: ['http', 'https', 'data'],
          })
        : seputarcabdin.isi;

      const { error: updateError } = await supabaseWithUser
        .from('seputar_cabdin')
        .update({
          judul: judulBaru,
          penulis: penulisBaru,
          isi: isiBaru,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError)
        throw new InternalServerErrorException(updateError.message);

      if (
        updateSeputarCabdinDto.seputar_cabdin_gambar &&
        updateSeputarCabdinDto.seputar_cabdin_gambar.length > 0
      ) {
        const gambarBaru = updateSeputarCabdinDto.seputar_cabdin_gambar[0];
        const gambarLama = seputarcabdin.seputar_cabdin_gambar?.[0];

        if (gambarBaru.url_gambar?.startsWith('data:image')) {
          if (gambarLama?.url_gambar) {
            const oldFileName = gambarLama.url_gambar.split('/').pop();
            if (oldFileName) {
              const { error: removeError } = await supabaseWithUser.storage
                .from('seputar_cabdin')
                .remove([oldFileName]);
              if (removeError && !removeError.message.includes('not found')) {
                throw new InternalServerErrorException(removeError.message);
              }
            }
          }

          const base64 = gambarBaru.url_gambar.split(';base64,').pop();
          const fileExt = gambarBaru.url_gambar.substring(
            gambarBaru.url_gambar.indexOf('/') + 1,
            gambarBaru.url_gambar.indexOf(';'),
          );
          const fileName = `seputar-cabdin-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('seputar_cabdin')
            .upload(fileName, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
              upsert: false,
            });

          if (uploadError)
            throw new InternalServerErrorException(uploadError.message);

          const { data: publicUrlData } = supabaseWithUser.storage
            .from('seputar_cabdin')
            .getPublicUrl(fileName);

          if (gambarLama) {
            await supabaseWithUser
              .from('seputar_cabdin_gambar')
              .update({
                url_gambar: publicUrlData.publicUrl,
                keterangan:
                  gambarBaru.keterangan?.trim() ||
                  gambarLama.keterangan ||
                  null,
              })
              .eq('id', gambarLama.id);
          } else {
            await supabaseWithUser.from('seputar_cabdin_gambar').insert({
              seputar_id: idParam,
              url_gambar: publicUrlData.publicUrl,
              keterangan: gambarBaru.keterangan?.trim() || null,
            });
          }
        } else if (gambarBaru.keterangan && gambarLama) {
          await supabaseWithUser
            .from('seputar_cabdin_gambar')
            .update({
              keterangan: gambarBaru.keterangan.trim(),
            })
            .eq('id', gambarLama.id);
        }
      }

      const { data: updated, error: selectError } = await supabaseWithUser
        .from('seputar_cabdin')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        seputar_cabdin_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', idParam)
        .single();

      if (selectError)
        throw new InternalServerErrorException(selectError.message);

      return updated as SeputarCabdinJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui seputarcabdin: ${err.message}`,
      );
    }
  }

  /**
   * Delete seputarcabdin
   *
   * @returns {Promise<SeputarCabdinJoined[]>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async deleteSeputarCabdin(
    userJwt: string,
    paramSeputarCabdinDto: ParamSeputarCabdinDto,
  ): Promise<SeputarCabdinJoined[]> {
    const { idParam } = paramSeputarCabdinDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('seputar_cabdin')
        .select(
          `
            id,
            judul,
            penulis,
            tanggal_diterbitkan,
            isi,
            dibuat_pada,
            diperbarui_pada,
            seputar_cabdin_gambar (
              id,
              url_gambar
            )
          `,
        )
        .eq('id', idParam)
        .maybeSingle();

      if (fetchError)
        throw new InternalServerErrorException(fetchError.message);
      if (!existing)
        throw new NotFoundException('Seputar cabdin tidak ditemukan');

      const gambarArr = Array.isArray(existing.seputar_cabdin_gambar)
        ? existing.seputar_cabdin_gambar
        : existing.seputar_cabdin_gambar
          ? [existing.seputar_cabdin_gambar]
          : [];

      if (gambarArr.length > 0) {
        const filenames = gambarArr
          .map((g: any) => {
            if (!g?.url_gambar) return null;
            const urlParts = g.url_gambar.split('/');
            return urlParts[urlParts.length - 1] || null;
          })
          .filter(Boolean) as string[];

        if (filenames.length > 0) {
          const { error: removeError } = await supabaseWithUser.storage
            .from('seputar_cabdin')
            .remove(filenames);

          if (removeError && !removeError.message.includes('not found')) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('seputar_cabdin_gambar')
        .delete()
        .eq('seputar_id', idParam);

      if (deleteGambarError && deleteGambarError.code !== 'PGRST116') {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const { data: deletedSeputarcabdin, error: deleteSeputarCabdinError } =
        await supabaseWithUser
          .from('seputar_cabdin_gambar')
          .delete()
          .eq('id', idParam)
          .select();

      if (deleteSeputarCabdinError)
        throw new InternalServerErrorException(
          deleteSeputarCabdinError.message,
        );

      return [existing as SeputarCabdinJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus seputar cabdin: ${err.message}`,
      );
    }
  }
}
