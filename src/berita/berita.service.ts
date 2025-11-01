import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateBeritaWithGambarDto } from './dto/create-berita.dto';
import { FilterBeritaDto } from './dto/filter-berita.dto';
import { ParamBeritaDto } from './dto/param-berita.dto';
import { UpdateBeritaWithGambarDto } from './dto/update-berita.dto';
import { BeritaJoined, BeritaView } from './interface/berita.interface';

@Injectable()
export class BeritaService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}
  /**
   * Get All Berita
   *
   * @returns {Promise<BeritaJoined[]>}
   * @throws {InternalServerErrorException}
   */

  async getAllBerita(): Promise<BeritaJoined[]> {
    const { data, error } = await this.supabase
      .from('berita')
      .select(
        `
      id,
      judul,
      penulis,
      tanggal_diterbitkan,
      isi,
      dibuat_pada,
      diperbarui_pada,
      berita_gambar (
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

    return data as BeritaJoined[];
  }

  /**
   * Get all berita dari view dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @returns {Promise<BeritaView[]>}
   * @throws {InternalServerErrorException}
   */
  async getFilteredBerita(filter: FilterBeritaDto): Promise<BeritaView[]> {
    const { judul, penulis, tanggal_diterbitkan } = filter;

    let query = this.supabase.from('berita_with_gambar').select('*');

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

    return data as BeritaView[];
  }

  /**
   * Create berita
   *
   * @returns {Promise<BeritaJoined>}
   * @throws {InternalServerErrorException}
   */
  async createBerita(
    userJwt: string,
    createBeritaDto: CreateBeritaWithGambarDto,
  ): Promise<BeritaJoined> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      let isiHTML = createBeritaDto.isi ?? '';

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

      const { data: beritaData, error: beritaError } = await supabaseWithUser
        .from('berita')
        .insert({
          judul: createBeritaDto.judul,
          penulis: createBeritaDto.penulis,
          isi: sanitizedIsi,
        })
        .select()
        .single();

      if (beritaError) {
        throw new InternalServerErrorException(beritaError.message);
      }

      const beritaId = beritaData.id;

      if (createBeritaDto.berita_gambar?.length) {
        const gambar = createBeritaDto.berita_gambar[0];

        const base64 = gambar.url_gambar.split(';base64,').pop();
        const fileExt = gambar.url_gambar.substring(
          gambar.url_gambar.indexOf('/') + 1,
          gambar.url_gambar.indexOf(';'),
        );

        const fileName = `berita-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabaseWithUser.storage
          .from('berita')
          .upload(fileName, Buffer.from(base64!, 'base64'), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data: urlData } = supabaseWithUser.storage
          .from('berita')
          .getPublicUrl(fileName);

        const { error: insertGambarError } = await supabaseWithUser
          .from('berita_gambar')
          .insert({
            berita_id: beritaId,
            url_gambar: urlData.publicUrl,
            keterangan: gambar.keterangan ?? null,
          });

        if (insertGambarError) {
          throw new InternalServerErrorException(insertGambarError.message);
        }
      }

      const { data: beritaJoined } = await supabaseWithUser
        .from('berita')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        berita_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', beritaId)
        .single();

      return beritaJoined as BeritaJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Update berita
   *
   * @returns {Promise<BeritaJoined>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async updateBerita(
    userJwt: string,
    paramBeritaDto: ParamBeritaDto,
    updateBeritaDto: UpdateBeritaWithGambarDto,
  ): Promise<BeritaJoined> {
    const { idParam } = paramBeritaDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: berita } = await supabaseWithUser
        .from('berita')
        .select('*')
        .eq('id', idParam)
        .single();

      if (!berita) {
        throw new NotFoundException('Berita tidak ditemukan');
      }

      let sanitizedIsi = updateBeritaDto.isi;
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
        .from('berita')
        .update({
          ...(updateBeritaDto.judul && { judul: updateBeritaDto.judul }),
          ...(updateBeritaDto.penulis && { penulis: updateBeritaDto.penulis }),
          ...(sanitizedIsi && { isi: sanitizedIsi }),
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', idParam);

      if (updateError)
        throw new InternalServerErrorException(updateError.message);

      if (
        updateBeritaDto.berita_gambar &&
        updateBeritaDto.berita_gambar.length > 0
      ) {
        const gambarBaru = updateBeritaDto.berita_gambar[0];

        if (gambarBaru.url_gambar) {
          const { data: gambarLama } = await supabaseWithUser
            .from('berita_gambar')
            .select('*')
            .eq('berita_id', idParam)
            .maybeSingle();

          if (gambarLama?.url_gambar) {
            const fileNameLama = gambarLama.url_gambar.split('/').pop();
            if (fileNameLama) {
              await supabaseWithUser.storage
                .from('berita')
                .remove([fileNameLama]);
            }
            await supabaseWithUser
              .from('berita_gambar')
              .delete()
              .eq('berita_id', idParam);
          }

          const base64 = gambarBaru.url_gambar.split(';base64,').pop();
          const fileExt = gambarBaru.url_gambar.substring(
            gambarBaru.url_gambar.indexOf('/') + 1,
            gambarBaru.url_gambar.indexOf(';'),
          );
          const fileNameBaru = `berita-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabaseWithUser.storage
            .from('berita')
            .upload(fileNameBaru, Buffer.from(base64!, 'base64'), {
              contentType: `image/${fileExt}`,
            });

          if (uploadError) {
            throw new InternalServerErrorException(uploadError.message);
          }

          const { data: urlData } = supabaseWithUser.storage
            .from('berita')
            .getPublicUrl(fileNameBaru);

          await supabaseWithUser.from('berita_gambar').insert({
            berita_id: idParam,
            url_gambar: urlData.publicUrl,
            keterangan: gambarBaru.keterangan ?? null,
          });
        }
      }

      const { data: updated } = await supabaseWithUser
        .from('berita')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        berita_gambar (
          id,
          url_gambar,
          keterangan,
          dibuat_pada
        )
      `,
        )
        .eq('id', idParam)
        .single();

      return updated as BeritaJoined;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Delete berita
   *
   * @returns {Promise<BeritaJoined[]>}
   * @throws {InternalServerErrorException, NotFoundException}
   */
  async deleteBerita(
    userJwt: string,
    paramBeritaDto: ParamBeritaDto,
  ): Promise<BeritaJoined[]> {
    const { idParam } = paramBeritaDto;
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: existing, error: fetchError } = await supabaseWithUser
        .from('berita')
        .select(
          `
        id,
        judul,
        penulis,
        tanggal_diterbitkan,
        isi,
        dibuat_pada,
        diperbarui_pada,
        berita_gambar (
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
        throw new NotFoundException('Berita tidak ditemukan');
      }

      const gambarArr = existing.berita_gambar
        ? Array.isArray(existing.berita_gambar)
          ? existing.berita_gambar
          : [existing.berita_gambar]
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
            .from('berita')
            .remove(filenames);

          if (removeError && removeError.message) {
            throw new InternalServerErrorException(removeError.message);
          }
        }
      }

      const { error: deleteGambarError } = await supabaseWithUser
        .from('berita_gambar')
        .delete()
        .eq('berita_id', idParam);

      if (deleteGambarError) {
        throw new InternalServerErrorException(deleteGambarError.message);
      }

      const { data: deletedBerita, error: deleteBeritaError } =
        await supabaseWithUser
          .from('berita')
          .delete()
          .eq('id', idParam)
          .select();

      if (deleteBeritaError) {
        throw new InternalServerErrorException(deleteBeritaError.message);
      }

      return [existing as BeritaJoined];
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
