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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BeritaService } from './berita.service';

import { CreateBeritaWithGambarDto } from './dto/create-berita.dto';
import { FilterBeritaDto } from './dto/filter-berita.dto';
import { ParamBeritaDto } from './dto/param-berita.dto';
import { UpdateBeritaWithGambarDto } from './dto/update-berita.dto';

@ApiTags('Berita')
@Controller('berita')
export class BeritaController {
  constructor(private readonly beritaService: BeritaService) {}

  /**
   * Get all berita
   *
   * @returns All berita
   */
  @Get()
  @ApiOperation({
    summary: 'Ambil semua berita atau berdasarkan ID (jika diberikan)',
  })
  @ApiQuery({
    name: 'idParam',
    required: false,
    description: 'ID berita (opsional, untuk ambil berita tertentu)',
    example: 15,
  })
  async getAllOrById(@Query() paramBeritaDto: ParamBeritaDto) {
    const { idParam } = paramBeritaDto;

    if (idParam) {
      return await this.beritaService.getBeritaById(paramBeritaDto);
    } else {
      return await this.beritaService.getAllBerita();
    }
  }

  /**
   *  Get all berita dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @return All berita dengan filter
   */
  @Get('filter')
  async getFilteredBerita(@Query() filter: FilterBeritaDto) {
    return await this.beritaService.getFilteredBerita(filter);
  }

  /**
   * Create berita (gambar base64 disimpan langsung di kolom isi, tidak masuk bucket)
   *
   * @returns Created berita
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Tambah berita (base64 gambar langsung di isi, tidak masuk storage)',
  })
  async createBerita(
    @Req() req: Request,
    @Body() dto: CreateBeritaWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.beritaService.createBerita(userJwt, dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update berita' })
  async updateBerita(
    @Req() req: Request,
    @Query() params: ParamBeritaDto,
    @Body() dto: UpdateBeritaWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.beritaService.updateBerita(userJwt, params, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Hapus berita' })
  async deleteBerita(@Req() req: Request, @Query() params: ParamBeritaDto) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.beritaService.deleteBerita(userJwt, params);
  }
}
