import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { AdminRoleFilter } from './dto/admin-filter.dto';
import { BeritaFilterDto } from './dto/berita-filter.dto';
import { SekolahFilterDto } from './dto/sekolah-filter.dto';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  /*
   * Get admin count based on role filter
   * @param roleFilter Optional role filter (Superadmin or Admin)
   * @returns Number of admins matching the filter
   */
  async getAdminCount(
    roleFilter?: AdminRoleFilter,
  ): Promise<{ name: string; jumlah: number }[]> {
    try {
      if (roleFilter) {
        const { count, error } = await this.supabase
          .from('admin')
          .select('id', { count: 'exact', head: true })
          .eq('role', roleFilter);

        if (error) {
          throw new InternalServerErrorException(
            `Gagal mengambil data admin: ${error.message}`,
          );
        }

        const name =
          roleFilter === AdminRoleFilter.SUPERADMIN ? 'Super Admin' : 'Admin';

        return [{ name, jumlah: count ?? 0 }];
      }

      const [superAdminResult, adminResult] = await Promise.all([
        this.supabase
          .from('admin')
          .select('id', { count: 'exact', head: true })
          .eq('role', AdminRoleFilter.SUPERADMIN),
        this.supabase
          .from('admin')
          .select('id', { count: 'exact', head: true })
          .eq('role', AdminRoleFilter.ADMIN),
      ]);

      if (superAdminResult.error || adminResult.error) {
        throw new InternalServerErrorException(
          `Gagal mengambil data admin: ${
            superAdminResult.error?.message || adminResult.error?.message
          }`,
        );
      }

      const adminData = [
        { name: 'Super Admin', jumlah: superAdminResult.count ?? 0 },
        { name: 'Admin', jumlah: adminResult.count ?? 0 },
      ];

      return adminData;
    } catch (error) {
      throw new InternalServerErrorException(
        `Terjadi kesalahan saat mengambil data admin: ${error.message}`,
      );
    }
  }

  /*
   * Get news count based on various filters
   * @param filter Various optional filters for news
   * @returns Number of news items matching the filters
   */

  async getBeritaCount(
    filter?: BeritaFilterDto,
  ): Promise<{ bulan: string; jumlah: number }[]> {
    try {
      const currentYear = new Date().getFullYear();

      let query = this.supabase.from('berita').select('tanggal_diterbitkan');

      if (filter?.tanggalMulai && filter?.tanggalAkhir) {
        query = query
          .gte('tanggal_diterbitkan', `${filter.tanggalMulai}T00:00:00Z`)
          .lte('tanggal_diterbitkan', `${filter.tanggalAkhir}T23:59:59Z`);
      } else if (filter?.tahun) {
        query = query
          .gte('tanggal_diterbitkan', `${filter.tahun}-01-01`)
          .lte('tanggal_diterbitkan', `${filter.tahun}-12-31`);
      } else if (filter?.tahunMulai && filter?.tahunAkhir) {
        query = query
          .gte('tanggal_diterbitkan', `${filter.tahunMulai}-01-01`)
          .lte('tanggal_diterbitkan', `${filter.tahunAkhir}-12-31`);
      } else if (filter?.bulanMulai && filter?.bulanAkhir && filter?.tahun) {
        const start = `${filter.tahun}-${String(filter.bulanMulai).padStart(2, '0')}-01`;
        const end = `${filter.tahun}-${String(filter.bulanAkhir).padStart(2, '0')}-31`;
        query = query
          .gte('tanggal_diterbitkan', start)
          .lte('tanggal_diterbitkan', end);
      } else {
        query = query
          .gte('tanggal_diterbitkan', `${currentYear}-01-01`)
          .lte('tanggal_diterbitkan', `${currentYear}-12-31`);
      }

      const { data, error } = await query;

      if (error) {
        throw new InternalServerErrorException(
          `Gagal mengambil data berita: ${error.message}`,
        );
      }

      const bulanData = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ].map((bulan) => ({ bulan, jumlah: 0 }));

      for (const item of data) {
        const tanggal = new Date(item.tanggal_diterbitkan);
        if (!isNaN(tanggal.getTime())) {
          const monthIndex = tanggal.getMonth();
          bulanData[monthIndex].jumlah += 1;
        }
      }

      if (
        !filter?.tanggalMulai &&
        !filter?.tanggalAkhir &&
        !filter?.tahun &&
        !filter?.tahunMulai &&
        !filter?.tahunAkhir &&
        !filter?.bulanMulai &&
        !filter?.bulanAkhir
      ) {
        return bulanData;
      }

      return bulanData;
    } catch (error) {
      throw new InternalServerErrorException(
        `Terjadi kesalahan saat mengambil data berita: ${error.message}`,
      );
    }
  }

  /*
   * Get sekolah count based on various filters
   * @param filter Various optional filters for sekolah
   * @returns Number of sekolah items matching the filters
   */
  async getJumlahSekolahPerJenis(
    filter?: SekolahFilterDto,
  ): Promise<{ sekolahData: { name: string; jumlah: number }[] }> {
    try {
      const { data: jenisData, error: jenisError } = await this.supabase
        .from('jenis_sekolah')
        .select('id, nama_jenis');

      if (jenisError) {
        throw new InternalServerErrorException(
          `Gagal mengambil jenis sekolah: ${jenisError.message}`,
        );
      }

      let query = this.supabase
        .from('satuan_pendidikan')
        .select('jenis_id, status');

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      if (filter?.jenis_id) {
        query = query.eq('jenis_id', filter.jenis_id);
      }

      const { data: sekolahRawData, error: sekolahError } = await query;

      if (sekolahError) {
        throw new InternalServerErrorException(
          `Gagal mengambil data sekolah: ${sekolahError.message}`,
        );
      }

      const countMap = new Map<number, number>();
      for (const sekolah of sekolahRawData) {
        const jenisId = sekolah.jenis_id;
        countMap.set(jenisId, (countMap.get(jenisId) || 0) + 1);
      }

      const sekolahData = jenisData.map((jenis) => ({
        name: jenis.nama_jenis,
        jumlah: countMap.get(jenis.id) || 0,
      }));

      return { sekolahData };
    } catch (error) {
      throw new InternalServerErrorException(
        `Terjadi kesalahan saat menghitung jumlah sekolah: ${error.message}`,
      );
    }
  }
}
