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
   * Get all inovasi dari view dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @returns {Promise<InovasiView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredInovasi(filter: FilterInovasiDto): Promise<InovasiView[]> {
    const { judul, penulis, tanggal_diterbitkan } = filter;

    let query = this.supabase.from('inovasi_gambar').select('*');

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

      const seputarId = inovasiData.id;

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
            cerita_id: seputarId,
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
        .eq('id', seputarId)
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
   * @throws {InternalServerErrorException, NotFoundException, BadRequestException}
   */
  async updateInovasi(
    userJwt: string,
    paramInovasiDto: ParamInovasiDto,
    updateInovasiDto: UpdateInovasiWithGambarDto,
  ): Promise<InovasiJoined> {
    const { idParam } = paramInovasiDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const numericId = Number(idParam);
      if (isNaN(numericId)) {
        throw new BadRequestException('ID tidak valid');
      }

      const { data: inovasi } = await supabaseWithUser
        .from('inovasi')
        .select('*')
        .eq('id', numericId)
        .single();

      if (!inovasi) {
        throw new NotFoundException('Inovasi tidak ditemukan');
      }

      let sanitizedIsi = updateInovasiDto.isi;
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
        .from('inovasi')
        .update({
          ...(updateInovasiDto.judul && {
            judul: updateInovasiDto.judul,
          }),
          ...(updateInovasiDto.penulis && {
            penulis: updateInovasiDto.penulis,
          }),
          ...(sanitizedIsi && { isi: sanitizedIsi }),
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      if (
        updateInovasiDto.inovasi_gambar &&
        updateInovasiDto.inovasi_gambar.length > 0
      ) {
        const gambarBaru = updateInovasiDto.inovasi_gambar[0];

        if (gambarBaru.url_gambar) {
          const { data: gambarLamaList } = await supabaseWithUser
            .from('inovasi_gambar')
            .select('*')
            .eq('cerita_id', idParam);

          // 4.2 Hapus semua file di storage & row tabel
          if (gambarLamaList && gambarLamaList.length > 0) {
            const fileNamesLama = gambarLamaList
              .map((g) => g.url_gambar?.split('/').pop())
              .filter((f) => !!f);

            if (fileNamesLama.length > 0) {
              await supabaseWithUser.storage
                .from('inovasi')
                .remove(fileNamesLama);
            }

            await supabaseWithUser
              .from('inovasi_gambar')
              .delete()
              .eq('cerita_id', idParam);
          }

          const base64 = gambarBaru.url_gambar.split(';base64,').pop();
          const fileExt = gambarBaru.url_gambar.substring(
            gambarBaru.url_gambar.indexOf('/') + 1,
            gambarBaru.url_gambar.indexOf(';'),
          );
          const fileNameBaru = `inovasi-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('inovasi')
            .upload(fileNameBaru, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
            });

          if (uploadError) {
            throw new InternalServerErrorException(uploadError.message);
          }

          const { data: urlData } = supabaseWithUser.storage
            .from('inovasi')
            .getPublicUrl(fileNameBaru);

          await supabaseWithUser.from('inovasi_gambar').insert({
            cerita_id: idParam,
            url_gambar: urlData.publicUrl,
            keterangan: gambarBaru.keterangan ?? null,
          });
        }
      }

      const { data: updated } = await supabaseWithUser
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

      return updated as InovasiJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
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
        throw new NotFoundException('Inovasi tidak ditemukan');
      }

      const gambarArr = existing.inovasi_gambar
        ? Array.isArray(existing.inovasi_gambar)
          ? existing.inovasi_gambar
          : [existing.inovasi_gambar]
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
            .from('inovasi')
            .remove(filenames);

          if (removeError && removeError.message) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('inovasi_gambar')
        .delete()
        .eq('cerita_id', idParam);

      if (deleteGambarError) {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const { data: deletedInovasi, error: deleteInovasiError } =
        await supabaseWithUser
          .from('inovasi')
          .delete()
          .eq('id', idParam)
          .select();

      if (deleteInovasiError) {
        throw new InternalServerErrorException(deleteInovasiError.message);
      }

      return [existing as InovasiJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
