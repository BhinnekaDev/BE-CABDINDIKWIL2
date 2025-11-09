import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

import { AdminFilterDto } from './dto/admin-filter.dto';
import { BeritaFilterDto } from './dto/berita-filter.dto';
import { SekolahFilterDto } from './dto/sekolah-filter.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /*
   * Get admin count with optional role filter
   * @param filter Optional filter for admin role
   * @returns Number of admins matching the filter
   */
  @Get('admin-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get admin count',
    description:
      'Mengambil jumlah admin. Jika parameter role diberikan, hasil difilter berdasarkan role.',
  })
  async getAdminCount(@Query() filter: AdminFilterDto) {
    return await this.dashboardService.getAdminCount(filter.role);
  }

  /*
   * Get monthly news count with optional date filters
   * @param filter Optional filters for news date range
   * @returns Number of news articles per month matching the filters
   */
  @Get('berita-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get monthly news count',
    description:
      'Mengambil jumlah berita per bulan berdasarkan filter tanggal yang diberikan.',
  })
  async getBeritaMonthlyCount(@Query() filter: BeritaFilterDto) {
    return await this.dashboardService.getBeritaCount(filter);
  }

  /*
   * Get school count with optional filters
   * @param filter Optional filters for school type or status
   * @returns Number of schools matching the filters
   */
  @Get('sekolah-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get school count',
    description:
      'Mengambil jumlah sekolah berdasarkan filter jenis atau status yang diberikan.',
  })
  async getSekolahCount(@Query() filter: SekolahFilterDto) {
    return await this.dashboardService.getJumlahSekolahPerJenis(filter);
  }
}
