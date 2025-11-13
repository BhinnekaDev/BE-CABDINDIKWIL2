import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateInovasiWithGambarDto } from './dto/create-inovasi.dto';
import { FilterInovasiDto } from './dto/filter-inovasi.dto';
import { ParamInovasiDto } from './dto/param-inovasi.dto';
import { UpdateInovasiWithGambarDto } from './dto/update-inovasi.dto';
import { InovasiJoined, InovasiView } from './interface/inovasi.interface';

@Injectable()
export class InovasiService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}
  /**
   * Get All Inovasi
   *
   * @returns {Promise<InovasiJoined[]>}
   * @throws {InternalServerErrorException}
   */

  async getAllInovasi(): Promise<InovasiJoined[]> {
    const { data, error } = await this.supabase
      .from('inovasi')
      .select(
        `
      id,
      judul,
      penulis,
      tanggal_diterbitkan,
      isi,
      dibuat_pada,
      diperbarui_pada,
      inovasi_gambar (
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

    return data as InovasiJoined[];
  }

  /**
   * Get inovasi by ID
   *
   * @returns {Promise<InovasiJoined>}
   * @throws {NotFoundException | InternalServerErrorException}
   */
  async getInovasiById(
    paramInovasiDto: ParamInovasiDto,
  ): Promise<InovasiJoined> {
    const { idParam } = paramInovasiDto;

    const { data, error } = await this.supabase
      .from('inovasi')
      .select(
        `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        inovasi_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )`,
      )
      .eq('id', idParam);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (data.length === 0) {
      throw new NotFoundException('Inovasi tidak ditemukan.');
    }

    return data[0] as InovasiJoined;
  }

  /**
   * Get all inovasi dari view dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @returns {Promise<InovasiView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredInovasi(filter: FilterInovasiDto): Promise<InovasiView[]> {
    const { judul, penulis, tanggal_diterbitkan } = filter;

    let query = this.supabase.from('inovasi_with_gambar').select('*');

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

    return data as InovasiView[];
  }

  /**
   * Create inovasi
   *
   * @returns {Promise<InovasiJoined>}
   * @throws {InternalServerErrorException}
   */
  async createInovasi(
    userJwt: string,
    createInovasiDto: CreateInovasiWithGambarDto,
  ): Promise<InovasiJoined> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      let isiHTML = createInovasiDto.isi ?? '';

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

      const { data: inovasiData, error: inovasiError } = await supabaseWithUser
        .from('inovasi')
        .insert({
          judul: createInovasiDto.judul,
          penulis: createInovasiDto.penulis,
          isi: sanitizedIsi,
        })
        .select()
        .single();

      if (inovasiError) {
        throw new InternalServerErrorException(inovasiError.message);
      }

      const inovasiId = inovasiData.id;

      if (createInovasiDto.inovasi_gambar?.length) {
        const gambar = createInovasiDto.inovasi_gambar[0];

        const base64 = gambar.url_gambar.split(';base64,').pop();
        const fileExt = gambar.url_gambar.substring(
          gambar.url_gambar.indexOf('/') + 1,
          gambar.url_gambar.indexOf(';'),
        );

        const fileName = `inovasi-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('inovasi')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('inovasi')
          .getPublicUrl(fileName);

        const { error: insertGambarError } = await supabaseWithUser
          .from('inovasi_gambar')
          .insert({
            inovasi_id: inovasiId,
            url_gambar: urlData.publicUrl,
            keterangan: gambar.keterangan ?? null,
          });

        if (insertGambarError) {
          throw new InternalServerErrorException(insertGambarError.message);
        }
      }

      const { data: inovasiJoined } = await supabaseWithUser
        .from('inovasi')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        inovasi_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', inovasiId)
        .single();

      return inovasiJoined as InovasiJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Update inovasi
   *
   * @returns {Promise<InovasiJoined>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async updateInovasi(
    userJwt: string,
    paramInovasiDto: ParamInovasiDto,
    updateInovasiDto: UpdateInovasiWithGambarDto,
  ): Promise<InovasiJoined> {
    const { idParam } = paramInovasiDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: inovasi, error: inovasiError } = await supabaseWithUser
        .from('inovasi')
        .select('*, inovasi_gambar(id, url_gambar, keterangan)')
        .eq('id', idParam)
        .single();

      if (inovasiError || !inovasi) {
        throw new NotFoundException('Inovasi tidak ditemukan');
      }

      const judulBaru = updateInovasiDto.judul?.trim() || inovasi.judul;
      const penulisBaru = updateInovasiDto.penulis?.trim() || inovasi.penulis;
      const isiBaru = updateInovasiDto.isi
        ? sanitizeHtml(updateInovasiDto.isi, {
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
        : inovasi.isi;

      const { error: updateError } = await supabaseWithUser
        .from('inovasi')
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
        updateInovasiDto.inovasi_gambar &&
        updateInovasiDto.inovasi_gambar.length > 0
      ) {
        const gambarBaru = updateInovasiDto.inovasi_gambar[0];
        const gambarLama = inovasi.inovasi_gambar?.[0];

        if (gambarBaru.url_gambar?.startsWith('data:image')) {
          if (gambarLama?.url_gambar) {
            const oldFileName = gambarLama.url_gambar.split('/').pop();
            if (oldFileName) {
              const { error: removeError } = await supabaseWithUser.storage
                .from('inovasi')
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
          const fileName = `inovasi-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('inovasi')
            .upload(fileName, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
              upsert: false,
            });

          if (uploadError)
            throw new InternalServerErrorException(uploadError.message);

          const { data: publicUrlData } = supabaseWithUser.storage
            .from('inovasi')
            .getPublicUrl(fileName);

          if (gambarLama) {
            await supabaseWithUser
              .from('inovasi_gambar')
              .update({
                url_gambar: publicUrlData.publicUrl,
                keterangan:
                  gambarBaru.keterangan?.trim() ||
                  gambarLama.keterangan ||
                  null,
              })
              .eq('id', gambarLama.id);
          } else {
            await supabaseWithUser.from('inovasi_gambar').insert({
              inovasi_id: idParam,
              url_gambar: publicUrlData.publicUrl,
              keterangan: gambarBaru.keterangan?.trim() || null,
            });
          }
        } else if (gambarBaru.keterangan && gambarLama) {
          await supabaseWithUser
            .from('inovasi_gambar')
            .update({
              keterangan: gambarBaru.keterangan.trim(),
            })
            .eq('id', gambarLama.id);
        }
      }

      const { data: updated, error: selectError } = await supabaseWithUser
        .from('inovasi')
        .select(
          `
          id,
          judul,
          penulis,
          tanggal_diterbitkan,
          isi,
          dibuat_pada,
          diperbarui_pada,
          inovasi_gambar (
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

      return updated as InovasiJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui inovasi: ${err.message}`,
      );
    }
  }

  /**
   * Delete inovasi
   *
   * @returns {Promise<InovasiJoined[]>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async deleteInovasi(
    userJwt: string,
    paramInovasiDto: ParamInovasiDto,
  ): Promise<InovasiJoined[]> {
    const { idParam } = paramInovasiDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('inovasi')
        .select(
          `
          id,
          judul,
          penulis,
          tanggal_diterbitkan,
          isi,
          dibuat_pada,
          diperbarui_pada,
          inovasi_gambar (
            id,
            url_gambar
          )
        `,
        )
        .eq('id', idParam)
        .maybeSingle();

      if (fetchError)
        throw new InternalServerErrorException(fetchError.message);
      if (!existing) throw new NotFoundException('Inovasi tidak ditemukan');

      const gambarArr = Array.isArray(existing.inovasi_gambar)
        ? existing.inovasi_gambar
        : existing.inovasi_gambar
          ? [existing.inovasi_gambar]
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
            .from('inovasi')
            .remove(filenames);

          if (removeError && !removeError.message.includes('not found')) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('inovasi_gambar')
        .delete()
        .eq('inovasi_id', idParam);

      if (deleteGambarError && deleteGambarError.code !== 'PGRST116') {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const { data: deletedInovasi, error: deleteInovasiError } =
        await supabaseWithUser
          .from('inovasi')
          .delete()
          .eq('id', idParam)
          .select();

      if (deleteInovasiError)
        throw new InternalServerErrorException(deleteInovasiError.message);

      return [existing as InovasiJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus inovasi: ${err.message}`,
      );
    }
  }
}
