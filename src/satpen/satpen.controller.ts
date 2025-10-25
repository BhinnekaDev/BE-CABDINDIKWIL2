import type { Request } from 'express';
import { SatpenService } from './satpen.service';
import { ParamSatpenDto } from './dto/param-satpen.dto';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { UpdateSatpenDto } from './dto/update-satpen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
}
