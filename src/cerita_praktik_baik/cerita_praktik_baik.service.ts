import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateCeritaPraktikBaikWithGambarDto } from './dto/create-ceritapraktikbaik.dto';
import { FilterCeritaPraktikBaikDto } from './dto/filter-ceritapraktikbaik.dto';
import { ParamCeritaPraktikBaikDto } from './dto/param-ceritapraktikbaik.dto';
import { UpdateCeritaPraktikBaikWithGambarDto } from './dto/update-ceritapraktikbaik.dto';
import {
  CeritaPraktikBaikJoined,
  CeritaPraktikBaikView,
} from './interface/cerita-praktik-baik.interface';

@Injectable()
export class CeritaPraktikBaikService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}
  /**
   * Get All Ceritapraktikbaik
   *
   * @returns {Promise<CeritaPraktikBaikJoined[]>}
   * @throws {InternalServerErrorException}
   */

  async getAllCeritaPraktikBaik(): Promise<CeritaPraktikBaikJoined[]> {
    const { data, error } = await this.supabase
      .from('cerita_praktik_baik')
      .select(
        `
      id,
      judul,
      penulis,
      tanggal_diterbitkan,
      isi,
      dibuat_pada,
      diperbarui_pada,
      cerita_praktik_baik_gambar (
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

    return data as CeritaPraktikBaikJoined[];
  }

  /**
   * Get all ceritapraktikbaik dari view dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @returns {Promise<CeritaPraktikBaikView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredCeritaPraktikBaik(
    filter: FilterCeritaPraktikBaikDto,
  ): Promise<CeritaPraktikBaikView[]> {
    const { judul, penulis, tanggal_diterbitkan } = filter;

    let query = this.supabase.from('cerita_praktik_baik_gambar').select('*');

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

    return data as CeritaPraktikBaikView[];
  }

  /**
   * Create ceritapraktikbaik
   *
   * @returns {Promise<CeritaPraktikBaikJoined>}
   * @throws {InternalServerErrorException}
   */
  async createCeritaPraktikBaik(
    userJwt: string,
    createCeritaPraktikBaikDto: CreateCeritaPraktikBaikWithGambarDto,
  ): Promise<CeritaPraktikBaikJoined> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      let isiHTML = createCeritaPraktikBaikDto.isi ?? '';

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
        allowedSchemes: ['http', 'https', 'data'],
        allowProtocolRelative: false,
      });

      const { data: ceritapraktikbaikData, error: ceritapraktikbaikError } =
        await supabaseWithUser
          .from('cerita_praktik_baik')
          .insert({
            judul: createCeritaPraktikBaikDto.judul,
            penulis: createCeritaPraktikBaikDto.penulis,
            isi: sanitizedIsi,
          })
          .select()
          .single();

      if (ceritapraktikbaikError) {
        throw new InternalServerErrorException(ceritapraktikbaikError.message);
      }

      const seputarId = ceritapraktikbaikData.id;

      if (createCeritaPraktikBaikDto.cerita_praktik_baik_gambar?.length) {
        const gambar = createCeritaPraktikBaikDto.cerita_praktik_baik_gambar[0];

        const base64 = gambar.url_gambar.split(';base64,').pop();
        const fileExt = gambar.url_gambar.substring(
          gambar.url_gambar.indexOf('/') + 1,
          gambar.url_gambar.indexOf(';'),
        );

        const fileName = `ceritapraktikbaik-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('cerita_praktik_baik')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('cerita_praktik_baik')
          .getPublicUrl(fileName);

        const { error: insertGambarError } = await supabaseWithUser
          .from('cerita_praktik_baik_gambar')
          .insert({
            cerita_id: seputarId,
            url_gambar: urlData.publicUrl,
            keterangan: gambar.keterangan ?? null,
          });

        if (insertGambarError) {
          throw new InternalServerErrorException(insertGambarError.message);
        }
      }

      const { data: ceritaPraktikBaikJoined } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        cerita_praktik_baik_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', seputarId)
        .single();

      return ceritaPraktikBaikJoined as CeritaPraktikBaikJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Update ceritapraktikbaik
   *
   * @returns {Promise<CeritaPraktikBaikJoined>}
   * @throws {InternalServerErrorException, NotFoundException, BadRequestException}
   */
  async updateCeritaPraktikBaik(
    userJwt: string,
    paramCeritaPraktikBaikDto: ParamCeritaPraktikBaikDto,
    updateCeritaPraktikBaikDto: UpdateCeritaPraktikBaikWithGambarDto,
  ): Promise<CeritaPraktikBaikJoined> {
    const { idParam } = paramCeritaPraktikBaikDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const numericId = Number(idParam);
      if (isNaN(numericId)) {
        throw new BadRequestException('ID tidak valid');
      }

      const { data: ceritapraktikbaik } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .select('*')
        .eq('id', numericId)
        .single();

      if (!ceritapraktikbaik) {
        throw new NotFoundException('Ceritapraktikbaik tidak ditemukan');
      }

      let sanitizedIsi = updateCeritaPraktikBaikDto.isi;
      if (sanitizedIsi) {
        sanitizedIsi = sanitizeHtml(sanitizedIsi, {
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
        });
      }

      const { error: updateError } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .update({
          ...(updateCeritaPraktikBaikDto.judul && {
            judul: updateCeritaPraktikBaikDto.judul,
          }),
          ...(updateCeritaPraktikBaikDto.penulis && {
            penulis: updateCeritaPraktikBaikDto.penulis,
          }),
          ...(sanitizedIsi && { isi: sanitizedIsi }),
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      if (
        updateCeritaPraktikBaikDto.cerita_praktik_baik_gambar &&
        updateCeritaPraktikBaikDto.cerita_praktik_baik_gambar.length > 0
      ) {
        const gambarBaru =
          updateCeritaPraktikBaikDto.cerita_praktik_baik_gambar[0];

        if (gambarBaru.url_gambar) {
          const { data: gambarLamaList } = await supabaseWithUser
            .from('cerita_praktik_baik_gambar')
            .select('*')
            .eq('cerita_id', idParam);

          // 4.2 Hapus semua file di storage & row tabel
          if (gambarLamaList && gambarLamaList.length > 0) {
            const fileNamesLama = gambarLamaList
              .map((g) => g.url_gambar?.split('/').pop())
              .filter((f) => !!f);

            if (fileNamesLama.length > 0) {
              await supabaseWithUser.storage
                .from('cerita_praktik_baik')
                .remove(fileNamesLama);
            }

            await supabaseWithUser
              .from('cerita_praktik_baik_gambar')
              .delete()
              .eq('cerita_id', idParam);
          }

          const base64 = gambarBaru.url_gambar.split(';base64,').pop();
          const fileExt = gambarBaru.url_gambar.substring(
            gambarBaru.url_gambar.indexOf('/') + 1,
            gambarBaru.url_gambar.indexOf(';'),
          );
          const fileNameBaru = `ceritapraktikbaik-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('cerita_praktik_baik')
            .upload(fileNameBaru, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
            });

          if (uploadError) {
            throw new InternalServerErrorException(uploadError.message);
          }

          const { data: urlData } = supabaseWithUser.storage
            .from('cerita_praktik_baik')
            .getPublicUrl(fileNameBaru);

          await supabaseWithUser.from('cerita_praktik_baik_gambar').insert({
            cerita_id: idParam,
            url_gambar: urlData.publicUrl,
            keterangan: gambarBaru.keterangan ?? null,
          });
        }
      }

      const { data: updated } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        cerita_praktik_baik_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', idParam)
        .single();

      return updated as CeritaPraktikBaikJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Delete ceritapraktikbaik
   *
   * @returns {Promise<CeritaPraktikBaikJoined[]>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async deleteCeritaPraktikBaik(
    userJwt: string,
    paramCeritaPraktikBaikDto: ParamCeritaPraktikBaikDto,
  ): Promise<CeritaPraktikBaikJoined[]> {
    const { idParam } = paramCeritaPraktikBaikDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        cerita_praktik_baik_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', idParam)
        .maybeSingle();

      if (fetchError) {
        throw new InternalServerErrorException(fetchError.message);
      }

      if (!existing) {
        throw new NotFoundException('Ceritapraktikbaik tidak ditemukan');
      }

      const gambarArr = existing.cerita_praktik_baik_gambar
        ? Array.isArray(existing.cerita_praktik_baik_gambar)
          ? existing.cerita_praktik_baik_gambar
          : [existing.cerita_praktik_baik_gambar]
        : [];

      if (gambarArr.length > 0) {
        const filenames = gambarArr
          .map((g: any) => {
            if (!g?.url_gambar) return null;
            const parts = String(g.url_gambar).split('/');
            return parts[parts.length - 1] || null;
          })
          .filter((f: string | null) => !!f) as string[];

        if (filenames.length > 0) {
          const { error: removeError } = await supabaseWithUser.storage
            .from('cerita_praktik_baik')
            .remove(filenames);

          if (removeError && removeError.message) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('cerita_praktik_baik_gambar')
        .delete()
        .eq('cerita_id', idParam);

      if (deleteGambarError) {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const {
        data: deletedCeritapraktikbaik,
        error: deleteCeritaPraktikBaikError,
      } = await supabaseWithUser
        .from('cerita_praktik_baik')
        .delete()
        .eq('id', idParam)
        .select();

      if (deleteCeritaPraktikBaikError) {
        throw new InternalServerErrorException(
          deleteCeritaPraktikBaikError.message,
        );
      }

      return [existing as CeritaPraktikBaikJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
