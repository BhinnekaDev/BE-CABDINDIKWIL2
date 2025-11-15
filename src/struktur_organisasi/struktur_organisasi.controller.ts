import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StrukturOrganisasiService } from './struktur_organisasi.service';

import { CreateStrukturOrganisasiDto } from './dto/create-strukturorganisasi.dto';
import { ParamStrukturOrganisasinDto } from './dto/param-struktur_organisasi.dto';
import { UpdateStrukturOrganisasiDto } from './dto/update-strukturorganisasi.dto';

@ApiTags('Struktur Organisasi')
@Controller('struktur-organisasi')
export class StrukturOrganisasiController {
  constructor(
    private readonly strukturOrganisasiService: StrukturOrganisasiService,
  ) {}

  /**
   * Get all struktur organisasi
   * @returns All struktur organisasi
   */
  @ApiOperation({ summary: 'Ambil data struktur organisasi' })
  @Get()
  async getStrukturOrganisasi(@Query() params?: ParamStrukturOrganisasinDto) {
    return await this.strukturOrganisasiService.getStrukturOrganisasi(params);
  }

  /**
   * Create new struktur organisasi
   *
   * @param req Request object
   * @param createDto Data untuk membuat struktur organisasi baru
   * @returns Struktur organisasi yang baru dibuat
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Buat data struktur organisasi baru' })
  @Post()
  async createStrukturOrganisasi(
    @Req() req: Request,
    @Body() createDto: CreateStrukturOrganisasiDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.strukturOrganisasiService.createStrukturOrganisasi(
      userJwt,
      createDto,
    );
  }

  /**
   * Update existing struktur organisasi
   *
   * @param req Request object
   * @param params Parameter untuk mengidentifikasi struktur organisasi yang akan diupdate
   * @param updateDto Data untuk mengupdate struktur organisasi
   * @returns Struktur organisasi yang telah diupdate
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update data struktur organisasi' })
  @Put()
  async updateStrukturOrganisasi(
    @Req() req: Request,
    @Query() params: ParamStrukturOrganisasinDto,
    @Body() updateDto: UpdateStrukturOrganisasiDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.strukturOrganisasiService.updateStrukturOrganisasi(
      userJwt,
      params,
      updateDto,
    );
  }

  /**
   * Delete struktur organisasi
   *
   * @param req Request object
   * @param params Parameter untuk mengidentifikasi struktur organisasi yang akan dihapus
   * @returns Hasil penghapusan struktur organisasi
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Hapus data struktur organisasi beserta file terkait',
  })
  @Delete()
  async deleteStrukturOrganisasi(
    @Req() req: Request,
    @Query() params: ParamStrukturOrganisasinDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.strukturOrganisasiService.deleteStrukturOrganisasi(
      userJwt,
      params,
    );
  }
}
