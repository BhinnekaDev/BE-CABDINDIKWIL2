import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Satpen } from './interfaces/satpen.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { SatpenView } from './interfaces/satpen.interface';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

@Injectable()
export class SatpenService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async getAllSatpen() {
    const { data, error } = await this.supabase.from('satuan_pendidikan')
      .select(`
        npsn,
        nama,
        status,
        alamat,
        jenis_sekolah:jenis_id(nama_jenis),
        lokasi:lokasi_id(kelurahan, kecamatan, kabupaten, provinsi)
      `);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async getFilteredSatpen(filter: FilterSatpenDto): Promise<SatpenView[]> {
    const { nama, jenis } = filter;

    let query = this.supabase.from('satpen_with_jenis').select('*');

    if (nama) {
      query = query.ilike('nama', `%${nama}%`);
    }

    if (jenis) {
      query = query.eq('nama_jenis', jenis);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as SatpenView[];
  }

  async createSatpen(
    createSatpenDto: CreateSatpenDto,
    userJwt: string,
  ): Promise<Satpen[]> {
    const { npsn, nama, jenis_id, status, alamat, lokasi_id } = createSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .insert([{ npsn, nama, jenis_id, status, alamat, lokasi_id }])
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Satpen[];
  }
}
