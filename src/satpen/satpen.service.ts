import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientWithUser } from '../../supabase/supabase.client';
import { CreateJenisSekolahGambarDto } from './dto/create-jenis-sekolah-gambar.dto';
import { CreateSatpenKindDto } from './dto/create-satpen-kind.dto';
import { CreateSatpenLocationDto } from './dto/create-satpen-location.dto';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { ParamJenisSekolahGambarDto } from './dto/param-jenis-sekolah-gambar.dto';
import { ParamSatpenKindDto } from './dto/param-satpen-kind.dto';
import { ParamSatpenLocationDto } from './dto/param-satpen-location.dto';
import { ParamSatpenDto } from './dto/param-satpen.dto';
import { UpdateJenisSekolahGambarDto } from './dto/update-jenis-sekolah-gambar.dto';
import { UpdateSatpenKindDto } from './dto/update-satpen-kind.dto';
import { UpdateSatpenLocationDto } from './dto/update-satpen-location.dto';
import { UpdateSatpenDto } from './dto/update-satpen.dto';
import {
  Kind,
  Location,
  Satpen,
  SatpenJoined,
  SatpenView,
} from './interfaces/satpen.interface';

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
  async getAllSatpen(): Promise<SatpenJoined[]> {
    const { data, error } = await this.supabase.from('satuan_pendidikan')
      .select(`
      npsn,
      nama,
      status,
      jenis_sekolah ( nama_jenis ),
      lokasi ( kelurahan, alamat )
    `);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as SatpenJoined[];
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
    const { npsn, nama, jenis_id, status, lokasi_id } = createSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .insert({ npsn, nama, jenis_id, status, lokasi_id })
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
    const { kelurahan, alamat } = CreateSatpenLocationDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('lokasi')
      .insert({ kelurahan, alamat })
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
    const { npsn, nama, jenis_id, status, lokasi_id } = updateSatpenDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('satuan_pendidikan')
      .update({ npsn, nama, jenis_id, status, lokasi_id })
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
    const { kelurahan, alamat } = updateSatpenLocationDto;

    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    const { data, error } = await supabaseWithUser
      .from('lokasi')
      .update({ kelurahan, alamat })
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

  /**
   * Get all jenis sekolah gambar by ID or jenis sekolah ID
   *
   * @returns {Promise<any>}
   * @throws {InternalServerErrorException}
   */
  async getJenisSekolahGambar(id_jenis?: number, id?: number): Promise<any> {
    let query = this.supabase.from('jenis_sekolah_gambar').select(
      `
      id,
      url_gambar,
      dibuat_pada,
      jenis_sekolah (
        id,
        nama_jenis
      )
    `,
    );

    if (id_jenis) {
      query = query.eq('id_jenis', id_jenis);
    }

    if (id) {
      query = query.eq('id', id);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  /**
   * Create jenis sekolah gambar
   *
   * @returns {Promise<any>}
   * @throws {InternalServerErrorException}
   */
  async createJenisSekolahGambar(
    userJwt: string,
    dto: CreateJenisSekolahGambarDto,
  ) {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);

    try {
      const { data: jenis, error: jenisErr } = await supabaseWithUser
        .from('jenis_sekolah')
        .select('id, nama_jenis')
        .eq('id', dto.id_jenis)
        .single();

      if (jenisErr || !jenis) {
        throw new BadRequestException('Jenis sekolah tidak ditemukan.');
      }

      if (!dto.url_gambar.startsWith('http')) {
        throw new BadRequestException(
          'URL gambar tidak valid atau bukan URL Supabase Storage.',
        );
      }

      const { data: inserted, error: insertErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .insert({
          id_jenis: dto.id_jenis,
          url_gambar: dto.url_gambar,
        })
        .select()
        .single();

      if (insertErr) throw new InternalServerErrorException(insertErr.message);

      const insertedId = inserted.id;

      const { data: result, error: joinErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .select(
          `
        id,
        url_gambar,
        dibuat_pada,
        jenis_sekolah (
          id,
          nama_jenis
        )
      `,
        )
        .eq('id', insertedId)
        .single();

      if (joinErr) throw new InternalServerErrorException(joinErr.message);

      return result;
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Update jenis sekolah gambar
   * @param userJwt
   * @param paramDto
   * @param dto
   * @returns {Promise<any>}
   * @throws {InternalServerErrorException}
   */
  async updateJenisSekolahGambar(
    userJwt: string,
    paramDto: ParamJenisSekolahGambarDto,
    dto: UpdateJenisSekolahGambarDto,
  ) {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    const { idParam } = paramDto;

    try {
      const { data: oldRecord, error: oldErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .select('id, id_jenis, url_gambar')
        .eq('id', idParam)
        .single();

      if (oldErr || !oldRecord) {
        throw new NotFoundException('Data tidak ditemukan');
      }

      if (dto.id_jenis !== undefined) {
        const { data: jenisCheck, error: jenisErr } = await supabaseWithUser
          .from('jenis_sekolah')
          .select('id')
          .eq('id', dto.id_jenis)
          .single();

        if (jenisErr || !jenisCheck) {
          throw new BadRequestException('ID jenis sekolah tidak valid');
        }
      }

      let finalUrl = oldRecord.url_gambar;
      let shouldDeleteOld = false;

      if (dto.url_gambar && dto.url_gambar !== oldRecord.url_gambar) {
        shouldDeleteOld = true;
        finalUrl = dto.url_gambar;
      }

      if (shouldDeleteOld) {
        const oldFile = oldRecord.url_gambar.split('/').pop();
        if (oldFile) {
          const { error: delErr } = await supabaseWithUser.storage
            .from('satpen-icons')
            .remove([oldFile]);

          if (delErr && !delErr.message.includes('not found')) {
            throw new InternalServerErrorException(
              `Gagal menghapus file lama: ${delErr.message}`,
            );
          }
        }
      }

      const updatePayload: any = {
        diperbarui_pada: new Date().toISOString(),
      };

      if (dto.id_jenis !== undefined) {
        updatePayload.id_jenis = dto.id_jenis;
      } else {
        updatePayload.id_jenis = oldRecord.id_jenis;
      }

      if (dto.url_gambar !== undefined) {
        updatePayload.url_gambar = finalUrl;
      } else {
        updatePayload.url_gambar = oldRecord.url_gambar;
      }

      const { error: updateErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .update(updatePayload)
        .eq('id', idParam);

      if (updateErr) {
        throw new InternalServerErrorException(updateErr.message);
      }

      const { data: result, error: joinErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .select(
          `
          id,
          url_gambar,
          id_jenis,
          dibuat_pada,
          diperbarui_pada,
          jenis_sekolah (
            id,
            nama_jenis
          )
        `,
        )
        .eq('id', idParam)
        .single();

      if (joinErr) {
        throw new InternalServerErrorException(joinErr.message);
      }

      return result;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal memperbarui data: ${err.message}`,
      );
    }
  }

  /**
   * Delete jenis sekolah gambar
   * @param userJwt
   * @param paramDto
   * @returns {Promise<any>}
   * @throws {InternalServerErrorException}
   */
  async deleteJenisSekolahGambar(
    userJwt: string,
    paramDto: ParamJenisSekolahGambarDto,
  ) {
    const supabaseWithUser = createSupabaseClientWithUser(userJwt);
    const { idParam } = paramDto;

    try {
      const { data: oldRecord, error: oldErr } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .select('id, url_gambar')
        .eq('id', idParam)
        .single();

      if (oldErr || !oldRecord) {
        throw new NotFoundException(
          'Data gambar jenis sekolah tidak ditemukan',
        );
      }

      if (oldRecord.url_gambar) {
        const url = new URL(oldRecord.url_gambar);
        const bucketPath = url.pathname.split('/storage/v1/object/public/')[1];

        if (bucketPath) {
          const { error: deleteErr } = await supabaseWithUser.storage
            .from('satpen-icons')
            .remove([bucketPath.replace(/^satpen-icons\//, '')]);

          if (deleteErr && !deleteErr.message.includes('not found')) {
            throw new InternalServerErrorException(
              `Gagal menghapus gambar dari Storage: ${deleteErr.message}`,
            );
          }
        }
      }

      const { data, error } = await supabaseWithUser
        .from('jenis_sekolah_gambar')
        .delete()
        .eq('id', idParam)
        .select();

      if (error) throw new InternalServerErrorException(error.message);

      return data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Gagal menghapus data: ${err.message}`,
      );
    }
  }
}
