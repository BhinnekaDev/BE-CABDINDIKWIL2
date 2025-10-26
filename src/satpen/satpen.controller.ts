import {
  Get,
  Req,
  Put,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import type { Request } from 'express';
import { SatpenService } from './satpen.service';
import { ParamSatpenDto } from './dto/param-satpen.dto';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { UpdateSatpenDto } from './dto/update-satpen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParamSatpenKindDto } from './dto/param-satpen-kind.dto';
import { CreateSatpenKindDto } from './dto/create-satpen-kind.dto';
import { UpdateSatpenKindDto } from './dto/update-satpen-kind.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParamSatpenLocationDto } from './dto/param-satpen-location.dto';
import { UpdateSatpenLocationDto } from './dto/update-satpen-location.dto';
import { CreateSatpenLocationDto } from './dto/create-satpen-location.dto';

@ApiTags('Satpen')
@Controller('satpen')
export class SatpenController {
  constructor(private readonly satpenService: SatpenService) {}

  /**
   * Get all satuan pendidikan
   *
   * @returns All satuan pendidikan
   */
  @Get()
  async getAll() {
    return await this.satpenService.getAllSatpen();
  }

  /**
   * Get all lokasi satuan pendidikan
   *
   * @returns All lokasi satuan pendidikan
   */
  @Get('lokasi')
  async getAllSatpenLocation() {
    return await this.satpenService.getAllSatpenLocation();
  }

  /**
   * Get all jenis satuan pendidikan
   *
   * @returns All jenis satuan pendidikan
   */
  @Get('jenis')
  async getAllSatpenKind() {
    return await this.satpenService.getAllSatpenKind();
  }

  /**
   * Get filtered satuan pendidikan
   *
   * @returns Filtered satuan pendidikan
   */
  @Get('filtered')
  async getFilteredSatpen(@Query() filterDto: FilterSatpenDto) {
    return this.satpenService.getFilteredSatpen(filterDto);
  }

  /**
   * Create satuan pendidikan
   *
   * @returns Created satuan pendidikan
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tambah satuan pendidikan (harus login sebagai admin)',
  })
  async create(@Req() req: Request, @Body() createSatpenDto: CreateSatpenDto) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.createSatpen(userJwt, createSatpenDto);
  }

  /**
   * Create satuan pendidikan lokasinya
   *
   * @returns Created satuan pendidikan lokasinya
   */
  @Post('lokasi')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tambah satuan pendidikan lokasinya (harus login sebagai admin)',
  })
  async createLocation(
    @Req() req: Request,
    @Body() CreateSatpenLocationDto: CreateSatpenLocationDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.createLocation(
      userJwt,
      CreateSatpenLocationDto,
    );
  }

  /**
   * Create jenis satuan pendidikan
   *
   * @returns Created jenis satuan pendidikan
   */
  @Post('jenis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tambah jenis satuan pendidikan (harus login sebagai admin)',
  })
  async createKind(
    @Req() req: Request,
    @Body() createSatpenKindDto: CreateSatpenKindDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.createKind(userJwt, createSatpenKindDto);
  }

  /**
   * Update satuan pendidikan
   *
   * @returns Updated satuan pendidikan
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update satuan pendidikan (harus login sebagai admin)',
  })
  async update(
    @Req() req: Request,
    @Query() paramSatpenDto: ParamSatpenDto,
    @Body() updateSatpenDto: UpdateSatpenDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.updateSatpen(
      userJwt,
      paramSatpenDto,
      updateSatpenDto,
    );
  }

  /**
   * Update satuan pendidikan lokasinya
   *
   * @returns Updated satuan pendidikan lokasinya
   */
  @Put('lokasi')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update satuan pendidikan lokasinya (harus login sebagai admin)',
  })
  async updateLocation(
    @Req() req: Request,
    @Query() paramSatpenLocationDto: ParamSatpenLocationDto,
    @Body() updateSatpenLocationDto: UpdateSatpenLocationDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.updateLocation(
      userJwt,
      paramSatpenLocationDto,
      updateSatpenLocationDto,
    );
  }

  /**
   * Update jenis satuan pendidikan
   *
   * @returns Updated jenis satuan pendidikan
   */
  @Put('jenis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update jenis satuan pendidikan (harus login sebagai admin)',
  })
  async updateKind(
    @Req() req: Request,
    @Query() paramSatpenKindDto: ParamSatpenKindDto,
    @Body() updateSatpenKindDto: UpdateSatpenKindDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.updateKind(
      userJwt,
      paramSatpenKindDto,
      updateSatpenKindDto,
    );
  }

  /**
   * Delete satuan pendidikan
   *
   * @returns Deleted satuan pendidikan
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Hapus satuan pendidikan (harus login sebagai admin)',
  })
  async delete(@Req() req: Request, @Query() paramSatpenDto: ParamSatpenDto) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.satpenService.deleteSatpen(userJwt, paramSatpenDto);
  }

  /**
   * Delete satuan pendidikan lokasinya
   *
   * @returns Deleted satuan pendidikan lokasinya
   */
  @Delete('lokasi')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Hapus satuan pendidikan lokasinya (harus login sebagai admin)',
  })
  async deleteLocation(
    @Req() req: Request,
    @Query() ParamSatpenLocationDto: ParamSatpenLocationDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.satpenService.deleteLocation(
      userJwt,
      ParamSatpenLocationDto,
    );
  }

  /**
   * Delete jenis satuan pendidikan
   *
   * @returns Deleted jenis satuan pendidikan
   */
  @Delete('jenis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Hapus jenis satuan pendidikan (harus login sebagai admin)',
  })
  async deleteKind(
    @Req() req: Request,
    @Query() paramSatpenKindDto: ParamSatpenKindDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.satpenService.deleteKind(userJwt, paramSatpenKindDto);
  }
}
