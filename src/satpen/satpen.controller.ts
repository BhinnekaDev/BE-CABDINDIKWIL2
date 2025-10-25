import { SatpenService } from './satpen.service';
import { FilterSatpenDto } from './dto/filter-satpen.dto';
import { CreateSatpenDto } from './dto/create-satpen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Controller,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

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

    return await this.satpenService.createSatpen(createSatpenDto, userJwt);
  }
}
