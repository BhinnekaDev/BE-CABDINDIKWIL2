import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreatePrakataDto } from './dto/create-prakata.dto';
import { ParamPrakataDto } from './dto/param-prakata.dto';
import { UpdatePrakataDto } from './dto/update-prakata.dto';
import { Prakata } from './interface/prakata.interface';

@Injectable()
export class PrakataService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Get all prakata entries.
   *
   * @return Promise<Prakata[]>
   * @throws {InternalServerErrorException}
   */
  async getAllPrakata(): Promise<Prakata[]> {
    const { data, error } = await this.supabase
      .from('prakata')
      .select('*')
      .order('dibuat_pada', { ascending: false });

    if (error) {
      throw new InternalServerErrorException('Gagal mengambil data prakata');
    }

    return data as Prakata[];
  }

  /**
   * Create prakata
   *
   * @returns Promise<Prakata>
   * @throws {InternalServerErrorException}
   */
  async createPrakata(
    userJwt: string,
    createPrakataDto: CreatePrakataDto,
  ): Promise<Prakata> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { judul, sub_judul, isi, penutup } = createPrakataDto;
    const sanitizedIsi = sanitizeHtml(isi, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        img: ['src', 'alt', 'title', 'width', 'height', 'style'],
      },
    });
    const { data, error } = await supabaseWithUser
      .from('prakata')
      .insert({
        judul,
        sub_judul: sub_judul || null,
        isi: sanitizedIsi,
        penutup: penutup || null,
      })
      .select()
      .single();
    if (error) {
      throw new InternalServerErrorException('Gagal membuat prakata baru');
    }
    return data as Prakata;
  }

  /**
   * Update prakata by ID
   *
   * @returns Promise<Prakata>
   * @throws {NotFoundException, InternalServerErrorException}
   */
  async updatePrakata(
    userJwt: string,
    paramPrakataDto: ParamPrakataDto,
    updatePrakataDto: UpdatePrakataDto,
  ): Promise<Prakata> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    const { idParam } = paramPrakataDto;
    const { judul, sub_judul, isi, penutup } = updatePrakataDto;
    const sanitizedIsi = sanitizeHtml(isi, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        img: ['src', 'alt', 'title', 'width', 'height', 'style'],
      },
    });
    const { data, error } = await supabaseWithUser
      .from('prakata')
      .update({
        judul,
        sub_judul: sub_judul || null,
        isi: sanitizedIsi,
        penutup: penutup || null,
      })
      .eq('id', idParam)
      .select()
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(
          `Prakata dengan ID ${idParam} tidak ditemukan`,
        );
      }
      throw new InternalServerErrorException('Gagal memperbarui prakata');
    }
    return data as Prakata;
  }

  /**
   * Delete prakata by ID
   *
   * @returns Promise<Prakata>
   * @throws {NotFoundException, InternalServerErrorException}
   */
  async deletePrakata(
    userJwt: string,
    paramPrakataDto: ParamPrakataDto,
  ): Promise<Prakata> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    const { idParam } = paramPrakataDto;
    const { data, error } = await supabaseWithUser
      .from('prakata')
      .delete()
      .eq('id', idParam)
      .select()
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(
          `Prakata dengan ID ${idParam} tidak ditemukan`,
        );
      }
      throw new InternalServerErrorException('Gagal menghapus prakata');
    }
    return data as Prakata;
  }
}
