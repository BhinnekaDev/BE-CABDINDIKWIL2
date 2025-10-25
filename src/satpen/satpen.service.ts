import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Satpen } from './interfaces/satpen.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { FilterSatpenDto } from './dto/filter-satpen.dto';

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

  async getFilteredSatpen(filter: FilterSatpenDto): Promise<Satpen[]> {
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
      throw new Error(`Error filtering data: ${error.message}`);
    }

    return data as Satpen[];
  }
}
