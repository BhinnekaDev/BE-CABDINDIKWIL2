import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import { ParamSatpenLocationDto } from './dto/param-satpen-location.dto';
import { UpdateSatpenLocationDto } from './dto/update-satpen-location.dto';
import { CreateSatpenLocationDto } from './dto/create-satpen-location.dto';

@ApiTags('Satpen')
@Controller('satpen')
export class SatpenController {
  constructor(private readonly satpenService: SatpenService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get all satuan pendidikan' })
  async getAll() {
    return await this.satpenService.getAllSatpen();
  }

  @Get('filtered')
  async getFilteredSatpen(@Query() filterDto: FilterSatpenDto) {
    return this.satpenService.getFilteredSatpen(filterDto);
  }

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
}
