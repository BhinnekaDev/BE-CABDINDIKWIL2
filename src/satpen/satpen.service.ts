import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ParamSatpenDto } from './dto/param-satpen.dto';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { UpdateSatpenDto } from './dto/update-satpen.dto';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { SatpenView } from './interfaces/satpen.interface';
import { Satpen, Location } from './interfaces/satpen.interface';
import { ParamSatpenLocationDto } from './dto/param-satpen-location.dto';
import { UpdateSatpenLocationDto } from './dto/update-satpen-location.dto';
import { CreateSatpenLocationDto } from './dto/create-satpen-location.dto';
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
    userJwt: string,
    createSatpenDto: CreateSatpenDto,
  ): Promise<Satpen[]> {
    const { npsn, nama, jenis_id, status, alamat, lokasi_id } = createSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .insert({ npsn, nama, jenis_id, status, alamat, lokasi_id })
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Satpen[];
  }

  async createLocation(
    userJwt: string,
    CreateSatpenLocationDto: CreateSatpenLocationDto,
  ): Promise<Location[]> {
    const { kelurahan, kecamatan, kabupaten, provinsi } =
      CreateSatpenLocationDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('lokasi')
      .insert({ kelurahan, kecamatan, kabupaten, provinsi })
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Location[];
  }

  async updateSatpen(
    userJwt: string,
    paramSatpenDto: ParamSatpenDto,
    updateSatpenDto: UpdateSatpenDto,
  ): Promise<Satpen[]> {
    const { npsnParam } = paramSatpenDto;
    const { npsn, nama, jenis_id, status, alamat, lokasi_id } = updateSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .update({ npsn, nama, jenis_id, status, alamat, lokasi_id })
      .eq('npsn', npsnParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Satpen[];
  }

  async updateLocation(
    userJwt: string,
    paramSatpenLocationDto: ParamSatpenLocationDto,
    updateSatpenLocationDto: UpdateSatpenLocationDto,
  ): Promise<Location[]> {
    const { idParam } = paramSatpenLocationDto;
    const { kelurahan, kecamatan, kabupaten, provinsi } =
      updateSatpenLocationDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('lokasi')
      .update({ kelurahan, kecamatan, kabupaten, provinsi })
      .eq('id', idParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Location[];
  }

  async deleteSatpen(userJwt: string, paramSatpenDto: ParamSatpenDto) {
    const { npsnParam } = paramSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .delete()
      .eq('npsn', npsnParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Satpen[];
  }

  async deleteLocation(
    userJwt: string,
    paramSatpenLocationDto: ParamSatpenLocationDto,
  ) {
    const { idParam } = paramSatpenLocationDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('lokasi')
      .delete()
      .eq('id', idParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Location[];
  }
}
