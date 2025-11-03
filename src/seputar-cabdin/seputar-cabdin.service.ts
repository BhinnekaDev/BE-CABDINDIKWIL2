import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      let isiHTML = createSeputarCabdinDto.isi ?? '';

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

        const base64 = gambar.url_gambar.split(';base64,').pop();
        const fileExt = gambar.url_gambar.substring(
          gambar.url_gambar.indexOf('/') + 1,
          gambar.url_gambar.indexOf(';'),
        );

        const fileName = `seputarcabdin-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('seputar_cabdin')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('seputar_cabdin')
          .getPublicUrl(fileName);

        const { error: insertGambarError } = await supabaseWithUser
          .from('seputar_cabdin')
          .insert({
            seputar_id: seputarId,
            url_gambar: urlData.publicUrl,
            keterangan: gambar.keterangan ?? null,
          });

        if (insertGambarError) {
          throw new InternalServerErrorException(insertGambarError.message);
        }
      }

      const { data: seputarCabdinJoined } = await supabaseWithUser
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

      return seputarCabdinJoined as SeputarCabdinJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
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
      const { data: seputarcabdinData, error: seputarcabdinError } =
        await supabaseWithUser
          .from('seputar_cabdin')
          .select('*, seputar_cabdin_gambar(id, url_gambar, keterangan)')
          .eq('id', idParam)
          .single();

      if (seputarcabdinError || !seputarcabdinData) {
        throw new NotFoundException('Seputar cabdin tidak ditemukan');
      }

      const gambarLama = seputarcabdinData.seputar_cabdin_gambar
        ? Array.isArray(seputarcabdinData.seputar_cabdin_gambar)
          ? seputarcabdinData.seputar_cabdin_gambar[0]
          : seputarcabdinData.seputar_cabdin_gambar
        : null;

      const judulBaru =
        updateSeputarCabdinDto.judul?.trim() !== ''
          ? updateSeputarCabdinDto.judul
          : seputarcabdinData.judul;
      const penulisBaru =
        updateSeputarCabdinDto.penulis?.trim() !== ''
          ? updateSeputarCabdinDto.penulis
          : seputarcabdinData.penulis;
      const isiBaru =
        updateSeputarCabdinDto.isi?.trim() !== ''
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
          : seputarcabdinData.isi;

      const { error: updateError } = await supabaseWithUser
        .from('seputar_cabdin')
        .update({
          judul: judulBaru,
          penulis: penulisBaru,
          isi: isiBaru,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      const gambarBaru =
        updateSeputarCabdinDto.seputar_cabdin_gambar &&
        updateSeputarCabdinDto.seputar_cabdin_gambar.length
          ? updateSeputarCabdinDto.seputar_cabdin_gambar[0]
          : null;

      if (gambarBaru) {
        if (
          typeof gambarBaru.url_gambar === 'string' &&
          !gambarBaru.url_gambar.startsWith('data:image')
        ) {
          const { error: updateKeteranganError } = await supabaseWithUser
            .from('seputar_cabdin_gambar')
            .update({
              keterangan:
                (gambarBaru.keterangan ?? '').trim() !== ''
                  ? gambarBaru.keterangan
                  : (gambarLama?.keterangan ?? null),
            })
            .eq('id', gambarLama?.id);

          if (updateKeteranganError) {
            throw new InternalServerErrorException(
              updateKeteranganError.message,
            );
          }
        } else if (
          typeof gambarBaru.url_gambar === 'string' &&
          gambarBaru.url_gambar.startsWith('data:image')
        ) {
          const base64 = gambarBaru.url_gambar.split(';base64,').pop();
          const fileExt = gambarBaru.url_gambar.substring(
            gambarBaru.url_gambar.indexOf('/') + 1,
            gambarBaru.url_gambar.indexOf(';'),
          );
          const fileNameBaru = `seputarcabdin-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('seputar_cabdin')
            .upload(fileNameBaru, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
            });

          if (uploadError) {
            throw new InternalServerErrorException(uploadError.message);
          }

          const { data: urlData } = supabaseWithUser.storage
            .from('seputar_cabdin')
            .getPublicUrl(fileNameBaru);

          if (gambarLama) {
            if (gambarLama.url_gambar) {
              const fileNameLama = gambarLama.url_gambar.split('/').pop();
              if (fileNameLama) {
                await supabaseWithUser.storage
                  .from('seputar_cabdin')
                  .remove([fileNameLama]);
              }
            }

            const { error: updateGambarError } = await supabaseWithUser
              .from('seputar_cabdin_gambar')
              .update({
                url_gambar: urlData.publicUrl,
                keterangan:
                  gambarBaru.keterangan && gambarBaru.keterangan.trim() !== ''
                    ? gambarBaru.keterangan
                    : gambarLama.keterangan,
              })
              .eq('id', gambarLama.id);

            if (updateGambarError) {
              throw new InternalServerErrorException(updateGambarError.message);
            }
          } else {
            const { error: insertError } = await supabaseWithUser
              .from('seputar_cabdin_gambar')
              .insert({
                seputar_id: idParam,
                url_gambar: urlData.publicUrl,
                keterangan:
                  gambarBaru.keterangan && gambarBaru.keterangan.trim() !== ''
                    ? gambarBaru.keterangan
                    : null,
              });

            if (insertError) {
              throw new InternalServerErrorException(insertError.message);
            }
          }
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

      if (selectError) {
        throw new InternalServerErrorException(selectError.message);
      }

      return updated as SeputarCabdinJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
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
        throw new NotFoundException('Seputarcabdin tidak ditemukan');
      }

      const gambarArr = existing.seputar_cabdin_gambar
        ? Array.isArray(existing.seputar_cabdin_gambar)
          ? existing.seputar_cabdin_gambar
          : [existing.seputar_cabdin_gambar]
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
            .from('seputar_cabdin')
            .remove(filenames);

          if (removeError && removeError.message) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('seputar_cabdin')
        .delete()
        .eq('seputar_id', idParam);

      if (deleteGambarError) {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const { data: deletedSeputarcabdin, error: deleteSeputarCabdinError } =
        await supabaseWithUser
          .from('seputar_cabdin')
          .delete()
          .eq('id', idParam)
          .select();

      if (deleteSeputarCabdinError) {
        throw new InternalServerErrorException(
          deleteSeputarCabdinError.message,
        );
      }

      return [existing as SeputarCabdinJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
