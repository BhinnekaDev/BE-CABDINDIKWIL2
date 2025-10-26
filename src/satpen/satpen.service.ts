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
import { ParamSatpenKindDto } from './dto/param-satpen-kind.dto';
import { CreateSatpenKindDto } from './dto/create-satpen-kind.dto';
import { UpdateSatpenKindDto } from './dto/update-satpen-kind.dto';
import { Kind, Satpen, Location } from './interfaces/satpen.interface';
import { ParamSatpenLocationDto } from './dto/param-satpen-location.dto';
import { UpdateSatpenLocationDto } from './dto/update-satpen-location.dto';
import { CreateSatpenLocationDto } from './dto/create-satpen-location.dto';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';

@Injectable()
export class SatpenService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Get all satuan pendidikan
   *
   * @returns {Promise<Satpen[]>}
   * @throws {InternalServerErrorException}
   */
  async getAllSatpen(): Promise<Satpen[]> {
    const { data, error } = await this.supabase
      .from('satuan_pendidikan')
      .select('*');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Satpen[];
  }

  /**
   * Get all lokasi satuan pendidikan
   *
   * @returns {Promise<Location[]>}
   * @throws {InternalServerErrorException}
   */
  async getAllSatpenLocation(): Promise<Location[]> {
    const { data, error } = await this.supabase.from('lokasi').select('*');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Location[];
  }

  /**
   * Get all jenis satuan pendidikan
   *
   * @returns {Promise<Kind[]>}
   * @throws {InternalServerErrorException}
   */
  async getAllSatpenKind(): Promise<Kind[]> {
    const { data, error } = await this.supabase
      .from('jenis_sekolah')
      .select('*');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Kind[];
  }

  /**
   * Get all satuan pendidikan
   *
   * @returns {Promise<SatpenView[]>}
   * @throws {InternalServerErrorException}
   */
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

  /**
   * Create satuan pendidikan
   *
   * @returns {Promise<Satpen[]>}
   * @throws {InternalServerErrorException}
   */
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

  /**
   * Create lokasi satuan pendidikan
   *
   * @returns {Promise<Location[]>}
   * @throws {InternalServerErrorException}
   */
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

  /**
   * Create jenis pendidikan
   *
   * @returns {Promise<Kind[]>}
   * @throws {InternalServerErrorException}
   */
  async createKind(
    userJwt: string,
    CreateSatpenKindDto: CreateSatpenKindDto,
  ): Promise<Kind[]> {
    const { namaJenis } = CreateSatpenKindDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('jenis_sekolah')
      .insert({ nama_jenis: namaJenis })
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Kind[];
  }

  /**
   * Update satuan pendidikan
   *
   * @returns {Promise<Satpen[]>}
   * @throws {InternalServerErrorException}
   */
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

  /**
   * Update lokasi satuan pendidikan
   *
   * @returns {Promise<Location[]>}
   * @throws {InternalServerErrorException}
   */
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

  /**
   * Update jenis pendidikan
   *
   * @returns {Promise<Kind[]>}
   * @throws {InternalServerErrorException}
   */
  async updateKind(
    userJwt: string,
    paramSatpenKindDto: ParamSatpenKindDto,
    updateSatpenKindDto: UpdateSatpenKindDto,
  ): Promise<Kind[]> {
    const { idParam } = paramSatpenKindDto;
    const { namaJenis } = updateSatpenKindDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('jenis_sekolah')
      .update({ nama_jenis: namaJenis })
      .eq('id', idParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Kind[];
  }

  /**
   * Delete satuan pendidikan
   *
   * @returns {Promise<Satpen[]>}
   * @throws {InternalServerErrorException}
   */
  async deleteSatpen(
    userJwt: string,
    paramSatpenDto: ParamSatpenDto,
  ): Promise<Satpen[]> {
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

  /**
   * Delete lokasi satuan pendidikan
   *
   * @returns {Promise<Location[]>}
   * @throws {InternalServerErrorException}
   */
  async deleteLocation(
    userJwt: string,
    paramSatpenLocationDto: ParamSatpenLocationDto,
  ): Promise<Location[]> {
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

  /**
   * Delete jenis pendidikan
   *
   * @returns {Promise<Kind[]>}
   * @throws {InternalServerErrorException}
   */
  async deleteKind(
    userJwt: string,
    paramSatpenKindDto: ParamSatpenKindDto,
  ): Promise<Kind[]> {
    const { idParam } = paramSatpenKindDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('jenis_sekolah')
      .delete()
      .eq('id', idParam)
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Kind[];
  }
}
