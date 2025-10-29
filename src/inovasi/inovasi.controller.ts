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
import { InovasiService } from './inovasi.service';

import { CreateInovasiWithGambarDto } from './dto/create-inovasi.dto';
import { FilterInovasiDto } from './dto/filter-inovasi.dto';
import { ParamInovasiDto } from './dto/param-inovasi.dto';
import { UpdateInovasiWithGambarDto } from './dto/update-inovasi.dto';

@ApiTags('Inovasi')
@Controller('inovasi')
export class InovasiController {
  constructor(private readonly inovasiService: InovasiService) {}

  /**
   * Get all inovasi
   * @returns All inovasi
   */
  @Get()
  async getAll() {
    return await this.inovasiService.getAllInovasi();
  }

  /**
   *  Get all inovasi dengan filter judul / penulis / tanggal_diterbitkan
   * @return All inovasi dengan filter
   */
  @Get('filter')
  async getFilteredInovasi(@Query() filter: FilterInovasiDto) {
    return await this.inovasiService.getFilteredInovasi(filter);
  }

  /**
   * Create inovasi (gambar base64 disimpan langsung di kolom isi, tidak masuk bucket)
   * @returns Created inovasi
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create inovasi',
    description:
      'Create inovasi (gambar base64 disimpan langsung di kolom isi, tidak masuk bucket)',
  })
  async createInovasi(
    @Req() req: Request,
    @Body() dto: CreateInovasiWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.inovasiService.createInovasi(userJwt, dto);
  }

  /**
   * Update inovasi by ID
   * @param param Inovasi ID param
   * @returns Updated inovasi
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update inovasi by ID' })
  async updateInovasi(
    @Req() req: Request,
    @Body() dto: UpdateInovasiWithGambarDto,
    @Query() params: ParamInovasiDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.inovasiService.updateInovasi(userJwt, params, dto);
  }

  /**
   * Delete inovasi by ID
   * @param param Inovasi ID param
   * @returns Deleted inovasi
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete inovasi by ID' })
  async deleteInovasi(@Req() req: Request, @Query() params: ParamInovasiDto) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.inovasiService.deleteInovasi(userJwt, params);
  }
}
