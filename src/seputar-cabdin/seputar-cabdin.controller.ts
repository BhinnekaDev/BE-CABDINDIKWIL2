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
import { SeputarCabdinService } from './seputar-cabdin.service';

import { CreateSeputarCabdinWithGambarDto } from './dto/create-seputarcabdin.dto';
import { FilterSeputarCabdinDto } from './dto/filter-seputarcabdin.dto';
import { ParamSeputarCabdinDto } from './dto/param-seputarcabdin.dto';
import { UpdateSeputarCabdinWithGambarDto } from './dto/update-seputarcabdin.dto';

@ApiTags('Seputar cabdin')
@Controller('seputar-cabdin')
export class SeputarCabdinController {
  constructor(private readonly seputarcabdinService: SeputarCabdinService) {}

  /**
   * Get all seputarcabdin
   *
   * @returns All seputarcabdin
   */
  @Get()
  async getAll() {
    return await this.seputarcabdinService.getAllSeputarCabdin();
  }

  /**
   *  Get all seputarcabdin dengan filter judul / penulis / tanggal_diterbitkan
   *
   * @return All seputarcabdin dengan filter
   */
  @Get('filter')
  async getFilteredSeputarCabdin(@Query() filter: FilterSeputarCabdinDto) {
    return await this.seputarcabdinService.getFilteredSeputarCabdin(filter);
  }

  /**
   * Create seputarcabdin (gambar base64 disimpan langsung di kolom isi, tidak masuk bucket)
   *
   * @returns Created seputarcabdin
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Tambah seputarcabdin (base64 gambar langsung di isi, tidak masuk storage)',
  })
  async createSeputarCabdin(
    @Req() req: Request,
    @Body() dto: CreateSeputarCabdinWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }

    return await this.seputarcabdinService.createSeputarCabdin(userJwt, dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update seputarcabdin' })
  async updateSeputarCabdin(
    @Req() req: Request,
    @Query() params: ParamSeputarCabdinDto,
    @Body() dto: UpdateSeputarCabdinWithGambarDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.seputarcabdinService.updateSeputarCabdin(
      userJwt,
      params,
      dto,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Hapus seputarcabdin' })
  async deleteSeputarCabdin(
    @Req() req: Request,
    @Query() params: ParamSeputarCabdinDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1];
    if (!userJwt) {
      throw new Error('JWT token not found');
    }
    return await this.seputarcabdinService.deleteSeputarCabdin(userJwt, params);
  }
}
