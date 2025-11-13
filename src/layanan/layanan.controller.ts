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
import { LayananService } from './layanan.service';

import { CreateLayananDto } from './dto/create-layanan.dto';
import { ParamLayananDto } from './dto/param-layanan.dto';
import { UpdateLayananDto } from './dto/update-layanan.dto';

@ApiTags('Layanan')
@Controller('layanan')
export class LayananController {
  constructor(private readonly layananService: LayananService) {}

  /*
   * Get all layanan or by kind layanan or ID layanan
   * @param kindServices Jenis layanan (optional)
   * @param idLayanan ID layanan (optional)
   */
  @Get()
  @ApiOperation({
    summary:
      'Ambil semua layanan atau berdasarkan jenis layanan / jenis file / ID layanan (jika diberikan)',
  })
  @ApiQuery({
    name: 'jenis_layanan',
    required: false,
    description:
      'Jenis layanan (opsional, untuk filter layanan berdasarkan jenis)',
    example: 'Kenaikan_Pangkat_Reguler',
  })
  @ApiQuery({
    name: 'jenis_file',
    required: false,
    description:
      'Jenis file (opsional, untuk filter layanan berdasarkan jenis file)',
    example: 'PDF',
  })
  @ApiQuery({
    name: 'idParam',
    required: false,
    description: 'ID layanan (opsional, untuk ambil layanan tertentu)',
    example: 10,
  })
  async getAllOrByFilter(
    @Query('jenis_layanan') jenis_layanan: string,
    @Query('jenis_file') jenis_file: string,
    @Query() paramLayananDto: ParamLayananDto,
  ) {
    const { idParam } = paramLayananDto;
    if (idParam || jenis_layanan || jenis_file) {
      return await this.layananService.getLayanan(
        jenis_layanan as any,
        jenis_file,
        paramLayananDto,
      );
    } else {
      return await this.layananService.getLayanan();
    }
  }

  /*
   * Create new layanan
   * @param createLayananDto Data layanan baru
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat layanan baru' })
  async createLayanan(
    @Body() createLayananDto: CreateLayananDto,
    @Req() req: Request,
  ) {
    const authHeader =
      (req.headers as any).authorization ||
      (req.headers as any).Authorization ||
      '';
    const token =
      typeof authHeader === 'string'
        ? authHeader.replace(/^Bearer\s+/i, '')
        : '';
    return await this.layananService.createLayanan(token, createLayananDto);
  }

  /*
   * Update existing layanan
   * @param updateLayananDto Data layanan yang akan diupdate
   * @param idParam ID layanan yang akan diupdate
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perbarui layanan yang ada' })
  @ApiQuery({
    name: 'idParam',
    required: true,
    description: 'ID layanan yang akan diperbarui',
    example: 10,
  })
  async updateLayanan(
    @Body() updateLayananDto: UpdateLayananDto,
    @Query() params: ParamLayananDto,
    @Req() req: Request,
  ) {
    const authHeader =
      (req.headers as any).authorization ||
      (req.headers as any).Authorization ||
      '';
    const token =
      typeof authHeader === 'string'
        ? authHeader.replace(/^Bearer\s+/i, '')
        : '';
    return await this.layananService.updateLayanan(
      token,
      params,
      updateLayananDto,
    );
  }

  /*
   * Delete existing layanan
   * @param idParam ID layanan yang akan dihapus
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus layanan yang ada' })
  @ApiQuery({
    name: 'idParam',
    required: true,
    description: 'ID layanan yang akan dihapus',
    example: 10,
  })
  async deleteLayanan(@Query() params: ParamLayananDto, @Req() req: Request) {
    const authHeader =
      (req.headers as any).authorization ||
      (req.headers as any).Authorization ||
      '';
    const token =
      typeof authHeader === 'string'
        ? authHeader.replace(/^Bearer\s+/i, '')
        : '';
    return await this.layananService.deleteLayanan(token, params);
  }
}
