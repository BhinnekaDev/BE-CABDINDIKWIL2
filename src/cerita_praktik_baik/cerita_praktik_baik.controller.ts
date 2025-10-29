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
import { CeritaPraktikBaikService } from './cerita_praktik_baik.service';

import { CreateCeritaPraktikBaikWithGambarDto } from './dto/create-ceritapraktikbaik.dto';
import { FilterCeritaPraktikBaikDto } from './dto/filter-ceritapraktikbaik.dto';
import { ParamCeritaPraktikBaikDto } from './dto/param-ceritapraktikbaik.dto';
import { UpdateCeritaPraktikBaikWithGambarDto } from './dto/update-ceritapraktikbaik.dto';

@ApiTags('Cerita praktik baik')
@Controller('cerita-praktik-baik')
export class CeritaPraktikBaikController {
  constructor(
    private readonly ceritaPraktikBaikService: CeritaPraktikBaikService,
  ) {}

  /**
   * Get all cerita praktik baik
   * @returns All cerita praktik baik
   */
  @Get()
  async getAll() {
    return await this.ceritaPraktikBaikService.getAllCeritaPraktikBaik();
  }

  /**
   *  Get all cerita praktik baik dengan filter judul / penulis / tanggal_diterbitkan
   * @return All cerita praktik baik dengan filter
   */
  @Get('filter')
  async getFilteredCeritaPraktikBaik(
    @Query() filter: FilterCeritaPraktikBaikDto,
  ) {
    return await this.ceritaPraktikBaikService.getFilteredCeritaPraktikBaik(
      filter,
    );
  }

  /**
   * Create cerita praktik baik (gambar base64 disimpan langsung di kolom isi, tidak masuk bucket)
   * @returns Created cerita praktik baik
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Tambah cerita praktik baik (base64 gambar langsung di isi, tidak masuk storage)',
  })
  async createCeritaPraktikBaik(
    @Req() req: Request,
    @Body() dto: CreateCeritaPraktikBaikWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.ceritaPraktikBaikService.createCeritaPraktikBaik(
      userJwt,
      dto,
    );
  }

  /**
   * Update cerita praktik baik
   * @throws {Error} When JWT token is not found
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update cerita praktik baik' })
  async updateCeritaPraktikBaik(
    @Req() req: Request,
    @Query() params: ParamCeritaPraktikBaikDto,
    @Body() dto: UpdateCeritaPraktikBaikWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.ceritaPraktikBaikService.updateCeritaPraktikBaik(
      userJwt,
      params,
      dto,
    );
  }

  /**
   * Delete cerita praktik baik
   * @throws {Error} When JWT token is not found
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Hapus cerita praktik baik' })
  async deleteCeritaPraktikBaik(
    @Req() req: Request,
    @Query() params: ParamCeritaPraktikBaikDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.ceritaPraktikBaikService.deleteCeritaPraktikBaik(
      userJwt,
      params,
    );
  }
}
