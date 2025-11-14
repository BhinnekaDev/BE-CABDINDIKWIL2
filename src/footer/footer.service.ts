import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

import { CreateFooterDto } from './dto/create-footer.dto';
import { ParamFooterDto } from './dto/param-footer.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';
import { Footer, FooterView } from './interface/footer.interface';

@Injectable()
export class FooterService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  /*
   * Get Footer By ID or Get All Footer
   * @param {ParamFooterDto} params
   * @return {Promise<Footer[] | Footer>}
   */
  async getFooter(
    params?: ParamFooterDto,
  ): Promise<Footer[] | FooterView | null> {
    try {
      if (params?.idParam !== undefined && params.idParam !== null) {
        const { data, error } = await this.supabase
          .from('footer')
          .select('email, no_telp, alamat')
          .eq('id', params.idParam)
          .single();

        if (error) throw error;

        return data as FooterView;
      }

      const { data, error } = await this.supabase.from('footer').select('*');

      if (error) throw error;

      return data as Footer[];
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mendapatkan data footer',
        error.message,
      );
    }
  }

  /*
   * Create Footer
   * @param {CreateFooterDto}
   * @return {Promise<Footer>}
   */
  async createFooter(
    userJwt: string,
    createFooterDto: CreateFooterDto,
  ): Promise<Footer> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data, error } = await supabaseWithUser
        .from('footer')
        .insert(createFooterDto)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data as Footer;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Gagal membuat data footer',
        error?.message || error,
      );
    }
  }

  /*
   * Update Footer By ID
   * @param {ParamFooterDto} params
   * @param {UpdateFooterDto} updateFooterDto
   * @return {Promise<Footer>}
   */
  async updateFooter(
    userJwt: string,
    params: ParamFooterDto,
    updateFooterDto: UpdateFooterDto,
  ): Promise<Footer> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const updateData: Partial<UpdateFooterDto> = {};
    Object.keys(updateFooterDto).forEach((key) => {
      const value = (updateFooterDto as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        (updateData as any)[key] = value;
      }
    });

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Tidak ada data yang valid untuk diperbarui',
      );
    }

    try {
      const { data: updatedData, error: updateError } = await supabaseWithUser
        .from('footer')
        .update(updateData)
        .eq('id', params.idParam)
        .select()
        .single();

      if (updateError) {
        throw new InternalServerErrorException(updateError.message);
      }

      return updatedData as Footer;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Gagal memperbarui data footer',
        error?.message || error,
      );
    }
  }

  /*
   * Delete Footer By ID
   * @param {ParamFooterDto} params
   * @return {Promise<Footer>}
   */
  async deleteFooter(userJwt: string, params: ParamFooterDto): Promise<Footer> {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data, error } = await supabaseWithUser
        .from('footer')
        .delete()
        .eq('id', params.idParam)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data as Footer;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Gagal menghapus data footer',
        error?.message || error,
      );
    }
  }
}
